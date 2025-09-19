import { Link, Outlet } from 'react-router';

import { useUser } from '@/hooks/useUser.ts';
import { Stack } from '../containers/Containers.tsx';
import { buttonVariants } from '../ui/button.tsx';
import { Header } from './Header.tsx';
import { Skeleton } from '../skeleton/Skeleton.tsx';

export function AppLayout() {
  return (
    <>
      <Header className="flex items-center justify-between">
        <Link className="font-semibold" to="/">
          😼 eepy
        </Link>
        <UserButton />
      </Header>
      <Outlet />
    </>
  );
}

function UserButton() {
  const { user, error, isLoading } = useUser();

  if (error) {
    return <p className="text-sm text-destructive">Error: {error.message}</p>;
  }

  if (isLoading) {
    return <Skeleton className="h-8 w-39" />;
  }

  if (user) {
    return <p className="font-medium">👋 Hey, {user.full_name}!</p>;
  }

  return (
    <Stack direction="row" gap="4">
      <Link
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        to="/auth/login"
      >
        Login
      </Link>
      <Link
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        to="/auth/register"
      >
        Register
      </Link>
    </Stack>
  );
}
