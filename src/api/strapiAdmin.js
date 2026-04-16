import { fetchStrapi, uploadStrapi } from './strapi';

const STRAPI_TOKEN_KEY = 'strapi_token';
const STRAPI_USER_KEY  = 'strapi_user';

export const setStrapiToken = (token) => {
  localStorage.setItem(STRAPI_TOKEN_KEY, token);
};

export const getStrapiToken = () =>
  localStorage.getItem(STRAPI_TOKEN_KEY);

export const clearStrapiAuth = () => {
  localStorage.removeItem(STRAPI_TOKEN_KEY);
  localStorage.removeItem(STRAPI_USER_KEY);
};

export const getStrapiUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STRAPI_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export async function loginStrapi(identifier, password) {
  const data = await fetchStrapi('auth/local', {
    method: 'POST',
    body: { identifier, password },
  });
  setStrapiToken(data.jwt);
  localStorage.setItem(STRAPI_USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function logoutStrapi() {
  clearStrapiAuth();
}

export async function createEntry(collection, payload, imageFile = null) {
  let finalPayload = { ...payload };

  if (imageFile) {
    const uploaded = await uploadStrapi(imageFile);
    finalPayload.image_file = uploaded.id;
  }

  return fetchStrapi(collection, {
    method: 'POST',
    body: { data: finalPayload },
    token: getStrapiToken(),
  });
}

export async function updateEntry(collection, id, documentId, payload, imageFile = null) {
  let finalPayload = { ...payload };

  if (imageFile) {
    const uploaded = await uploadStrapi(imageFile);
    finalPayload.image_file = uploaded.id;
  }

  const key = documentId || id;
  return fetchStrapi(`${collection}/${key}`, {
    method: 'PUT',
    body: { data: finalPayload },
    token: getStrapiToken(),
  });
}

export async function deleteEntry(collection, id, documentId) {
  const key = documentId || id;
  return fetchStrapi(`${collection}/${key}`, {
    method: 'DELETE',
    token: getStrapiToken(),
  });
}

// ─── Collections spécifiques ────────────────────────────────────────

// Hero Slides
export async function getHeroSlides() {
  return fetchStrapi('hero-slides?sort[0]=order:asc&filters[active][$eq]=true&populate=*');
}
export async function createHeroSlide(data, imageFile) {
  return createEntry('hero-slides', data, imageFile);
}
export async function updateHeroSlide(documentId, data, imageFile) {
  return updateEntry('hero-slides', documentId, documentId, data, imageFile);
}
export async function deleteHeroSlide(id) {
  return deleteEntry('hero-slides', id, id);
}

// About
export async function getAbout() {
  const data = await fetchStrapi('abouts?populate=*');
  return data?.data || data;
}
export async function updateAbout(item, data, imageFile) {
  let finalPayload = { ...data };
  if (imageFile) {
    const uploaded = await uploadStrapi(imageFile);
    finalPayload.image_file = uploaded.id;
  }
  return fetchStrapi(`abouts/${item.documentId || item.id}`, {
    method: 'PUT',
    body: { data: finalPayload },
    token: getStrapiToken(),
  });
}

// ─── Services ────────────────────────────────────────────────────────
// Nouveaux champs : longDescription, features, benefits, process,
//                   stats, tags, highlights
export async function getServices() {
  return fetchStrapi('services?sort[0]=order:asc&populate=*');
}

export async function createService(data) {
  const payload = _buildServicePayload(data);
  return createEntry('services', payload);
}

export async function updateService(item, data) {
  const payload = _buildServicePayload(data);
  return updateEntry('services', item.id, item.documentId, payload);
}

export async function deleteService(item) {
  return deleteEntry('services', item.id, item.documentId);
}

function _buildServicePayload(data) {
  return {
    title:           data.title,
    description:     data.description,
    icon:            data.icon,
    active:          data.active ?? true,
    // ── champs détail modale ──
    longDescription: data.longDescription  || '',
    features:        _jsonField(data.features),
    benefits:        _jsonField(data.benefits),
    process:         _jsonField(data.process),
    stats:           _jsonField(data.stats),
    tags:            _jsonField(data.tags),
    highlights:      _jsonField(data.highlights),
  };
}

// ─── Formations ──────────────────────────────────────────────────────
// Nouveaux champs : objectives, program, prerequisites,
//                   maxParticipants, nextSession, instructor
export async function getFormations() {
  return fetchStrapi('formations?sort[0]=order:asc&populate=*');
}

export async function createFormation(data, imageFile = null) {
  const payload = _buildFormationPayload(data);
  return createEntry('formations', payload, imageFile);
}

export async function updateFormation(item, data, imageFile = null) {
  const payload = _buildFormationPayload(data);
  return updateEntry('formations', item.id, item.documentId, payload, imageFile);
}

export async function deleteFormation(item) {
  return deleteEntry('formations', item.id, item.documentId);
}

function _buildFormationPayload(data) {
  return {
    title:           data.title,
    description:     data.description,
    duration:        data.duration        || '',
    price:           data.price           || '',
    date:            data.date            || '',
    level:           data.level           || 'Débutant',
    image_url:       data.image_url       || data.image || '',
    // ── champs détail modale ──
    maxParticipants: Number(data.maxParticipants) || 15,
    nextSession:     data.nextSession     || '',
    objectives:      _jsonField(data.objectives),
    program:         _jsonField(data.program),
    prerequisites:   _jsonField(data.prerequisites),
    instructor:      _jsonField(data.instructor),
  };
}

// ─── Packs ───────────────────────────────────────────────────────────
export async function getPacks() {
  return fetchStrapi('packs?sort[0]=order:asc&populate=*');
}
export async function createPack(data) {
  return createEntry('packs', data);
}
export async function updatePack(item, data) {
  return updateEntry('packs', item.id, item.documentId, data);
}
export async function deletePack(item) {
  return deleteEntry('packs', item.id, item.documentId);
}

// ─── Projects ────────────────────────────────────────────────────────
export async function getProjects() {
  return fetchStrapi('projects?sort[0]=order:asc&populate=*');
}
export async function createProject(data, imageFile) {
  return createEntry('projects', data, imageFile);
}
export async function updateProject(item, data, imageFile) {
  return updateEntry('projects', item.id, item.documentId, data, imageFile);
}
export async function deleteProject(item) {
  return deleteEntry('projects', item.id, item.documentId);
}

// ─── Testimonials ────────────────────────────────────────────────────
export async function getTestimonials() {
  return fetchStrapi('testimonials?sort[0]=order:asc&populate=*');
}
export async function createTestimonial(data, avatarFile) {
  return createEntry('testimonials', data, avatarFile);
}
export async function updateTestimonial(item, data, avatarFile) {
  return updateEntry('testimonials', item.id, item.documentId, data, avatarFile);
}
export async function deleteTestimonial(item) {
  return deleteEntry('testimonials', item.id, item.documentId);
}

// ─── Team Members ────────────────────────────────────────────────────
export async function getTeamMembers() {
  return fetchStrapi('team-members?sort[0]=order:asc&populate=*');
}
export async function createTeamMember(data, imageFile) {
  return createEntry('team-members', data, imageFile);
}
export async function updateTeamMember(item, data, imageFile) {
  return updateEntry('team-members', item.id, item.documentId, data, imageFile);
}
export async function deleteTeamMember(item) {
  return deleteEntry('team-members', item.id, item.documentId);
}

// ─── Contact Info (Single Type) ──────────────────────────────────────
export async function getContactInfo() {
  const data = await fetchStrapi('contact-info?populate=*');
  return data?.data || data;
}
export async function updateContactInfo(data) {
  return fetchStrapi('contact-info', {
    method: 'PUT',
    body: { data },
    token: getStrapiToken(),
  });
}

// ─── Site Config (Single Type) ───────────────────────────────────────
export async function getSiteConfig() {
  const data = await fetchStrapi('site-config?populate=*');
  return data?.data || data;
}
export async function updateSiteConfig(data, logoFile) {
  let finalPayload = { ...data };
  if (logoFile) {
    const uploaded = await uploadStrapi(logoFile);
    finalPayload.logo_file = uploaded.id;
  }
  return fetchStrapi('site-config', {
    method: 'PUT',
    body: { data: finalPayload },
    token: getStrapiToken(),
  });
}


function _jsonField(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}