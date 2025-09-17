import { ClockAlertIcon, ClockPlusIcon } from 'lucide-react';
import { BASE_URL, formatDate } from '@/lib/utils';
import type { GetUrl } from '@/types/url';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card/Card';
import { Stack } from './containers/Containers';
import { Link } from './link/Link';
import { Skeleton } from './skeleton/Skeleton';
import { buttonVariants } from './ui/button';

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
    <Stack align="center" className="w-full" gap="4">
      {urls.data.map((url) => (
        <Card className="w-full max-w-md" key={url.id}>
          <CardHeader>
            <CardTitle>
              {BASE_URL}/{url.short_url}
            </CardTitle>
            <CardDescription>{url.long_url}</CardDescription>
            <CardAction>
              <Link
                className={buttonVariants({ variant: 'secondary' })}
                href={`/${url.short_url}`}
              >
                Visit
              </Link>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <Stack className="text-muted-foreground text-sm" gap="2">
              <Stack align="center" direction="row" gap="2">
                <ClockPlusIcon className="size-4" />
                <p>
                  Created:{' '}
                  <span className="font-medium text-primary">
                    {formatDate(url.created_at)}
                  </span>
                </p>
              </Stack>
              <Stack align="center" direction="row" gap="2">
                <ClockAlertIcon className="size-4" />
                <p>
                  Expires:{' '}
                  <span className="font-medium text-destructive">
                    {formatDate(url.expires_at)}
                  </span>
                </p>
              </Stack>
            </Stack>
          </CardFooter>
        </Card>
      ))}
    </Stack>
  );
}
