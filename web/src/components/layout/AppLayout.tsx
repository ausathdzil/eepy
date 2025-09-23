import { Outlet, useNavigate } from 'react-router';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { useUser } from '@/hooks/useUser.ts';
import { logout } from '@/lib/actions/auth.ts';
import { API_URL } from '@/lib/utils.ts';
import { Stack } from '../containers/Containers.tsx';
import { Link } from '../link/Link.tsx';
import { Skeleton } from '../skeleton/Skeleton.tsx';
import { Button } from '../ui/button.tsx';
import { Header } from './Header.tsx';

export function AppLayout() {
  return (
    <>
      <Header className="flex items-center justify-between">
        <Link className="font-semibold" href="/">
          😼 EEPY
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
    return <p className="text-destructive text-sm">Error: {error.message}</p>;
  }

  if (isLoading) {
    return <Skeleton className="h-8 w-39" />;
  }

  if (user) {
    return (
      <Stack align="center" direction="row" gap="4">
        <p className="hidden font-medium md:block">
          👋 Hey, {user.full_name || user.email}!
        </p>
        <Link href="/profile" variant="secondary">
          Profile
        </Link>
        <LogoutButton />
      </Stack>
    );
  }

  return (
    <Stack align="center" direction="row" gap="4">
      <Link href="/auth/login">Login</Link>
      <Link href="/auth/register">Register</Link>
    </Stack>
  );
}

function LogoutButton() {
  const { trigger, isMutating } = useSWRMutation(
    `${API_URL}/auth/logout`,
    logout
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    await trigger(null, {
      onSuccess: () => {
        mutate(() => true);
        navigate('/auth/login');
      },
    });
  };

  return (
    <Button
      disabled={isMutating}
      onClick={handleLogout}
      size="sm"
      variant="destructive"
    >
      Logout
    </Button>
  );
}
