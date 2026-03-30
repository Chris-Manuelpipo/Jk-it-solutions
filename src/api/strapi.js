const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
 
export const getStrapiURL = (path = '') => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
};

// Résout l'image : priorité image_file (Cloudinary/local) sinon image_url
export const resolveImage = (item) => {
  if (item?.image_file?.url) return getStrapiURL(item.image_file.url);
  if (item?.avatar_file?.url) return getStrapiURL(item.avatar_file.url);
  if (item?.image_url) return item.image_url;
  if (item?.avatar_url) return item.avatar_url;
  return null;
};

// export async function fetchStrapi(endpoint) {
//   const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
//     headers: { 'Content-Type': 'application/json' },
//   });
//   if (!response.ok) throw new Error(`Strapi error: ${response.status}`);
//   const json = await response.json();
//   // Strapi v5 retourne { data: [...] } ou { data: {...} }
//   return json.data ?? json;
// } 
// Structure mapping helper
export const formatStrapiData = (data) => {
    if (!data) return null;

    const formatItem = (item) => {
        const url = item.image_url || (item.image_file && item.image_file.url ? getStrapiURL(item.image_file.url) : null);
        return {
            id: item.id,
            ...item,
            imageUrl: url,
            image: url // Backward compatibility
        };
    };

    if (Array.isArray(data)) {
        return data.map(formatItem);
    }

    return formatItem(data);
};

export async function fetchStrapi(endpoint, options = {}) {
    const { method = 'GET', body, token, isRetry = false } = options;
    const jwt = token || localStorage.getItem('strapi_token');

    const headers = {
        'Content-Type': 'application/json',
    };

    if (jwt && !isRetry) {
        headers['Authorization'] = `Bearer ${jwt}`;
    }

    const config = {
        method,
        headers,
        ...options
    };

    if (body && !(body instanceof FormData)) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, config);

        if (response.status === 401 && jwt && !isRetry) {
            console.warn(`401 Unauthorized for ${endpoint}. Retrying without token for public access...`);
            return fetchStrapi(endpoint, { ...options, isRetry: true });
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `API Error ${response.status}` }));
            throw new Error(error.error?.message || error.message || `Error ${response.status}`);
        }

        const result = await response.json();
        return result.data || result;
    } catch (err) {
        console.error(`Fetch error for ${endpoint}:`, err.message);
        throw err;
    }
}

// Upload specifically for Cloudinary integration via Strapi
export async function uploadStrapi(file) {
    const jwt = localStorage.getItem('strapi_token');
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        body: formData,
    });

    if (!response.ok) {
        let errorMsg = 'Upload failed';
        try {
            const errBody = await response.json();
            errorMsg = errBody.error?.message || errBody.message || errorMsg;
        } catch (e) { }
        throw new Error(errorMsg);
    }

    const data = await response.json();
    return data[0];
}
