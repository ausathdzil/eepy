import useSWR from 'swr';

import { useAuthStore } from '@/hooks/useAuthStore.ts';
import { UserContext } from '@/hooks/useUser.ts';
import { getUser } from '@/lib/data/user.ts';
import { API_URL } from '@/lib/utils.ts';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const { data, error, isLoading } = useSWR(
    [`${API_URL}/users/me`, accessToken],
    ([url, arg]) => getUser(url, arg),
    {
      onSuccess: (result) => {
        setAccessToken(result.token);
      },
      dedupingInterval: 2000,
    }
  );

  const user = data?.user;
  const token = data?.token;

  const value = {
    user,
    token,
    error,
    isLoading,
  };

  return <UserContext value={value}>{children}</UserContext>;
}
