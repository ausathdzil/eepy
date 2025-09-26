import { lazy, Suspense, useEffect } from 'react';
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
import { UrlContainer } from '@/components/url/UrlContainer.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';
import type { Urls } from '@/types/url.ts';

const UrlCard = lazy(() => import('@/components/url/UrlCard.tsx'));

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
    ([url, arg]) => getUrls(url, arg),
    { keepPreviousData: true }
  );

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = urls?.total_pages || 0;
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  return (
    <MainContainer>
      <Title>My URLs</Title>
      <SearchInput placeholder="Search URLs..." />
      <UserUrls error={error} isLoading={isUrlsLoading} urls={urls} />
      {urls && (
        <Pagination>
          <PaginationData count={urls.count || 0} />
          <PaginationButtons
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            page={currentPage}
            totalPages={totalPages}
          />
        </Pagination>
      )}
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
    return <div className="flex-1 text-destructive">{error.message}</div>;
  }

  if (isLoading || !urls) {
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

  if (urls.data.length === 0) {
    return <div className="flex-1 text-center">No URLs found</div>;
  }

  return (
    <UrlContainer>
      {urls.data.map((url) => (
        <Suspense fallback={<Skeleton className="h-42 w-full" />} key={url.id}>
          <UrlCard showAction url={url} />
        </Suspense>
      ))}
    </UrlContainer>
  );
}
