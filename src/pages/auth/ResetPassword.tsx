import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Key, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useResetPassword } from './hooks/useResetPassword';
import AuthCard from '../../core/components/auth/AuthCard';


export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem('resetEmail') || '';
  
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: resetPassword, isPending, error, isSuccess } = useResetPassword();

  useEffect(() => {
    if (!email && step === 'otp') {
      navigate('/forgot-password');
    }
  }, [email, navigate, step]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, newPassword });
    if (formData.confirmPassword) {
      validatePassword(newPassword);
    } else {
      validatePassword(newPassword);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!validatePassword(formData.newPassword)) {
      return;
    }
    
    resetPassword({
      email,
      otp: otp.join(''),
      newPassword: formData.newPassword,
    });
  };

  const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message;

  return (
    <AuthCard 
      title={step === 'otp' ? "Verify Reset Code" : "Create New Password"}
      subtitle={step === 'otp' 
        ? `Enter the 6-digit code sent to ${email}` 
        : "Your new password must be different from previous ones"
      }
    >
      {isSuccess ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600 text-sm">
                Your password has been changed successfully.
              </p>
            </div>
          </div>
          
          <Link
            to="/login"
            className="block w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2.5 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <>
          {error && step === 'password' && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{errorMessage || "Failed to reset password"}</span>
            </div>
          )}

          {step === 'otp' ? (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                    //   ref={(el) => (inputRefs.current[index] = el)}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-gray-500">
                  Enter the 6-digit OTP sent to your email
                </p>
              </div>

              <button
                type="submit"
                disabled={otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <Key className="w-5 h-5" />
                <span>Verify OTP</span>
              </button>

              <div className="text-center">
                <Link 
                  to="/forgot-password" 
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Forgot Password
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {formData.newPassword && (
                <div className="space-y-1 text-xs">
                  <p className={`flex items-center gap-1 ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.newPassword.length >= 8 ? <CheckCircle className="w-3 h-3" /> : '•'} At least 8 characters
                  </p>
                  <p className={`flex items-center gap-1 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                    {/[A-Z]/.test(formData.newPassword) ? <CheckCircle className="w-3 h-3" /> : '•'} One uppercase letter
                  </p>
                  <p className={`flex items-center gap-1 ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                    {/[0-9]/.test(formData.newPassword) ? <CheckCircle className="w-3 h-3" /> : '•'} One number
                  </p>
                </div>
              )}

              {passwordError && (
                <div className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !formData.newPassword || !formData.confirmPassword || !!passwordError}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}
        </>
      )}
    </AuthCard>
  );
};