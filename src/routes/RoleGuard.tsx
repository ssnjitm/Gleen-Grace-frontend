import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '../core/types/user';
import { useAuthStore } from '../store/authStore';


interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

// export const RoleGuard = ({ allowedRoles, redirectTo = '/unauthorized' }: RoleGuardProps) => {
//   const { user, isAuthenticated, isLoading } = useAuthStore();
//   const location = useLocation();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Check if user has required role
//   const hasRequiredRole = user && allowedRoles.includes(user.role);

//   if (!hasRequiredRole) {
//     return <Navigate to={redirectTo} replace />;
//   }

//   return <Outlet />;
// };

export const RoleGuard = ({ allowedRoles, redirectTo = '/unauthorized' }: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading, _hasHydrated } = useAuthStore();
  const location = useLocation();

  // 1. Wait for hydration and loading
  if (!_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Check Authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Robust Role Check
  // We check if user and user.role exist, then cast user.role to UserRole
  const userRole = user?.role as UserRole;
  const hasRequiredRole = userRole && allowedRoles.includes(userRole);

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};