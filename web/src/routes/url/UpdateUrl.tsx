import { lazy, Suspense, useId } from 'react';
import { useParams } from 'react-router';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { Card, CardContent, CardFooter } from '@/components/card/Card.tsx';
import { MainContainer, Stack } from '@/components/containers/Containers.tsx';
import { Skeleton } from '@/components/skeleton/Skeleton.tsx';
import { Title } from '@/components/typography/Typography.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { updateUrl } from '@/lib/actions/url.ts';
import { getUrl } from '@/lib/data/url.ts';
import { API_URL, BASE_URL } from '@/lib/utils.ts';
import type { Url } from '@/types/url.ts';

const UrlCard = lazy(() => import('@/components/url/UrlCard.tsx'));

export default function UpdateUrl() {
  const { user, token } = useUser();
  const params = useParams();

  const { data, error, isLoading } = useSWR(
    user ? [`${API_URL}/url/${params.url_id}`, token] : null,
    ([url, arg]) => getUrl(url, arg)
  );

  return (
    <MainContainer>
      <Title>Update URL</Title>
      <UpdateUrlContent
        error={error}
        isLoading={isLoading}
        token={token}
        url={data}
      />
    </MainContainer>
  );
}

type UpdateUrlContentProps = {
  token: string | null | undefined;
  url: Url | undefined;
  error: Error | null;
  isLoading: boolean;
};

function UpdateUrlContent({
  token,
  url,
  error,
  isLoading,
}: UpdateUrlContentProps) {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading || !url) {
    return (
      <Stack align="center" gap="8" justify="center">
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-58 w-full max-w-md" />
      </Stack>
    );
  }

  return (
    <Stack align="center" gap="8" justify="center">
      <UpdateUrlForm token={token} url={url} />
      <Suspense fallback={<Skeleton className="h-42 w-full max-w-md" />}>
        <UrlCard className="max-w-md" showAction={false} url={url} />
      </Suspense>
    </Stack>
  );
}

function UpdateUrlForm({
  token,
  url,
}: {
  token: string | null | undefined;
  url: Url;
}) {
  const id = useId();

  const { error, trigger, isMutating } = useSWRMutation(
    `${API_URL}/url/${url.id}`,
    updateUrl
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
          mutate(
            (key) => Array.isArray(key) && key[0] === `${API_URL}/url/${url.id}`
          );
        },
      }
    );
  };

  return (
    <Card className="w-full md:max-w-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${id}-long_url`}>Long URL</Label>
            <Input
              defaultValue={url.long_url}
              id={`${id}-long_url`}
              name="long_url"
              placeholder="https://example.com"
              required
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-short_url`}>Short URL (optional)</Label>
            <div className="flex rounded-md shadow-xs">
              <span className="inline-flex items-center rounded-s-md border border-input bg-background px-3 text-muted-foreground text-sm">
                {BASE_URL}/u/
              </span>
              <Input
                className="-ms-px rounded-s-none shadow-none"
                defaultValue={url.short_url}
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
            Update URL
          </Button>
          {error && <p className="text-destructive text-sm">{error.message}</p>}
        </CardFooter>
      </form>
    </Card>
  );
}
