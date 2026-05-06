import { create } from 'zustand';
import { api } from '../core/config/axios';

interface User {
  id: string;
  customerID: string;
  email?: string;
  fullName?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setAuth: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  checkAuth: () => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setAuth: (user) => set({ 
    user, 
    isAuthenticated: true,
    isLoading: false 
  }),

  setLoading: (isLoading) => set({ isLoading }),

  // Check authentication status by calling a protected endpoint
  checkAuth: async () => {
    // Don't check if already checking
    if (get().isLoading) return false;
    
    set({ isLoading: true });
    
    try {
      // Try to get current user info - this will work if cookies are valid
      const response = await api.get('/auth/me');
      
      if (response.data?.data?.user) {
        set({ 
          user: response.data.data.user, 
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true
        });
        return true;
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          isInitialized: true 
        });
        return false;
      }
    } catch (error) {
      // If error (401), user is not authenticated
      console.log('Auth check failed:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        isInitialized: true 
      });
      return false;
    }
  },

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
        isLoading: false,
        isInitialized: true
      });
      // Clear any stored data
      localStorage.removeItem('auth-storage');
    }
  },
  
  clearAuth: () => {
    set({ user: null, isAuthenticated: false, isLoading: false, isInitialized: false });
    localStorage.removeItem('auth-storage');
  },
}));