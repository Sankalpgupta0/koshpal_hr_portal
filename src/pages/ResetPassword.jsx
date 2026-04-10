import { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPasswordOtp } from '../api/auth';

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('OTP has been sent to your email');
      setStep('otp');
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setError(
        Array.isArray(apiMessage)
          ? apiMessage[0]
          : apiMessage || 'Unable to send OTP. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Verify OTP and get temp token
      const verifyRes = await verifyOtp(email, otp);
      const token = verifyRes.tempToken;

      // Step 2: Reset password using temp token
      await resetPasswordOtp(token, newPassword);
      
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      setError(
        Array.isArray(apiMessage)
          ? apiMessage[0]
          : apiMessage || 'Verification failed. Please check your OTP.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8"
      style={{ backgroundColor: 'var(--color-bg-secondary, #f3f4f6)' }}
    >
      <div
        className="rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md transition-all duration-300"
        style={{
          backgroundColor: 'var(--color-bg-card, #ffffff)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <img src="/logo.png" alt="logo" className="w-6 h-6 sm:w-8 sm:h-8" />
          <span
            className="text-lg sm:text-xl font-bold"
            style={{ color: 'var(--color-text-primary, #1f2937)' }}
          >
            Koshpal
          </span>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2"
            style={{ color: 'var(--color-text-primary, #1f2937)' }}
          >
            {step === 'email' ? 'Forgot Password' : 'Verify OTP'}
          </h1>
          <p
            className="text-sm sm:text-base"
            style={{ color: 'var(--color-text-secondary, #6b7280)' }}
          >
            {step === 'email' 
              ? 'Enter your work email to receive a password reset OTP.' 
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-6">
              <label
                className="block text-xs sm:text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-primary, #1f2937)' }}
              >
                Work Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: 'var(--color-text-tertiary, #9ca3af)' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-input-bg, #f9fafb)',
                    border: '1px solid var(--color-input-border, #e5e7eb)',
                    color: 'var(--color-input-text, #1f2937)',
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 text-sm rounded-lg px-3 py-2" style={{ backgroundColor: 'rgba(245, 90, 81, 0.12)', color: 'var(--color-error-dark, #d5332a)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="cursor-pointer w-full font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-200 hover:opacity-90 flex items-center justify-center"
              style={{
                background: 'linear-gradient(to right, #334eac, #17a2b8)',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                opacity: isLoading ? 0.85 : 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            {/* OTP Field */}
            <div className="mb-4">
              <label
                className="block text-xs sm:text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-primary, #1f2937)' }}
              >
                Enter 6-Digit OTP
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: 'var(--color-text-tertiary, #9ca3af)' }}
                />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2 tracking-[0.5em] font-mono text-center"
                  style={{
                    backgroundColor: 'var(--color-input-bg, #f9fafb)',
                    border: '1px solid var(--color-input-border, #e5e7eb)',
                    color: 'var(--color-input-text, #1f2937)',
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="mb-4">
              <label
                className="block text-xs sm:text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-primary, #1f2937)' }}
              >
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: 'var(--color-text-tertiary, #9ca3af)' }}
                />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-input-bg, #f9fafb)',
                    border: '1px solid var(--color-input-border, #e5e7eb)',
                    color: 'var(--color-input-text, #1f2937)',
                  }}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--color-text-tertiary, #9ca3af)' }}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-xs sm:text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-primary, #1f2937)' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: 'var(--color-text-tertiary, #9ca3af)' }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-input-bg, #f9fafb)',
                    border: '1px solid var(--color-input-border, #e5e7eb)',
                    color: 'var(--color-input-text, #1f2937)',
                  }}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--color-text-tertiary, #9ca3af)' }}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 text-sm rounded-lg px-3 py-2" style={{ backgroundColor: 'rgba(245, 90, 81, 0.12)', color: 'var(--color-error-dark, #d5332a)' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 text-sm rounded-lg px-3 py-2 flex items-center gap-2" style={{ backgroundColor: 'rgba(128, 181, 151, 0.18)', color: 'var(--color-success-darkest, #1b7a43)' }}>
                <CheckCircle2 className="w-4 h-4" />
                {success}
              </div>
            )}

            <button
              type="submit"
              className="cursor-pointer w-full font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-all duration-200 hover:opacity-90"
              style={{
                background: 'linear-gradient(to right, #334eac, #17a2b8)',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                opacity: isLoading ? 0.85 : 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Reset Password'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full mt-4 text-sm font-medium py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-text-secondary, #6b7280)' }}
              disabled={isLoading}
            >
              Change Email
            </button>
          </form>
        )}

        {step === 'email' && (
          <div className="mt-6 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-primary, #334eac)' }}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
