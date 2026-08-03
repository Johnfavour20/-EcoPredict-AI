import React, { useState } from 'react';

interface LoginViewProps {
  onBack: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
  onSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBack, onSwitchToRegister, onForgotPassword, onSuccess }) => {
  const [email, setEmail] = useState('researcher@ecopredict.ai');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email);
    }, 1200);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-white text-[#1B1C1A] font-sans relative">
      {/* Top Left Navigation Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#E8E3DA] text-[#43493C] hover:text-[#2E5D3D] hover:bg-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Back to Home</span>
      </button>

      {/* Left Column: Authentication Form */}
      <main className="w-full md:w-5/12 lg:w-4/12 xl:w-[480px] h-full bg-white flex flex-col justify-between p-8 sm:p-12 z-10 overflow-y-auto border-r border-[#E8E3DA]">
        <div className="my-auto max-w-sm w-full mx-auto space-y-8 pt-8">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E5D3D] text-white shadow-xs">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#2E5D3D]">
              EcoPredict AI
            </span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B1C1A] tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-[#43493C]">
              Access the West Africa Climate Intelligence platform.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#43493C] uppercase tracking-wider" htmlFor="email-input">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@ecopredict.ai"
                className="w-full rounded-xl border border-[#E8E3DA] bg-[#FBF9F5] px-4 py-3 text-sm text-[#1B1C1A] focus:border-[#2E5D3D] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#43493C] uppercase tracking-wider" htmlFor="password-input">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E8E3DA] bg-[#FBF9F5] px-4 py-3 text-sm text-[#1B1C1A] focus:border-[#2E5D3D] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#74796A] hover:text-[#2E5D3D] transition-colors"
                  title="Toggle Password Visibility"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#43493C]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#E8E3DA] text-[#2E5D3D] focus:ring-[#2E5D3D]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => onForgotPassword ? onForgotPassword() : onSuccess(email)}
                className="font-semibold text-[#2E5D3D] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#2E5D3D] hover:bg-[#20422a] py-4 text-sm font-bold text-white shadow-sm transition-all duration-100 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          {onSwitchToRegister && (
            <div className="text-center border-t border-[#E8E3DA] pt-4">
              <p className="text-xs text-[#43493C]">
                Don't have a research account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#2E5D3D] font-bold hover:underline cursor-pointer"
                >
                  Register
                </button>
              </p>
            </div>
          )}

          {/* Footer Partners */}
          <div className="pt-6 border-t border-[#E8E3DA] space-y-2">
            <div className="flex items-center gap-2 text-[#74796A] text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">school</span>
              <span>Academic Partner</span>
            </div>
            <div className="flex items-center gap-2 text-[#74796A] text-xs font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">account_balance</span>
              <span>Government Portal</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Column: Visual Composition */}
      <section className="relative hidden md:flex h-full flex-1 overflow-hidden bg-[#FBF9F5]">
        {/* Background Landscape Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQLpB0jr82gwHRgiu4SNU7D7WIvvTFoTC9x9m9StsFndwnqq1Png4owQbhC-DJ1YYFzOaruBZdY9IOXy1R2sx0aZgv8afUmL6gBDGaBcPTgCKqyf6e_PIoSb2H_Vj84DdWsHiqVqLpFlyh_wqlqTlKRWobr0v1J-sxRnCMFnATacTGEfJRi2_zK46Kffa23efZugovB0f1MsRd8gRZu285oBqvgmrxvC5rc7J1Zbn2WicbV8fA7b-zuA"
            alt="West Africa Climate Landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20"></div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white/95 shadow-2xl border border-[#E8E3DA] backdrop-blur-md p-6 space-y-4 animate-float">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between bg-[#2E5D3D] px-4 py-2.5 rounded-xl shadow-xs">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#B8ECC2] animate-pulse"></div>
                <span className="text-xs font-bold text-white">EcoPredict AI Dashboard</span>
              </div>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white/30"></div>
                <div className="h-2 w-2 rounded-full bg-white/30"></div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#F5F3EF] p-3 border border-[#E8E3DA]">
                <p className="text-[11px] text-[#43493C] font-semibold">Model Accuracy</p>
                <p className="text-xl font-extrabold text-[#785500] mt-0.5">94.2%</p>
                <div className="mt-2 h-1.5 w-full bg-[#E4E2DE] rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-[#2E5D3D] rounded-full"></div>
                </div>
              </div>

              <div className="rounded-xl bg-[#F5F3EF] p-3 border border-[#E8E3DA]">
                <p className="text-[11px] text-[#43493C] font-semibold">Carbon Impact</p>
                <p className="text-xl font-extrabold text-[#2E5D3D] mt-0.5">-1.5 Gt</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#B8ECC2] text-[#215031] text-[10px] font-bold rounded-full">
                  Target Met
                </span>
              </div>

              <div className="rounded-xl bg-[#F5F3EF] p-3 border border-[#E8E3DA]">
                <p className="text-[11px] text-[#43493C] font-semibold">Confidence</p>
                <p className="text-xl font-extrabold text-[#A65A35] mt-0.5">High</p>
                <div className="flex gap-1 mt-2">
                  <div className="h-2.5 w-2.5 bg-[#EFBF67] rounded-full"></div>
                  <div className="h-2.5 w-2.5 bg-[#EFBF67] rounded-full"></div>
                  <div className="h-2.5 w-2.5 bg-[#EFBF67] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Monthly Rainfall Chart */}
            <div className="rounded-xl bg-white p-4 border border-[#E8E3DA] space-y-2">
              <p className="text-xs font-bold text-[#1B1C1A]">Monthly Rainfall Trend (mm)</p>
              <div className="flex items-end justify-between h-20 gap-2 pt-2">
                <div className="w-full bg-[#B8ECC2] h-[60%] rounded-t-xs"></div>
                <div className="w-full bg-[#B8ECC2] h-[45%] rounded-t-xs"></div>
                <div className="w-full bg-[#B8ECC2] h-[80%] rounded-t-xs"></div>
                <div className="w-full bg-[#2E5D3D] h-[95%] rounded-t-xs"></div>
                <div className="w-full bg-[#B8ECC2] h-[70%] rounded-t-xs"></div>
                <div className="w-full bg-[#B8ECC2] h-[40%] rounded-t-xs"></div>
                <div className="w-full bg-[#B8ECC2] h-[55%] rounded-t-xs"></div>
                <div className="w-full bg-[#B8ECC2] h-[30%] rounded-t-xs"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Caption Box */}
        <div className="absolute bottom-8 left-8 z-20 max-w-sm">
          <div className="flex flex-col gap-1 rounded-xl bg-[#30312E]/80 p-4 text-white backdrop-blur-md shadow-lg border border-white/10">
            <p className="text-xs font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#B8ECC2]">sensors</span>
              <span>Field Research Station #04</span>
            </p>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Volta Region, Ghana. Automated sensing and AI prediction for agricultural resilience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
