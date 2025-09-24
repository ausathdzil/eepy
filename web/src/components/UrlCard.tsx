import { ClockAlertIcon, ClockPlusIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { BASE_URL, cn, formatDate } from '@/lib/utils.ts';
import type { Url } from '@/types/url.ts';
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

export function UrlCard({
  url,
  className,
  ...props
}: { url: Url } & ComponentProps<'div'>) {
  return (
    <Card
      className={cn('@container/card w-full', className)}
      key={url.id}
      {...props}
    >
      <CardHeader>
        <Stack direction="column" gap="1">
          <CardTitle>
            <a href={`/u/${url.short_url}`} target="_blank">
              {BASE_URL}/u/{url.short_url}
            </a>
          </CardTitle>
          <CardDescription>
            <a href={url.long_url} rel="noopener noreferrer" target="_blank">
              {url.long_url}
            </a>
          </CardDescription>
        </Stack>
        <CardAction className="@sm/card:block hidden">
          <Link
            href={`/u/${url.short_url}`}
            target="_blank"
            variant="secondary"
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
  );
}
