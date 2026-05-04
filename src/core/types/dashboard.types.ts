export interface StatCardData {
  title: string;
  value: string | number;
  change: string;
  icon: string; // Icon name as string to avoid passing React nodes
  trend: 'up' | 'down' | 'neutral';
}

export interface FeatureCardData {
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  badge?: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconColor: string;
  path: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeQuizzes: number;
  activePuzzles: number;
  activeUsers: number;
  userGrowth: string;
  quizGrowth: string;
  puzzleGrowth: string;
  userActivityGrowth: string;
}