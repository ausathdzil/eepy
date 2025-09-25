import { ArrowRightIcon } from 'lucide-react';

import { useId } from 'react';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { Card, CardContent, CardFooter } from '@/components/card/Card.tsx';
import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Link } from '@/components/link/Link.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { Heading } from '@/components/typography/Typography.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { UrlCard } from '@/components/url/Url.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { shortenUrl } from '@/lib/actions/url.ts';
import { getUrls } from '@/lib/data/url.ts';
import { API_URL, BASE_URL } from '@/lib/utils.ts';
import type { Urls } from '@/types/url.ts';

export default function Home() {
  const { user, token, isLoading: isUserLoading } = useUser();
  const params = { limit: '2' };

  const {
    data: urls,
    error,
    isLoading,
  } = useSWR(
    user ? [`${API_URL}/url`, { params, token }] : null,
    ([url, arg]) => getUrls(url, arg)
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
          <UrlForm token={token} />
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

function UrlForm({ token }: { token: string | null | undefined }) {
  const id = useId();

  const { error, trigger, isMutating } = useSWRMutation(
    `${API_URL}/url`,
    shortenUrl
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const longUrl = formData.get('long_url') as string;
    const shortUrl = formData.get('short_url') as string;
    await trigger(
      { token, long_url: longUrl, short_url: shortUrl },
      {
        onSuccess: () => {
          mutate((key) => Array.isArray(key) && key[0] === `${API_URL}/url`);
        },
      }
    );
  };

  return (
    <Card className="w-full md:max-w-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-long_url`}>Enter your URL</Label>
            <Input
              id={`${id}-long_url`}
              name="long_url"
              placeholder="https://example.com"
              required
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-short_url`}>
              Enter custom short URL (optional)
            </Label>
            <div className="flex rounded-md shadow-xs">
              <span className="inline-flex items-center rounded-s-md border border-input bg-background px-3 text-muted-foreground text-sm">
                {BASE_URL}/u/
              </span>
              <Input
                className="-ms-px rounded-s-none shadow-none"
                id={`${id}-short_url`}
                name="short_url"
                placeholder="blog"
                type="text"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="!items-start flex-col gap-2">
          <Button className="w-full" disabled={isMutating} type="submit">
            Shorten URL
          </Button>
          {error && <p className="text-destructive text-sm">{error.message}</p>}
        </CardFooter>
      </form>
    </Card>
  );
}

function RecentUrls({
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
      <Stack align="center" className="w-full" gap="8">
        <Skeleton className="h-42 w-full" />
        <Skeleton className="h-42 w-full" />
      </Stack>
    );
  }

  if (!urls || urls.data.length === 0) {
    return <div>Create your first URL!</div>;
  }

  return (
    <Stack align="center" className="w-full" gap="8">
      {urls.data.map((url) => (
        <UrlCard key={url.id} url={url} />
      ))}
    </Stack>
  );
}
