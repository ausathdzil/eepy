import { createContext, useContext } from 'react';

import type { User } from '@/types/user.ts';

type UserContextType = {
  user: User | null | undefined;
  error: Error | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
