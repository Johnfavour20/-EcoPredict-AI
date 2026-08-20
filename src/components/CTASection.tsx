import React from 'react';

interface CTASectionProps {
  onLogin: () => void;
  onExplore: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLogin, onExplore }) => {
  return (
    <section className="py-16 md:py-20 px-6 bg-[#FBF9F5]">
      <div className="max-w-[1280px] mx-auto bg-[#2E5D3D] rounded-[32px] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-xl">
        {/* Background radial gradient overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Begin Climate Analysis?
          </h2>

          <p className="text-white/80 text-base sm:text-lg leading-relaxed">
            Join a community of scientists using AI to build a resilient future for West Africa.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={onLogin}
              className="bg-[#EFB333] hover:bg-[#EFB333]/90 text-[#2E5D3D] px-10 py-4 rounded-xl font-bold text-base transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              Login to Platform
            </button>
            <button
              onClick={onExplore}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-base transition-all cursor-pointer"
            >
              Login to Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
