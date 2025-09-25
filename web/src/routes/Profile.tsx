import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import useSWR from 'swr';

import { MainContainer } from '@/components/containers/Containers.tsx';
import {
  Pagination,
  PaginationButtons,
  PaginationData,
} from '@/components/pagination/Pagination.tsx';
import { SearchInput } from '@/components/SearchInput.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { UrlCard, UrlContainer } from '@/components/url/Url.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';
import type { Urls } from '@/types/url.ts';

export default function Profile() {
  const { user, token, isLoading } = useUser();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!(isLoading || user)) {
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '6';

  const params = { q: query, page, limit };

  const {
    data: urls,
    error,
    isLoading: isUrlsLoading,
  } = useSWR(
    user ? [`${API_URL}/url`, { params, token }] : null,
    ([url, arg]) => getUrls(url, arg)
  );

  return (
    <MainContainer>
      <Title>My URLs</Title>
      {isLoading ? (
        <Skeleton className="h-9 w-full" />
      ) : (
        <SearchInput placeholder="Search URLs..." />
      )}
      <UserUrls error={error} isLoading={isUrlsLoading} urls={urls} />
    </MainContainer>
  );
}

function UserUrls({
  urls,
  error,
  isLoading,
}: {
  urls: Urls | undefined;
  error: Error | null;
  isLoading: boolean;
}) {
  if (error) {
    return <div className="text-destructive">{error.message}</div>;
  }

  if (isLoading) {
    return (
      <UrlContainer>
        <Skeleton className="h-42 w-full" />
        <Skeleton className="h-42 w-full" />
        <Skeleton className="h-42 w-full" />
        <Skeleton className="h-42 w-full" />
        <Skeleton className="h-42 w-full" />
        <Skeleton className="h-42 w-full" />
      </UrlContainer>
    );
  }

  if (!urls || urls.data.length === 0) {
    return <div className="text-center">No URLs found</div>;
  }

  return (
    <>
      <UrlContainer>
        {urls.data.map((url) => (
          <UrlCard key={url.id} url={url} />
        ))}
      </UrlContainer>
      <Pagination>
        <PaginationData count={urls.count} />
        <PaginationButtons
          hasNext={urls.has_next}
          hasPrevious={urls.has_previous}
          page={urls.page}
          totalPages={urls.total_pages}
        />
      </Pagination>
    </>
  );
}
