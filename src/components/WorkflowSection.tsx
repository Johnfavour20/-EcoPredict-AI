import React from 'react';
import { PlatformTab } from '../types';

interface WorkflowSectionProps {
  onSelectStep: (tab: PlatformTab) => void;
}

const STEPS = [
  {
    id: 'datasets' as PlatformTab,
    icon: 'history',
    title: 'Historical Data',
    desc: 'Archival collection',
    highlight: false,
  },
  {
    id: 'datasets' as PlatformTab,
    icon: 'cloud_upload',
    title: 'Dataset Upload',
    desc: 'Secure ingestion',
    highlight: false,
  },
  {
    id: 'preprocessing' as PlatformTab,
    icon: 'cleaning_services',
    title: 'Preprocessing',
    desc: 'Normalization',
    highlight: false,
  },
  {
    id: 'models' as PlatformTab,
    icon: 'psychology',
    title: 'Model Training',
    desc: 'Neural computation',
    highlight: true, // secondary color icon
  },
  {
    id: 'prediction' as PlatformTab,
    icon: 'online_prediction',
    title: 'Prediction',
    desc: 'Trend generation',
    highlight: false,
  },
  {
    id: 'evaluation' as PlatformTab,
    icon: 'rule',
    title: 'Evaluation',
    desc: 'Accuracy validation',
    highlight: false,
  },
  {
    id: 'visualizations' as PlatformTab,
    icon: 'query_stats',
    title: 'Visualization',
    desc: 'Insight delivery',
    dark: true, // dark green box
  },
];

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onSelectStep }) => {
  return (
    <section className="py-16 md:py-20 px-6 bg-[#FBF9F5]">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2E5D3D] mb-3">
            The Intelligent Workflow
          </h2>
          <p className="text-[#43493C] max-w-2xl mx-auto text-base sm:text-lg">
            A seamless journey from raw environmental data to high-fidelity climate projections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 relative">
          {STEPS.map((step, idx) => {
            const isLast = idx === STEPS.length - 1;

            return (
              <div
                key={idx}
                onClick={() => onSelectStep(step.id)}
                className={`flex flex-col items-center text-center space-y-3 cursor-pointer group relative ${
                  !isLast ? 'workflow-step' : ''
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center border transition-all z-10 group-hover:scale-105 group-hover:shadow-md ${
                    step.dark
                      ? 'bg-[#2E5D3D] text-white border-[#2E5D3D]'
                      : step.highlight
                      ? 'bg-white text-[#EFB333] border-[#E8E3DA] group-hover:border-[#EFB333]'
                      : 'bg-white text-[#6E9445] border-[#E8E3DA] group-hover:border-[#6E9445]'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {step.icon}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#1B1C1A] group-hover:text-[#2E5D3D]">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#43493C] mt-1">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
