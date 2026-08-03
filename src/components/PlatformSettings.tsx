import React, { useState } from 'react';

interface PlatformSettingsProps {
  triggerToast: (msg: string) => void;
}

export const PlatformSettings: React.FC<PlatformSettingsProps> = ({ triggerToast }) => {
  const [defaultAlgorithm, setDefaultAlgorithm] = useState<'Artificial Neural Network (ANN)' | 'Linear Regression'>('Artificial Neural Network (ANN)');
  const [autoSavePredictions, setAutoSavePredictions] = useState<boolean>(true);
  const [confidenceInterval, setConfidenceInterval] = useState<string>('95%');

  const handleSave = () => {
    triggerToast('Platform research configuration saved!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">settings</span>
            <span className="text-xs font-bold tracking-wider uppercase">System & Research Config</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1B1C1A]">Settings</h1>
          <p className="text-sm text-[#43493C] mt-1 max-w-2xl">
            Configure climate modeling defaults, regional focus zones, API connections, and validation parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-[#2C4D03] text-white hover:bg-[#43651C] rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">save</span>
          <span>Save Settings</span>
        </button>
      </div>

      <div className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs space-y-6 max-w-3xl">
        <h3 className="text-sm font-bold text-[#1B1C1A] pb-3 border-b border-[#E8E3DA]">
          Modeling Defaults
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#43493C] mb-1">Default Training Algorithm</label>
            <select
              value={defaultAlgorithm}
              onChange={(e) => setDefaultAlgorithm(e.target.value as any)}
              className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-semibold text-[#1B1C1A] focus:outline-none cursor-pointer"
            >
              <option value="Artificial Neural Network (ANN)">Artificial Neural Network (ANN)</option>
              <option value="Linear Regression">Linear Regression</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#43493C] mb-1">Confidence Interval Bounds</label>
            <select
              value={confidenceInterval}
              onChange={(e) => setConfidenceInterval(e.target.value)}
              className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-semibold text-[#1B1C1A] focus:outline-none cursor-pointer"
            >
              <option>90% Confidence Interval</option>
              <option>95% Confidence Interval</option>
              <option>99% Confidence Interval</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#F5F3EF] rounded-xl border border-[#E8E3DA]">
            <div>
              <div className="font-bold text-[#1B1C1A]">Auto-Archive Simulation Runs</div>
              <div className="text-[11px] text-[#43493C]">Automatically save generated prediction outputs to history log</div>
            </div>
            <input
              type="checkbox"
              checked={autoSavePredictions}
              onChange={(e) => setAutoSavePredictions(e.target.checked)}
              className="w-4 h-4 text-[#2C4D03] rounded focus:ring-[#2C4D03]"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-[#1B1C1A] pt-4 pb-3 border-b border-[#E8E3DA]">
          Academic System Status
        </h3>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xl space-y-1">
            <span className="text-[#43493C] block">Platform Tier:</span>
            <span className="font-bold text-[#2C4D03]">Academic Research Tier</span>
          </div>
          <div className="p-3.5 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xl space-y-1">
            <span className="text-[#43493C] block">Region Focus:</span>
            <span className="font-bold text-[#1B1C1A]">West Africa (ECOWAS Zone)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
