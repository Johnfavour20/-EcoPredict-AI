import React from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';

interface AboutSectionProps {
  onExplore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExplore }) => {
  return (
    <section id="about-section" className="py-16 md:py-20 bg-white border-y border-[#E8E3DA]">
      <div className="max-w-[1280px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Environmental Research Image */}
        <div className="order-2 lg:order-1">
          <div className="relative group overflow-hidden rounded-2xl shadow-md border border-[#E8E3DA]">
            <img
              src={HOTLINK_IMAGES.researchPhoto}
              alt="Environmental Research Station Photography"
              className="w-full h-[450px] lg:h-[500px] object-cover rounded-xl group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-[#E8E3DA] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#6E9445]">sensors</span>
                <div>
                  <div className="text-xs font-bold text-[#2E5D3D]">Field Telemetry Station</div>
                  <div className="text-[11px] text-[#43493C]">West Africa Regional Node #084</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2E5D3D] bg-[#6E9445]/15 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#6E9445] animate-pulse"></span>
                Active Sensor
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2 space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2E5D3D]">
            Pioneering Environmental Intelligence
          </h2>

          <p className="text-base sm:text-lg text-[#43493C] leading-relaxed">
            Our workflow integrates high-resolution satellite imagery with ground-level sensor data, creating a robust machine learning architecture specifically tuned for the unique ecological nuances of the West African landscape.
          </p>

          <div className="space-y-4 pt-2">
            <div 
              onClick={onExplore}
              className="flex gap-4 p-4 bg-[#FBF9F5] rounded-xl border border-[#E8E3DA] hover:border-[#6E9445]/50 transition-all cursor-pointer group"
            >
              <div className="p-3 bg-white rounded-xl shadow-sm text-[#6E9445] group-hover:bg-[#6E9445] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">hub</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1B1C1A] text-base group-hover:text-[#2E5D3D]">
                  Distributed Node Network
                </h4>
                <p className="text-sm text-[#43493C] mt-0.5">
                  Connecting local weather stations to regional processing hubs.
                </p>
              </div>
            </div>

            <div 
              onClick={onExplore}
              className="flex gap-4 p-4 bg-[#FBF9F5] rounded-xl border border-[#E8E3DA] hover:border-[#EFB333]/50 transition-all cursor-pointer group"
            >
              <div className="p-3 bg-white rounded-xl shadow-sm text-[#EFB333] group-hover:bg-[#EFB333] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-2xl">model_training</span>
              </div>
              <div>
                <h4 className="font-bold text-[#1B1C1A] text-base group-hover:text-[#2E5D3D]">
                  Adaptive ML Architectures
                </h4>
                <p className="text-sm text-[#43493C] mt-0.5">
                  Models that evolve with seasonal variability and climate shifts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
