import type { Url } from '@/types/url.ts';

type ShortenUrlArg = {
  arg: {
    token: string | null | undefined;
    short_url: string;
    long_url: string;
  };
};

export async function shortenUrl(
  url: RequestInfo | URL,
  { arg }: ShortenUrlArg
): Promise<Url | { detail: string }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${arg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to shorten URL'
    );
  }

  return data;
}
