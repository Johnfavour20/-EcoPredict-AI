import React from 'react';

interface CTASectionProps {
  onLogin: () => void;
  onExplore: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLogin, onExplore }) => {
  return (
    <section className="py-16 md:py-20 px-6 bg-[#FBF9F5]">
      <div className="max-w-[1280px] mx-auto bg-[#2E5D3D] rounded-[24px] p-8 sm:p-12 md:p-16 text-center shadow-[0_18px_40px_rgba(25,43,30,0.12)]">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-[-0.04em] leading-[1.08]">
            Ready to begin climate analysis?
          </h2>

          <p className="text-white/80 text-base sm:text-lg leading-7">
            Join a community of researchers using AI to build a resilient future for West Africa.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={onLogin}
              className="bg-[#EFB333] hover:bg-[#EFB333]/90 text-[#2E5D3D] px-10 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              Login to platform
            </button>
            <button
              onClick={onExplore}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
