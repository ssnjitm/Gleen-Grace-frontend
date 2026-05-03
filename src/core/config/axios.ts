// import axios from "axios";
// import { useAuthStore } from "../../store/authStore";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
// });

// // Request interceptor to add Bearer token
// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

// api/axios.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // Crucial for cookies
});

// Optional: Interceptor to handle token refresh automatically
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?._retry) {
            prevRequest._retry = true;
            try {
                await api.post('/auth/refresh-token'); // Endpoint to refresh
                return api(prevRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);