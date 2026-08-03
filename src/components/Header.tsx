import React from 'react';
import { ActiveView } from '../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenLogin,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E3DA] h-20 flex items-center transition-all">
      <div className="max-w-[1280px] mx-auto w-full px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span 
            className="material-symbols-outlined text-[#6E9445] text-3xl group-hover:scale-105 transition-transform" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <span className="font-bold text-xl tracking-tight text-[#2E5D3D]">
            EcoPredict AI
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveView('landing')}
            className={`text-sm font-medium transition-colors ${
              activeView === 'landing' ? 'text-[#2E5D3D] font-semibold' : 'text-[#43493C] hover:text-[#6E9445]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveView('landing');
              setTimeout(() => {
                const element = document.getElementById('about-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-sm font-medium text-[#43493C] hover:text-[#6E9445] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => {
              setActiveView('landing');
              setTimeout(() => {
                const element = document.getElementById('features-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="text-sm font-medium text-[#43493C] hover:text-[#6E9445] transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => setActiveView('platform')}
            className={`text-sm font-medium transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
              activeView === 'platform'
                ? 'bg-[#2E5D3D] text-white border-[#2E5D3D]'
                : 'border-[#E8E3DA] text-[#2E5D3D] hover:bg-[#6E9445]/10'
            }`}
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            Platform
          </button>

          <button
            onClick={onOpenLogin}
            className="bg-[#6E9445] hover:bg-[#2E5D3D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-sm"
          >
            Login
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setActiveView('platform')}
            className="text-xs bg-[#2E5D3D] text-white px-3 py-1.5 rounded-lg font-semibold"
          >
            Platform
          </button>
          <button
            onClick={onOpenLogin}
            className="material-symbols-outlined text-[#1B1C1A]"
          >
            account_circle
          </button>
        </div>
      </div>
    </header>
  );
};
