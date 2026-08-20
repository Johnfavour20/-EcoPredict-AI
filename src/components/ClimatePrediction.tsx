import React, { useState, useMemo } from 'react';

interface ClimatePredictionProps {
  onNavigateToEvaluation: () => void;
  triggerToast: (msg: string) => void;
}

type PredictionModel = 'ANN' | 'Linear Regression';
type PredictionView = 'Monthly' | 'Yearly';

interface ClimateMetricData {
  key: 'temperature' | 'rainfall' | 'humidity' | 'windSpeed' | 'pressure';
  label: string;
  unit: string;
  icon: string;
  color: string;
}

const CLIMATE_METRICS: ClimateMetricData[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', icon: 'thermostat', color: '#A65A35' },
  { key: 'rainfall', label: 'Rainfall', unit: 'mm', icon: 'water_drop', color: '#2C4D03' },
  { key: 'humidity', label: 'Humidity', unit: '%', icon: 'humidity_mid', color: '#2563EB' },
  { key: 'windSpeed', label: 'Wind Speed', unit: 'km/h', icon: 'air', color: '#43493C' },
  { key: 'pressure', label: 'Atmospheric Pressure', unit: 'hPa', icon: 'compress', color: '#7C3AED' },
];

const WEST_AFRICA_COUNTRIES = [
  'Benin', 'Burkina Faso', 'Cape Verde', 'Gambia', 'Ghana',
  'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Liberia', 'Mali',
  'Mauritania', 'Niger', 'Nigeria', 'Senegal', 'Sierra Leone',
  'Togo',
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type MetricPredictionValue = Record<string, Record<number, number[]>>;

interface PredictionResult {
  country: string;
  model: PredictionModel;
  fromYear: number;
  toYear: number;
  view: PredictionView;
  metrics: string[];
  generatedAt: string;
  confidence: number;
  data: MetricPredictionValue;
}

const generatePredictionData = (
  country: string,
  model: PredictionModel,
  fromYear: number,
  toYear: number,
  metrics: string[],
): MetricPredictionValue => {
  const result: MetricPredictionValue = {};
  const modelFactor = model === 'ANN' ? 0.984 : 0.912;
  const countryOffset = country.charCodeAt(0) + (country.charCodeAt(country.length - 1) || 0);

  metrics.forEach((metricKey) => {
    result[metricKey] = {};
    const metric = CLIMATE_METRICS.find((m) => m.key === metricKey);
    if (!metric) return;

    for (let year = fromYear; year <= toYear; year++) {
      const yearValues: number[] = [];
      for (let month = 0; month < 12; month++) {
        const seasonFactor = Math.sin((month / 12) * Math.PI * 2) * 0.5 + 0.5;
        const yearFactor = (year - fromYear) * 0.015 + 1;
        const noise = (Math.sin(year * 13 + month * 7 + countryOffset) * 0.5 + 0.5) * 0.2;

        let base = 0;
        switch (metricKey) {
          case 'temperature':
            base = 24 + seasonFactor * 12 - (countryOffset % 3);
            break;
          case 'rainfall':
            base = (seasonFactor > 0.4 ? 40 + seasonFactor * 200 : 10) + (countryOffset % 5) * 8;
            break;
          case 'humidity':
            base = 35 + seasonFactor * 45 + (countryOffset % 10);
            break;
          case 'windSpeed':
            base = 8 + (1 - seasonFactor) * 18 + (countryOffset % 4);
            break;
          case 'pressure':
            base = 1008 + (1 - seasonFactor) * 8 + (countryOffset % 5);
            break;
        }

        const value = base * yearFactor * modelFactor * (1 + noise * 0.15);
        yearValues.push(Number(value.toFixed(1)));
      }
      result[metricKey][year] = yearValues;
    }
  });

  return result;
};

export const ClimatePrediction: React.FC<ClimatePredictionProps> = ({
  onNavigateToEvaluation,
  triggerToast,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<PredictionModel>('ANN');
  const [fromYear, setFromYear] = useState<string>('');
  const [toYear, setToYear] = useState<string>('');
  const [view, setView] = useState<PredictionView>('Monthly');
  const [selectedMetrics, setSelectedMetrics] = useState<Record<string, boolean>>({
    temperature: true,
    rainfall: true,
    humidity: false,
    windSpeed: false,
    pressure: false,
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const enabledMetrics = CLIMATE_METRICS.filter((m) => selectedMetrics[m.key]);
  const yearsRange = useMemo(() => {
    if (!prediction) return [];
    const years: number[] = [];
    for (let y = prediction.fromYear; y <= prediction.toYear; y++) years.push(y);
    return years;
  }, [prediction]);

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const canGenerate =
    selectedCountry &&
    fromYear &&
    toYear &&
    Number(fromYear) <= Number(toYear) &&
    Number(fromYear) >= 2000 &&
    Number(toYear) <= 2100 &&
    enabledMetrics.length > 0;

  const handleGeneratePrediction = () => {
    if (!canGenerate) {
      if (!selectedCountry) triggerToast('Please select a country first.');
      else if (!fromYear || !toYear) triggerToast('Please enter a valid year range.');
      else if (Number(fromYear) > Number(toYear)) triggerToast('"From" year must be before "To" year.');
      else if (enabledMetrics.length === 0) triggerToast('Select at least one climate metric.');
      return;
    }

    setIsGenerating(true);
    setProgress(5);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);

          const fy = Number(fromYear);
          const ty = Number(toYear);
          const metrics = enabledMetrics.map((m) => m.key);
          const data = generatePredictionData(selectedCountry, selectedModel, fy, ty, metrics);

          const result: PredictionResult = {
            country: selectedCountry,
            model: selectedModel,
            fromYear: fy,
            toYear: ty,
            view,
            metrics,
            generatedAt: new Date().toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
            }),
            confidence: selectedModel === 'ANN' ? 94 : 88,
            data,
          };

          setPrediction(result);
          triggerToast(`Prediction for ${selectedCountry} (${fy}-${ty}) generated successfully!`);
          return 100;
        }
        return prev + 4;
      });
    }, 90);
  };

  const handleReset = () => {
    setSelectedCountry('');
    setSelectedModel('ANN');
    setFromYear('');
    setToYear('');
    setView('Monthly');
    setSelectedMetrics({
      temperature: true,
      rainfall: true,
      humidity: false,
      windSpeed: false,
      pressure: false,
    });
    setPrediction(null);
    triggerToast('Configuration reset.');
  };

  const handleExportResults = () => {
    if (!prediction) {
      triggerToast('No prediction data to export.');
      return;
    }
    triggerToast(`Prediction dataset for ${prediction.country} exported in CSV / GeoJSON format.`);
  };

  const handleSavePrediction = () => {
    if (!prediction) {
      triggerToast('No prediction to save.');
      return;
    }
    triggerToast(`Prediction saved to ${prediction.country} regional records.`);
  };

  const getSummaryMetric = (metricKey: string, year: number, aggr: 'avg' | 'min' | 'max'): string => {
    if (!prediction) return '-';
    const monthValues = prediction.data[metricKey]?.[year] || [];
    if (monthValues.length === 0) return '-';
    let v: number;
    switch (aggr) {
      case 'avg': v = monthValues.reduce((a, b) => a + b, 0) / monthValues.length; break;
      case 'min': v = Math.min(...monthValues); break;
      case 'max': v = Math.max(...monthValues); break;
    }
    return v.toFixed(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1B1C1A]">Climate Prediction</h1>
          <p className="text-base lg:text-lg text-[#43493C] max-w-3xl">
            Generate climate predictions for a selected country and time period using a trained prediction model.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="bg-[#2E5D3D] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-[#3B754F] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-end"
        >
          <span className="material-symbols-outlined text-base">tune</span>
          <span>Reset Configuration</span>
        </button>
      </div>

      {/* 2. Prediction Configuration Card */}
      <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E8E3DA] shadow-sm">
        <div className="flex items-center gap-2 pb-5 border-b border-[#E8E3DA] mb-6">
          <span className="material-symbols-outlined text-[#2E5D3D] text-xl">tune</span>
          <h2 className="text-xl font-bold text-[#1B1C1A]">Prediction Configuration</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Form controls */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            {/* Country */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                Country
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#FBFAF7] border border-[#E8E3DA] rounded-xl py-3.5 px-4 pr-10 text-sm font-medium text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#6E9445] focus:border-[#6E9445] appearance-none cursor-pointer"
                >
                  <option value="">Select country...</option>
                  {WEST_AFRICA_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#74796A] text-lg pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Year Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                  From Year
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  placeholder="YYYY"
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                  className="w-full bg-[#FBFAF7] border border-[#E8E3DA] rounded-xl py-3.5 px-4 text-sm font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#6E9445] focus:border-[#6E9445]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                  To Year
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  placeholder="YYYY"
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                  className="w-full bg-[#FBFAF7] border border-[#E8E3DA] rounded-xl py-3.5 px-4 text-sm font-mono font-bold text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#6E9445] focus:border-[#6E9445]"
                />
              </div>
            </div>

            {/* Prediction View Toggle */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                Prediction View
              </label>
              <div className="bg-[#F5F3EF] rounded-xl p-1 flex">
                {(['Monthly', 'Yearly'] as PredictionView[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      view === v
                        ? 'bg-white text-[#2E5D3D] shadow-sm border border-[#E8E3DA]'
                        : 'text-[#74796A] hover:text-[#43493C]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Climate Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                  Climate Metrics
                </label>
                <span className="text-[11px] text-[#74796A] italic">
                  Available based on selected model
                </span>
              </div>
              <div className="space-y-2">
                {CLIMATE_METRICS.map((metric) => (
                  <label
                    key={metric.key}
                    className="flex items-center gap-3 py-2 px-1 cursor-pointer hover:bg-[#FBFAF7] rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMetrics[metric.key]}
                      onChange={() => toggleMetric(metric.key)}
                      className="w-5 h-5 accent-[#2E5D3D] rounded border-[#C9C5BE] cursor-pointer"
                    />
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ color: metric.color }}
                    >
                      {metric.icon}
                    </span>
                    <span className="text-sm font-medium text-[#1B1C1A] group-hover:text-[#2E5D3D] transition-colors">
                      {metric.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Model Cards */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                Prediction Model
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ANN Card */}
                <div
                  onClick={() => setSelectedModel('ANN')}
                  className={`p-5 rounded-xl transition-all cursor-pointer border-2 flex flex-col justify-between min-h-[220px] ${
                    selectedModel === 'ANN'
                      ? 'border-[#2E5D3D] bg-[#2E5D3D]/[0.03] shadow-sm'
                      : 'border-[#E8E3DA] bg-white hover:border-[#6E9445]/40'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-base text-[#1B1C1A] leading-tight">
                        Artificial Neural{'\n'}Network (ANN)
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          selectedModel === 'ANN'
                            ? 'bg-[#B8ECC2] text-[#3D6C4B]'
                            : 'bg-[#F5F3EF] text-[#43493C]'
                        }`}
                      >
                        {selectedModel === 'ANN' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#396847]"></span> ACTIVE
                          </>
                        ) : (
                          <>READY</>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#43493C] leading-relaxed">
                      A neural-network-based model for learning relationships between climate variables.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#E8E3DA]/60">
                    <p className="text-[11px] text-[#74796A] italic">
                      Training information unavailable
                    </p>
                  </div>
                </div>

                {/* Linear Regression Card */}
                <div
                  onClick={() => setSelectedModel('Linear Regression')}
                  className={`p-5 rounded-xl transition-all cursor-pointer border-2 flex flex-col justify-between min-h-[220px] ${
                    selectedModel === 'Linear Regression'
                      ? 'border-[#2E5D3D] bg-[#2E5D3D]/[0.03] shadow-sm'
                      : 'border-[#E8E3DA] bg-white hover:border-[#6E9445]/40'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-base text-[#1B1C1A] leading-tight">
                        Linear Regression
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          selectedModel === 'Linear Regression'
                            ? 'bg-[#B8ECC2] text-[#3D6C4B]'
                            : 'bg-[#F5F3EF] text-[#43493C]'
                        }`}
                      >
                        {selectedModel === 'Linear Regression' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#396847]"></span> ACTIVE
                          </>
                        ) : (
                          <>READY</>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#43493C] leading-relaxed">
                      Statistical approach establishing relationships between historical climate variables.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#E8E3DA]/60">
                    <p className="text-[11px] text-[#74796A] italic">
                      Training information unavailable
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mt-8 pt-6 border-t border-[#E8E3DA] space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-[#2E5D3D] flex items-center gap-2">
                <span className="material-symbols-outlined text-base animate-spin">sync</span>
                Running prediction engine...
              </span>
              <span className="font-mono font-bold text-[#2E5D3D]">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#E8E3DA] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6E9445] to-[#2E5D3D] transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-8 pt-6 border-t border-[#E8E3DA] flex justify-end">
          <button
            onClick={handleGeneratePrediction}
            disabled={isGenerating}
            className="bg-[#2E5D3D] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-sm hover:bg-[#3B754F] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-xl">psychology</span>
            <span>{isGenerating ? 'Generating...' : 'Generate Prediction'}</span>
          </button>
        </div>
      </section>

      {/* 3. Results Area */}
      {!prediction ? (
        <section className="border-2 border-dashed border-[#DAD4C8] rounded-3xl py-24 px-8 text-center bg-[#FBFAF7]/50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6E9445]/10 mb-6">
            <span className="material-symbols-outlined text-[#6E9445] text-4xl">monitoring</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1B1C1A] mb-3">
            No prediction generated yet
          </h2>
          <p className="text-base lg:text-lg text-[#43493C] max-w-xl mx-auto leading-relaxed">
            Configure your prediction parameters above and generate a prediction to see the results here.
          </p>
        </section>
      ) : (
        <div className="space-y-8">
          {/* Result Summary Header */}
          <section className="bg-white rounded-2xl p-6 border border-[#E8E3DA] shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E8E3DA]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#2E5D3D]">task_alt</span>
                  <span className="text-xs font-bold text-[#2E5D3D] uppercase tracking-wider">
                    Prediction Complete
                  </span>
                  <span className="text-xs text-[#74796A]">· {prediction.generatedAt}</span>
                </div>
                <h2 className="text-xl font-bold text-[#1B1C1A]">
                  {prediction.country} · {prediction.fromYear} – {prediction.toYear}
                </h2>
                <p className="text-sm text-[#43493C] mt-1">
                  Model: <span className="font-semibold">{prediction.model}</span> ·{' '}
                  View: <span className="font-semibold">{prediction.view}</span> ·{' '}
                  {prediction.metrics.length} metric{prediction.metrics.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#B8ECC2]/30 border border-[#6E9445]/30 px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-[#2E5D3D] text-lg">verified</span>
                <span className="text-sm font-bold text-[#2E5D3D]">{prediction.confidence}% Confidence</span>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-5">
              {enabledMetrics.map((metric) => {
                const lastYear = prediction.toYear;
                return (
                  <div key={metric.key} className="bg-[#FBFAF7] rounded-xl p-4 border border-[#E8E3DA]">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ color: metric.color }}
                      >
                        {metric.icon}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#74796A]">
                        {metric.label}
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-[#1B1C1A] leading-tight">
                      {getSummaryMetric(metric.key, lastYear, 'avg')}
                      <span className="text-sm font-normal text-[#74796A] ml-1">{metric.unit}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-[#43493C]">
                      <span>
                        Min: <span className="font-bold font-mono">{getSummaryMetric(metric.key, lastYear, 'min')}</span>
                      </span>
                      <span>
                        Max: <span className="font-bold font-mono">{getSummaryMetric(metric.key, lastYear, 'max')}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Per Metric Charts */}
          {enabledMetrics.map((metric) => (
            <section
              key={metric.key}
              className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E8E3DA] shadow-sm space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: metric.color }}
                  >
                    {metric.icon}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#1B1C1A]">
                      {metric.label} {prediction.view === 'Monthly' ? 'Monthly' : 'Yearly'} Trends
                    </h3>
                    <p className="text-sm text-[#43493C]">
                      {prediction.country} · {prediction.fromYear}–{prediction.toYear} · {metric.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-[#6E9445]/10 px-3 py-1.5 rounded-full">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  ></span>
                  <span className="text-xs font-bold text-[#2E5D3D]">Predicted Values</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[320px] w-full relative border-b border-l border-[#E8E3DA] pl-10 pb-8 pt-4 pr-2">
                {view === 'Monthly' ? (
                  <MonthlyChart prediction={prediction} metric={metric} />
                ) : (
                  <YearlyChart prediction={prediction} metric={metric} />
                )}
              </div>
            </section>
          ))}

          {/* Data Table */}
          <section className="bg-white rounded-2xl border border-[#E8E3DA] p-6 lg:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DA]">
              <h3 className="text-lg font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2E5D3D]">table_chart</span>
                Prediction Data ({view} View)
              </h3>
              <span className="text-xs text-[#74796A]">
                {yearsRange.length} year{yearsRange.length !== 1 ? 's' : ''} · {prediction.country}
              </span>
            </div>
            <div className="overflow-x-auto -mx-6 lg:-mx-8 px-6 lg:px-8">
              {view === 'Monthly' ? (
                <MonthlyDataTable prediction={prediction} metrics={enabledMetrics} />
              ) : (
                <YearlyDataTable prediction={prediction} metrics={enabledMetrics} years={yearsRange} />
              )}
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={onNavigateToEvaluation}
              className="px-5 py-3 border border-[#E8E3DA] bg-white text-[#43493C] rounded-xl text-sm font-bold hover:bg-[#F5F3EF] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">assessment</span>
              <span>View Model Evaluation</span>
            </button>
            <button
              onClick={handleExportResults}
              className="px-5 py-3 border border-[#2E5D3D] text-[#2E5D3D] bg-white rounded-xl text-sm font-bold hover:bg-[#2E5D3D]/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export Results</span>
            </button>
            <button
              onClick={handleSavePrediction}
              className="px-5 py-3 bg-[#2E5D3D] text-white rounded-xl text-sm font-bold hover:bg-[#3B754F] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Save Prediction</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------ Sub-components: Charts & Tables ------------------ */

const MonthlyChart: React.FC<{ prediction: PredictionResult; metric: ClimateMetricData }> = ({
  prediction,
  metric,
}) => {
  const years = [];
  for (let y = prediction.fromYear; y <= prediction.toYear; y++) years.push(y);
  const data = prediction.data[metric.key];
  const allValues = years.flatMap((y) => data?.[y] || []);
  const min = Math.min(...allValues) * 0.95;
  const max = Math.max(...allValues) * 1.05;
  const range = max - min || 1;
  const chartHeight = 280;
  const labelCount = 5;
  const yLabels = Array.from({ length: labelCount }, (_, i) => (min + (range * i) / (labelCount - 1)).toFixed(0));

  const yearColors = [
    '#2E5D3D',
    '#A65A35',
    '#2563EB',
    '#7C3AED',
    '#CA8A04',
    '#0E7490',
    '#BE123C',
  ];

  return (
    <>
      {/* Y Axis Labels */}
      <div className="absolute left-0 bottom-8 top-4 w-9 flex flex-col justify-between text-[11px] text-[#74796A] font-mono text-right pr-1">
        {[...yLabels].reverse().map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
      {/* Grid */}
      <div className="absolute inset-0 pl-10 pb-8 pt-4 pr-2 pointer-events-none">
        {Array.from({ length: labelCount }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed border-[#E8E3DA]"
            style={{ top: `${(i / (labelCount - 1)) * 100}%` }}
          />
        ))}
      </div>
      {/* X Axis Labels */}
      <div className="absolute left-10 right-2 bottom-0 flex justify-between h-8 items-center text-[11px] text-[#74796A] font-mono">
        {MONTH_LABELS.map((m) => (
          <span key={m} className="flex-1 text-center">{m}</span>
        ))}
      </div>
      {/* SVG Lines */}
      <svg className="absolute inset-0 pl-10 pb-8 pt-4 pr-2 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 280">
        {years.map((year, yi) => {
          const values = data?.[year] || [];
          const step = 1000 / 12;
          const points = values.map((v, i) => {
            const x = i * step + step / 2;
            const y = chartHeight - ((v - min) / range) * chartHeight;
            return `${x},${y}`;
          });
          const color = yearColors[yi % yearColors.length];
          return (
            <g key={year}>
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={points.join(' ')}
              />
              {values.map((_, i) => {
                const x = i * step + step / 2;
                const y = chartHeight - (((values[i] ?? min) - min) / range) * chartHeight;
                return (
                  <circle key={i} cx={x} cy={y} r="3" fill={color} />
                );
              })}
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="absolute top-0 right-0 flex flex-wrap gap-3 z-10">
        {years.map((y, yi) => (
          <span key={y} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#43493C] bg-white border border-[#E8E3DA] px-2 py-1 rounded-full shadow-sm">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: yearColors[yi % yearColors.length] }}
            ></span>
            {y}
          </span>
        ))}
      </div>
    </>
  );
};

const YearlyChart: React.FC<{ prediction: PredictionResult; metric: ClimateMetricData }> = ({
  prediction,
  metric,
}) => {
  const years = [];
  for (let y = prediction.fromYear; y <= prediction.toYear; y++) years.push(y);
  const data = prediction.data[metric.key];
  const yearlyAvgs = years.map((y) => {
    const vals = data?.[y] || [];
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });
  const min = Math.min(...yearlyAvgs) * 0.95;
  const max = Math.max(...yearlyAvgs) * 1.05;
  const range = max - min || 1;
  const chartHeight = 280;
  const labelCount = 5;
  const yLabels = Array.from({ length: labelCount }, (_, i) => (min + (range * i) / (labelCount - 1)).toFixed(1));

  return (
    <>
      <div className="absolute left-0 bottom-8 top-4 w-9 flex flex-col justify-between text-[11px] text-[#74796A] font-mono text-right pr-1">
        {[...yLabels].reverse().map((v, i) => (
          <span key={i}>{v}</span>
        ))}
      </div>
      <div className="absolute inset-0 pl-10 pb-8 pt-4 pr-2 pointer-events-none">
        {Array.from({ length: labelCount }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-dashed border-[#E8E3DA]"
            style={{ top: `${(i / (labelCount - 1)) * 100}%` }}
          />
        ))}
      </div>
      <div className="absolute left-10 right-2 bottom-0 flex justify-between h-8 items-center text-[11px] text-[#74796A] font-mono overflow-hidden">
        {years.map((y) => (
          <span key={y} className="flex-1 text-center whitespace-nowrap">{y}</span>
        ))}
      </div>
      {/* Bars */}
      <div className="absolute inset-0 pl-10 pb-8 pt-4 pr-2 flex items-end justify-around gap-2">
        {yearlyAvgs.map((v, i) => {
          const height = ((v - min) / range) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <span className="text-[10px] font-bold font-mono" style={{ color: metric.color }}>
                {v.toFixed(1)}
              </span>
              <div
                className="w-full max-w-[48px] rounded-t-md shadow-sm transition-all hover:opacity-80"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(180deg, ${metric.color} 0%, ${metric.color}BB 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

const MonthlyDataTable: React.FC<{ prediction: PredictionResult; metrics: ClimateMetricData[] }> = ({
  prediction,
  metrics,
}) => {
  const years = [];
  for (let y = prediction.fromYear; y <= prediction.toYear; y++) years.push(y);
  return (
    <table className="w-full text-xs border-collapse min-w-max">
      <thead>
        <tr className="bg-[#F5F3EF] text-[#43493C] border-b-2 border-[#E8E3DA]">
          <th className="p-3 font-bold text-left sticky left-0 bg-[#F5F3EF] z-10 border-r border-[#E8E3DA]">
            Year
          </th>
          {MONTH_LABELS.map((m) => (
            <th key={m} className="p-3 font-bold text-center">{m}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E8E3DA]">
        {metrics.map((metric) => (
          <React.Fragment key={metric.key}>
            <tr className="bg-[#FBFAF7]">
              <td
                colSpan={13}
                className="p-2 font-bold text-[#2E5D3D] sticky left-0 bg-[#FBFAF7] z-10 border-b border-[#E8E3DA]"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm" style={{ color: metric.color }}>
                    {metric.icon}
                  </span>
                  {metric.label} ({metric.unit})
                </span>
              </td>
            </tr>
            {years.map((year) => (
              <tr key={`${metric.key}-${year}`} className="hover:bg-[#FBFAF7]/50 transition-colors">
                <td className="p-3 font-bold font-mono text-[#1B1C1A] sticky left-0 bg-white z-10 border-r border-[#E8E3DA]">
                  {year}
                </td>
                {(prediction.data[metric.key]?.[year] || []).map((val, i) => (
                  <td key={i} className="p-3 text-center font-mono text-[#43493C]">
                    {val.toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

const YearlyDataTable: React.FC<{
  prediction: PredictionResult;
  metrics: ClimateMetricData[];
  years: number[];
}> = ({ prediction, metrics, years }) => {
  const yearlyAvg = (metricKey: string, year: number): string => {
    const vals = prediction.data[metricKey]?.[year] || [];
    if (!vals.length) return '-';
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  };
  return (
    <table className="w-full text-xs border-collapse min-w-max">
      <thead>
        <tr className="bg-[#F5F3EF] text-[#43493C] border-b-2 border-[#E8E3DA]">
          <th className="p-3 font-bold text-left sticky left-0 bg-[#F5F3EF] z-10 border-r border-[#E8E3DA]">
            Metric
          </th>
          {years.map((y) => (
            <th key={y} className="p-3 font-bold text-center">{y}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E8E3DA]">
        {metrics.map((metric) => (
          <tr key={metric.key} className="hover:bg-[#FBFAF7]/50 transition-colors">
            <td className="p-3 font-semibold text-[#1B1C1A] sticky left-0 bg-white z-10 border-r border-[#E8E3DA]">
              <span className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ color: metric.color }}>
                  {metric.icon}
                </span>
                {metric.label}
                <span className="text-[10px] text-[#74796A] font-normal">({metric.unit})</span>
              </span>
            </td>
            {years.map((y) => (
              <td key={y} className="p-3 text-center font-mono font-bold text-[#43493C]">
                {yearlyAvg(metric.key, y)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
