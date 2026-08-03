import React, { useState } from 'react';

interface ModelEvaluationProps {
  onNavigateToVisualizations: () => void;
  triggerToast: (msg: string) => void;
}

export const ModelEvaluation: React.FC<ModelEvaluationProps> = ({
  onNavigateToVisualizations,
  triggerToast,
}) => {
  const [selectedModel, setSelectedModel] = useState<'ANN' | 'Linear Reg.'>('ANN');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Dynamic evaluation metrics based on model selection
  const metrics =
    selectedModel === 'ANN'
      ? { mae: '0.12', rmse: '0.18', r2: '0.984', status: 'High' }
      : { mae: '0.25', rmse: '0.32', r2: '0.912', status: 'Moderate' };

  const handleGenerateReport = () => {
    triggerToast('Evaluation report PDF compiled and downloading...');
  };

  const handleExportReport = () => {
    triggerToast('Exported model evaluation benchmarks as JSON/CSV.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">rule</span>
            <span className="text-xs font-bold tracking-wider uppercase">Validation Framework</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1B1C1A]">Model Evaluation</h1>
          <p className="text-xs text-[#43493C] max-w-3xl">
            Evaluate and compare the performance of trained climate prediction models using standard regression evaluation metrics.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          className="bg-[#2C4D03] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-[#43651C] active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">summarize</span>
          <span>Generate Evaluation Report</span>
        </button>
      </div>

      {/* 2. Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Selected Model Summary Banner (Full width / 12 cols) */}
        <section className="lg:col-span-12 bg-white/80 backdrop-blur-md rounded-xl p-6 border border-[#E8E3DA] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B8ECC2] flex items-center justify-center text-[#3D6C4B] shrink-0">
              <span className="material-symbols-outlined text-2xl">model_training</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider block">
                Selected Model
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1B1C1A]">
                  {selectedModel === 'ANN'
                    ? 'Artificial Neural Network (ANN)'
                    : 'Multivariate Linear Regression'}
                </h3>
                <span className="bg-[#B8ECC2] text-[#3D6C4B] px-2 py-0.5 rounded-full text-[10px] font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-10 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider block">
                Dataset
              </span>
              <p className="font-semibold text-[#1B1C1A]">West Africa Climate v4</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider block">
                Training Date
              </span>
              <p className="font-semibold text-[#1B1C1A]">Oct 12, 2026</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider block">
                Prediction Date
              </span>
              <p className="font-semibold text-[#1B1C1A]">Oct 15, 2026</p>
            </div>
          </div>
        </section>

        {/* Section 2: Performance Metrics (3 KPI Cards across 12 cols) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KPI 1: MAE */}
          <div className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#2C4D03]/10 rounded-full blur-2xl group-hover:bg-[#2C4D03]/20 transition-colors"></div>
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-bold text-[#43493C] uppercase tracking-wider">MAE</h4>
              <span
                className="material-symbols-outlined text-[#396847] text-lg cursor-help"
                title="Mean Absolute Error: Average absolute magnitude of errors"
              >
                info
              </span>
            </div>
            <div className="text-4xl font-extrabold text-[#1B1C1A] font-mono my-1">
              {metrics.mae}
            </div>
            <p className="text-[11px] text-[#74796A] border-t border-[#E8E3DA] pt-2 mt-auto">
              Measures the average magnitude of the errors in a set of predictions.
            </p>
          </div>

          {/* KPI 2: RMSE */}
          <div className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#A65A35]/10 rounded-full blur-2xl group-hover:bg-[#A65A35]/20 transition-colors"></div>
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-bold text-[#43493C] uppercase tracking-wider">RMSE</h4>
              <span
                className="material-symbols-outlined text-[#396847] text-lg cursor-help"
                title="Root Mean Square Error: Penalizes larger prediction outliers"
              >
                info
              </span>
            </div>
            <div className="text-4xl font-extrabold text-[#1B1C1A] font-mono my-1">
              {metrics.rmse}
            </div>
            <p className="text-[11px] text-[#74796A] border-t border-[#E8E3DA] pt-2 mt-auto">
              Measures the square root of the average squared differences between prediction and actual observation.
            </p>
          </div>

          {/* KPI 3: R2 Score */}
          <div className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#B8ECC2]/30 rounded-full blur-2xl group-hover:bg-[#B8ECC2]/50 transition-colors"></div>
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-bold text-[#43493C] uppercase tracking-wider">
                R² Score
              </h4>
              <span
                className="material-symbols-outlined text-[#396847] text-lg cursor-help"
                title="Coefficient of Determination: Proportion of variance explained"
              >
                info
              </span>
            </div>
            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl font-extrabold text-[#2C4D03] font-mono">
                {metrics.r2}
              </span>
              <span className="text-xs font-bold text-[#2C4D03] flex items-center">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> {metrics.status}
              </span>
            </div>
            <p className="text-[11px] text-[#74796A] border-t border-[#E8E3DA] pt-2 mt-auto">
              Indicates the proportion of the variance for a dependent variable explained by independent variables.
            </p>
          </div>
        </div>

        {/* Section 3 & 4 Container */}
        {/* Left Visualizations Column (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Chart 1: Predicted vs. Actual Values Scatter Plot */}
          <div className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
              <h3 className="text-sm font-bold text-[#1B1C1A]">Predicted vs. Actual Values</h3>
              <div className="flex gap-2 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2C4D03]"></span> Accurate Points
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#A65A35]"></span> Outlier Variance
                </span>
              </div>
            </div>

            <div className="w-full h-64 bg-[#F5F3EF] rounded-lg relative flex items-center justify-center overflow-hidden border border-[#E8E3DA] p-4">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#43651c_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Chart Coordinates Box */}
              <div className="w-full h-full border-l-2 border-b-2 border-[#74796A] relative">
                {/* 1:1 Identity Reference Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <line
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                    stroke="#A65A35"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                </svg>

                {/* Mock Scatter Points */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#2C4D03] bottom-[15%] left-[18%] transition-transform hover:scale-150 shadow-xs"
                  title="Actual: 24.1, Predicted: 24.3"
                ></div>
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#2C4D03] bottom-[30%] left-[32%] transition-transform hover:scale-150 shadow-xs"
                  title="Actual: 26.5, Predicted: 26.4"
                ></div>
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#2C4D03] bottom-[48%] left-[49%] transition-transform hover:scale-150 shadow-xs"
                  title="Actual: 28.2, Predicted: 28.1"
                ></div>
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#2C4D03] bottom-[65%] left-[64%] transition-transform hover:scale-150 shadow-xs"
                  title="Actual: 30.0, Predicted: 30.1"
                ></div>
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#2C4D03] bottom-[85%] left-[83%] transition-transform hover:scale-150 shadow-xs"
                  title="Actual: 32.4, Predicted: 32.5"
                ></div>

                {/* Slight outlier point */}
                <div
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#A65A35] bottom-[32%] left-[48%] transition-transform hover:scale-150 shadow-xs"
                  title="Outlier: Actual 28.0, Predicted 26.2"
                ></div>
              </div>

              <span className="absolute bottom-1 font-mono text-[10px] font-bold text-[#74796A]">
                Actual Observed Values
              </span>
              <span className="absolute left-1 top-1/2 -rotate-90 font-mono text-[10px] font-bold text-[#74796A] origin-left">
                Predicted Values
              </span>
            </div>
          </div>

          {/* Chart 2: Error Distribution Histogram */}
          <div className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
              <h3 className="text-sm font-bold text-[#1B1C1A]">Error Residual Distribution</h3>
              <span className="text-[10px] font-mono font-bold text-[#43493C]">
                μ = 0.012, σ = 0.178
              </span>
            </div>

            <div className="w-full h-48 bg-[#F5F3EF] rounded-lg flex items-end justify-center gap-1.5 px-6 pt-6 pb-2 border border-[#E8E3DA]">
              <div className="w-1/12 h-[12%] bg-[#396847]/40 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="-0.4 error"></div>
              <div className="w-1/12 h-[22%] bg-[#396847]/50 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="-0.3 error"></div>
              <div className="w-1/12 h-[45%] bg-[#396847]/60 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="-0.2 error"></div>
              <div className="w-1/12 h-[75%] bg-[#396847]/80 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="-0.1 error"></div>
              <div className="w-1/12 h-[95%] bg-[#2C4D03] rounded-t-sm hover:bg-[#43651C] transition-colors cursor-pointer" title="0.0 error (peak)"></div>
              <div className="w-1/12 h-[100%] bg-[#2C4D03] rounded-t-sm hover:bg-[#43651C] transition-colors cursor-pointer" title="0.0 error (peak)"></div>
              <div className="w-1/12 h-[82%] bg-[#2C4D03] rounded-t-sm hover:bg-[#43651C] transition-colors cursor-pointer" title="+0.1 error"></div>
              <div className="w-1/12 h-[52%] bg-[#396847]/70 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="+0.2 error"></div>
              <div className="w-1/12 h-[32%] bg-[#396847]/50 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="+0.3 error"></div>
              <div className="w-1/12 h-[14%] bg-[#396847]/30 rounded-t-sm hover:bg-[#396847] transition-colors cursor-pointer" title="+0.4 error"></div>
            </div>
          </div>
        </div>

        {/* Right Table & Summary Column (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section 4: Model Comparison Table */}
          <div className="bg-white rounded-xl border border-[#E8E3DA] shadow-xs overflow-hidden space-y-0">
            <div className="p-4 border-b border-[#E8E3DA] bg-[#F5F3EF] flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1B1C1A]">Model Comparison</h3>
              <span className="text-[10px] font-bold text-[#74796A] uppercase">2 Benchmark Models</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F3EF] border-b border-[#E8E3DA] text-[#43493C]">
                    <th className="p-3 font-bold">Model</th>
                    <th className="p-3 font-bold text-right">MAE</th>
                    <th className="p-3 font-bold text-right">RMSE</th>
                    <th className="p-3 font-bold text-right">R²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DA]">
                  <tr
                    onClick={() => setSelectedModel('ANN')}
                    className={`cursor-pointer transition-colors ${
                      selectedModel === 'ANN'
                        ? 'bg-[#B8ECC2]/20 font-semibold'
                        : 'hover:bg-[#F5F3EF]/50'
                    }`}
                  >
                    <td className="p-3 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#2C4D03] text-sm">
                        verified
                      </span>
                      <span className="text-[#1B1C1A]">ANN</span>
                    </td>
                    <td className="p-3 text-right font-mono">0.12</td>
                    <td className="p-3 text-right font-mono">0.18</td>
                    <td className="p-3 text-right font-mono font-bold text-[#2C4D03]">0.984</td>
                  </tr>

                  <tr
                    onClick={() => setSelectedModel('Linear Reg.')}
                    className={`cursor-pointer transition-colors ${
                      selectedModel === 'Linear Reg.'
                        ? 'bg-[#FFDEA7]/30 font-semibold'
                        : 'hover:bg-[#F5F3EF]/50'
                    }`}
                  >
                    <td className="p-3 text-[#43493C] flex items-center gap-1.5 pl-7">
                      <span>Linear Reg.</span>
                    </td>
                    <td className="p-3 text-right font-mono text-[#43493C]">0.25</td>
                    <td className="p-3 text-right font-mono text-[#43493C]">0.32</td>
                    <td className="p-3 text-right font-mono text-[#43493C]">0.912</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Evaluation Summary (Dark Card with Glow) */}
          <div className="bg-[#30312E] text-[#F2F0ED] rounded-xl p-6 shadow-lg relative overflow-hidden space-y-4">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#2C4D03]/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="material-symbols-outlined text-[#C6F096] text-xl">insights</span>
              <h3 className="text-sm font-bold text-white">Evaluation Summary</h3>
            </div>

            <div className="space-y-3 relative z-10 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#C4C9B8] uppercase tracking-wider block mb-1">
                  Best Performing Model
                </span>
                <span className="text-sm font-bold text-[#C6F096]">
                  Artificial Neural Network (ANN)
                </span>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-[#C4C9B8] uppercase tracking-wider block">
                  Key Findings
                </span>
                <p className="text-[#F2F0ED]/90 leading-relaxed text-[11px]">
                  The ANN model demonstrates superior non-linear pattern recognition for rainfall variability compared to standard regression baselines across West African sub-zones.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-[#C4C9B8] uppercase block mb-0.5">
                    Assessment
                  </span>
                  <p className="font-semibold text-white">Highly reliable for regional forecasting.</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#B8ECC2] uppercase block mb-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span> Recommendation
                  </span>
                  <p className="font-semibold text-white">Primary usage in Sahel region.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#E8E3DA] pb-6">
        <button
          onClick={() => setShowHistoryModal(true)}
          className="px-5 py-2.5 bg-white border border-[#E8E3DA] text-[#43493C] rounded-lg text-xs font-bold hover:bg-[#F5F3EF] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-base">history</span>
          <span>Prediction History</span>
        </button>

        <button
          onClick={handleExportReport}
          className="px-5 py-2.5 bg-white border border-[#2C4D03] text-[#2C4D03] rounded-lg text-xs font-bold hover:bg-[#B8ECC2]/20 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Export Report</span>
        </button>

        <button
          onClick={onNavigateToVisualizations}
          className="px-5 py-2.5 bg-[#2C4D03] text-white rounded-lg text-xs font-bold hover:bg-[#43651C] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
        >
          <span>Continue to Visualizations</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E8E3DA] shadow-2xl w-full max-w-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
              <h3 className="text-base font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">history</span>
                <span>Historical Evaluation Logs</span>
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-[#74796A] hover:text-[#1B1C1A] p-1 rounded-full hover:bg-[#F5F3EF] cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-xs">
              <div className="p-3 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#1B1C1A]">ANN - Sahel Regional Run v4</p>
                  <p className="text-[11px] text-[#74796A]">Evaluated: Oct 15, 2026 • 150 Epochs</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#2C4D03]">R² = 0.984</span>
                  <span className="block text-[10px] text-[#3D6C4B] font-semibold">Passed Validation</span>
                </div>
              </div>

              <div className="p-3 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#1B1C1A]">Multivariate Linear Reg. - Sahel v3</p>
                  <p className="text-[11px] text-[#74796A]">Evaluated: Oct 12, 2026 • OLS Solver</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#A65A35]">R² = 0.912</span>
                  <span className="block text-[10px] text-[#43493C] font-semibold">Baseline Verified</span>
                </div>
              </div>

              <div className="p-3 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA] flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#1B1C1A]">ANN - Guinea Coast Hydro Model</p>
                  <p className="text-[11px] text-[#74796A]">Evaluated: Oct 01, 2026 • 100 Epochs</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#2C4D03]">R² = 0.965</span>
                  <span className="block text-[10px] text-[#3D6C4B] font-semibold">Passed Validation</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-[#2C4D03] text-white text-xs font-bold rounded-lg hover:bg-[#43651C] transition-colors cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

