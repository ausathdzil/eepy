import type { Url } from '../types/url';

export async function shortenUrl(
  url: RequestInfo | URL,
  { arg }: { arg: { long_url: string } }
): Promise<Url> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error('Failed to shorten URL');
  }

  const data = await res.json();
  return data;
}
