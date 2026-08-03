import React from 'react';
import { PlatformTab } from '../types';

interface FeaturesSectionProps {
  onSelectTab: (tab: PlatformTab) => void;
}

const FEATURES = [
  {
    id: 'datasets' as PlatformTab,
    icon: 'database',
    title: 'Dataset Management',
    description: 'Unified control for large-scale climate records and real-time telemetry feeds.',
  },
  {
    id: 'preprocessing' as PlatformTab,
    icon: 'filter_list',
    title: 'Preprocessing',
    description: 'Automated data cleaning and outlier detection for high-fidelity scientific inputs.',
  },
  {
    id: 'models' as PlatformTab,
    icon: 'auto_awesome',
    title: 'ML Models',
    description: 'Access a library of pre-trained models optimized for tropical meteorology.',
  },
  {
    id: 'prediction' as PlatformTab,
    icon: 'insights',
    title: 'Prediction',
    description: 'Generate long-term climate scenarios and short-term weather anomalies.',
  },
  {
    id: 'evaluation' as PlatformTab,
    icon: 'verified_user',
    title: 'Evaluation',
    description: 'Rigorous validation metrics including MAE, RMSE, and confidence intervals.',
  },
  {
    id: 'visualizations' as PlatformTab,
    icon: 'dashboard',
    title: 'Visualizations',
    description: 'Interactive GIS-based dashboards and exportable scientific report formats.',
  },
];

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectTab }) => {
  return (
    <section id="features-section" className="py-16 md:py-20 px-6 bg-white border-t border-[#E8E3DA]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2E5D3D]">
            Platform Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTab(feature.id)}
              className="p-6 sm:p-8 bg-[#FBF9F5] rounded-xl border border-[#E8E3DA] hover:border-[#6E9445]/50 hover:shadow-md transition-all group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#6E9445] text-4xl mb-4 group-hover:scale-110 transition-transform block">
                {feature.icon}
              </span>
              <h3 className="text-xl font-bold text-[#1B1C1A] mb-2 group-hover:text-[#2E5D3D]">
                {feature.title}
              </h3>
              <p className="text-[#43493C] text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#2E5D3D] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Launch Tool</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
