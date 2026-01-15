import { create } from 'zustand';
import type { User } from '@shared/types';
interface ChatStore {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  setAuth: (user: User, token: string) => void;
  setInitialized: () => void;
  logout: () => void;
}
const getSafeUser = (): User | null => {
  try {
    const data = localStorage.getItem('luma_user');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};
const getSafeToken = (): string | null => {
  try {
    return localStorage.getItem('luma_token');
  } catch {
    return null;
  }
};
export const useChatStore = create<ChatStore>((set) => ({
  user: getSafeUser(),
  token: getSafeToken(),
  isInitialized: false,
  setAuth: (user, token) => {
    try {
      localStorage.setItem('luma_user', JSON.stringify(user));
      localStorage.setItem('luma_token', token);
    } catch (e) {
      console.error('Failed to persist auth to localStorage', e);
    }
    set({ user, token });
  },
  setInitialized: () => set({ isInitialized: true }),
  logout: () => {
    try {
      localStorage.removeItem('luma_user');
      localStorage.removeItem('luma_token');
    } catch (e) {
      console.error('Failed to remove auth from localStorage', e);
    }
    set({ user: null, token: null });
  },
}));