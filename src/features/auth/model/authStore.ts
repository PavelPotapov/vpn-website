import { create } from 'zustand';

import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/api';

interface AuthState {
  token: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clear: () => void;
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  token: readToken(),
  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    set({ token: accessToken });
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    set({ token: null });
  },
}));
