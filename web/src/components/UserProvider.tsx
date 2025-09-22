import useSWR from 'swr';

import { UserContext } from '@/hooks/useUser.ts';
import { getUser } from '@/lib/data/user.ts';
import { API_URL } from '@/lib/utils.ts';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`${API_URL}/users/me`, getUser);

  const value = {
    user,
    error,
    isLoading,
  };

  return <UserContext value={value}>{children}</UserContext>;
}
