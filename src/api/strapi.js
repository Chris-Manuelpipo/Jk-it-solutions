 //src/api/strapi.js

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

if (import.meta.env.DEV) {
  console.log('='.repeat(70));
  console.log('STRAPI_URL →', STRAPI_URL);
  console.log('='.repeat(70));
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

/**
 * Retourne une URL absolue vers le média Strapi.
 * - Si le chemin commence déjà par "http" (ex: Cloudinary), il est retourné tel quel.
 * - Sinon, on préfixe avec STRAPI_URL.
 * - Si path est vide/null, on retourne null.
 */
export const getStrapiURL = (path = '') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
};

/**
 * Résout l'URL d'image depuis un item Strapi, en supportant :
 *   - Strapi v4 : { data: { attributes: { url } } }
 *   - Strapi v5 : { data: { url } }  ou  { url }
 *   - Champs directs : image_url, avatar_url
 * Priorité : image → avatar → image_file → avatar_file → logo → image_url → avatar_url
 */
export const resolveImage = (item) => {
  if (!item) return null;

  const getUrl = (field) => {
    if (!field) return null;
    if (typeof field === 'string') return getStrapiURL(field);
    // Strapi v4 : { data: { attributes: { url } } }
    if (field.data?.attributes?.url) return getStrapiURL(field.data.attributes.url);
    // Strapi v5 : { data: { url } }
    if (field.data?.url) return getStrapiURL(field.data.url);
    // Objet direct : { url }
    if (field.url) return getStrapiURL(field.url);
    // Tableau (multiple media) : prend le premier
    if (Array.isArray(field) && field[0]?.url) return getStrapiURL(field[0].url);
    return null;
  };

  return (
    getUrl(item.image)       ||
    getUrl(item.avatar)      ||
    getUrl(item.image_file)  ||
    getUrl(item.avatar_file) ||
    getUrl(item.logo)        ||
    (typeof item.image_url  === 'string' ? getStrapiURL(item.image_url)  : null) ||
    (typeof item.avatar_url === 'string' ? getStrapiURL(item.avatar_url) : null) ||
    null
  );
};

// ─── formatStrapiData (helper rétrocompatible) ───────────────────────────────

/**
 * Normalise un item ou tableau d'items Strapi en ajoutant
 * les propriétés `imageUrl` et `image` résolues.
 * Gardé pour rétrocompatibilité — préférer resolveImage() dans les nouveaux mappers.
 */
export const formatStrapiData = (data) => {
  if (!data) return null;

  const formatItem = (item) => {
    const url =
      item.image_url ||
      (item.image_file?.url ? getStrapiURL(item.image_file.url) : null) ||
      resolveImage(item);
    return { ...item, id: item.id, imageUrl: url, image: url };
  };

  return Array.isArray(data) ? data.map(formatItem) : formatItem(data);
};

// ─── fetchStrapi ──────────────────────────────────────────────────────────────

/**
 * Effectue une requête vers l'API Strapi.
 *
 * @param {string}  endpoint  - Chemin relatif, ex: 'services?populate=*'
 * @param {object}  options
 * @param {string}  options.method   - HTTP method (défaut : 'GET')
 * @param {object}  options.body     - Corps de la requête (sérialisé en JSON automatiquement)
 * @param {string}  options.token    - JWT optionnel (sinon lu depuis localStorage)
 * @param {boolean} options.isRetry  - Interne : indique une ré-tentative sans token
 *
 * Comportement :
 *  - Ajoute automatiquement le JWT depuis localStorage si présent.
 *  - En cas de 401, retente sans JWT (accès public) avant de throw.
 *  - Retourne `result.data` si présent (Strapi v4/v5), sinon `result` entier.
 *  - Retourne null pour les réponses 204 / corps vide.
 */
export async function fetchStrapi(endpoint, options = {}) {
  const { method = 'GET', body, token, isRetry = false } = options;
  const jwt = token || localStorage.getItem('strapi_token');

  const headers = { 'Content-Type': 'application/json' };
  if (jwt && !isRetry) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }

  // ⚠️ On construit le config fetch SANS répandre `options` directement —
  // cela évitait d'injecter les clés custom (token, isRetry) dans fetch().
  const fetchConfig = { method, headers };

  if (body) {
    if (body instanceof FormData) {
      // Pour FormData, on supprime Content-Type et on laisse le browser le gérer
      delete fetchConfig.headers['Content-Type'];
      fetchConfig.body = body;
    } else {
      fetchConfig.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, fetchConfig);

    // 401 → ré-essai sans token pour les routes publiques
    if (response.status === 401 && jwt && !isRetry) {
      console.warn(`401 sur "${endpoint}" — ré-essai sans token (accès public)…`);
      return fetchStrapi(endpoint, { ...options, token: null, isRetry: true });
    }

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const msg = errBody?.error?.message || errBody?.message || `Erreur HTTP ${response.status}`;
      throw new Error(msg);
    }

    // Réponse vide (DELETE, etc.)
    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      return null;
    }

    const result = await response.json();

    // Strapi v4/v5 enveloppe dans { data: ... }
    // On retourne data s'il existe, sinon le résultat brut
    return result?.data ?? result;

  } catch (err) {
    console.error(`[fetchStrapi] "${endpoint}":`, err.message);
    throw err;
  }
}

// ─── uploadStrapi ─────────────────────────────────────────────────────────────

/**
 * Uploade un fichier vers Strapi (intégration Cloudinary incluse).
 * Retourne le premier objet media créé par Strapi.
 *
 * @param {File}   file        - Fichier à uploader
 * @param {object} [meta]      - Métadonnées optionnelles (fileInfo, refId, ref, field)
 * @returns {Promise<object>}  - Objet media Strapi : { id, url, name, … }
 */
export async function uploadStrapi(file, meta = {}) {
  const jwt = localStorage.getItem('strapi_token');

  const formData = new FormData();
  formData.append('files', file);

  // Métadonnées optionnelles pour lier l'image à un content-type
  if (meta.refId)    formData.append('refId',    meta.refId);
  if (meta.ref)      formData.append('ref',      meta.ref);
  if (meta.field)    formData.append('field',    meta.field);
  if (meta.fileInfo) formData.append('fileInfo', JSON.stringify(meta.fileInfo));

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    // Pas de Content-Type — le browser gère le multipart boundary
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const msg = errBody?.error?.message || errBody?.message || 'Upload échoué';
    throw new Error(msg);
  }

  const data = await response.json();

  // Strapi retourne un tableau même pour un seul fichier
  const uploaded = Array.isArray(data) ? data[0] : data;
  if (!uploaded) throw new Error('Upload : aucun fichier retourné par Strapi');

  return uploaded;
}