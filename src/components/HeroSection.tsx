import React from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';

interface HeroSectionProps {
  onExplore: () => void;
  onLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onLogin }) => {
  return (
    <section className="py-12 md:py-16 px-6 overflow-hidden">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6E9445]/10 text-[#2E5D3D] rounded-full border border-[#6E9445]/20">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              Environmental Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[4.25rem] font-semibold tracking-[-0.05em] text-[#1B1C1A] leading-[0.98]">
            Artificial Intelligence-Based{' '}
            <span className="text-[#2E5D3D]">Climate Change Prediction in West Africa
</span>
          </h1>

          <p className="text-[#43493C] text-base sm:text-lg max-w-xl leading-7">
            Our environmental intelligence platform integrates high-fidelity climate data and advanced modeling to help teams plan with confidence across changing regional conditions.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onLogin}
              className="bg-[#6E9445] hover:bg-[#2E5D3D] text-white px-8 py-3.5 rounded-xl font-semibold shadow-sm transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              Login
            </button>
            <button
              onClick={onExplore}
              className="bg-white border border-[#E8E3DA] hover:border-[#6E9445]/40 text-[#43493C] hover:text-[#2E5D3D] px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 flex items-center gap-2"
            >
              <span>Open platform</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="relative group cursor-pointer" onClick={onExplore}>
          <div className="absolute inset-0 rounded-[28px] border border-[#E8E3DA] bg-[#F5F3EF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />

          <div className="relative z-10 overflow-hidden rounded-[22px] border border-[#E8E3DA] bg-white shadow-[0_14px_30px_rgba(20,33,18,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_rgba(20,33,18,0.12)]">
            <img
              src={HOTLINK_IMAGES.dashboardMockup}
              alt="EcoPredict AI Dashboard Mockup"
              className="w-full h-auto object-cover rounded-[22px]"
            />
            <div className="absolute inset-0 bg-[#2E5D3D]/0 group-hover:bg-[#2E5D3D]/5 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-[#2E5D3D] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Open dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
