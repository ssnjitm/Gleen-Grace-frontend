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
      return response.data; 
    },
    // onSuccess: async (responseData) => {
    //   // DEBUG: Look at this in your browser console!
    //   console.log('Full Response Data:', responseData);

    //   // Check both common nested structures
    //   const user = responseData?.data?.user || responseData?.user;
      
    //   if (user) {
    //     const fullUser = {
    //       id: user.id || user._id,
    //       customerID: user.customerID,
    //       email: user.email,
    //       fullName: user.fullName,
    //       role: user.role,
    //       username: user.username,
    //     };
        
    //     setAuth(fullUser);
        
    //     // Ensure queries are fresh
    //     await queryClient.invalidateQueries({ queryKey: ['user'] });
        
    //     toast.success('Logged in successfully!');
        
    //     // Use replace: true to prevent "back" button returning to login
    //     navigate('/dashboard', { replace: true });
    //   } else {
    //     console.error('User data missing. Check response structure:', responseData);
    //     toast.error('Login failed: Invalid server response');
    //   }
    // },

    onSuccess: async (data) => {
  const user = data?.data?.user || data?.user;
  
  if (user) {
    // 1. Set Auth first
    setAuth(user);
    
    // 2. Invalidate queries but DON'T await them if they might 401
    queryClient.invalidateQueries({ queryKey: ['user'] });

    toast.success('Logged in successfully!');

    // 3. Small delay ensures Zustand and Cookies are ready
    setTimeout(() => {
      // Use replace: true so the user can't go 'back' to login
      navigate('/dashboard', { replace: true });
    }, 100); 
  }
},
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    },
  });
};