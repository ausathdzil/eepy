import type { Url, Urls } from '@/types/url.ts';

type GetUrlParams = {
  q: string;
  page: string;
  limit: string;
  order: string;
};

type GetUrlArg = {
  params: Partial<GetUrlParams>;
  token: string | null | undefined;
};

export async function getUrls(
  url: RequestInfo | URL,
  arg: GetUrlArg
): Promise<Urls> {
  const params = arg.params;
  const token = arg.token;
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set('q', params.q);
  }
  if (params.page) {
    searchParams.set('page', params.page);
  }
  if (params.limit) {
    searchParams.set('limit', params.limit);
  }
  if (params.order) {
    searchParams.set('order', params.order);
  }

  const res = await fetch(`${url}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
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

export async function getUrl(
  url: RequestInfo | URL,
  token: string | null | undefined
): Promise<Url> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
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

export async function getTotalUrl(
  url: RequestInfo | URL,
  token: string | null | undefined
): Promise<{ count: number }> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail[0].msg || data.detail || 'Failed to fetch total URLs'
    );
  }

  return data;
}
