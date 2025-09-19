import { createContext, useContext } from 'react';
import useSWR from 'swr';

import { getUser } from '@/lib/data/user.ts';
import { API_URL } from '@/lib/utils.ts';
import type { User } from '@/types/user.ts';

type UserContextType = {
  user: User | null | undefined;
  error: Error | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

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
