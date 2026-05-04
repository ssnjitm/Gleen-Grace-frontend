import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import { useAuthStore } from '../../../store/authStore';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
      
      // Clear auth store
      logout();
      
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    },
    onError: (error: any) => {
      console.error('Logout error:', error);
      // Still clear local state even if API fails
      queryClient.clear();
      logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    },
  });
};