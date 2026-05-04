import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';

interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export const useResetPassword = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    },
    onSuccess: () => {
      // Clear any cached auth data
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['auth'] });
      
      // Clear stored email
      sessionStorage.removeItem('resetEmail');
      
      toast.success('Password reset successfully! Please login with your new password.');
      
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful!' } });
      }, 2000);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });
};