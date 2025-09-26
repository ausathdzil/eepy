import type { Url } from '@/types/url.ts';

type UrlArg = {
  arg: {
    token: string | null | undefined;
    short_url: string;
    long_url: string;
  };
};

export async function shortenUrl(
  url: RequestInfo | URL,
  { arg }: UrlArg
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

export async function updateUrl(
  url: RequestInfo | URL,
  { arg }: Partial<UrlArg>
) {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${arg?.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      long_url: arg?.long_url,
      short_url: arg?.short_url,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to shorten URL'
    );
  }

  return data;
}

export async function deleteUrl(
  url: RequestInfo | URL,
  { arg }: { arg: { token: string | null | undefined } }
): Promise<string | { detail: string }> {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${arg.token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to delete URL'
    );
  }

  return data;
}
