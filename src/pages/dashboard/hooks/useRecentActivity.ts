import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/config/axios';
import type { RecentActivity } from '../../../core/types/dashboard.types';

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      const response = await api.get('/dashboard/recent-activity');
      return response.data.data as RecentActivity[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};