import type { Urls } from '@/types/url.ts';

export async function getRecentUrls(url: RequestInfo | URL): Promise<Urls> {
  const params = new URLSearchParams();
  params.set('limit', '2');
  params.set('order', 'desc');

  const res = await fetch(`${url}?${params.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to fetch active URLs'
    );
  }

  return data;
}
