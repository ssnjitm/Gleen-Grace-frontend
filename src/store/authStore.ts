import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  customerID: string;
  email?: string;
  fullName?: string;
  role?: string;
}

interface AuthState {
  user:any;
  isAuthenticated: boolean;
  tempEmail: string | null;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User) => void;
  setTempEmail: (email: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      tempEmail: null,
      isLoading: false,

      setAuth: (user) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false
      }),

      setTempEmail: (email) => set({ tempEmail: email }),
      
      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        set({ user: null, isAuthenticated: false, tempEmail: null });
        localStorage.removeItem('auth-storage');
      },
      
      clearAuth: () => {
        set({ user: null, isAuthenticated: false, tempEmail: null });
      }
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