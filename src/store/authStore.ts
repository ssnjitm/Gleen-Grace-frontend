import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../core/config/axios';

interface User {
    id: string;
    customerID: string;
    email: string;
    fullName: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    tempEmail: string | null;
    
    // Setters for TanStack Query integration
    setAuth: (user: User) => void;
    setTempEmail: (email: string | null) => void;
    
    // Actions
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            tempEmail: null,

            setAuth: (user) => set({ 
                user, 
                isAuthenticated: true 
            }),

            setTempEmail: (email) => set({ 
                tempEmail: email 
            }),

            logout: async () => {
                try {
                    await api.post('/auth/logout');
                } finally {
                    set({ user: null, isAuthenticated: false, tempEmail: null });
                    localStorage.removeItem('auth-storage');
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