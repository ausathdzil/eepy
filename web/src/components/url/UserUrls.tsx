import type { Urls } from '@/types/url.ts';
import {
  Pagination,
  PaginationButtons,
  PaginationData,
} from '../pagination/Pagination.tsx';
import { Skeleton } from '../skeleton/Skeleton.tsx';
import { UrlCard } from './UrlCard.tsx';

export function UserUrls({
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
      <div className="grid grid-cols-1 place-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
        <Skeleton className="h-42 w-full max-w-md" />
      </div>
    );
  }

  if (!urls || urls.data.length === 0) {
    return <div className="text-center">No URLs found</div>;
  }

  return (
    <>
      <div className="grid flex-1 grid-cols-1 place-content-start place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
        {urls.data.map((url) => (
          <UrlCard className="basis-1/3" key={url.id} url={url} />
        ))}
      </div>
      <Pagination>
        <PaginationData count={urls.count} />
        <PaginationButtons
          hasNext={urls.has_next}
          hasPrevious={urls.has_previous}
          page={urls.page}
          totalPages={urls.total_pages}
        />
      </Pagination>
    </>
  );
}
