import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import { useAuthStore } from '../../../store/authStore';

export const useVerifyOTP = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tempEmail = useAuthStore((state) => state.tempEmail);
  const clearTempEmail = useAuthStore((state) => state.setTempEmail);

  return useMutation({
    mutationFn: async (otp: string) => {
      if (!tempEmail) {
        throw new Error('No email found for verification');
      }
      
      const response = await api.post('/auth/verify-otp', {
        email: tempEmail,
        otp: otp,
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Clear temporary email and any cached signup data
      clearTempEmail(null);
      queryClient.removeQueries({ queryKey: ['signupData'] });
      
      toast.success('Email verified successfully! Please login.');
      
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created successfully!' } });
      }, 1500);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid or expired OTP';
      toast.error(message);
    },
  });
};