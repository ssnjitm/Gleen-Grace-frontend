import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';

interface ForgotPasswordData {
  email: string;
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success('If an account exists, you will receive an OTP');
      // Store email in sessionStorage for reset password page
      sessionStorage.setItem('resetEmail', variables.email);
    },
    onError: (error: any) => {
      // Don't show error for security reasons (backend also returns success)
      console.log('Password reset request processed');
    },
  });
};