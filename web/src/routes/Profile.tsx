import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router';
import useSWR from 'swr';

import { MainContainer } from '@/components/containers/Containers.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { TypographyH1 } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';

const UserUrls = lazy(() => import('@/components/url/UserUrls.tsx'));

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth/login');
  }

  const params = { offset: 0, limit: 6 };

  const {
    data: urls,
    error,
    isLoading,
  } = useSWR([`${API_URL}/url`, params], ([url, arg]) => getUrls(url, arg));

  return (
    <MainContainer>
      <TypographyH1>My URLs</TypographyH1>
      <Suspense fallback={<UrlSkeleton />}>
        <UserUrls error={error} isLoading={isLoading} urls={urls} />
      </Suspense>
    </MainContainer>
  );
}

function UrlSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <Skeleton className="h-42 w-full max-w-md" key={index} />
      ))}
    </div>
  );
}
