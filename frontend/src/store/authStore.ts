import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  updateProfile: (data: { name?: string; role?: string; avatar?: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isInitialized: true });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
      return true;
    } catch {
      set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
      return false;
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const result = await authService.login(data);
      set({ user: result.user, isAuthenticated: true, isInitialized: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const result = await authService.register(data);
      set({ user: result.user, isAuthenticated: true, isInitialized: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await authService.updateProfile(data);
      set({ user: updatedUser, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
