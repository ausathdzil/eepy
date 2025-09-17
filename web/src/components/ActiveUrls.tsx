import { BASE_URL } from '@/lib/utils';
import type { GetUrl } from '@/types/url';
import { Link } from './link/Link';
import { Skeleton } from './skeleton/Skeleton';
import { List } from './typography/Typography';

export default function ActiveUrls({
  urls,
  error,
  isLoading,
}: {
  urls: GetUrl | undefined;
  error: Error | null;
  isLoading: boolean;
}) {
  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return <Skeleton className="h-40 w-full max-w-md" />;
  }

  if (!urls) {
    return <div>No URLs found</div>;
  }

  return (
    <List>
      {urls.data.map((item) => (
        <li key={item.id}>
          <Link href={`/${item.short_url}`}>
            {`${BASE_URL}/${item.short_url}`}
          </Link>
        </li>
      ))}
    </List>
  );
}
