import type { User } from '@/types/user';

const HTTP_UNAUTHORIZED = 401;

export async function getUser(url: RequestInfo | URL): Promise<User | null> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === HTTP_UNAUTHORIZED) {
      return null;
    }
    throw new Error(data.detail[0].msg || data.detail || 'Failed to fetch user');
  }

  return data;
}
