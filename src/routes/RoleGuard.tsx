import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '../core/types/user';
import { useAuthStore } from '../store/authStore';


interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleGuard = ({ allowedRoles, redirectTo = '/unauthorized' }: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = user && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};