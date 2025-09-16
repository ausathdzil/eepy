import { lazy, Suspense } from 'react';

import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import {
  TypographyH1,
  TypographyH2,
} from '@/components/typography/Typography.tsx';

const UrlForm = lazy(() => import('@/components/UrlForm.tsx'));
const ActiveUrls = lazy(() => import('@/components/ActiveUrls.tsx'));

export default function Home() {
  return (
    <MainContainer>
      <TypographyH1>😼 eepy 😼</TypographyH1>
      <Stack align="center" direction="column" gap="calc(var(--spacing) * 4)">
        <TypographyH2>Shorten URL</TypographyH2>
        <Suspense fallback={<Skeleton className="h-40 w-full max-w-md" />}>
          <UrlForm />
        </Suspense>
      </Stack>
      <Stack align="center" direction="column" gap="calc(var(--spacing) * 4)">
        <TypographyH2>Active URLs</TypographyH2>
        <Suspense fallback={<Skeleton className="h-40 w-full max-w-md" />}>
          <ActiveUrls />
        </Suspense>
      </Stack>
    </MainContainer>
  );
}
