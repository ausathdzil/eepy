import { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import useSWR from 'swr';

import { MainContainer } from '@/components/containers/Containers.tsx';
import { Search } from '@/components/Search.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';

const UserUrls = lazy(() => import('@/components/url/UserUrls.tsx'));

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
      <Suspense fallback={<UrlSkeleton />}>
        <Search placeholder="Search URLs..." />
        <UserUrls error={error} isLoading={isUrlsLoading} urls={urls} />
      </Suspense>
    </MainContainer>
  );
}

function UrlSkeleton() {
  return (
    <div className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-42 w-full max-w-md" />
      <Skeleton className="h-42 w-full max-w-md" />
      <Skeleton className="h-42 w-full max-w-md" />
      <Skeleton className="h-42 w-full max-w-md" />
      <Skeleton className="h-42 w-full max-w-md" />
      <Skeleton className="h-42 w-full max-w-md" />
    </div>
  );
}
