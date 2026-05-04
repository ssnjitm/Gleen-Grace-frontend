import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../core/config/axios';
import type { SignupCredentials } from '../../../core/types/auth';
import { useAuthStore } from '../../../store/authStore';

export const useSignup = () => {
  const navigate = useNavigate();
  const setTempEmail = useAuthStore((state) => state.setTempEmail);

  return useMutation({
    mutationFn: async (data: SignupCredentials) => {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        username: data.email.split('@')[0],
      };
      const response = await api.post('/auth/register-request', payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      setTempEmail(variables.email);
      navigate('/verify-otp');
    },
  });
};