import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminUser, BulkUserActionParams, DashboardStats, GetUsersParams, GetUsersResponse, SystemHealth, SystemInfo, UpdateUserParams, UserStatistics } from '../../../../core/types/admin.types';
import { api as axiosInstance } from '../../../../core/config/axios';

const ADMIN_API = '/admin';
const QUERY_KEYS = {
  DASHBOARD: 'admin-dashboard',
  USERS: 'admin-users',
  USER_STATS: 'admin-user-stats',
  USER_DETAIL: 'admin-user-detail',
  SYSTEM_HEALTH: 'admin-system-health',
  SYSTEM_INFO: 'admin-system-info',
  ADMINS: 'admin-admins',
};

// ==================== Dashboard ====================
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: DashboardStats }>(`${ADMIN_API}/dashboard`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== Users ====================
export const useGetUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: GetUsersResponse }>(`${ADMIN_API}/users`, {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
          role: params?.role,
          isVerified: params?.isVerified,
          isActive: params?.isActive,
          sortBy: params?.sortBy,
          sortOrder: params?.sortOrder,
        }
      });
      return data.data;
    },
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_DETAIL, userId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: AdminUser }>(`${ADMIN_API}/users/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: UpdateUserParams) => {
      const response = await axiosInstance.put<{ data: AdminUser }>(`${ADMIN_API}/users/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      await axiosInstance.delete(`${ADMIN_API}/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
  });
};

export const useBulkUserAction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: BulkUserActionParams) => {
      const response = await axiosInstance.post(`${ADMIN_API}/users/bulk`, params);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
  });
};

// ==================== User Statistics ====================
export const useUserStatistics = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_STATS],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: UserStatistics }>(`${ADMIN_API}/users/stats`);
      return data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==================== Roles ====================
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await axiosInstance.put<{ data: AdminUser }>(`${ADMIN_API}/users/${userId}/role`, { role });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
    },
  });
};

export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMINS],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: AdminUser[] }>(`${ADMIN_API}/admins`);
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetUsersByRole = (role: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, role],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: AdminUser[] }>(`${ADMIN_API}/roles/${role}`);
      return data.data;
    },
    enabled: !!role,
  });
};

// ==================== System ====================
export const useSystemHealth = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SYSTEM_HEALTH],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: SystemHealth }>(`${ADMIN_API}/health`);
      return data.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSystemInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SYSTEM_INFO],
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: SystemInfo }>(`${ADMIN_API}/system/info`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClearCache = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`${ADMIN_API}/cache/clear`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// ==================== Export ====================
export const useExportUsers = () => {
  return useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
      const response = await axiosInstance.get(`${ADMIN_API}/export/users`, {
        params: { format },
        responseType: format === 'csv' ? 'blob' : 'json',
      });
      return response.data;
    },
  });
};

export const useExportStats = () => {
  return useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
      const response = await axiosInstance.get(`${ADMIN_API}/export/stats`, {
        params: { format },
        responseType: format === 'csv' ? 'blob' : 'json',
      });
      return response.data;
    },
  });
};
