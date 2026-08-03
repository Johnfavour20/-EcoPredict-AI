import React from 'react';

interface PasswordResetSuccessViewProps {
  onProceedToLogin: () => void;
  onBackToHome: () => void;
}

export const PasswordResetSuccessView: React.FC<PasswordResetSuccessViewProps> = ({
  onProceedToLogin,
  onBackToHome,
}) => {
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

      <main className="min-h-screen w-full flex flex-col md:flex-row">
        {/* Left Section: Content Canvas */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 z-10 bg-[#FBF9F5] border-r border-[#E8E3DA]">
          <div className="max-w-md w-full text-center md:text-left flex flex-col items-center md:items-start pt-8">
            {/* Animated Success Icon */}
            <div className="w-20 h-20 mb-8 rounded-full bg-[#B8ECC2] flex items-center justify-center shadow-xs">
              <svg
                className="w-10 h-10 text-[#215031]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="animate-draw"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-[#1B1C1A] mb-3 tracking-tight">
              Password Reset Successful
            </h1>

            <p className="text-base text-[#43493C] mb-8 leading-relaxed">
              Your password has been successfully updated. You can now log in with your new credentials to access the EcoPredict AI dashboard.
            </p>

            <button
              onClick={onProceedToLogin}
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#43651C] hover:bg-[#2C4D03] text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 active:scale-95 group cursor-pointer"
            >
              <span>Proceed to Login</span>
              <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1 text-lg">
                arrow_forward
              </span>
            </button>

            {/* Brand Footer */}
            <div className="mt-12 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2E5D3D] flex items-center justify-center text-white shadow-xs">
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
              </div>
              <span className="text-lg font-bold text-[#1B1C1A] tracking-tight">
                EcoPredict AI
              </span>
            </div>
          </div>
        </section>

        {/* Right Section: Visual Experience */}
        <section className="hidden md:block md:w-1/2 relative overflow-hidden bg-[#EAE8E4]">
          {/* Imagery Composition */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIC9Oiz2ahOS3wvH-FQGx7ow3U7QmhaINpiL5X7q-UGvmOshtW05-sfQVUsP832WppyUYjokPkggIf3DLAVEAHxdtnov-DUKMGS6L8L2fJ54_aJNkvhOv0XiHeuL3NZ5NjoWvfvoefAZrXQsxO6VYqeN3DHIcCUevY-78zUVJ452CZx4VtRZ9-4XL9gdKr8IUQn0KB-t0ie-7Grh64Ac9iOdF_tPUVAZJb8-iZ49myaBOcxZl3ZB1Bsw"
              alt="West Africa Rainforest Canopy Dawn"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FBF9F5]/80 via-transparent to-transparent"></div>
          </div>

          {/* Floating Dashboard Elements (Bento Layout Preview) */}
          <div className="absolute inset-0 flex items-center justify-center p-10 z-10">
            <div className="relative w-full max-w-xl grid grid-cols-6 grid-rows-6 gap-4 h-[520px]">
              {/* Large Visualization Mock */}
              <div className="col-span-4 row-span-4 bg-white/75 backdrop-blur-md rounded-2xl p-5 shadow-2xl flex flex-col gap-3 border border-white/40">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#BA1A1A]/60"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFDEA7]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#B8ECC2]"></div>
                  </div>
                  <div className="h-4 w-28 bg-[#EAE8E4] rounded-full"></div>
                </div>

                <div className="flex-grow rounded-xl bg-[#F5F3EF] flex items-center justify-center overflow-hidden relative border border-[#E8E3DA]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBxL-2KvDte7Xcv1zgaxw2YOMVl2ftFlcPZJTL16EcRUZCK7dAahj0oQ6PqF6Cex9pPKpJ9VNPkBYHCdysDpjVTU1GCZh6F_re_AQd15fVJxPyj1yjGLGUX_5SyiL2v5QFmN1Q6E44z0xnWrIxJ3CNFBS48HFygDg2QIXlYF5CINo5kzJgsqeWCD9Q4H1hsUddEOj9NrYgXL1lW1JTwEk1Xab3-AeMeoFQO2WiWKIB515ZWryXG3OMFQ"
                    alt="EcoPredict Dashboard Analytics Visualization"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="h-10 rounded-lg bg-[#B8ECC2]/40 border border-[#9FD3AA]"></div>
                  <div className="h-10 rounded-lg bg-[#B8ECC2]/40 border border-[#9FD3AA]"></div>
                  <div className="h-10 rounded-lg bg-[#B8ECC2]/40 border border-[#9FD3AA]"></div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="col-span-2 row-span-2 bg-white/75 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col justify-between border border-white/40">
                <span className="material-symbols-outlined text-[#396847] text-2xl">
                  monitoring
                </span>
                <div>
                  <div className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                    AI Accuracy
                  </div>
                  <div className="text-2xl font-black text-[#1B1C1A]">98.4%</div>
                </div>
              </div>

              <div className="col-span-2 row-span-2 bg-white/75 backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col justify-between border border-white/40">
                <span className="material-symbols-outlined text-[#A65A35] text-2xl">
                  terrain
                </span>
                <div>
                  <div className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                    Biome Health
                  </div>
                  <div className="text-2xl font-black text-[#A65A35]">Stable</div>
                </div>
              </div>

              <div className="col-span-3 row-span-2 col-start-4 row-start-5 bg-white/75 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-3 border border-white/40">
                <div className="w-10 h-10 rounded-full bg-[#C6F096] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[#2C4D03] text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    psychology
                  </span>
                </div>
                <div className="flex-grow space-y-1.5">
                  <div className="h-2 w-3/4 bg-[#43493C]/20 rounded-full"></div>
                  <div className="h-2 w-1/2 bg-[#43493C]/10 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
