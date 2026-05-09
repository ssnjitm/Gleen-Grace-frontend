import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../store/authStore';

// Extend AxiosRequestConfig to include _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // Crucial for cookies - this sends httpOnly cookies automatically
  timeout: 10000,
});

// Request interceptor - No need to add token manually since cookies are sent automatically
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // For cookie-based auth, we don't need to add Authorization header
    // The httpOnly cookies are sent automatically with withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// // Response interceptor for token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as CustomAxiosRequestConfig;
    
//     // Only attempt refresh on 401 errors and not already retried
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Attempt to refresh token using the refresh token cookie
//         // The refresh token is automatically sent via cookie
//         await api.post('/auth/refresh-token');
//         // Retry the original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed - logout user
//         const { logout } = useAuthStore.getState();
//         await logout();
//         // Redirect to login page
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const currentPath = window.location.pathname;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept 401s if the user is already trying to log in
      if (currentPath === '/login' || originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      
      try {
        await api.post('/auth/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth(); 
        
        // Only redirect to login if we aren't already there
        if (currentPath !== '/login') {
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);