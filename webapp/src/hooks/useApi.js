const BASE_URL = '/api';

async function request(path, { token, method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }

  return data;
}

export function useApi() {
  return {
    getSession: (token) => request('/session', { token }),
    getCatalog: (token, floor) => request(`/catalog?floor=${floor}`, { token }),
    marcarSesionUsada: (token) => request('/session/use', { token, method: 'POST' })
  };
}