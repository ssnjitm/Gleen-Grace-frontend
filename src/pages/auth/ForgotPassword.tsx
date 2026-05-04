import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import AuthCard from '../../core/components/auth/AuthCard';
import { useForgotPassword } from './hooks/useForgotPassword';


export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { mutate: forgotPassword, isPending, isSuccess, error, data } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  return (
    <AuthCard 
      title="Forgot Password?" 
      subtitle="Enter your email to receive a password reset OTP"
    >
      {isSuccess ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm">
                We've sent a password reset OTP to <strong>{email}</strong>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                The OTP is valid for 5 minutes
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link
              to="/reset-password"
              state={{ email }}
              className="block w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2.5 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Proceed to Reset Password
            </Link>
            <Link
              to="/login"
              className="block w-full text-gray-600 hover:text-gray-800 text-center text-sm transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>If an account exists, you will receive an OTP</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the email address you used to sign up
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending || !email}
            className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
          >
            {isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Reset OTP</span>
              </>
            )}
          </button>

          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500">
            <p>We'll send a 6-digit OTP to verify your identity</p>
          </div>
        </form>
      )}
    </AuthCard>
  );
};