import type { GetUrl } from '../types/url.ts';

export async function getActiveUrls(url: RequestInfo | URL): Promise<GetUrl> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch active URLs');
  }

  const data = await res.json();
  return data;
}
