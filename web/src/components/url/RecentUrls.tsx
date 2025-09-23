import type { Urls } from '@/types/url.ts';
import { Stack } from '../containers/Containers.tsx';
import { Skeleton } from '../skeleton/Skeleton.tsx';
import { UrlCard } from './UrlCard.tsx';

export function RecentUrls({
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
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
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
