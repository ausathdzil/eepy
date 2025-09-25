import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuth: boolean;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  setAccessToken: (token) =>
    set({ accessToken: token, isAuth: token !== null }),
  isAuth: false,
}));
