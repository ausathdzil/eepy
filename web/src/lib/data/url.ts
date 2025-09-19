import type { Urls } from '@/types/url.ts';

export async function getActiveUrls(url: RequestInfo | URL): Promise<Urls> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to fetch active URLs'
    );
  }

  return data;
}
