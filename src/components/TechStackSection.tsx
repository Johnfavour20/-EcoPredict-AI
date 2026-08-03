import React from 'react';

const TECH_BADGES = [
  'Python',
  'Flask',
  'PyTorch',
  'Linear Regression',
  'ANN',
  'Climate Data',
];

export const TechStackSection: React.FC = () => {
  return (
    <section className="py-8 px-6 border-t border-[#E8E3DA] bg-white">
      <div className="max-w-[1280px] mx-auto flex flex-wrap justify-center gap-3">
        {TECH_BADGES.map((tech, idx) => (
          <span
            key={idx}
            className="px-6 py-2 bg-[#FBF9F5] border border-[#E8E3DA] rounded-full text-sm font-semibold text-[#2E5D3D] shadow-2xs hover:bg-[#6E9445]/10 hover:border-[#6E9445]/30 transition-all cursor-default"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
};
