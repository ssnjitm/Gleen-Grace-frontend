import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import { useAuthStore } from '../../../store/authStore';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      // Extract user from response - check the structure of your response
      // Your backend returns: { data: { user: { id, customerID } } }
      const user = data.data?.user;
      
      if (user) {
        // Create a complete user object
        const fullUser = {
          id: user.id || user._id,
          customerID: user.customerID,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          username: user.username,
        };
        
        // Set auth state (this will persist to localStorage)
        setAuth(fullUser);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
        toast.success('Logged in successfully!');
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        toast.error('Login failed: No user data received');
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    },
  });
};