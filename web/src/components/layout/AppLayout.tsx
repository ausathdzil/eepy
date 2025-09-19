import { Link, Outlet } from 'react-router';

import { Stack } from '../containers/Containers.tsx';
import { useUser } from '../UserProvider.tsx';
import { buttonVariants } from '../ui/button.tsx';
import { Header } from './Header.tsx';

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
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div className="font-medium">👋 Hey, {user.full_name}!</div>;
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
