import { QueryClient, type QueryClientConfig } from '@tanstack/react-query';
const defaultConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      networkMode: 'online',
    },
    mutations: {
      retry: 0,
      networkMode: 'online',
    },
  },
};

export const createQueryClient = () => new QueryClient(defaultConfig);

// Query keys for better cache management
export const queryKeys = {
  auth: {
    user: ['user', 'current'],
    all: ['auth'],
  },
  dashboard: {
    stats: ['dashboard', 'stats'],
    recent: ['dashboard', 'recent'],
  },
  users: {
    all: ['users'],
    detail: (id: string) => ['users', id],
  },
} as const;