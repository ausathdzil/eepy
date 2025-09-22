import { ArrowRightIcon } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { Link } from 'react-router';
import useSWR from 'swr';
import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { TypographyH2 } from '@/components/typography/Typography.tsx';
import { buttonVariants } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { getRecentUrls } from '@/lib/data/url';
import { API_URL, cn } from '@/lib/utils.ts';

const UrlForm = lazy(() => import('@/components/UrlForm.tsx'));
const ActiveUrls = lazy(() => import('@/components/ActiveUrls.tsx'));

export default function Home() {
  const {
    data: urls,
    error,
    isLoading,
  } = useSWR(`${API_URL}/url`, getRecentUrls);

  const { user, isLoading: isLoadingUser } = useUser();

  if (!(user || isLoadingUser)) {
    return (
      <MainContainer className="items-center">
        <Link
          className={cn(buttonVariants({ variant: 'ghost' }), 'w-fit')}
          to="/auth/login"
        >
          Login or create an account to start shortening URLs <ArrowRightIcon />
        </Link>
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
            <ActiveUrls error={error} isLoading={isLoading} urls={urls} />
          </Suspense>
          <Link className={buttonVariants({ variant: 'ghost' })} to="/">
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
