import type { Urls } from '@/types/url';
import { UrlCard } from './UrlCard';
import { Skeleton } from '../skeleton/Skeleton';

export default function UserUrls({
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-42 w-full max-w-md" key={index} />
        ))}
      </div>
    );
  }

  if (!urls) {
    return <div>No URLs found</div>;
  }
  return (
    <div className="grid grid-cols-3 gap-4">
      {urls?.data.map((url) => (
        <UrlCard className="basis-1/3" key={url.id} url={url} />
      ))}
    </div>
  );
}
