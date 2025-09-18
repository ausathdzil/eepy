import { ClockAlertIcon, ClockPlusIcon } from 'lucide-react';

import { BASE_URL, formatDate } from '@/lib/utils.ts';
import type { GetUrl } from '@/types/url.ts';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card/Card.tsx';
import { Stack } from './containers/Containers.tsx';
import { Link } from './link/Link.tsx';
import { Skeleton } from './skeleton/Skeleton.tsx';
import { buttonVariants } from './ui/button.tsx';

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
    <Stack align="center" className="w-full flex-col" gap="8">
      {urls.data.map((url) => (
        <Card className="w-full max-w-md" key={url.id}>
          <CardHeader>
            <Stack direction="column" gap="1">
              <CardTitle>
                {BASE_URL}/u/{url.short_url}
              </CardTitle>
              <CardDescription>{url.long_url}</CardDescription>
            </Stack>
            <CardAction className="hidden sm:block">
              <Link
                className={buttonVariants({ variant: 'secondary' })}
                href={`/u/${url.short_url}`}
              >
                Visit
              </Link>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <Stack className="text-muted-foreground text-xs sm:text-sm" gap="2">
              <Stack align="center" direction="row" gap="2">
                <ClockPlusIcon className="size-3 sm:size-4" />
                <p>
                  Created:{' '}
                  <span className="font-medium text-primary">
                    {formatDate(url.created_at)}
                  </span>
                </p>
              </Stack>
              <Stack align="center" direction="row" gap="2">
                <ClockAlertIcon className="size-3 sm:size-4" />
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
