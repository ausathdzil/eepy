import type { Url } from '@/types/url.ts';

type UrlArg = {
  arg: {
    token: string | null | undefined;
    shortUrl: string;
    longUrl: string;
  };
};

export async function shortenUrl(
  url: RequestInfo | URL,
  { arg }: UrlArg
): Promise<Url | { detail: string }> {
  const payload = {
    long_url: arg.longUrl,
    shortenUrl: arg.shortUrl,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${arg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
  const payload: Record<string, string> = {};

  if (arg?.longUrl) {
    payload.long_url = arg.longUrl;
  }

  if (arg?.shortUrl) {
    payload.short_url = arg.shortUrl;
  }

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${arg?.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
