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
        {/* Left Column: Headline & Description */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6E9445]/10 text-[#2E5D3D] rounded-full border border-[#6E9445]/20">
            <span className="material-symbols-outlined text-sm">science</span>
            <span className="text-xs font-bold uppercase tracking-widest">
              Environmental Intelligence Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1B1C1A] leading-[1.1] tracking-tight">
            Predicting Climate Trends for{' '}
            <span className="text-[#2E5D3D]">West Africa</span>
          </h1>

          <p className="text-[#43493C] text-base sm:text-lg max-w-xl leading-relaxed">
            Our environmental intelligence platform leverages high-fidelity data and advanced modeling to deliver precise climate forecasts and actionable insights for the West African region. Empowering decision-makers with the tools to navigate a changing climate.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onLogin}
              className="bg-[#6E9445] hover:bg-[#2E5D3D] text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={onExplore}
              className="bg-white border-2 border-[#E8E3DA] hover:border-[#6E9445]/40 text-[#43493C] hover:text-[#2E5D3D] px-8 py-4 rounded-xl font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>Login to Platform</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Column: Dashboard Mockup Image */}
        <div className="relative group cursor-pointer" onClick={onExplore}>
          <div className="absolute -inset-4 bg-[#6E9445]/10 rounded-[40px] blur-3xl group-hover:bg-[#6E9445]/20 transition-all"></div>
          
          <div className="relative z-10 overflow-hidden rounded-2xl shadow-xl border border-[#E8E3DA] transform lg:rotate-1 group-hover:rotate-0 transition-transform duration-700 bg-white">
            <img
              src={HOTLINK_IMAGES.dashboardMockup}
              alt="EcoPredict AI Dashboard Mockup"
              className="w-full h-auto object-cover rounded-xl"
            />
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-[#2E5D3D]/0 group-hover:bg-[#2E5D3D]/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-[#2E5D3D] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Login to Access Interactive Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
