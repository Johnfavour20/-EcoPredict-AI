import React from 'react';
import { PlatformTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: PlatformTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#FBF9F5] border-t border-[#E8E3DA] py-16 px-6 text-[#1B1C1A]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#6E9445] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            <span className="font-bold text-lg tracking-tight text-[#2E5D3D]">
              EcoPredict AI
            </span>
          </div>

          <p className="text-sm text-[#43493C] max-w-sm leading-relaxed">
            A collaborative academic project dedicated to advancing climate resilience through high-performance computing and environmental data science.
          </p>

          <div className="flex gap-4 pt-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="p-2 rounded-lg bg-white border border-[#E8E3DA] text-[#43493C] hover:text-[#6E9445] transition-colors"
              title="Global Regional Portal"
            >
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="p-2 rounded-lg bg-white border border-[#E8E3DA] text-[#43493C] hover:text-[#6E9445] transition-colors"
              title="Contact Academic Team"
            >
              <span className="material-symbols-outlined text-lg">alternate_email</span>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="p-2 rounded-lg bg-white border border-[#E8E3DA] text-[#43493C] hover:text-[#6E9445] transition-colors"
              title="Data Hub Network"
            >
              <span className="material-symbols-outlined text-lg">hub</span>
            </a>
          </div>
        </div>

        {/* Platform Column */}
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#6E9445]">
            Platform
          </h4>
          <ul className="space-y-2 text-sm text-[#43493C]">
            <li>
              <button onClick={() => onSelectTab('dashboard')} className="hover:text-[#6E9445] transition-colors">
                Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('models')} className="hover:text-[#6E9445] transition-colors">
                Models & Training
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('datasets')} className="hover:text-[#6E9445] transition-colors">
                Data Portal
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('prediction')} className="hover:text-[#6E9445] transition-colors">
                Prediction Tools
              </button>
            </li>
          </ul>
        </div>

        {/* Documentation Column */}
        <div>
          <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-[#6E9445]">
            Documentation
          </h4>
          <ul className="space-y-2 text-sm text-[#43493C]">
            <li>
              <button onClick={() => onSelectTab('ai-analyst')} className="hover:text-[#6E9445] transition-colors">
                API Reference & AI Assistant
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('evaluation')} className="hover:text-[#6E9445] transition-colors">
                Validation & Metrics
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('visualizations')} className="hover:text-[#6E9445] transition-colors">
                GIS Export Formats
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Line */}
      <div className="max-w-[1280px] mx-auto mt-12 pt-6 border-t border-[#E8E3DA] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#43493C]">
        <p>© 2024 EcoPredict AI Project. All rights reserved.</p>
        <p className="flex items-center gap-1 italic">
          Supporting the Regional Climate Initiative{' '}
          <span
            className="material-symbols-outlined text-xs text-[#6E9445]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </p>
      </div>
    </footer>
  );
};
