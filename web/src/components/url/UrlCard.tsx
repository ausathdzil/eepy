import {
  ClockAlertIcon,
  ClockPlusIcon,
  EditIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from 'lucide-react';

import type { ComponentProps } from 'react';
import { Link } from 'react-router';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { useUser } from '@/hooks/useUser.ts';
import { deleteUrl } from '@/lib/actions/url.ts';
import { API_URL, BASE_URL, cn, formatDate } from '@/lib/utils.ts';
import type { Url } from '@/types/url.ts';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card/Card.tsx';
import { Stack } from '../containers/Containers.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog.tsx';
import { Button } from '../ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';

export default function UrlCard({
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
        <UrlAction url={url} />
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

function UrlAction({ url }: { url: Url }) {
  const { token } = useUser();
  const {
    error: _error,
    trigger,
    isMutating,
  } = useSWRMutation(`${API_URL}/url/${url.id}`, deleteUrl);

  const handleDeleteUrl = async () => {
    await trigger(
      { token },
      {
        onSuccess: () => {
          mutate((key) => Array.isArray(key) && key[0] === `${API_URL}/url`);
        },
      }
    );
  };

  return (
    <CardAction>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="secondary">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link target="_blank" to={`/u/${url.short_url}`}>
                <ExternalLinkIcon />
                Visit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/url/${url.id}/update`}>
                <EditIcon />
                Update
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AlertDialogTrigger className="w-full">
                <Trash2Icon />
                Delete
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete URL</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isMutating}
              onClick={handleDeleteUrl}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardAction>
  );
}
