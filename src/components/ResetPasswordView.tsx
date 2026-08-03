import React, { useState } from 'react';

interface ResetPasswordViewProps {
  onBackToLogin: () => void;
  onBackToHome: () => void;
  onResetSuccess: () => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  onBackToLogin,
  onBackToHome,
  onResetSuccess,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password requirement checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid = hasMinLength && hasUpper && hasNumber && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!passwordsMatch) {
        setErrorMsg('Passwords do not match');
      } else {
        setErrorMsg('Please satisfy all security requirements');
      }
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onResetSuccess();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#FBF9F5] text-[#1B1C1A] font-sans relative">
      {/* Top Left Navigation Back Button to Home */}
      <button
        onClick={onBackToHome}
        className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#E8E3DA] text-[#43493C] hover:text-[#2C4D03] hover:bg-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Back to Home</span>
      </button>

      <main className="flex h-full w-full">
        {/* Left Column: Reset Password Form */}
        <section className="w-full lg:w-[480px] xl:w-[560px] h-full flex flex-col justify-between p-8 sm:p-12 lg:px-16 bg-[#FBF9F5] z-10 overflow-y-auto border-r border-[#E8E3DA]">
          <div className="my-auto w-full max-w-md mx-auto space-y-6 pt-8">
            {/* Brand Header */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 bg-[#2C4D03] rounded-lg flex items-center justify-center text-white shadow-xs">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    eco
                  </span>
                </div>
                <span className="text-xl font-bold text-[#1B1C1A] tracking-tight">
                  EcoPredict AI
                </span>
              </div>
              <h1 className="text-3xl font-bold text-[#1B1C1A] mb-1 tracking-tight">
                Reset Password
              </h1>
              <p className="text-sm text-[#43493C] leading-relaxed">
                Please enter your new credentials to secure your research account.
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-[#B8ECC2] border border-[#9FD3AA] text-[#00210D] p-5 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#215031] text-2xl">
                    check_circle
                  </span>
                  <h3 className="text-base font-bold">Password Reset Successful!</h3>
                </div>
                <p className="text-xs text-[#215031]">
                  Your credentials have been securely updated in our enterprise system. Redirecting you to sign in...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3 bg-[#FFDAD6] text-[#93000A] text-xs font-semibold rounded-lg border border-[#FFDAD6] flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* New Password Input */}
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-semibold text-[#43493C] uppercase tracking-wider"
                    htmlFor="new-password"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74796A] text-lg">
                      lock
                    </span>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-10 py-3 bg-white border border-[#E8E3DA] rounded-lg focus:ring-2 focus:ring-[#2C4D03]/20 focus:border-[#2C4D03] transition-all outline-none text-sm text-[#1B1C1A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] hover:text-[#1B1C1A] text-xs"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-semibold text-[#43493C] uppercase tracking-wider"
                    htmlFor="confirm-password"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#74796A] text-lg">
                      verified_user
                    </span>
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E8E3DA] rounded-lg focus:ring-2 focus:ring-[#2C4D03]/20 focus:border-[#2C4D03] transition-all outline-none text-sm text-[#1B1C1A]"
                    />
                  </div>
                </div>

                {/* Security Requirements Checklist */}
                <div className="bg-[#F5F3EF] rounded-xl p-4 border border-[#E8E3DA]">
                  <h3 className="text-xs font-bold text-[#43493C] uppercase tracking-wider mb-2.5">
                    Security Requirements
                  </h3>
                  <ul className="space-y-2 text-xs">
                    <li
                      className={`flex items-center gap-2 transition-colors ${
                        hasMinLength ? 'text-[#2C4D03] font-semibold' : 'text-[#74796A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>At least 8 characters</span>
                    </li>
                    <li
                      className={`flex items-center gap-2 transition-colors ${
                        hasUpper ? 'text-[#2C4D03] font-semibold' : 'text-[#74796A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {hasUpper ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>One uppercase letter</span>
                    </li>
                    <li
                      className={`flex items-center gap-2 transition-colors ${
                        hasNumber ? 'text-[#2C4D03] font-semibold' : 'text-[#74796A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>One number</span>
                    </li>
                    {confirmPassword.length > 0 && (
                      <li
                        className={`flex items-center gap-2 transition-colors ${
                          passwordsMatch ? 'text-[#2C4D03] font-semibold' : 'text-[#BA1A1A]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {passwordsMatch ? 'check_circle' : 'cancel'}
                        </span>
                        <span>
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2C4D03] text-white py-3.5 rounded-lg font-bold text-sm hover:bg-[#1f3702] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">
                        sync
                      </span>
                      <span>Validating Secure Connection...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>

                {/* Back to Sign In Link */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-sm font-semibold text-[#2C4D03] hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            <footer className="pt-6 border-t border-[#E8E3DA]">
              <p className="text-[11px] text-[#74796A] leading-normal">
                © 2026 EcoPredict AI Research Division. Enterprise-Grade Security Active.
              </p>
            </footer>
          </div>
        </section>

        {/* Right Column: Visual Brand Story */}
        <section className="hidden lg:block flex-1 relative bg-[#DBDAD6] overflow-hidden">
          {/* Background Image: Savanna Golden Hour with Monitoring Station */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2C4D03]/20 to-transparent z-10 pointer-events-none"></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNzbiA8M5Hi2qdfakfFtq7Zs5vgWj0W6Geivza0tkkDMJYRAjvgr_2qtl7aLDkhkbWVFtmFkYIioTnKQdVGw43Lb44bPNXGCDDmNYQa4GabLUXcYc34_EgYtTfLKKA0gh3O2vU0djz18zSfKcOmQh-VDiDgk10jubp2uTAPV6b3EPKv7yJ06NimcwOckwpiyZ-BcpUvOh2IZdGGBXxjBq2M9q6FOkrzelUmc6ouPiKx4Q694U2aGgJDQ"
              alt="African Savanna Environmental Monitoring Station"
              className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
            />
          </div>

          {/* Dashboard Preview Glass Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[580px] z-20">
            <div className="bg-white/75 backdrop-blur-md p-6 rounded-2xl shadow-2xl space-y-4 border border-[#E8E3DA]/60">
              <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#BA1A1A]/60"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFDEA7]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#B8ECC2]"></div>
                </div>
                <span className="text-xs font-bold text-[#2C4D03] bg-[#C6F096]/50 px-3 py-1 rounded-full border border-[#2C4D03]/20 tracking-wider">
                  LIVE DATA FEED
                </span>
              </div>

              {/* Mock Chart Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 p-4 rounded-xl border border-[#E8E3DA] shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-[#43493C]">
                      Precipitation Index
                    </span>
                    <span className="material-symbols-outlined text-[#2C4D03] text-lg">
                      water_drop
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#EAE8E4] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#2C4D03] w-[65%] rounded-full"></div>
                  </div>
                  <span className="block text-2xl font-black text-[#1B1C1A]">
                    42.8<small className="text-xs font-normal text-[#74796A] ml-1">mm</small>
                  </span>
                </div>

                <div className="bg-white/80 p-4 rounded-xl border border-[#E8E3DA] shadow-xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-[#43493C]">
                      Confidence Level
                    </span>
                    <span className="material-symbols-outlined text-[#785500] text-lg">
                      verified
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#EAE8E4] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#785500] w-[94%] rounded-full"></div>
                  </div>
                  <span className="block text-2xl font-black text-[#1B1C1A]">
                    94.2<small className="text-xs font-normal text-[#74796A] ml-1">%</small>
                  </span>
                </div>
              </div>

              {/* Mini Topo Satellite Map Card */}
              <div className="bg-white/80 p-3 rounded-xl border border-[#E8E3DA] h-40 relative overflow-hidden shadow-xs">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuALpcwokScfLvLVaYAsz594jVrEf-jMeXAn4DWHFOPtD3X4c10Y1UtuNHF16PSpnrxfUbJmVrJdHd2hiodehPLvvNU0TJ42ByJtJkmD3ZlGnmGe6VcLs4VX77rLCUbaje4khku3G4X8qdhNSWXeW5J67HAXMLP_kngiD8ryqJgsWVc63P7H5JHK8x8iSLBVmtffx6U5CSguFZP8XEc7yGOvLhBiIXBJ7tLTnqHzbdCIJtlhQ8562Ak3Wg"
                  alt="East African Rift Topographic Satellite Map"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-[#2C4D03]/10 pointer-events-none rounded-lg"></div>
                <div className="absolute top-3 left-3 bg-[#1B1C1A]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 bg-[#2C4D03] rounded-full animate-ping"></span>
                  <span>Sector G-14 Analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Atmospheric Accents */}
          <div className="absolute bottom-10 right-12 z-30 text-right pointer-events-none">
            <div className="text-4xl font-black text-white/20 tracking-widest uppercase">
              PRECISION
            </div>
            <div className="text-sm text-white/80 font-light tracking-widest uppercase">
              Research Framework
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
