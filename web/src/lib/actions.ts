import type { Url } from '../types/url.ts';

export async function shortenUrl(
  url: RequestInfo | URL,
  { arg }: { arg: { short_url: string; long_url: string } }
): Promise<Url | { detail: string }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || 'Failed to shorten URL');
  }

  return data;
}
