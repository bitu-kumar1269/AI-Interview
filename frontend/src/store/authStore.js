import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // ── Actions ──────────────────────────────────────────
      setAccessToken: (token) => set({ accessToken: token }),

      login: async ({ email, password }) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
      },

      register: async ({ name, email, password }) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
      },

      // Used by /oauth-callback after a successful social sign-in.
      // Stores the tokens issued by the backend, then fetches the user profile.
      loginWithTokens: async ({ accessToken, refreshToken }) => {
        set({ accessToken, refreshToken, isAuthenticated: true, isLoading: true });
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, isLoading: false });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return { success: false, message: err.response?.data?.message || 'Failed to load profile' };
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (updatedUser) => {
        set({ user: { ...get().user, ...updatedUser } });
      },
    }),
    {
      name: 'ai-interview-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
