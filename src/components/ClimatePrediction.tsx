import React, { useState } from 'react';

interface ClimatePredictionProps {
  onNavigateToEvaluation: () => void;
  triggerToast: (msg: string) => void;
}

interface PredictionItem {
  id: string;
  model: string;
  dataset: string;
  date: string;
  status: 'Success' | 'Failed';
  tempAnomaly: string;
  rainfallEst: string;
}

export const ClimatePrediction: React.FC<ClimatePredictionProps> = ({
  onNavigateToEvaluation,
  triggerToast,
}) => {
  const [selectedModel, setSelectedModel] = useState<'ANN' | 'Linear Regression'>('ANN');

  // Input Parameters
  const [temperature, setTemperature] = useState<number>(28.5);
  const [rainfall, setRainfall] = useState<number>(120.0);
  const [humidity, setHumidity] = useState<number>(65.2);
  const [windSpeed, setWindSpeed] = useState<number>(15.4);
  const [pressure, setPressure] = useState<number>(1012.3);

  // Prediction simulation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [hasPrediction, setHasPrediction] = useState<boolean>(true);

  // Results metrics
  const [tempAnomalyResult, setTempAnomalyResult] = useState<string>('+1.2');
  const [estTempResult, setEstTempResult] = useState<string>('29.5');
  const [rainfallResult, setRainfallResult] = useState<string>('142');
  const [avgRainfallResult, setAvgRainfallResult] = useState<string>('130');

  // History table
  const [history, setHistory] = useState<PredictionItem[]>([
    {
      id: 'PR-901',
      model: 'ANN',
      dataset: 'Sahel v4',
      date: 'Oct 15, 2026',
      status: 'Success',
      tempAnomaly: '+1.2°C',
      rainfallEst: '142 mm',
    },
    {
      id: 'PR-900',
      model: 'Linear Regression',
      dataset: 'Sahel v3',
      date: 'Oct 14, 2026',
      status: 'Success',
      tempAnomaly: '+0.8°C',
      rainfallEst: '135 mm',
    },
    {
      id: 'PR-899',
      model: 'ANN',
      dataset: 'Sahel v4 (Test)',
      date: 'Oct 12, 2026',
      status: 'Failed',
      tempAnomaly: 'N/A',
      rainfallEst: 'N/A',
    },
  ]);

  const handleReset = () => {
    setTemperature(28.5);
    setRainfall(120.0);
    setHumidity(65.2);
    setWindSpeed(15.4);
    setPressure(1012.3);
    triggerToast('Parameters reset to regional baseline standards.');
  };

  const handleGeneratePrediction = () => {
    setIsGenerating(true);
    setProgress(15);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setHasPrediction(true);

          // Calculate derived results based on parameters
          const calculatedTempAnomaly = (
            (temperature - 27.0) * 0.4 +
            (humidity > 60 ? 0.3 : 0.1)
          ).toFixed(1);

          const calculatedEstTemp = (
            temperature +
            parseFloat(calculatedTempAnomaly)
          ).toFixed(1);

          const calculatedRainfallEst = Math.round(
            rainfall * 1.1 + (humidity - 50) * 0.8
          ).toString();

          setTempAnomalyResult(`+${calculatedTempAnomaly}`);
          setEstTempResult(calculatedEstTemp);
          setRainfallResult(calculatedRainfallEst);
          setAvgRainfallResult('130');

          const newId = `PR-${Math.floor(902 + Math.random() * 50)}`;
          const newEntry: PredictionItem = {
            id: newId,
            model: selectedModel,
            dataset: selectedModel === 'ANN' ? 'Sahel v4' : 'Sahel v3',
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            status: 'Success',
            tempAnomaly: `+${calculatedTempAnomaly}°C`,
            rainfallEst: `${calculatedRainfallEst} mm`,
          };

          setHistory([newEntry, ...history]);
          triggerToast(`Climate prediction successfully generated (${newId})!`);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleSavePrediction = () => {
    triggerToast('Current prediction run saved to regional records.');
  };

  const handleExportResults = () => {
    triggerToast('Prediction dataset exported in GeoJSON / CSV format.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">online_prediction</span>
            <span className="text-xs font-bold tracking-wider uppercase">Inference Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1B1C1A]">Climate Prediction</h1>
          <p className="text-xs text-[#43493C] max-w-3xl">
            Generate climate predictions using trained machine learning models and visualize the predicted results across West Africa.
          </p>
        </div>

        <button
          onClick={handleGeneratePrediction}
          disabled={isGenerating}
          className="bg-[#2C4D03] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm hover:bg-[#43651C] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              <span>Running Simulation...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">psychology</span>
              <span>Generate Prediction</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Top Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Configuration (col-span-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Model Selection Card */}
          <section className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2 pb-2 border-b border-[#E8E3DA]">
              <span className="material-symbols-outlined text-[#2C4D03]">model_training</span>
              <span>Model Selection</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model Card: ANN */}
              <div
                onClick={() => setSelectedModel('ANN')}
                className={`p-5 rounded-xl transition-all cursor-pointer border flex flex-col justify-between ${
                  selectedModel === 'ANN'
                    ? 'border-2 border-[#2C4D03] bg-[#2C4D03]/5 shadow-xs'
                    : 'border-[#E8E3DA] bg-white hover:border-[#2C4D03]/40'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-sm text-[#1B1C1A]">Artificial Neural Network (ANN)</h4>
                  {selectedModel === 'ANN' ? (
                    <span className="bg-[#B8ECC2] text-[#3D6C4B] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#396847]"></span> Active
                    </span>
                  ) : (
                    <span className="bg-[#F5F3EF] text-[#43493C] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Ready
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end mt-4 text-xs pt-2 border-t border-[#E8E3DA]/60">
                  <div className="text-[11px] text-[#43493C]">
                    <p>Trained: Oct 12, 2026</p>
                    <p>Dataset: Sahel Region v4</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#74796A] uppercase font-semibold">R² Score</p>
                    <p className="font-bold text-base text-[#2C4D03]">0.984</p>
                  </div>
                </div>
              </div>

              {/* Model Card: Linear Regression */}
              <div
                onClick={() => setSelectedModel('Linear Regression')}
                className={`p-5 rounded-xl transition-all cursor-pointer border flex flex-col justify-between ${
                  selectedModel === 'Linear Regression'
                    ? 'border-2 border-[#2C4D03] bg-[#2C4D03]/5 shadow-xs'
                    : 'border-[#E8E3DA] bg-white hover:border-[#2C4D03]/40'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-sm text-[#1B1C1A]">Linear Regression</h4>
                  {selectedModel === 'Linear Regression' ? (
                    <span className="bg-[#B8ECC2] text-[#3D6C4B] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#396847]"></span> Active
                    </span>
                  ) : (
                    <span className="bg-[#F5F3EF] text-[#43493C] px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Ready
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end mt-4 text-xs pt-2 border-t border-[#E8E3DA]/60">
                  <div className="text-[11px] text-[#43493C]">
                    <p>Trained: Sep 28, 2026</p>
                    <p>Dataset: Sahel Region v3</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#74796A] uppercase font-semibold">R² Score</p>
                    <p className="font-bold text-base text-[#43493C]">0.912</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Input Parameters Card */}
          <section className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#A65A35]">tune</span>
                <span>Input Parameters</span>
              </h3>
              <button
                onClick={handleReset}
                className="text-[#43493C] text-xs font-semibold hover:text-[#2C4D03] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span> Reset to Baseline
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#43493C] uppercase tracking-wider block">
                  Temperature (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg py-2 pl-3 pr-8 text-xs font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#2C4D03]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] text-xs font-semibold">
                    °C
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#43493C] uppercase tracking-wider block">
                  Rainfall (mm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1.0"
                    value={rainfall}
                    onChange={(e) => setRainfall(Number(e.target.value))}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg py-2 pl-3 pr-10 text-xs font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#2C4D03]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] text-xs font-semibold">
                    mm
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#43493C] uppercase tracking-wider block">
                  Humidity (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg py-2 pl-3 pr-8 text-xs font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#2C4D03]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] text-xs font-semibold">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#43493C] uppercase tracking-wider block">
                  Wind Speed (km/h)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(Number(e.target.value))}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg py-2 pl-3 pr-12 text-xs font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#2C4D03]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] text-[11px] font-semibold">
                    km/h
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#43493C] uppercase tracking-wider block">
                  Pressure (hPa)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={pressure}
                    onChange={(e) => setPressure(Number(e.target.value))}
                    className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg py-2 pl-3 pr-10 text-xs font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#2C4D03]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] text-[11px] font-semibold">
                    hPa
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Status & Results (col-span-4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Configuration Summary Card */}
          <section className="bg-white rounded-xl p-5 border border-[#E8E3DA] shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#43493C] uppercase text-[10px] tracking-wider pb-2 border-b border-[#E8E3DA]">
              Configuration Summary
            </h4>
            <div className="bg-[#F5F3EF] rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-[#43493C]">Model</span>
              <span className="font-bold text-[#1B1C1A]">
                {selectedModel === 'ANN' ? 'ANN (Sahel v4)' : 'Linear Regression (Sahel v3)'}
              </span>
            </div>
            <div className="bg-[#F5F3EF] rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-[#43493C]">Variables</span>
              <span className="font-bold text-[#1B1C1A]">5 Included</span>
            </div>
            <div className="bg-[#F5F3EF] rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-[#43493C]">Target Region</span>
              <span className="font-bold text-[#2C4D03] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                West Africa ECOWAS
              </span>
            </div>
            <div className="bg-[#F5F3EF] rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-[#43493C]">Date</span>
              <span className="font-bold text-[#1B1C1A]">Oct 15, 2026</span>
            </div>
          </section>

          {/* Generating Prediction Progress */}
          {isGenerating && (
            <section className="bg-[#F5F3EF] rounded-xl p-5 border border-[#2C4D03]/30 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-bold text-[#2C4D03] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  Generating Prediction...
                </h4>
                <span className="font-mono font-bold text-[#2C4D03]">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#E8E3DA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2C4D03] transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-[#74796A] pt-1">
                Running tensor computations for geographic matrix...
              </p>
            </section>
          )}

          {/* Prediction Results Hero Metrics */}
          {hasPrediction && (
            <section className="bg-[#B8ECC2]/20 border border-[#2C4D03]/30 rounded-xl p-5 space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm text-[#2C4D03]">Prediction Results</h3>
                <div className="bg-white px-2 py-0.5 rounded border border-[#E8E3DA] flex items-center gap-1 shadow-xs">
                  <span className="material-symbols-outlined text-[#A65A35] text-xs">verified</span>
                  <span className="text-[10px] font-bold text-[#43493C]">94% Confidence</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/90 rounded-lg p-3 border border-[#E8E3DA]">
                  <p className="text-[10px] font-bold text-[#74796A] uppercase">Temp. Anomaly</p>
                  <p className="text-2xl font-extrabold text-[#A65A35] mt-0.5">
                    {tempAnomalyResult}<span className="text-sm font-normal">°C</span>
                  </p>
                  <p className="text-[10px] text-[#43493C] mt-1 font-semibold">Est. {estTempResult}°C</p>
                </div>

                <div className="bg-white/90 rounded-lg p-3 border border-[#E8E3DA]">
                  <p className="text-[10px] font-bold text-[#74796A] uppercase">Rainfall Est.</p>
                  <p className="text-2xl font-extrabold text-[#2C4D03] mt-0.5">
                    {rainfallResult}<span className="text-sm font-normal">mm</span>
                  </p>
                  <p className="text-[10px] text-[#43493C] mt-1 font-semibold">Avg. {avgRainfallResult}mm</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 3. Result Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Historical vs. Predicted Temperature */}
        <section className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs flex flex-col h-80 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#43493C]">show_chart</span>
              <span>Historical vs. Predicted Temperature (2025–2026)</span>
            </h3>
            <div className="flex gap-3 text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2C4D03]"></span> Historical
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#A65A35]"></span> Predicted
              </span>
            </div>
          </div>

          <div className="flex-1 relative border-b border-l border-[#E8E3DA] pt-4 pb-1 pl-1 flex items-end justify-between">
            {/* Y Axis Labels */}
            <div className="absolute -left-6 bottom-0 top-2 flex flex-col justify-between text-[10px] text-[#74796A] font-mono">
              <span>32°</span>
              <span>30°</span>
              <span>28°</span>
            </div>

            {/* SVG Plot */}
            <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 120">
              <line x1="0" y1="25" x2="300" y2="25" stroke="#E8E3DA" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="300" y2="60" stroke="#E8E3DA" strokeDasharray="3 3" />
              <line x1="0" y1="95" x2="300" y2="95" stroke="#E8E3DA" strokeDasharray="3 3" />

              {/* Historical Curve */}
              <path
                d="M 10 90 Q 60 85 110 50 T 180 65 T 230 40"
                fill="none"
                stroke="#2C4D03"
                strokeWidth="2.5"
              />

              {/* Predicted Projection Curve */}
              <path
                d="M 230 40 Q 255 25 290 15"
                fill="none"
                stroke="#A65A35"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              <circle cx="290" cy="15" r="4" fill="#A65A35" />
            </svg>

            {/* X Axis Labels */}
            <div className="w-full absolute -bottom-5 left-0 flex justify-between text-[10px] text-[#74796A] px-2 font-mono">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jul</span>
              <span>Sep</span>
              <span>Nov</span>
            </div>
          </div>
        </section>

        {/* Chart 2: Monthly Rainfall Comparison */}
        <section className="bg-white rounded-xl p-6 border border-[#E8E3DA] shadow-xs flex flex-col h-80 space-y-4">
          <h3 className="text-xs font-bold text-[#1B1C1A] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#43493C]">bar_chart</span>
            <span>Monthly Rainfall Comparison (Precipitation)</span>
          </h3>

          <div className="flex-1 relative border-b border-l border-[#E8E3DA] pt-4 pb-1 pl-2 flex items-end justify-around">
            <div className="absolute -left-7 bottom-0 top-2 flex flex-col justify-between text-[10px] text-[#74796A] font-mono">
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="w-8 h-[40%] bg-[#E8E3DA] rounded-t-sm"></div>
            <div className="w-8 h-[60%] bg-[#E8E3DA] rounded-t-sm"></div>
            <div className="w-8 h-[80%] bg-[#2C4D03] rounded-t-sm shadow-xs"></div>
            <div className="w-8 h-[70%] bg-[#B8ECC2] rounded-t-sm"></div>
            <div className="w-8 h-[45%] bg-[#E8E3DA] rounded-t-sm"></div>

            <div className="w-full absolute -bottom-5 left-0 flex justify-around text-[10px] text-[#74796A] font-mono">
              <span>Jun</span>
              <span>Jul</span>
              <span className="font-bold text-[#2C4D03]">Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Recent Predictions History Table */}
      <section className="bg-white rounded-xl border border-[#E8E3DA] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
          <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2C4D03]">history</span>
            <span>Recent Predictions</span>
          </h3>
          <button className="text-xs font-bold text-[#2C4D03] hover:underline">View All Records</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F3EF] text-[#43493C] border-b border-[#E8E3DA]">
                <th className="p-3 font-bold">Prediction ID</th>
                <th className="p-3 font-bold">Model</th>
                <th className="p-3 font-bold">Dataset</th>
                <th className="p-3 font-bold">Temp. Anomaly</th>
                <th className="p-3 font-bold">Rainfall Est.</th>
                <th className="p-3 font-bold">Date</th>
                <th className="p-3 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA]">
              {history.map((row) => (
                <tr key={row.id} className="hover:bg-[#F5F3EF]/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#2C4D03]">{row.id}</td>
                  <td className="p-3 font-medium text-[#1B1C1A]">{row.model}</td>
                  <td className="p-3 text-[#43493C]">{row.dataset}</td>
                  <td className="p-3 font-mono font-bold text-[#A65A35]">{row.tempAnomaly}</td>
                  <td className="p-3 font-mono font-bold text-[#2C4D03]">{row.rainfallEst}</td>
                  <td className="p-3 text-[#74796A]">{row.date}</td>
                  <td className="p-3 text-center">
                    {row.status === 'Success' ? (
                      <span className="inline-block px-2.5 py-0.5 bg-[#B8ECC2] text-[#3D6C4B] font-bold rounded-md text-[10px]">
                        Success
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 bg-[#FFDAD6] text-[#93000A] font-bold rounded-md text-[10px]">
                        Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 pb-6 border-t border-[#E8E3DA]">
        <button
          onClick={onNavigateToEvaluation}
          className="px-5 py-2.5 border border-[#E8E3DA] bg-white text-[#43493C] rounded-lg text-xs font-bold hover:bg-[#F5F3EF] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">assessment</span>
          <span>View Model Evaluation</span>
        </button>

        <button
          onClick={handleExportResults}
          className="px-5 py-2.5 border border-[#2C4D03] text-[#2C4D03] bg-white rounded-lg text-xs font-bold hover:bg-[#B8ECC2]/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Export Results</span>
        </button>

        <button
          onClick={handleSavePrediction}
          className="px-5 py-2.5 bg-[#2C4D03] text-white rounded-lg text-xs font-bold hover:bg-[#43651C] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">save</span>
          <span>Save Prediction</span>
        </button>
      </div>
    </div>
  );
};

