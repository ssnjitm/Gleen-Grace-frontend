import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const location = useLocation();

  if (!_hasHydrated) return null; // Or a loading spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};