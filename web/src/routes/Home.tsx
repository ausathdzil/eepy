import { ArrowRightIcon } from 'lucide-react';
import useSWR from 'swr';

import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Link } from '@/components/link/Link.tsx';
import { Heading } from '@/components/typography/Typography.tsx';
import { RecentUrls } from '@/components/url/RecentUrls.tsx';
import { UrlForm } from '@/components/url/UrlForm.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL } from '@/lib/utils.ts';

export default function Home() {
  const { user, isLoading: isUserLoading } = useUser();
  const {
    data: urls,
    error,
    isLoading,
  } = useSWR(user ? [`${API_URL}/url`, { limit: '2' }] : null, ([url, arg]) =>
    getUrls(url, arg)
  );

  if (isUserLoading) {
    return null;
  }

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
          <Heading>Shorten URL</Heading>
          <UrlForm />
        </Stack>
        <Stack
          align="center"
          className="w-full flex-1"
          direction="column"
          gap="4"
        >
          <Heading>Recently Created URLs</Heading>
          <RecentUrls error={error} isLoading={isLoading} urls={urls} />
          {urls && urls.data.length > 0 && (
            <Link href="/profile">
              View All URLs <ArrowRightIcon />
            </Link>
          )}
        </Stack>
      </Stack>
    </MainContainer>
  );
}
