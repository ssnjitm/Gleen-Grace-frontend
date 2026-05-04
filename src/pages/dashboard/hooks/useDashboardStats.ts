import { useQuery } from '@tanstack/react-query';
import { api } from '../../../core/config/axios';
import type { DashboardStats } from '../../../core/types/dashboard.types';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data as DashboardStats;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};