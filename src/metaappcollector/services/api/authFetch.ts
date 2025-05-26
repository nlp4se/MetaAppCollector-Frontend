import { METAAPP_API_URL } from '../../../config';

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const backend = localStorage.getItem('ACTIVE_BACKEND')
  const accessTokenKey = backend === 'metaapp' ? 'METAAPP_ACCESS_TOKEN' : 'REMINER_ACCESS_TOKEN';
  const refreshTokenKey = backend === 'metaapp' ? 'METAAPP_REFRESH_TOKEN' : 'REMINER_REFRESH_TOKEN';

  let accessToken = localStorage.getItem(accessTokenKey);
  const refreshToken = localStorage.getItem(refreshTokenKey);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

    if (options.headers && !(options.headers instanceof Headers)) {
    Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
        headers[key] = value;
        }
    });
    }

    if (!headers['Authorization'] && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
    }


  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(`${METAAPP_API_URL}users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      accessToken = data.access;
      if (!accessToken) {
        throw new Error('No access token received from refresh');
      }
      localStorage.setItem(accessTokenKey, accessToken);

      // Repetim la crida amb el nou token
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
    } else {
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(refreshTokenKey);
      localStorage.removeItem('USER_ID');
      localStorage.removeItem('ACTIVE_BACKEND');
      window.location.href = '/login';
    }
  }

  return response;
}
