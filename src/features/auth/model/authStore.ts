import { create } from 'zustand';

import { AUTH_TOKEN_KEY } from '@/shared/api';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clear: () => void;
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export const useAuthStore = create<AuthState>((set) => ({
  token: readToken(),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    set({ token });
  },
  clear: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    set({ token: null });
  },
}));
