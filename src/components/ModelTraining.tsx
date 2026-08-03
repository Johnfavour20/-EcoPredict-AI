import React, { useState } from 'react';

interface ModelTrainingProps {
  onNavigateToPrediction: () => void;
  triggerToast: (msg: string) => void;
}

interface TrainingHistoryItem {
  id: string;
  dataset: string;
  model: 'Linear Regression' | 'Artificial Neural Network (ANN)';
  date: string;
  r2: number;
  mae: number;
  rmse: number;
  status: 'Completed' | 'Running' | 'Failed';
}

export const ModelTraining: React.FC<ModelTrainingProps> = ({
  onNavigateToPrediction,
  triggerToast,
}) => {
  const [selectedDataset, setSelectedDataset] = useState<string>('West Africa Climate Dataset (2020–2025)');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'Linear Regression' | 'Artificial Neural Network (ANN)'>('Artificial Neural Network (ANN)');
  
  // Hyperparameters
  const [epochs, setEpochs] = useState<number>(150);
  const [learningRate, setLearningRate] = useState<string>('0.005');
  const [hiddenLayers, setHiddenLayers] = useState<string>('128 x 64 x 32');

  // Training state
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: Idle, 1: Initialize, 2: Training, 3: Evaluating, 4: Complete
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Results
  const [metrics, setMetrics] = useState<{ r2: number; mae: number; rmse: number } | null>(null);

  // Training History
  const [history, setHistory] = useState<TrainingHistoryItem[]>([
    {
      id: 'TR-882',
      dataset: 'West Africa Climate Dataset (2020–2025)',
      model: 'Artificial Neural Network (ANN)',
      date: '2026-08-02',
      r2: 0.938,
      mae: 0.18,
      rmse: 0.24,
      status: 'Completed',
    },
    {
      id: 'TR-881',
      dataset: 'Nigeria Rainfall & Temp (2010–2023)',
      model: 'Linear Regression',
      date: '2026-08-01',
      r2: 0.864,
      mae: 0.35,
      rmse: 0.42,
      status: 'Completed',
    },
    {
      id: 'TR-880',
      dataset: 'Coastal Sea Level Surge (2015–2025)',
      model: 'Artificial Neural Network (ANN)',
      date: '2026-07-28',
      r2: 0.912,
      mae: 0.21,
      rmse: 0.28,
      status: 'Completed',
    },
  ]);

  const handleStartTraining = () => {
    setIsTraining(true);
    setProgress(5);
    setCurrentStep(1);
    setIsCompleted(false);
    setMetrics(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 25 && prev < 80) {
          setCurrentStep(2);
        } else if (prev >= 80 && prev < 100) {
          setCurrentStep(3);
        }

        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setCurrentStep(4);
          setIsCompleted(true);

          const finalMetrics =
            selectedAlgorithm === 'Artificial Neural Network (ANN)'
              ? { r2: 0.938, mae: 0.18, rmse: 0.24 }
              : { r2: 0.864, mae: 0.35, rmse: 0.42 };

          setMetrics(finalMetrics);

          // Add to history
          const newHistoryItem: TrainingHistoryItem = {
            id: `TR-${Math.floor(883 + Math.random() * 50)}`,
            dataset: selectedDataset,
            model: selectedAlgorithm,
            date: new Date().toISOString().split('T')[0],
            r2: finalMetrics.r2,
            mae: finalMetrics.mae,
            rmse: finalMetrics.rmse,
            status: 'Completed',
          };

          setHistory([newHistoryItem, ...history]);
          triggerToast(`${selectedAlgorithm} training session completed successfully!`);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Page Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">psychology</span>
            <span className="text-xs font-bold tracking-wider uppercase">Machine Learning Model Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1B1C1A]">Model Configuration & Training</h1>
          <p className="text-xs text-[#43493C] mt-1 max-w-2xl">
            Train prediction models using preprocessed West Africa climate datasets. Compare performance between Multivariate Linear Regression baseline and Artificial Neural Networks (ANN) with academic metrics (MAE, RMSE, R²).
          </p>
        </div>

        <button
          onClick={handleStartTraining}
          disabled={isTraining}
          className={`px-6 py-3.5 rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center gap-2 text-xs shrink-0 cursor-pointer ${
            isTraining
              ? 'bg-[#E8E3DA] text-[#74796A] cursor-not-allowed'
              : 'bg-[#2C4D03] text-white hover:bg-[#43651C]'
          }`}
        >
          {isTraining ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              <span>Training Model ({progress}%)...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              <span>Start Training Session</span>
            </>
          )}
        </button>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column (Dataset & Training Config) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Dataset Selection Card */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">inventory_2</span>
                <span>Dataset Selection</span>
              </h3>
              <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2]/40 px-2.5 py-1 rounded">
                STEP 01
              </span>
            </div>

            <div className="p-4 border-2 border-[#2C4D03] bg-[#F5F3EF] rounded-xl relative space-y-3">
              <span className="absolute top-3 right-3 bg-[#2C4D03] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>

              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full bg-white border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-bold text-[#1B1C1A] focus:outline-none cursor-pointer"
              >
                <option value="West Africa Climate Dataset (2020–2025)">
                  West Africa Climate Dataset (2020–2025)
                </option>
                <option value="Lagos Coastal Telemetry (2015–2025)">
                  Lagos Coastal Telemetry (2015–2025)
                </option>
                <option value="Sahel Drought Index (1990–2025)">
                  Sahel Drought Index (1990–2025)
                </option>
              </select>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-[#43493C] block text-[10px]">Region Scope</span>
                  <span className="font-bold text-[#1B1C1A]">West Africa ECOWAS</span>
                </div>
                <div>
                  <span className="text-[#43493C] block text-[10px]">Records Count</span>
                  <span className="font-bold text-[#1B1C1A]">450,000</span>
                </div>
                <div>
                  <span className="text-[#43493C] block text-[10px]">Features</span>
                  <span className="font-bold text-[#1B1C1A]">12 Meteorological</span>
                </div>
                <div>
                  <span className="text-[#43493C] block text-[10px]">Preprocessed</span>
                  <span className="font-bold text-[#2C4D03]">MinMax Scaled</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[10px] font-bold text-[#396847]">
                <span className="w-2 h-2 rounded-full bg-[#396847]"></span>
                <span>STATUS: READY FOR TRAINING</span>
              </div>
            </div>
          </div>

          {/* Training Configuration Panel */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1B1C1A] pb-3 border-b border-[#E8E3DA]">
              Training Split & Parameters
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F5F3EF] p-3 rounded-lg border border-[#E8E3DA]">
                <span className="text-[10px] text-[#43493C] font-semibold block">Train Samples (80%)</span>
                <span className="text-lg font-bold text-[#2C4D03] mt-1 block">360,000</span>
              </div>
              <div className="bg-[#F5F3EF] p-3 rounded-lg border border-[#E8E3DA]">
                <span className="text-[10px] text-[#43493C] font-semibold block">Val Samples (20%)</span>
                <span className="text-lg font-bold text-[#A65A35] mt-1 block">90,000</span>
              </div>
            </div>

            {selectedAlgorithm === 'Artificial Neural Network (ANN)' ? (
              <div className="space-y-3 text-xs pt-1">
                <div>
                  <label className="block text-[#43493C] font-semibold mb-1">Epochs</label>
                  <input
                    type="number"
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2 font-mono text-[#1B1C1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#43493C] font-semibold mb-1">Learning Rate</label>
                  <input
                    type="text"
                    value={learningRate}
                    onChange={(e) => setLearningRate(e.target.value)}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2 font-mono text-[#1B1C1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#43493C] font-semibold mb-1">Architecture Layers</label>
                  <input
                    type="text"
                    value={hiddenLayers}
                    onChange={(e) => setHiddenLayers(e.target.value)}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2 font-mono text-[#1B1C1A]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA] text-xs text-[#43493C]">
                Multivariate Linear Regression baseline configured with Ordinary Least Squares (OLS) closed-form matrix solver and L2 regularization.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Algorithm Selection, Live Progress, Best Metrics) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Model Architecture Selection */}
          <div className="bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">schema</span>
                <span>Select Model Architecture</span>
              </h3>
              <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2]/40 px-2.5 py-1 rounded">
                STEP 02
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Linear Regression */}
              <div
                onClick={() => setSelectedAlgorithm('Linear Regression')}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedAlgorithm === 'Linear Regression'
                    ? 'border-[#2C4D03] bg-[#2C4D03]/5 ring-1 ring-[#2C4D03]'
                    : 'border-[#E8E3DA] bg-white hover:border-[#2C4D03]/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="material-symbols-outlined text-[#5A3F00] bg-[#FFDEA7]/40 p-2 rounded-lg">
                      query_stats
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedAlgorithm === 'Linear Regression'
                          ? 'border-[#2C4D03] bg-[#2C4D03] text-white'
                          : 'border-[#74796A]'
                      }`}
                    >
                      {selectedAlgorithm === 'Linear Regression' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1B1C1A]">Multivariate Linear Regression</h4>
                  <p className="text-xs text-[#43493C] mt-1.5 leading-relaxed">
                    Statistical linear baseline estimating direct proportional relationships between predictors and climate targets.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3DA]/60 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#FFDEA7]/40 text-[#5A3F00] text-[10px] font-bold rounded">
                    Linear Baseline
                  </span>
                  <span className="px-2 py-0.5 bg-[#F5F3EF] text-[#43493C] text-[10px] font-semibold rounded">
                    Instant Solve
                  </span>
                </div>
              </div>

              {/* Card 2: ANN */}
              <div
                onClick={() => setSelectedAlgorithm('Artificial Neural Network (ANN)')}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedAlgorithm === 'Artificial Neural Network (ANN)'
                    ? 'border-[#2C4D03] bg-[#2C4D03]/5 ring-1 ring-[#2C4D03]'
                    : 'border-[#E8E3DA] bg-white hover:border-[#2C4D03]/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="material-symbols-outlined text-[#2C4D03] bg-[#B8ECC2]/40 p-2 rounded-lg">
                      psychology
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedAlgorithm === 'Artificial Neural Network (ANN)'
                          ? 'border-[#2C4D03] bg-[#2C4D03] text-white'
                          : 'border-[#74796A]'
                      }`}
                    >
                      {selectedAlgorithm === 'Artificial Neural Network (ANN)' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1B1C1A]">Artificial Neural Network (ANN)</h4>
                  <p className="text-xs text-[#43493C] mt-1.5 leading-relaxed">
                    Multi-layer non-linear perceptron architecture designed to model complex atmospheric feedback loops across West Africa.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E3DA]/60 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#B8ECC2] text-[#3D6C4B] text-[10px] font-bold rounded">
                    High Accuracy Non-Linear
                  </span>
                  <span className="px-2 py-0.5 bg-[#F5F3EF] text-[#43493C] text-[10px] font-semibold rounded">
                    Deep Perceptron
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Progress & Results Metrics Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Progress */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">monitoring</span>
                <span>Live Training Progress</span>
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2C4D03]">
                    {isTraining
                      ? `Training ${selectedAlgorithm}...`
                      : isCompleted
                      ? 'Training Complete'
                      : 'Ready to Train'}
                  </span>
                  <span className="font-mono font-bold text-[#1B1C1A]">{progress}%</span>
                </div>

                <div className="w-full bg-[#E8E3DA] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-[#2C4D03] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-2 pt-2 text-xs">
                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= 1 ? 'text-[#2C4D03] font-bold' : 'text-[#74796A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentStep >= 1 ? 'check_circle' : 'circle'}
                  </span>
                  <span>1. Initialize Model Architecture</span>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= 2 ? 'text-[#2C4D03] font-bold' : 'text-[#74796A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentStep >= 2 ? (isTraining ? 'sync' : 'check_circle') : 'circle'}
                  </span>
                  <span>2. Train Weights & Minimize Loss</span>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= 3 ? 'text-[#2C4D03] font-bold' : 'text-[#74796A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentStep >= 3 ? 'check_circle' : 'circle'}
                  </span>
                  <span>3. Compute MAE, RMSE & R² Metrics</span>
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    currentStep >= 4 ? 'text-[#2C4D03] font-bold' : 'text-[#74796A]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentStep >= 4 ? 'check_circle' : 'circle'}
                  </span>
                  <span>4. Training Complete</span>
                </div>
              </div>
            </div>

            {/* Results (Post-Training Metrics) */}
            <div className="bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2 pb-2 border-b border-[#E8E3DA]">
                  <span className="material-symbols-outlined text-[#2C4D03]">assessment</span>
                  <span>Validation Metrics</span>
                </h3>

                <div className="space-y-2.5 mt-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-[#F5F3EF] rounded-lg">
                    <span className="text-[#43493C] font-semibold">R² (Coefficient of Determination)</span>
                    <span className="font-mono font-bold text-[#2C4D03] text-base">
                      {metrics ? metrics.r2 : selectedAlgorithm === 'Artificial Neural Network (ANN)' ? '0.938' : '0.864'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#F5F3EF] rounded-lg">
                    <span className="text-[#43493C] font-semibold">MAE (Mean Absolute Error)</span>
                    <span className="font-mono font-bold text-[#1B1C1A] text-base">
                      {metrics ? metrics.mae : selectedAlgorithm === 'Artificial Neural Network (ANN)' ? '0.18' : '0.35'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#F5F3EF] rounded-lg">
                    <span className="text-[#43493C] font-semibold">RMSE (Root Mean Squared Error)</span>
                    <span className="font-mono font-bold text-[#1B1C1A] text-base">
                      {metrics ? metrics.rmse : selectedAlgorithm === 'Artificial Neural Network (ANN)' ? '0.24' : '0.42'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToPrediction}
                className="w-full bg-[#2C4D03] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#43651C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Continue to Climate Prediction</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous Training History (Full Width Table) */}
        <div className="col-span-12 bg-white rounded-xl border border-[#E8E3DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
            <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2C4D03]">history</span>
              <span>Previous Training History</span>
            </h3>
            <span className="text-xs text-[#74796A] font-medium">{history.length} Saved Sessions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F3EF] text-[#43493C] border-b border-[#E8E3DA]">
                  <th className="p-3 font-bold">Training ID</th>
                  <th className="p-3 font-bold">Dataset</th>
                  <th className="p-3 font-bold">Algorithm</th>
                  <th className="p-3 font-bold">R² Score</th>
                  <th className="p-3 font-bold">MAE</th>
                  <th className="p-3 font-bold">RMSE</th>
                  <th className="p-3 font-bold">Date</th>
                  <th className="p-3 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DA]">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F3EF]/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#2C4D03]">{item.id}</td>
                    <td className="p-3 font-medium text-[#1B1C1A]">{item.dataset}</td>
                    <td className="p-3 text-[#43493C] font-semibold">{item.model}</td>
                    <td className="p-3 font-mono font-bold text-[#2C4D03]">{item.r2}</td>
                    <td className="p-3 font-mono text-[#1B1C1A]">{item.mae}</td>
                    <td className="p-3 font-mono text-[#1B1C1A]">{item.rmse}</td>
                    <td className="p-3 text-[#74796A]">{item.date}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 bg-[#B8ECC2] text-[#3D6C4B] font-bold rounded-md text-[10px]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

