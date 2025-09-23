import type { Urls } from '@/types/url.ts';

export type GetUrlParams = {
  page: string;
  limit: string;
  order: string;
};

export async function getUrls(
  url: RequestInfo | URL,
  params: Partial<GetUrlParams>
): Promise<Urls> {
  const searchParams = new URLSearchParams();
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
