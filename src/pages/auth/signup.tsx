import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../core/config/axios';
import AuthCard from '../../core/components/auth/AuthCard';


export const Signup = () => {
  const navigate = useNavigate();
  const setTempEmail = useAuthStore((state) => state.setTempEmail);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', acceptTerms: false
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: any) => {
      // Backend expects: fullName, email, password, username
      const payload = { ...data, username: data.email.split('@')[0] };
      return api.post('/auth/register-request', payload);
    },
    onSuccess: (_, variables) => {
      setTempEmail(variables.email);
      navigate('/verify-otp');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.acceptTerms) mutate(formData);
  };

  return (
    <AuthCard title="Join Community" subtitle="Create an account to join our team">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {(error as any).response?.data?.message || "Signup failed"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            required
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="ml-2 text-xs text-gray-600">I agree to the Terms & Privacy Policy</span>
        </div>

        <button
          type="submit"
          disabled={isPending || !formData.acceptTerms}
          className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isPending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><UserPlus className="w-5 h-5" /><span>Create Account</span></>}
        </button>
      </form>
    </AuthCard>
  );
};