import { lazy, Suspense } from 'react';
import useSWR from 'swr';

import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { TypographyH2 } from '@/components/typography/Typography.tsx';
import { getActiveUrls } from '@/lib/data.ts';
import { API_URL } from '@/lib/utils.ts';

const UrlForm = lazy(() => import('@/components/UrlForm.tsx'));
const ActiveUrls = lazy(() => import('@/components/ActiveUrls.tsx'));

export default function Home() {
  const {
    data: urls,
    error,
    isLoading,
  } = useSWR(`${API_URL}/url`, getActiveUrls);

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
          <Suspense fallback={<Skeleton className="h-40 w-full max-w-md" />}>
            <UrlForm />
          </Suspense>
        </Stack>
        <Stack
          align="center"
          className="w-full flex-1"
          direction="column"
          gap="4"
        >
          <TypographyH2>Active URLs</TypographyH2>
          <Suspense fallback={<Skeleton className="h-40 w-full max-w-md" />}>
            <ActiveUrls error={error} isLoading={isLoading} urls={urls} />
          </Suspense>
        </Stack>
      </Stack>
    </MainContainer>
  );
}
