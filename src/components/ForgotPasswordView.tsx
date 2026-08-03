import React, { useState } from 'react';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
  onBackToHome: () => void;
  onSentResetLink?: (email: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onBackToHome,
  onSentResetLink,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      if (onSentResetLink) {
        onSentResetLink(email);
      }
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

      {/* Left Column: Form Section */}
      <section className="w-full md:w-1/2 lg:w-[500px] xl:w-[600px] h-full flex flex-col justify-between p-8 sm:p-12 md:px-16 bg-[#FBF9F5] z-10 overflow-y-auto border-r border-[#E8E3DA]">
        <div className="my-auto w-full max-w-md mx-auto space-y-6 pt-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#2C4D03] text-[32px]">
              psychology
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#2C4D03]">
              EcoPredict AI
            </h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#1B1C1A] mb-3 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-base text-[#43493C] leading-relaxed">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1B1C1A]" htmlFor="email-address">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74796A] group-focus-within:text-[#2C4D03] transition-colors text-xl">
                    mail
                  </span>
                  <input
                    id="email-address"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. researcher@ecopredict.ai"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E3DA] rounded-lg focus:ring-2 focus:ring-[#43651C]/20 focus:border-[#43651C] outline-none transition-all text-sm text-[#1B1C1A] placeholder:text-[#C4C9B8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#43651C] hover:bg-[#2C4D03] text-white font-medium text-sm rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="flex items-center gap-1.5 text-[#2C4D03] font-medium text-sm hover:underline transition-all group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 bg-[#B8ECC2] text-[#00210D] rounded-xl flex gap-3 items-start border border-[#9FD3AA]">
                <span className="material-symbols-outlined text-[#215031] text-2xl shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="text-sm font-bold text-[#00210D]">Check your inbox</p>
                  <p className="text-xs text-[#215031] mt-1 leading-relaxed">
                    We've sent a password reset link to <strong className="font-semibold">{email || 'your email address'}</strong> if it exists in our system.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3 border border-[#74796A] text-[#1B1C1A] hover:bg-white font-medium text-sm rounded-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                Resend Link
              </button>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="flex items-center gap-1.5 text-[#2C4D03] font-medium text-sm hover:underline transition-all group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
                    arrow_back
                  </span>
                  <span>Back to Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Right Column: Visual Section */}
      <section className="hidden md:block flex-1 relative overflow-hidden bg-[#DBDAD6]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAADaqoXx1ApkizZT9IwEvYJ1zWJSfN9_PUm9jCX4g3ecrS8U5kVrvW2l8FE2LQbBJNzzyL8uWImEcHnYgJhaQlJRd5FGZI5CzzERyF6lwHPTnwrbjmMZ47S8siA_jSlUAzVl_9526T6VICsqynMyAmNc56lhYbsmuVrC4cRTTOL-veB_N8kKZTCHyMNWm3GMIT8WYSayTrrbVfp3D4zk0QrMVchn79ztwr_EO6H2ngRxQCsoaY-6QObA"
            alt="West Africa Environmental Scientist Research Field Station"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF9F5]/40 via-transparent to-black/20"></div>
        </div>

        {/* Bento Dashboard Preview Floating */}
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
          <div className="w-full max-w-2xl bg-white/75 backdrop-blur-md rounded-2xl shadow-2xl p-6 space-y-6 border border-[#E8E3DA]/60 animate-float">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#BA1A1A]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFDEA7]"></div>
                <div className="w-3 h-3 rounded-full bg-[#B8ECC2]"></div>
              </div>
              <span className="text-xs font-semibold text-[#74796A] tracking-wider uppercase">
                Research Node: WA-772
              </span>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-4">
                {/* Chart Box */}
                <div className="h-40 bg-[#F5F3EF] rounded-xl relative overflow-hidden border border-[#E8E3DA]">
                  <div className="absolute top-3 left-4 text-xs font-bold text-[#2C4D03]">
                    Precipitation Trends
                  </div>
                  <div className="absolute inset-0 mt-8 p-4">
                    <div className="flex items-end gap-2 h-full">
                      <div className="w-full bg-[#ABD37D] rounded-t-xs h-[40%]"></div>
                      <div className="w-full bg-[#ABD37D] rounded-t-xs h-[60%]"></div>
                      <div className="w-full bg-[#43651C] rounded-t-xs h-[85%] shadow-xs"></div>
                      <div className="w-full bg-[#ABD37D] rounded-t-xs h-[55%]"></div>
                      <div className="w-full bg-[#ABD37D] rounded-t-xs h-[70%]"></div>
                      <div className="w-full bg-[#ABD37D] rounded-t-xs h-[45%]"></div>
                    </div>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-[#E8E3DA] shadow-xs">
                    <p className="text-xs text-[#74796A] font-semibold">Confidence</p>
                    <p className="text-2xl font-extrabold text-[#2C4D03] mt-0.5">94.2%</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-[#E8E3DA] shadow-xs">
                    <p className="text-xs text-[#74796A] font-semibold">Anomalies</p>
                    <p className="text-2xl font-extrabold text-[#A65A35] mt-0.5">02</p>
                  </div>
                </div>
              </div>

              {/* Data Ingestion Side Box */}
              <div className="col-span-1 bg-[#EAE8E4] rounded-xl border border-[#E8E3DA] flex flex-col p-4 justify-between">
                <div>
                  <span className="material-symbols-outlined text-[#5A3F00] text-2xl mb-2">
                    database
                  </span>
                  <h4 className="text-sm font-bold text-[#1B1C1A]">Data Ingestion</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-[#C4C9B8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EFBF67] w-[78%] rounded-full"></div>
                  </div>
                  <p className="text-[11px] text-[#74796A] text-right font-medium">78% Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute bottom-8 right-8 text-white/80 font-semibold text-xs tracking-widest uppercase drop-shadow-xs">
          Satellite Verification Active • 2026
        </div>
      </section>
    </div>
  );
};
