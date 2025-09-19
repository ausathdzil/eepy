import type { Urls } from '../types/url.ts';

export async function getActiveUrls(url: RequestInfo | URL): Promise<Urls> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch active URLs');
  }

  const data = await res.json();
  return data;
}
