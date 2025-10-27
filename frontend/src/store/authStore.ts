import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { user, tokens } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(data);
      const { user, tokens } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.email?.[0] ||
        error.response?.data?.username?.[0] ||
        error.response?.data?.password?.[0] ||
        error.response?.data?.detail ||
        'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const { refreshToken } = get();
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear everything
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },

  loadUser: async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('user');

    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        // Optionally fetch fresh user data
        const response = await authAPI.getProfile();
        set({ user: response.data });
      } catch (error) {
        console.error('Load user error:', error);
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      }
    }
  },

  clearError: () => set({ error: null }),
}));
