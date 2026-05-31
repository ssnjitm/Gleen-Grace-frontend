import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from './hooks/useLogout';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useRecentActivity } from './hooks/useRecentActivity';
import type { FeatureCardData } from '../../core/types/dashboard.types';
import { DashboardLayout } from '../../core/components/dashboard/DashboardLayout';
import { StatCard } from '../../core/components/dashboard/StatCard';
import { QuickAccessCard } from '../../core/components/dashboard/QuickAccessCard';
import { FeatureCard } from '../../core/components/dashboard/FeatureCard';
import { RecentActivity } from '../../core/components/dashboard/RecentActivity';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (user?.fullName) {
      return user.fullName.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Admin';
  };

  const getUserInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Stats data
  const statCards = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: stats.userGrowth,
      icon: 'Users',
      trend: stats.userGrowth.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      title: 'Active Quizzes',
      value: stats.activeQuizzes.toString(),
      change: stats.quizGrowth,
      icon: 'ClipboardList',
      trend: stats.quizGrowth.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      title: 'Active Puzzles',
      value: stats.activePuzzles.toString(),
      change: stats.puzzleGrowth,
      icon: 'Gamepad2',
      trend: stats.puzzleGrowth.startsWith('+') ? 'up' as const : 'down' as const,
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toString(),
      change: stats.userActivityGrowth,
      icon: 'Activity',
      trend: stats.userActivityGrowth.startsWith('+') ? 'up' as const : 'down' as const,
    },
  ] : [];

  // Features data
  const features: FeatureCardData[] = [
    {
      title: 'Quiz Management',
      description: 'Create, edit, and monitor educational quizzes. Track completion rates and student performance.',
      icon: 'ClipboardList',
      color: 'bg-blue-500',
      path: '/quiz-management',
      badge: '12 new'
    },
    {
      title: 'Puzzle Studio',
      description: 'Design interactive crosswords, logic puzzles, and brain teasers. Track solving rates and difficulty levels.',
      icon: 'Gamepad2',
      color: 'bg-purple-500',
      path: '/puzzle-studio',
      badge: '5 new'
    },
    {
      title: 'Users & Access',
      description: 'Control registration, roles, permissions and track student engagement metrics.',
      icon: 'Users',
      color: 'bg-green-500',
      path: '/users',
    },
    {
      title: 'Content Library',
      description: 'Curate lessons, video preachments, and downloadable educational materials.',
      icon: 'BookOpen',
      color: 'bg-orange-500',
      path: '/content'
    },
    {
      title: 'Notifications',
      description: 'Broadcast announcements, push updates, and manage automated alerts.',
      icon: 'Bell',
      color: 'bg-red-500',
      path: '/notifications'
    }
  ];

  // Add admin features if user is admin
  if (user?.role === 'admin') {
    console.log('✅ ADMIN user detected - adding admin features');
    features.push(
      {
        title: 'Admin Dashboard',
        description: 'Manage users, view system statistics, and oversee platform operations.',
        icon: 'Users',
        color: 'bg-indigo-500',
        path: '/admin/dashboard',
      },
      {
        title: 'System Health',
        description: 'Monitor system performance, resource usage, and health metrics.',
        icon: 'Activity',
        color: 'bg-cyan-500',
        path: '/admin/system-health',
      }
    );
  } else {
    console.log('❌ User is not ADMIN. User role:', user?.role, 'User object:', user);
  }

  // Loading skeleton for stats
  if (statsLoading) {
    return (
      <DashboardLayout
        features={features}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        userName={getUserDisplayName()}
        userInitial={getUserInitial()}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      features={features}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      userName={getUserDisplayName()}
      userInitial={getUserInitial()}
    >
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back, {getUserDisplayName()}
        </h2>
        <p className="text-gray-600">
          Manage your educational content, oversee user activities, and broadcast updates across the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <QuickAccessCard
          title="Quiz Management"
          description="Create, edit, and monitor educational quizzes. Track completion rates."
          icon="quiz"
          color="blue"
          path="/quiz-management"
          onNavigate={handleNavigate}
        />
        <QuickAccessCard
          title="Puzzle Studio"
          description="Design crosswords, logic puzzles, and brain teasers. Track solving rates."
          icon="puzzle"
          color="purple"
          path="/puzzle-studio"
          onNavigate={handleNavigate}
        />
      </div>

      {/* Feature Cards */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            {...feature}
            onNavigate={handleNavigate}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <RecentActivity
        activities={activities || []}
        onNavigate={handleNavigate}
        isLoading={activitiesLoading}
      />
    </DashboardLayout>
  );
};