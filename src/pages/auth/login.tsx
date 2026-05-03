import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AuthCard from '../../core/components/auth/AuthCard';
import { api } from '../../core/config/axios';

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials: typeof formData) => {
      // Ensure the path matches your backend: '/auth/login'
      const response = await api.post('/auth/login', credentials);
      return response.data.data.user;
    },
    onSuccess: (user) => {
      setAuth(user);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  // Type safe error message extraction
  const errorMessage = (error as any)?.response?.data?.message || error?.message;

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to continue">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {errorMessage || "Login failed"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 hover:shadow-lg transition-all"
        >
          {isPending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">Create Account</Link>
        </p>
      </form>
    </AuthCard>
  );
};