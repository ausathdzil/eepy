import type { User } from '@/types/user.ts';
import { API_URL } from '../utils.ts';

const HTTP_UNAUTHORIZED = 401;

export type GetUserResult = {
  user: User | null;
  token: string | null;
};

export async function getUser(
  url: RequestInfo | URL,
  accessToken: string | null
): Promise<GetUserResult> {
  let token = accessToken;

  if (!token) {
    try {
      token = await getAccessToken(`${API_URL}/auth/refresh`);
    } catch {
      return { user: null, token: null };
    }
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === HTTP_UNAUTHORIZED) {
      try {
        const newToken = await getAccessToken(`${API_URL}/auth/refresh`);
        const retryRes = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
        });

        if (retryRes.ok) {
          const data = await retryRes.json();
          return { user: data, token: newToken };
        }
      } catch {
        return { user: null, token: null };
      }
      return { user: null, token: null };
    }

    const data = await res.json();
    throw new Error(
      data.detail?.[0]?.msg || data.detail || 'Failed to fetch user'
    );
  }

  const data = await res.json();
  return { user: data, token };
}

export async function getAccessToken(url: RequestInfo | URL) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to fetch token'
    );
  }

  return data.access_token;
}
