import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// interface PublicRouteProps {
//   redirectTo?: string;
// }

// export const PublicRoute = ({ redirectTo = '/dashboard' }: PublicRouteProps) => {
//   const { isAuthenticated } = useAuthStore();
//   const location = useLocation();

//   if (isAuthenticated) {
//     const from = (location.state as any)?.from?.pathname || redirectTo;
//     return <Navigate to={from} replace />;
//   }

//   return <Outlet />;
// };

export const PublicRoute = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const location = useLocation();

  if (!_hasHydrated) return null; // Wait for storage

  if (isAuthenticated) {
    // Check if there is a 'from' in state, otherwise go to dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    // If we are already AT the 'from' or 'dashboard' path, don't navigate again
    if (location.pathname === from) return <Outlet />;
    
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};