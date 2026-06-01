export interface AdminUser {
  _id: string;
  customerID: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'ADMIN' | 'EDITOR' | 'DEVELOPER' | 'USER';
  isVerified: boolean;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    completionRate: number | string;
  };
  roles: {
    admin: number;
    user: number;
    editor: number;
    developer: number;
  };
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  byRole: Record<string, number>;
  newUsersToday: number;
  newUsersThisWeek: number;
}

export interface SystemHealth {
  database: {
    status: 'connected' | 'disconnected';
    name: string;
    host: string;
    readyState: number;
  };
  server: {
    uptime: number;
    memoryUsage: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      arrayBuffers: number;
    };
    nodeVersion: string;
    platform: string;
    cpuCores: number;
  };
  timestamp: string;
}

export interface SystemInfo {
  node: {
    version: string;
    env: string;
  };
  database: {
    type: string;
    version: string;
    collections: Record<string, number>;
  };
  app: {
    name: string;
    version: string;
    uptime: number;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UpdateUserParams {
  id: string;
  data: {
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    role?: string;
    isVerified?: boolean;
    isActive?: boolean;
    avatar?: string;
  };
}

export interface BulkUserActionParams {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'verify' | 'delete';
}

export interface AdminDashboardCard {
  title: string;
  value: number | string;
  change?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ExportFormat {
  format: 'csv' | 'json';
}
