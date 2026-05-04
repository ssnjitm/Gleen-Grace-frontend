import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import { useAuthStore } from '../../../store/authStore';

export const useResendOTP = () => {
  const tempEmail = useAuthStore((state) => state.tempEmail);

  return useMutation({
    mutationFn: async () => {
      if (!tempEmail) {
        throw new Error('No email found for OTP resend');
      }
      
      const response = await api.post('/auth/register-request', {
        email: tempEmail,
      });
      
      return response.data;
    },
    retry: 1, // Retry once if fails
    retryDelay: 1000, // Wait 1 second before retry
    onSuccess: () => {
      toast.success('New OTP sent to your email');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(message);
    },
  });
};