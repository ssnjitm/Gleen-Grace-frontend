import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RoleGuard } from './RoleGuard';

// Auth Pages
import { Login } from '../pages/auth/login';
import { Signup } from '../pages/auth/signup';
import { VerifyOTP } from '../pages/auth/VerifyOTP';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { Unauthorized } from '../core/components/common/Unauthorized';
import { NotFound } from '../core/components/common/NotFound';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { QuizList } from '../pages/quiz/QuizList';
import { QuizDetail } from '../pages/quiz/QuizDetail';
import { QuizEdit } from '../pages/quiz/QuizEdit';
import { QuizSettings } from '../pages/quiz/QuizSettings';
import QuizCreator from '../pages/quiz/QuizCreator';

// Admin Pages
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import SystemHealthPage from '../pages/dashboard/admin/SystemHealthPage';


// // Dashboard Pages
// import { Dashboard } from '../features/dashboard/pages/Dashboard';

// // Admin Pages
// import { UserManagement } from '../features/admin/pages/UserManagement';

// // Common Pages
// import { Unauthorized } from '../pages/Unauthorized';
// import { NotFound } from '../pages/NotFound';


export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes - Authentication required */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard and main routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Quiz Management Routes */}
        <Route path="/quiz-management" element={<Navigate to="/dashboard/quiz" replace />} />
        <Route path="/dashboard/quiz" element={<QuizList />} />
        <Route path="/dashboard/quiz/create" element={<QuizCreator />} />
        <Route path="/dashboard/quiz/:id" element={<QuizDetail />} />
       <Route path="/dashboard/quiz/edit/:id" element={<QuizEdit />} />
        {/* <Route path="/dashboard/quiz/:id/analytics" element={<QuizAnalyticsics />} /> */}
        <Route path="/dashboard/quiz/:id/settings" element={<QuizSettings />} /> 
        
        {/* Admin only routes */}
        <Route element={<RoleGuard allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/system-health" element={<SystemHealthPage />} />
          <Route path="/admin/settings" element={<div>Admin Settings</div>} />
        </Route>

        {/* Editor/Developer routes */}
        <Route element={<RoleGuard allowedRoles={['editor', 'developer', 'admin']} />}>
          <Route path="/content" element={<div>Content Management</div>} />
          <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
        </Route>

        {/* Developer only routes */}
        <Route element={<RoleGuard allowedRoles={['developer']} />}>
          <Route path="/developer/logs" element={<div>System Logs</div>} />
          <Route path="/developer/api-keys" element={<div>API Keys Management</div>} />
        </Route>
      </Route>

      {/* Common Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};