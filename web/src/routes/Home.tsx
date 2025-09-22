import { ArrowRightIcon } from 'lucide-react';
import { lazy, Suspense } from 'react';
import useSWR from 'swr';

import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Link } from '@/components/link/Link.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { TypographyH2 } from '@/components/typography/Typography.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';

const UrlForm = lazy(() => import('@/components/UrlForm.tsx'));
const RecentUrls = lazy(() => import('@/components/url/RecentUrls.tsx'));

export default function Home() {
  const {
    data: urls,
    error,
    isLoading,
  } = useSWR([`${API_URL}/url`, { limit: 2 }], ([url, arg]) =>
    getUrls(url, arg)
  );

  const { user } = useUser();

  if (!user) {
    return (
      <MainContainer className="items-center">
        Login to continue 😃
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Stack className="md:!flex-row" gap="8" justify="center">
        <Stack
          align="center"
          className="w-full flex-1"
          direction="column"
          gap="4"
        >
          <TypographyH2>Shorten URL</TypographyH2>
          <Suspense
            fallback={<Skeleton className="h-[234px] w-full max-w-md" />}
          >
            <UrlForm />
          </Suspense>
        </Stack>
        <Stack
          align="center"
          className="w-full flex-1"
          direction="column"
          gap="4"
        >
          <TypographyH2>Recently Created URLs</TypographyH2>
          <Suspense fallback={<UrlSkeleton />}>
            <RecentUrls error={error} isLoading={isLoading} urls={urls} />
          </Suspense>
          <Link href="/profile">
            View All URLs <ArrowRightIcon />
          </Link>
        </Stack>
      </Stack>
    </MainContainer>
  );
}

function UrlSkeleton() {
  return (
    <Stack align="center" className="w-full" gap="8">
      <Skeleton className="h-42 w-full max-w-md" />
      <Skeleton className="h-42 w-full max-w-md" />
    </Stack>
  );
}
