import React, { useState } from 'react';

interface ClimateReportsProps {
  triggerToast: (msg: string) => void;
  onNavigateToDashboard?: () => void;
}

interface ReportHistoryItem {
  id: string;
  title: string;
  dataset: string;
  model: string;
  date: string;
  format: string;
  status: 'Success' | 'Pending' | 'Processing';
  size: string;
}

export const ClimateReports: React.FC<ClimateReportsProps> = ({
  triggerToast,
  onNavigateToDashboard,
}) => {
  // Configuration State
  const [selectedReportType, setSelectedReportType] = useState<string>('Climate Prediction Report');
  const [selectedDataset, setSelectedDataset] = useState<string>('West Africa v4');
  const [selectedModel, setSelectedModel] = useState<string>('Artificial Neural Network (ANN)');
  const [forecastPeriod, setForecastPeriod] = useState<string>('2024 - 2025');

  // Included Sections State
  const [includeDatasetSummary, setIncludeDatasetSummary] = useState<boolean>(true);
  const [includePreprocessing, setIncludePreprocessing] = useState<boolean>(true);
  const [includeModelDetails, setIncludeModelDetails] = useState<boolean>(true);
  const [includePredictionResults, setIncludePredictionResults] = useState<boolean>(true);
  const [includeMetrics, setIncludeMetrics] = useState<boolean>(true);
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeConclusion, setIncludeConclusion] = useState<boolean>(true);

  // Modal & Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [historySearch, setHistorySearch] = useState<string>('');

  // Report History Data
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([
    {
      id: 'REP-024',
      title: 'Sahel Precipitation & Temperature Brief',
      dataset: 'West Africa v4',
      model: 'ANN',
      date: 'Oct 15, 2023',
      format: 'PDF, CSV',
      status: 'Success',
      size: '4.2 MB',
    },
    {
      id: 'REP-023',
      title: 'Global SST Anomaly Assessment',
      dataset: 'Global SST Base',
      model: 'Random Forest',
      date: 'Oct 10, 2023',
      format: 'PDF',
      status: 'Success',
      size: '2.8 MB',
    },
    {
      id: 'REP-022',
      title: 'Euro-Cordex Regional Downscaling',
      dataset: 'Euro-Cordex v2',
      model: 'CNN (Deep)',
      date: 'Oct 02, 2023',
      format: 'PDF, CSV',
      status: 'Pending',
      size: '12.1 MB',
    },
    {
      id: 'REP-021',
      title: 'Gulf of Guinea Coastal Erosion Forecast',
      dataset: 'Lagos Coastal Erosion',
      model: 'Linear Regression',
      date: 'Sep 28, 2023',
      format: 'CSV',
      status: 'Success',
      size: '1.5 MB',
    },
    {
      id: 'REP-020',
      title: 'Ivory Coast Drought Risk Index',
      dataset: 'Ivory Coast Reforestation',
      model: 'ANN',
      date: 'Sep 18, 2023',
      format: 'PDF',
      status: 'Success',
      size: '3.6 MB',
    },
  ]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    triggerToast('Compiling dataset metrics, charts, and model forecasts...');
    setTimeout(() => {
      setIsGenerating(false);
      const newReport: ReportHistoryItem = {
        id: `REP-0${reportHistory.length + 25}`,
        title: `${selectedReportType} (${selectedDataset})`,
        dataset: selectedDataset,
        model: selectedModel.includes('ANN') ? 'ANN' : selectedModel.includes('Linear') ? 'Linear Reg' : 'Random Forest',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        format: 'PDF, CSV',
        status: 'Success',
        size: '3.9 MB',
      };
      setReportHistory([newReport, ...reportHistory]);
      triggerToast(`Report "${newReport.id}" generated successfully!`);
    }, 1500);
  };

  const handleExportPDF = () => {
    triggerToast(`Exporting ${selectedReportType} as high-resolution PDF document...`);
  };

  const handleExportCSV = () => {
    triggerToast(`Exporting underlying climate observation tables as CSV...`);
  };

  const handlePrint = () => {
    triggerToast('Opening native browser print dialog...');
    window.print();
  };

  const filteredHistory = reportHistory.filter(
    (item) =>
      item.id.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.dataset.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.model.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E3DA] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">description</span>
            <span className="text-xs font-bold tracking-wider uppercase">Scientific Reporting Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1B1C1A]">Reports</h1>
          <p className="text-sm text-[#43493C] mt-1 max-w-2xl">
            Generate, preview, and export comprehensive climate prediction reports for analysis, policy advocacy, and scientific documentation.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="bg-[#2C4D03] text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-[#43651C] active:scale-95 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">
            {isGenerating ? 'sync' : 'summarize'}
          </span>
          <span>{isGenerating ? 'Generating Report...' : 'Generate Report'}</span>
        </button>
      </div>

      {/* 2. KPI Summary Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Total Reports</span>
            <span className="material-symbols-outlined text-[#2C4D03] text-xl">library_books</span>
          </div>
          <div className="text-2xl font-extrabold text-[#1B1C1A]">{reportHistory.length + 19}</div>
          <div className="text-xs text-[#396847] font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+3 generated this month</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Latest Report</span>
            <span className="material-symbols-outlined text-[#2C4D03] text-xl">calendar_today</span>
          </div>
          <div className="text-lg font-bold text-[#1B1C1A]">{reportHistory[0]?.date || 'Oct 15, 2023'}</div>
          <div className="text-xs text-[#74796A] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">history</span>
            <span>Recently updated</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Active Dataset</span>
            <span className="material-symbols-outlined text-[#2C4D03] text-xl">travel_explore</span>
          </div>
          <div className="text-lg font-bold text-[#1B1C1A] truncate" title={selectedDataset}>
            {selectedDataset}
          </div>
          <div className="text-xs text-[#3D6C4B] mt-1 flex items-center gap-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#B8ECC2] border border-[#396847]"></span>
            <span>Verified Synced</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Selected Model</span>
            <span className="material-symbols-outlined text-[#2C4D03] text-xl">psychology</span>
          </div>
          <div className="text-lg font-bold text-[#1B1C1A]">{selectedModel.split(' ')[0]}</div>
          <div className="text-xs text-[#74796A] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">speed</span>
            <span>High Confidence</span>
          </div>
        </div>
      </section>

      {/* 3. Main Split View: Report Preview (Left) & Configuration + Export (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2-cols): Document Preview */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#2C4D03]">visibility</span>
              <span>Report Preview</span>
            </h2>
            <span className="text-[10px] font-mono font-bold text-[#2C4D03] bg-[#B8ECC2]/50 px-2.5 py-1 rounded">
              LIVE DOCUMENT RENDERING
            </span>
          </div>

          <div className="bg-white border border-[#E8E3DA] rounded-xl shadow-xs overflow-hidden flex flex-col min-h-[620px]">
            {/* Document Header Banner */}
            <div className="bg-[#F5F3EF] border-b border-[#E8E3DA] p-6 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 bg-[#2C4D03] text-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                <span className="material-symbols-outlined text-3xl">public</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#2C4D03] mb-1">{selectedReportType}</h3>
              <p className="text-xs font-semibold text-[#43493C]">
                {selectedDataset} • Forecast Period {forecastPeriod}
              </p>
            </div>

            {/* Document Content Body */}
            <div className="p-6 flex-1 space-y-6 bg-white overflow-y-auto">
              {/* Executive Summary Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1B1C1A] uppercase tracking-wider border-b border-[#E8E3DA] pb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2C4D03]">article</span>
                  <span>Executive Summary</span>
                </h4>
                <p className="text-xs text-[#43493C] leading-relaxed">
                  This scientific report outlines forecasted climate anomalies for West Africa utilizing the robust{' '}
                  <strong className="text-[#1B1C1A]">{selectedDataset}</strong> telemetry dataset and an{' '}
                  <strong className="text-[#1B1C1A]">{selectedModel}</strong>. Predictive simulations highlight key trends in precipitation variance and surface air temperature shifts across the Sahel and coastal regions over the target period ({forecastPeriod}).
                </p>
              </div>

              {/* Grid: Dataset Details & Prediction Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dataset Details Card */}
                {includeDatasetSummary && (
                  <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#E8E3DA] space-y-2">
                    <h5 className="text-xs font-bold text-[#1B1C1A] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#2C4D03]">data_object</span>
                      <span>Dataset Summary</span>
                    </h5>
                    <ul className="text-[11px] text-[#43493C] space-y-1.5 font-mono">
                      <li className="flex justify-between">
                        <span className="text-[#74796A]">Source:</span>
                        <span className="font-bold text-[#1B1C1A]">ECMWF & Meteorological Stations</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-[#74796A]">Temporal Res:</span>
                        <span className="font-bold text-[#1B1C1A]">Monthly Aggregated</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-[#74796A]">Spatial Bounds:</span>
                        <span className="font-bold text-[#1B1C1A]">15°N–5°S, 20°W–15°E</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-[#74796A]">Parameters:</span>
                        <span className="font-bold text-[#2C4D03]">Temp, Precip, Soil Moisture</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Data Preprocessing Note */}
                {includePreprocessing && (
                  <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#E8E3DA] space-y-2">
                    <h5 className="text-xs font-bold text-[#1B1C1A] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#2C4D03]">memory</span>
                      <span>Data Preprocessing</span>
                    </h5>
                    <ul className="text-[11px] text-[#43493C] space-y-1.5">
                      <li className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-[#396847]">check_circle</span>
                        <span>Z-score Normalization applied</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-[#396847]">check_circle</span>
                        <span>KNN Imputation for missing readings</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-[#396847]">check_circle</span>
                        <span>80/20 Train-Test split validation</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Selected Model Details & Prediction Metrics */}
              {includeModelDetails && includePredictionResults && (
                <div className="bg-[#F5F3EF] p-4 rounded-xl border border-[#E8E3DA] space-y-3">
                  <h5 className="text-xs font-bold text-[#1B1C1A] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#2C4D03]">analytics</span>
                      <span>Model Performance & Evaluation</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#2C4D03] bg-[#B8ECC2] px-2 py-0.5 rounded font-bold">
                      {selectedModel}
                    </span>
                  </h5>

                  {includeMetrics && (
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="bg-white p-2.5 rounded-lg border border-[#E8E3DA] text-center">
                        <span className="text-[9px] font-bold text-[#74796A] block uppercase">Mean Abs Error (MAE)</span>
                        <span className="text-base font-extrabold text-[#1B1C1A]">0.18 °C</span>
                        <div className="w-full bg-[#E8E3DA] h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-[#2C4D03] h-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-[#E8E3DA] text-center">
                        <span className="text-[9px] font-bold text-[#74796A] block uppercase">Root Mean Sq Error</span>
                        <span className="text-base font-extrabold text-[#1B1C1A]">0.24</span>
                        <div className="w-full bg-[#E8E3DA] h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-[#2C4D03] h-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-[#E8E3DA] text-center">
                        <span className="text-[9px] font-bold text-[#74796A] block uppercase">R² Coefficient</span>
                        <span className="text-base font-extrabold text-[#2C4D03]">0.938</span>
                        <div className="w-full bg-[#E8E3DA] h-1 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-[#396847] h-full" style={{ width: '93.8%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Climate Charts Section */}
              {includeCharts && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#1B1C1A] uppercase tracking-wider border-b border-[#E8E3DA] pb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#2C4D03]">show_chart</span>
                    <span>Climate Anomaly Projections ({forecastPeriod})</span>
                  </h4>

                  <div className="w-full h-40 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-center text-[10px] text-[#74796A] font-mono">
                      <span>Sahel Precipitation & Surface Temp Anomaly Forecast</span>
                      <span className="text-[#2C4D03] font-bold">+1.51°C Trend</span>
                    </div>

                    <div className="flex-1 relative flex items-end pt-2">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 100">
                        <path
                          d="M 10 70 Q 100 50 200 40 T 350 25 T 490 10 L 490 95 L 10 95 Z"
                          fill="#2C4D03"
                          fillOpacity="0.1"
                        />
                        <polyline
                          fill="none"
                          stroke="#2C4D03"
                          strokeWidth="2.5"
                          points="10,70 100,50 200,40 300,35 400,20 490,10"
                        />
                      </svg>
                    </div>

                    <div className="flex justify-between text-[9px] text-[#74796A] font-mono pt-1">
                      <span>Jan 2024</span>
                      <span>Jul 2024</span>
                      <span>Jan 2025</span>
                      <span>Dec 2025</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conclusion & Insights */}
              {includeConclusion && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#1B1C1A] uppercase tracking-wider border-b border-[#E8E3DA] pb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#2C4D03]">verified_user</span>
                    <span>Conclusions & Policy Directives</span>
                  </h4>
                  <p className="text-xs text-[#43493C] leading-relaxed bg-[#F5F3EF] p-3 rounded-lg border border-[#E8E3DA]">
                    The model outputs strongly indicate an accelerated monsoonal onset shift toward late July, accompanied by heightened drought risk indices in agricultural belts. Regional governments are advised to update infrastructure resilience benchmarks and adjust cropping calendars.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Column (1-col): Configuration & Export Actions */}
        <div className="space-y-6">
          {/* Section: Report Configuration */}
          <section className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#1B1C1A] border-b border-[#E8E3DA] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#2C4D03]">tune</span>
              <span>Report Configuration</span>
            </h3>

            {/* Select Report Type */}
            <div>
              <label className="block text-xs font-bold text-[#1B1C1A] mb-1">Report Document Title</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-bold text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#2C4D03] cursor-pointer"
              >
                <option>Climate Prediction Report</option>
                <option>Sahel Monsoon & Drought Executive Brief</option>
                <option>Model Validation & Algorithm Audit</option>
                <option>Coastal Erosion & Flood Vulnerability Index</option>
              </select>
            </div>

            {/* Select Dataset */}
            <div>
              <label className="block text-xs font-bold text-[#1B1C1A] mb-1">Target Dataset</label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-bold text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#2C4D03] cursor-pointer"
              >
                <option>West Africa v4</option>
                <option>Sahel Precipitation 2023</option>
                <option>Lagos Coastal Erosion Hub</option>
                <option>Ghana Drought Index</option>
                <option>Ivory Coast Reforestation</option>
              </select>
            </div>

            {/* Select Model */}
            <div>
              <label className="block text-xs font-bold text-[#1B1C1A] mb-1">Predictive Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-bold text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#2C4D03] cursor-pointer"
              >
                <option>Artificial Neural Network (ANN)</option>
                <option>Multivariate Linear Regression</option>
                <option>Random Forest Ensemble</option>
              </select>
            </div>

            {/* Forecast Period */}
            <div>
              <label className="block text-xs font-bold text-[#1B1C1A] mb-1">Forecast Period</label>
              <select
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(e.target.value)}
                className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-2.5 text-xs font-bold text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#2C4D03] cursor-pointer"
              >
                <option>2024 - 2025</option>
                <option>2025 - 2030</option>
                <option>2020 - 2035</option>
              </select>
            </div>

            {/* Included Sections Checkboxes */}
            <div className="pt-2 border-t border-[#E8E3DA] space-y-2">
              <span className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider block mb-1">
                Included Sections
              </span>

              <label className="flex items-center gap-2 text-xs text-[#1B1C1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDatasetSummary}
                  onChange={(e) => setIncludeDatasetSummary(e.target.checked)}
                  className="rounded text-[#2C4D03] focus:ring-[#2C4D03] w-4 h-4 cursor-pointer"
                />
                <span>Dataset Summary</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#1B1C1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePreprocessing}
                  onChange={(e) => setIncludePreprocessing(e.target.checked)}
                  className="rounded text-[#2C4D03] focus:ring-[#2C4D03] w-4 h-4 cursor-pointer"
                />
                <span>Data Preprocessing</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#1B1C1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeModelDetails}
                  onChange={(e) => setIncludeModelDetails(e.target.checked)}
                  className="rounded text-[#2C4D03] focus:ring-[#2C4D03] w-4 h-4 cursor-pointer"
                />
                <span>Selected Model Details</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#1B1C1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePredictionResults}
                  onChange={(e) => setIncludePredictionResults(e.target.checked)}
                  className="rounded text-[#2C4D03] focus:ring-[#2C4D03] w-4 h-4 cursor-pointer"
                />
                <span>Prediction Results</span>
              </label>

              {/* Sub Checkboxes */}
              {includePredictionResults && (
                <div className="pl-6 space-y-1.5 border-l-2 border-[#E8E3DA]">
                  <label className="flex items-center gap-2 text-[11px] text-[#43493C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMetrics}
                      onChange={(e) => setIncludeMetrics(e.target.checked)}
                      className="rounded text-[#396847] focus:ring-[#396847] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>MAE, RMSE, R² Score</span>
                  </label>

                  <label className="flex items-center gap-2 text-[11px] text-[#43493C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="rounded text-[#396847] focus:ring-[#396847] w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Climate Anomaly Charts</span>
                  </label>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-[#1B1C1A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeConclusion}
                  onChange={(e) => setIncludeConclusion(e.target.checked)}
                  className="rounded text-[#2C4D03] focus:ring-[#2C4D03] w-4 h-4 cursor-pointer"
                />
                <span>Conclusion & Policy Insights</span>
              </label>
            </div>
          </section>

          {/* Section: Export Options */}
          <section className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#1B1C1A] border-b border-[#E8E3DA] pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#2C4D03]">download</span>
              <span>Export Options</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-3 p-3 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:bg-[#F5F3EF] transition-all text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#FFDAD6] text-[#93000A] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1B1C1A] group-hover:text-[#2C4D03]">Export as PDF</div>
                  <div className="text-[10px] text-[#74796A]">Standard research & policy format</div>
                </div>
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-3 p-3 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:bg-[#F5F3EF] transition-all text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#B8ECC2] text-[#3D6C4B] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">csv</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1B1C1A] group-hover:text-[#2C4D03]">Export as CSV</div>
                  <div className="text-[10px] text-[#74796A]">Raw telemetry & model metrics</div>
                </div>
              </button>

              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 p-3 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:bg-[#F5F3EF] transition-all text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E4E2DE] text-[#1B1C1A] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">print</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1B1C1A] group-hover:text-[#2C4D03]">Print Report</div>
                  <div className="text-[10px] text-[#74796A]">Send directly to connected printer</div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* 4. Section: Report History */}
      <section className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E8E3DA] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-[#2C4D03]">history</span>
              <span>Report History</span>
            </h2>
            <p className="text-xs text-[#43493C]">
              Access previously generated policy briefs and download historical climate forecasts.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74796A] text-sm">
              search
            </span>
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg text-xs text-[#1B1C1A] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F3EF] border-b border-[#E8E3DA] text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Title / Dataset</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DA] text-xs">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F3EF]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#2C4D03]">{item.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#1B1C1A]">{item.title}</div>
                    <div className="text-[10px] text-[#74796A]">{item.dataset}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#1B1C1A]">{item.model}</td>
                  <td className="py-3 px-4 text-[#43493C]">{item.date}</td>
                  <td className="py-3 px-4 text-[#74796A] font-mono">{item.format}</td>
                  <td className="py-3 px-4">
                    {item.status === 'Success' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B8ECC2] text-[#3D6C4B] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#396847]"></span>
                        Success
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFDEA7] text-[#5E4200] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[12px] animate-spin">sync</span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => triggerToast(`Downloading report package ${item.id} (${item.size})`)}
                      className="text-[#2C4D03] hover:text-[#43651C] p-1.5 rounded hover:bg-[#2C4D03]/10 transition-colors cursor-pointer"
                      title="Download Report"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Quick Actions Bar */}
      <section className="border-t border-[#E8E3DA] pt-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 bg-white border border-[#E8E3DA] px-4 py-2.5 rounded-full text-xs font-bold text-[#2C4D03] hover:bg-[#F5F3EF] transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Generate New Report</span>
          </button>

          <button
            onClick={() => triggerToast(`Downloading latest report ${reportHistory[0]?.id}`)}
            className="flex items-center gap-2 bg-white border border-[#E8E3DA] px-4 py-2.5 rounded-full text-xs font-bold text-[#1B1C1A] hover:bg-[#F5F3EF] transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Download Latest Report</span>
          </button>
        </div>

        {onNavigateToDashboard && (
          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 text-xs font-bold text-[#43493C] hover:text-[#1B1C1A] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Return to Dashboard</span>
          </button>
        )}
      </section>
    </div>
  );
};
