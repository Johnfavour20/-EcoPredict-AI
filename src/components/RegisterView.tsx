import React, { useState } from 'react';

interface RegisterViewProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSuccess: (email: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  onBack,
  onSwitchToLogin,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('Dr. Sarah Johnson');
  const [institution, setInstitution] = useState('Accra Environmental Research Lab');
  const [email, setEmail] = useState('s.johnson@aerl.edu.gh');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;
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

      {/* Left Column: Registration Form */}
      <main className="w-full md:w-5/12 lg:w-5/12 xl:w-[520px] h-full bg-white flex flex-col justify-between p-8 sm:p-12 z-10 overflow-y-auto border-r border-[#E8E3DA]">
        <div className="my-auto max-w-md w-full mx-auto space-y-6 pt-8">
          {/* Brand Header */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E5D3D] text-white shadow-xs">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#2E5D3D]">
                EcoPredict AI
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1B1C1A] mt-4">
              Create your research account
            </h2>
            <p className="text-sm text-[#43493C] mt-1">
              Access West Africa's most advanced climate modeling engine.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] mb-1" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Sarah Johnson"
                  className="w-full px-4 py-2.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg text-sm text-[#1B1C1A] placeholder:text-[#C4C9B8] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 focus:border-[#2E5D3D] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] mb-1" htmlFor="institution">
                  Institution/Organization
                </label>
                <input
                  id="institution"
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Accra Environmental Research Lab"
                  className="w-full px-4 py-2.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg text-sm text-[#1B1C1A] placeholder:text-[#C4C9B8] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 focus:border-[#2E5D3D] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="s.johnson@aerl.edu.gh"
                  className="w-full px-4 py-2.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg text-sm text-[#1B1C1A] placeholder:text-[#C4C9B8] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 focus:border-[#2E5D3D] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] mb-1" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg text-sm text-[#1B1C1A] placeholder:text-[#C4C9B8] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 focus:border-[#2E5D3D] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] mb-1" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg text-sm text-[#1B1C1A] placeholder:text-[#C4C9B8] focus:outline-none focus:ring-2 focus:ring-[#2E5D3D]/20 focus:border-[#2E5D3D] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 py-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#E8E3DA] text-[#2E5D3D] focus:ring-[#2E5D3D] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-[#43493C] leading-snug cursor-pointer">
                I agree to the{' '}
                <button type="button" className="text-[#2E5D3D] font-semibold hover:underline">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-[#2E5D3D] font-semibold hover:underline">
                  Privacy Policy
                </button>{' '}
                regarding scientific data handling.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreedTerms}
              className="w-full bg-[#2E5D3D] hover:bg-[#20422a] text-white py-3.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center border-t border-[#E8E3DA] pt-4">
            <p className="text-sm text-[#43493C]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#2E5D3D] font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-between items-center opacity-70 text-[#74796A] text-xs pt-2">
            <div className="flex items-center gap-1 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">security</span>
              <span>ISO 27001</span>
            </div>
            <div className="flex items-center gap-1 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">science</span>
              <span>Verified</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Column: Visual Preview Bento Grid */}
      <section className="hidden md:flex w-[55%] flex-1 bg-[#2E5D3D] relative overflow-hidden items-center justify-center p-8 lg:p-12">
        {/* Background Rainforest Aerial Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX0SYy8BxNHO8Dj76sY__jPo_SG-24hiPWvZxKqXrNDbgBmay55hqW2nxrUGDJ8Par64O6mutBxuUlpuCZ3YQb-1roHk5J50UGjWRUJuypXK1_xFeJwa2Z-miFa0oFvyHB343ikHBEvP2ft3KkR5JwCOJYgBUC8zfhw3Hxw3S-sjIDxBedTK0T0pQSy7IOIi5uy5LjFbQZRjaaEEaaf0YqLRqUJuDj5s_W0p6Q2DXelWMZ2m0VmDdCqg"
            alt="West Africa Dense Rainforest Aerial"
            className="w-full h-full object-cover brightness-50"
          />
          {/* Scientific Overlay Mask */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF9F5]/90 via-[#FBF9F5]/30 to-transparent"></div>
        </div>

        {/* Bento Cards Container */}
        <div className="relative z-10 w-full max-w-[560px] flex flex-col gap-5">
          {/* Panel 1: Predictive Model v4.2 */}
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="bg-[#2E5D3D]/10 text-[#2E5D3D] px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                Predictive Model v4.2
              </span>
              <span className="material-symbols-outlined text-[#2E5D3D]">query_stats</span>
            </div>
            <h3 className="text-lg font-bold text-[#1B1C1A]">Biomass Density Analysis</h3>
            {/* Chart Bars */}
            <div className="h-28 w-full flex items-end justify-between gap-2 pt-2">
              <div className="bg-[#B8ECC2] w-full rounded-t-sm h-[40%]"></div>
              <div className="bg-[#B8ECC2] w-full rounded-t-sm h-[65%]"></div>
              <div className="bg-[#B8ECC2] w-full rounded-t-sm h-[50%]"></div>
              <div className="bg-[#2E5D3D] w-full rounded-t-sm h-[85%] shadow-xs"></div>
              <div className="bg-[#B8ECC2] w-full rounded-t-sm h-[60%]"></div>
              <div className="bg-[#B8ECC2] w-full rounded-t-sm h-[75%]"></div>
              <div className="bg-[#B8ECC2] w-full rounded-t-sm h-[45%]"></div>
            </div>
          </div>

          {/* Panel 2: Metrics Grid */}
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-xl space-y-1">
              <span className="material-symbols-outlined text-[#2E5D3D]">thermostat</span>
              <p className="text-[11px] text-[#43493C] font-semibold uppercase tracking-wider">Temp Variance</p>
              <p className="text-2xl font-extrabold text-[#1B1C1A]">+1.2°C</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-xl space-y-1">
              <span className="material-symbols-outlined text-[#785500]" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
              <p className="text-[11px] text-[#43493C] font-semibold uppercase tracking-wider">Confidence Rate</p>
              <p className="text-2xl font-extrabold text-[#1B1C1A]">98.4%</p>
            </div>
          </div>

          {/* Panel 3: Geospatial Synced */}
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-full border-2 border-[#2E5D3D] flex items-center justify-center shrink-0 bg-[#2E5D3D]/10">
              <span className="material-symbols-outlined text-[#2E5D3D]">public</span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1B1C1A]">Geospatial Synced</p>
              <p className="text-xs text-[#43493C]">Real-time satellite data ingestion active for Sub-Saharan regions.</p>
            </div>
          </div>

          {/* Quote */}
          <div className="pt-2">
            <p className="text-white/90 text-sm font-medium italic drop-shadow-xs">
              "Enabling researchers to visualize environmental change before it happens."
            </p>
          </div>
        </div>

        {/* Decorative corner framing */}
        <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-white/30 rounded-tr-2xl pointer-events-none"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-white/30 rounded-bl-2xl pointer-events-none"></div>
      </section>
    </div>
  );
};
