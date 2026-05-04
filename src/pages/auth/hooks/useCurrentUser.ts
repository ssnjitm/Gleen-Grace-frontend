import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/config/axios';
import { useAuthStore } from '../../../store/authStore';

export const useCurrentUser = () => {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data.data?.user || response.data.user;
    },
    enabled: isAuthenticated, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    initialData: user || undefined, // Use store data as initial data
  });
};