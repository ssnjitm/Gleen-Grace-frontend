import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../core/config/axios';

interface User {
  id: string;
  customerID: string;
  email?: string;
  fullName?: string;
  role?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => Promise<void>;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false
          });
        }
      },
      
      clearAuth: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },
      
      hydrate: () => {
        // Force rehydration from storage
        const persisted = localStorage.getItem('auth-storage');
        if (persisted) {
          try {
            const state = JSON.parse(persisted);
            if (state.state?.user && state.state?.isAuthenticated) {
              set({ 
                user: state.state.user, 
                isAuthenticated: state.state.isAuthenticated,
                isLoading: false 
              });
            }
          } catch (e) {
            console.error('Failed to hydrate auth state', e);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);