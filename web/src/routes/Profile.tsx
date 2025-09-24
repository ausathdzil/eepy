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
import { UrlCard } from '@/components/UrlCard.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';
import type { Urls } from '@/types/url.ts';

export default function Profile() {
  const { user, isLoading } = useUser();
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
  } = useSWR(user ? [`${API_URL}/url`, params] : null, ([url, arg]) =>
    getUrls(url, arg)
  );

  return (
    <MainContainer>
      <Title>My URLs</Title>
      {urls && urls.data.length > 0 && (
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
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 place-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
      </div>
    );
  }

  if (!urls || urls.data.length === 0) {
    return <div className="text-center">No URLs found</div>;
  }

  return (
    <>
      <div className="grid flex-1 grid-cols-1 place-content-start place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
        {urls.data.map((url) => (
          <UrlCard className="basis-1/3" key={url.id} url={url} />
        ))}
      </div>
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
