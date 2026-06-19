import { create } from 'zustand';

import { readAuthFlag } from '@/shared/api';

import { logout as logoutRequest } from '../api/authApi';

interface AuthState {
  isAuthed: boolean;
  setAuthed: (value: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Источник правды — читаемая флаг-кука vpn_auth (сами токены в httpOnly-куках).
  isAuthed: readAuthFlag(),
  setAuthed: (value) => set({ isAuthed: value }),
  logout: async () => {
    try {
      await logoutRequest();
    } catch {
      // даже если запрос не прошёл — разлогиниваем локально
    }
    set({ isAuthed: false });
  },
}));
