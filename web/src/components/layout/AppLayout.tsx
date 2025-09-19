import { Link, Outlet } from 'react-router';

import { Stack } from '../containers/Containers.tsx';
import { buttonVariants } from '../ui/button.tsx';
import { Header } from './Header.tsx';

export function AppLayout() {
  return (
    <>
      <Header className="flex items-center justify-between">
        <Link className="font-semibold text-xl" to="/">
          😼 eepy
        </Link>
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
      </Header>
      <Outlet />
    </>
  );
}
