import React, { useState } from 'react';

interface CheckEmailViewProps {
  email?: string;
  onBackToLogin: () => void;
  onBackToHome: () => void;
  onOpenResetPasswordLink?: () => void;
}

export const CheckEmailView: React.FC<CheckEmailViewProps> = ({
  email = 'researcher@ecopredict.ai',
  onBackToLogin,
  onBackToHome,
  onOpenResetPasswordLink,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }, 1200);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#FBF9F5] text-[#1B1C1A] font-sans relative">
      {/* Top Left Navigation Back Button to Home */}
      <button
        onClick={onBackToHome}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#E8E3DA] text-[#43493C] hover:text-[#2E5D3D] hover:bg-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Back to Home</span>
      </button>

      {/* Main Container Layout */}
      <main className="w-full flex h-full">
        {/* Left Side: Action Column */}
        <section className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:px-16 bg-[#FBF9F5] z-10 overflow-y-auto border-r border-[#E8E3DA]">
          <div className="my-auto max-w-md w-full mx-auto space-y-6 pt-8">
            {/* Brand Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E5D3D] text-white shadow-xs">
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#2E5D3D]">
                EcoPredict AI
              </span>
            </div>

            {/* Email Read Badge */}
            <div className="pt-2">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#B8ECC2] text-[#00210D] mb-4 shadow-sm animate-pulse">
                <span
                  className="material-symbols-outlined text-[40px] text-[#215031]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  mark_email_read
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#1B1C1A] tracking-tight mb-3">
                Check Your Email
              </h1>
              <p className="text-base text-[#43493C] leading-relaxed">
                We've sent a password reset link to{' '}
                <span className="font-bold text-[#2C4D03]">{email}</span>. Please check your inbox and follow the instructions to regain access.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {onOpenResetPasswordLink && (
                <button
                  type="button"
                  onClick={onOpenResetPasswordLink}
                  className="w-full bg-[#2C4D03] hover:bg-[#1a3001] text-white font-semibold text-sm py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">lock_reset</span>
                  <span>Open Reset Password Link</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full bg-[#43651C] hover:bg-[#2C4D03] text-white font-semibold text-sm py-3.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isResending ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">
                      refresh
                    </span>
                    <span>Resending Email...</span>
                  </>
                ) : (
                  <>
                    <span>Resend Email</span>
                    <span className="material-symbols-outlined text-lg">refresh</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full border border-[#C4C9B8] text-[#1B1C1A] font-semibold text-sm py-3.5 px-6 rounded-lg hover:bg-[#F5F3EF] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Back to Login</span>
              </button>
            </div>

            {/* Assistance Footer */}
            <p className="pt-4 text-xs text-[#74796A] text-center leading-relaxed">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => alert('Support team contacted: support@ecopredict.ai')}
                className="text-[#2C4D03] font-semibold hover:underline cursor-pointer"
              >
                contact support
              </button>
              .
            </p>
          </div>
        </section>

        {/* Right Side: Visual & Dashboard Preview */}
        <section className="hidden md:flex w-1/2 relative bg-[#EAE8E4] overflow-hidden items-center justify-center p-12">
          {/* Background Image: West Africa Canopy */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwc1F668uddG8oKFAOxA_2MAYW5IWtJRuMAuJa6Nq-rk7QjuYAOWYhJCkK2jPLGI9ajpHL_KaJoMfRhNNfkYQ6IUZNLpxQJh78xVFjX7_l8SKe1qEX0fYUKijwmvF4P9Aa2q_SLmH1shRbtX9O6-bceGk9m26M4kwcklz3xPrCjnjymTzSzkSdQOBk5fe0CWORaOAc6D9Vz6xbcNIZVBEOQpztNj6y4f0uMGeJUlOvko20P_L6J6m9-Q"
              alt="West Africa Rainforest Canopy Research"
              className="w-full h-full object-cover"
            />
            {/* Subtle Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C4D03]/40 via-transparent to-black/10"></div>
          </div>

          {/* Floating Glassmorphic Cards */}
          <div className="relative z-10 w-full max-w-md space-y-5">
            {/* Card 1: Regional Confidence Score */}
            <div className="bg-white/75 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-2xl space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2C4D03] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg">analytics</span>
                </div>
                <span className="text-sm font-semibold text-[#1B1C1A]">
                  Regional Confidence Score
                </span>
              </div>
              <div className="flex items-end gap-2 pt-1">
                <span className="text-4xl font-extrabold text-[#2C4D03] leading-none">
                  94.2%
                </span>
                <span className="text-[#2C4D03] material-symbols-outlined text-2xl mb-1">
                  trending_up
                </span>
              </div>
              <div className="w-full h-2 bg-[#E4E2DE] rounded-full overflow-hidden">
                <div className="h-full bg-[#2C4D03] w-[94.2%] rounded-full"></div>
              </div>
            </div>

            {/* Card 2: Environmental Delta */}
            <div className="bg-white/75 backdrop-blur-md border border-white/40 p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-[#1B1C1A]">
                  Environmental Delta
                </h3>
                <span className="material-symbols-outlined text-[#43493C]">
                  more_horiz
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F5F3EF] rounded-xl border border-[#E8E3DA]">
                  <p className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                    Carbon Flux
                  </p>
                  <p className="text-2xl font-black text-[#A65A35] mt-1">-12.4t</p>
                </div>
                <div className="p-4 bg-[#F5F3EF] rounded-xl border border-[#E8E3DA]">
                  <p className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                    Predictive Index
                  </p>
                  <p className="text-2xl font-black text-[#396847] mt-1">High</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Corner Label */}
          <div className="absolute bottom-6 right-6 text-white/90 text-xs font-semibold uppercase tracking-widest drop-shadow-sm">
            Satellite Verification Active • 2026
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1B1C1A] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 z-50 transition-all animate-bounce">
          <span className="material-symbols-outlined text-[#B8ECC2]">check_circle</span>
          <span className="text-sm font-semibold">Password reset link resent successfully!</span>
        </div>
      )}
    </div>
  );
};
