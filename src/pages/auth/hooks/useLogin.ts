// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { api } from '../../../core/config/axios';
// import { useAuthStore } from '../../../store/authStore';

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export const useLogin = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { setAuth } = useAuthStore();

//   return useMutation({
//     mutationFn: async (credentials: LoginCredentials) => {
//       const response = await api.post('/auth/login', credentials);
//       return response.data;
//     },
//     onSuccess: async (response) => {
//       // Extract user from response - check the structure of your response
//       // Your backend returns: { data: { user: { id, customerID } } }

//       console.log('Server Response:', response);
//       // const user = data.data?.user;
//       const user = response?.data?.user || response?.user || response?.data;
      
//       if (user && (user.id || user._id)) {
//         // Create a complete user object
//         const fullUser = {
//           id: user.id || user._id,
//           customerID: user.customerID,
//           email: user.email,
//           fullName: user.fullName,
//           role: user.role,
//           username: user.username,
//         };
        
//         // Set auth state (this will persist to localStorage)
//         setAuth(fullUser);
//         //debug
//         console.log("User found:", user)
        
//         // Invalidate queries
//         queryClient.invalidateQueries({ queryKey: ['user'] });
//         queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        
//         toast.success('Logged in successfully!');
        
//         // Navigate to dashboard
//         // navigate('/dashboard');
        
//         setTimeout(() => {
//       navigate('/dashboard', { replace: true });
//       toast.success('Logged in successfully!');
//     }, 0);
//       } else {
//         toast.error('Login failed: No user data received');
//       }
//     },
//     onError: (error: any) => {
//       const message = error?.response?.data?.message || 'Invalid credentials';
//       toast.error(message);
//     },
//   });
// };


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import { useAuthStore } from '../../../store/authStore';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/auth/login', credentials);
      return response.data.data; 
    },

    onSuccess: async (data) => {
      // Data structure: { user: {...}, accessToken, refreshToken }
      const user = data?.user;
      
      console.log('Login Response - Full Data:', data);
      console.log('Login Response - User:', user);
      console.log('User Role:', user?.role);
      
      if (user) {
        // Create complete user object with all fields
        const fullUser = {
          id: user.id || user._id,
          customerID: user.customerID,
          email: user.email,
          fullName: user.fullName,
          role: user.role, // Make sure role is included
          username: user.username,
        };
        
        console.log('Full User Object to Store:', fullUser);
        
        // Set Auth - this persists to localStorage
        setAuth(fullUser);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['user'] });

        toast.success('Logged in successfully!');

        // Small delay ensures Zustand and localStorage are ready
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100); 
      } else {
        console.error('User data missing. Response:', data);
        toast.error('Login failed: No user data received');
      }
    },
    
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    },
  });
};