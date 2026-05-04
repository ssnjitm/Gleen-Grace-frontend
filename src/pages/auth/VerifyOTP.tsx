import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useResendOTP } from './hooks/useResendOTP';
import { useVerifyOTP } from './hooks/useVerifyOTP';
import AuthCard from '../../core/components/auth/AuthCard';


export const VerifyOTP = () => {
  const navigate = useNavigate();
  const tempEmail = useAuthStore((state) => state.tempEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOTP, isPending: isVerifying, isError, error } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  useEffect(() => {
    if (!tempEmail) {
      navigate('/signup');
    }
  }, [tempEmail, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
    
//     if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
//       e.preventDefault();
//       const pastedText = e.clipboardData?.getData('text');
//       if (pastedText && /^\d{6}$/.test(pastedText)) {
//         const digits = pastedText.split('');
//         setOtp(digits);
//         inputRefs.current[5]?.focus();
//       }
//     }
//   };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pastedText = e.clipboardData.getData('text');
  if (/^\d{6}$/.test(pastedText)) {
    const digits = pastedText.split('');
    setOtp(digits);
    inputRefs.current[5]?.focus();
  }
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      verifyOTP(otpCode);
    }
  };

  const handleResend = () => {
    if (canResend && !isResending) {
      resendOTP();
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message;

  return (
    <AuthCard 
      title="Verify Your Email" 
      subtitle={`Enter the 6-digit code sent to ${tempEmail || 'your email'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {isError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMessage || "Invalid verification code"}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                // ref={(el) => (inputRefs.current[index] = el)}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onPaste={handlePaste}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isVerifying || isResending}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {(isVerifying || isResending) && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">{isVerifying ? 'Verifying...' : 'Resending...'}</span>
            </div>
          )}

          <div className="text-center pt-2">
            {!canResend ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Code expires in <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span>
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? 'Sending...' : 'Resend verification code'}
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isVerifying || otp.join('').length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
        >
          {isVerifying ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Verify & Create Account</span>
            </>
          )}
        </button>

        <div className="text-center">
          <Link 
            to="/signup" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign Up
          </Link>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Didn't receive the code? Check your spam folder</p>
          <p className="mt-1">or contact support@example.com</p>
        </div>
      </form>
    </AuthCard>
  );
};