import React, { useState } from 'react';
import { HISTORICAL_CLIMATE_METRICS, WEST_AFRICA_REGIONS } from '../data/mockData';

interface ClimateVisualizationsProps {
  triggerToast: (msg: string) => void;
}

export const ClimateVisualizations: React.FC<ClimateVisualizationsProps> = ({ triggerToast }) => {
  // Filter States
  const [selectedDataset, setSelectedDataset] = useState<string>('West Africa v4');
  const [selectedRegion, setSelectedRegion] = useState<string>('Sahel');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('ANN vs Linear');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2020 - 2025');

  // Visualization View Mode
  const [activeViewMode, setActiveViewMode] = useState<'trends' | 'monsoon' | 'scatter' | 'geospatial'>('trends');

  // Hovered Data Point for Tooltip
  const [hoveredYear, setHoveredYear] = useState<number | null>(2024);

  const handleResetFilters = () => {
    setSelectedDataset('West Africa v4');
    setSelectedRegion('Sahel');
    setSelectedModelFilter('ANN vs Linear');
    setSelectedPeriod('2020 - 2025');
    triggerToast('Visualization filters reset to defaults.');
  };

  const handleExportCharts = () => {
    triggerToast('Climate charts and visual analytics package exported as SVG/PDF.');
  };

  const activeMetricData = HISTORICAL_CLIMATE_METRICS.find((m) => m.year === hoveredYear) || HISTORICAL_CLIMATE_METRICS[6];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-xl border border-[#E8E3DA] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">insert_chart</span>
            <span className="text-xs font-bold tracking-wider uppercase">Visual Analytics Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1B1C1A]">Climate Visualizations</h1>
          <p className="text-xs text-[#43493C] max-w-3xl">
            Explore historical climate trends and compare machine learning prediction results through interactive visual analytics.
          </p>
        </div>

        <button
          onClick={handleExportCharts}
          className="bg-[#2C4D03] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:bg-[#43651C] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Export Charts</span>
        </button>
      </div>

      {/* 2. Filter Panel */}
      <div className="bg-white border border-[#E8E3DA] rounded-xl p-3 flex flex-wrap items-center gap-3 shadow-xs">
        {/* Dataset Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA]">
          <span className="material-symbols-outlined text-sm text-[#74796A]">database</span>
          <select
            value={selectedDataset}
            onChange={(e) => {
              setSelectedDataset(e.target.value);
              triggerToast(`Filter updated: Dataset set to ${e.target.value}`);
            }}
            className="bg-transparent font-bold text-xs text-[#1B1C1A] focus:outline-none cursor-pointer"
          >
            <option>West Africa v4</option>
            <option>Sahel Precipitation v3</option>
            <option>Coastal Erosion Telemetry</option>
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA]">
          <span className="material-symbols-outlined text-sm text-[#74796A]">public</span>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              triggerToast(`Filter updated: Region set to ${e.target.value}`);
            }}
            className="bg-transparent font-bold text-xs text-[#1B1C1A] focus:outline-none cursor-pointer"
          >
            <option>Sahel</option>
            <option>Guinea Coast</option>
            <option>Niger Delta</option>
            <option>Senegal Valley</option>
            <option>Lake Chad Zone</option>
          </select>
        </div>

        {/* Model Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA]">
          <span className="material-symbols-outlined text-sm text-[#74796A]">model_training</span>
          <select
            value={selectedModelFilter}
            onChange={(e) => {
              setSelectedModelFilter(e.target.value);
              triggerToast(`Filter updated: Comparison set to ${e.target.value}`);
            }}
            className="bg-transparent font-bold text-xs text-[#1B1C1A] focus:outline-none cursor-pointer"
          >
            <option>ANN vs Linear</option>
            <option>ANN Only</option>
            <option>Linear Regression Only</option>
          </select>
        </div>

        {/* Period Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA]">
          <span className="material-symbols-outlined text-sm text-[#74796A]">calendar_today</span>
          <select
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              triggerToast(`Filter updated: Period set to ${e.target.value}`);
            }}
            className="bg-transparent font-bold text-xs text-[#1B1C1A] focus:outline-none cursor-pointer"
          >
            <option>2020 - 2025</option>
            <option>2018 - 2027</option>
            <option>2024 - 2030</option>
          </select>
        </div>

        <div className="flex-1"></div>

        <button
          onClick={handleResetFilters}
          className="text-[#2C4D03] text-xs font-bold hover:underline px-2 cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* 3. Overview KPIs (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Dataset</p>
          <p className="text-xl font-extrabold text-[#1B1C1A]">{selectedDataset}</p>
          <div className="pt-2 flex items-center gap-1.5 text-[#396847] text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Cleaned & Preprocessed</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Primary Model</p>
          <p className="text-xl font-extrabold text-[#1B1C1A]">ANN</p>
          <div className="pt-2 flex items-center gap-1.5 text-[#2C4D03] text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>High Confidence</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Period</p>
          <p className="text-xl font-extrabold text-[#1B1C1A]">2024–2025</p>
          <div className="pt-2 flex items-center gap-1.5 text-[#74796A] text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">update</span>
            <span>Future Projection</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DA] rounded-xl p-5 shadow-xs space-y-1">
          <p className="text-[10px] font-bold text-[#74796A] uppercase tracking-wider">Predictions</p>
          <p className="text-xl font-extrabold text-[#1B1C1A]">1,240</p>
          <div className="pt-2 flex items-center gap-1.5 text-[#A65A35] text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Across 12 stations</span>
          </div>
        </div>
      </div>

      {/* View Mode Subnav Tabs */}
      <div className="flex flex-wrap border-b border-[#E8E3DA] gap-2">
        <button
          onClick={() => setActiveViewMode('trends')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeViewMode === 'trends'
              ? 'border-[#2C4D03] text-[#2C4D03] bg-white rounded-t-lg'
              : 'border-transparent text-[#74796A] hover:text-[#1B1C1A]'
          }`}
        >
          <span className="material-symbols-outlined text-base">show_chart</span>
          <span>Spatio-Temporal Trends</span>
        </button>

        <button
          onClick={() => setActiveViewMode('monsoon')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeViewMode === 'monsoon'
              ? 'border-[#2C4D03] text-[#2C4D03] bg-white rounded-t-lg'
              : 'border-transparent text-[#74796A] hover:text-[#1B1C1A]'
          }`}
        >
          <span className="material-symbols-outlined text-base">calendar_view_month</span>
          <span>Monsoon Cycles</span>
        </button>

        <button
          onClick={() => setActiveViewMode('scatter')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeViewMode === 'scatter'
              ? 'border-[#2C4D03] text-[#2C4D03] bg-white rounded-t-lg'
              : 'border-transparent text-[#74796A] hover:text-[#1B1C1A]'
          }`}
        >
          <span className="material-symbols-outlined text-base">scatter_plot</span>
          <span>Scatter Validation</span>
        </button>

        <button
          onClick={() => setActiveViewMode('geospatial')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeViewMode === 'geospatial'
              ? 'border-[#2C4D03] text-[#2C4D03] bg-white rounded-t-lg'
              : 'border-transparent text-[#74796A] hover:text-[#1B1C1A]'
          }`}
        >
          <span className="material-symbols-outlined text-base">map</span>
          <span>Station Telemetry Grid</span>
        </button>
      </div>

      {/* Main Charts Section */}
      {activeViewMode === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Historical Temperature Trend */}
          <section className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs flex flex-col h-96 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#A65A35]">thermostat</span>
                <span>Historical Temperature Trend (2020–2027)</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#A65A35] bg-[#FFDEA7]/40 px-2.5 py-1 rounded-md">
                +1.51°C Anomaly
              </span>
            </div>

            <div className="flex-1 relative border-b border-l border-[#E8E3DA] pt-4 pb-2 pl-2 flex items-end justify-between">
              {/* Y Axis Labels */}
              <div className="absolute -left-6 bottom-0 top-2 flex flex-col justify-between text-[10px] text-[#74796A] font-mono">
                <span>+2.0°</span>
                <span>+1.5°</span>
                <span>+1.0°</span>
                <span>+0.5°</span>
              </div>

              {/* SVG Line Graph */}
              <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 180">
                <line x1="0" y1="30" x2="500" y2="30" stroke="#E8E3DA" strokeDasharray="3 3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="#E8E3DA" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#E8E3DA" strokeDasharray="3 3" />

                {/* Line Path */}
                <path
                  d="M 20 140 Q 80 125 140 100 T 260 80 T 380 50 T 480 25"
                  fill="none"
                  stroke="#A65A35"
                  strokeWidth="3"
                />

                {/* Interactive Points */}
                {HISTORICAL_CLIMATE_METRICS.slice(2).map((m, idx) => {
                  const cx = 20 + idx * 65;
                  const cy = 140 - idx * 16;
                  const isSelected = hoveredYear === m.year;
                  return (
                    <g
                      key={m.year}
                      className="cursor-pointer"
                      onClick={() => setHoveredYear(m.year)}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? "6" : "4"}
                        fill={isSelected ? "#2C4D03" : "#A65A35"}
                        stroke="#FFF"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X Axis Labels */}
              <div className="w-full absolute -bottom-5 left-0 flex justify-between text-[10px] text-[#74796A] px-2 font-mono">
                {HISTORICAL_CLIMATE_METRICS.slice(2).map((m) => (
                  <span
                    key={m.year}
                    onClick={() => setHoveredYear(m.year)}
                    className={`cursor-pointer ${hoveredYear === m.year ? 'font-bold text-[#2C4D03] underline' : ''}`}
                  >
                    {m.year}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#F5F3EF] p-2.5 rounded-lg border border-[#E8E3DA] flex justify-between items-center text-xs">
              <span className="text-[#43493C]">Selected Reading ({activeMetricData.year}):</span>
              <span className="font-mono font-bold text-[#A65A35]">
                +{activeMetricData.temperatureAnomaly}°C (Est. {activeMetricData.predictedTemp}°C)
              </span>
            </div>
          </section>

          {/* Chart 2: Historical Rainfall Trend */}
          <section className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs flex flex-col h-96 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#2C4D03]">water_drop</span>
                <span>Historical Rainfall Trend (2020–2027)</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#2C4D03] bg-[#B8ECC2] px-2.5 py-1 rounded-md">
                Avg. 815 mm/yr
              </span>
            </div>

            <div className="flex-1 relative border-b border-l border-[#E8E3DA] pt-4 pb-2 pl-2 flex items-end justify-around">
              {/* Y Axis Labels */}
              <div className="absolute -left-7 bottom-0 top-2 flex flex-col justify-between text-[10px] text-[#74796A] font-mono">
                <span>1000</span>
                <span>500</span>
                <span>0</span>
              </div>

              {HISTORICAL_CLIMATE_METRICS.slice(2).map((m) => (
                <div
                  key={m.year}
                  onClick={() => setHoveredYear(m.year)}
                  className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div
                    className={`w-7 rounded-t transition-all ${
                      hoveredYear === m.year ? 'bg-[#2C4D03] shadow-xs' : 'bg-[#396847]/40 hover:bg-[#396847]'
                    }`}
                    style={{ height: `${(m.rainfall / 1000) * 100}%` }}
                    title={`${m.year}: ${m.rainfall} mm`}
                  ></div>
                  <span
                    className={`text-[10px] font-mono ${
                      hoveredYear === m.year ? 'font-bold text-[#2C4D03]' : 'text-[#74796A]'
                    }`}
                  >
                    {m.year}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-[#F5F3EF] p-2.5 rounded-lg border border-[#E8E3DA] flex justify-between items-center text-xs">
              <span className="text-[#43493C]">Selected Reading ({activeMetricData.year}):</span>
              <span className="font-mono font-bold text-[#2C4D03]">
                {activeMetricData.rainfall} mm (Predicted: {activeMetricData.predictedRainfall} mm)
              </span>
            </div>
          </section>
        </div>
      )}

      {/* View Mode: Monsoon Cycles */}
      {activeViewMode === 'monsoon' && (
        <section className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
            <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#2C4D03]">calendar_view_month</span>
              <span>West African Monsoon Monthly Cycle (Precipitation & Temperature)</span>
            </h3>
            <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2] px-2.5 py-1 rounded-md">
              Peak: August (280 mm)
            </span>
          </div>

          <div className="h-72 w-full flex items-end justify-between px-2 gap-3 border-l border-b border-[#E8E3DA] pt-6">
            {[
              { m: 'Jan', val: 12, temp: 28 },
              { m: 'Feb', val: 20, temp: 30 },
              { m: 'Mar', val: 45, temp: 32 },
              { m: 'Apr', val: 80, temp: 31 },
              { m: 'May', val: 140, temp: 29 },
              { m: 'Jun', val: 210, temp: 27 },
              { m: 'Jul', val: 260, temp: 26 },
              { m: 'Aug', val: 280, temp: 25 },
              { m: 'Sep', val: 220, temp: 26 },
              { m: 'Oct', val: 110, temp: 28 },
              { m: 'Nov', val: 35, temp: 29 },
              { m: 'Dec', val: 15, temp: 28 },
            ].map((d) => (
              <div key={d.m} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className={`w-full rounded-t transition-all ${
                    d.m === 'Aug' ? 'bg-[#2C4D03] shadow-xs' : 'bg-[#396847]/50 hover:bg-[#396847]'
                  }`}
                  style={{ height: `${(d.val / 300) * 100}%` }}
                ></div>
                <span className="text-[10px] font-mono font-bold text-[#43493C]">{d.m}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#F5F3EF] rounded-lg border border-[#E8E3DA] text-xs space-y-1">
            <span className="font-bold text-[#1B1C1A]">Monsoon Onset Insight:</span>
            <p className="text-[#43493C]">
              The West African Monsoon shifts northward from coastal Guinea in April, reaching peak intensity in the Sahel belt during August before retreating in October.
            </p>
          </div>
        </section>
      )}

      {/* View Mode: Scatter Validation */}
      {activeViewMode === 'scatter' && (
        <section className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
            <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#2C4D03]">scatter_plot</span>
              <span>Predicted vs. Actual Scatter Validation (1:1 Parity)</span>
            </h3>
            <span className="text-[10px] font-bold text-[#2C4D03] font-mono">R² = 0.984</span>
          </div>

          <div className="h-72 w-full bg-[#F5F3EF] rounded-lg border border-[#E8E3DA] relative flex items-center justify-center p-6">
            <div className="w-full h-full border-l-2 border-b-2 border-[#74796A] relative">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <line x1="0%" y1="100%" x2="100%" y2="0%" stroke="#A65A35" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              <div className="absolute w-3 h-3 rounded-full bg-[#2C4D03] bottom-[20%] left-[21%]" title="Point 1"></div>
              <div className="absolute w-3 h-3 rounded-full bg-[#2C4D03] bottom-[40%] left-[39%]" title="Point 2"></div>
              <div className="absolute w-3 h-3 rounded-full bg-[#2C4D03] bottom-[60%] left-[61%]" title="Point 3"></div>
              <div className="absolute w-3 h-3 rounded-full bg-[#2C4D03] bottom-[80%] left-[79%]" title="Point 4"></div>
            </div>

            <span className="absolute bottom-1 font-mono text-[10px] font-bold text-[#74796A]">
              Observed Station Value
            </span>
            <span className="absolute left-1 top-1/2 -rotate-90 font-mono text-[10px] font-bold text-[#74796A] origin-left">
              ANN Model Forecast
            </span>
          </div>
        </section>
      )}

      {/* View Mode: Station Grid */}
      {activeViewMode === 'geospatial' && (
        <section className="bg-white border border-[#E8E3DA] rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E8E3DA] pb-3">
            <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#2C4D03]">map</span>
              <span>West African Telemetry Stations Grid</span>
            </h3>
            <span className="text-[10px] font-bold text-[#74796A] uppercase">5 Active Zones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEST_AFRICA_REGIONS.map((r) => (
              <div key={r.id} className="bg-[#F5F3EF] p-4 rounded-xl border border-[#E8E3DA] space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-xs text-[#1B1C1A]">{r.name}</h4>
                  <span className="text-[10px] bg-[#B8ECC2] text-[#3D6C4B] px-2 py-0.5 rounded font-bold">
                    {r.historicalAccuracy}% Acc.
                  </span>
                </div>
                <p className="text-[11px] text-[#74796A]">{r.country}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                  <div>
                    <span className="text-[#74796A] block text-[9px] uppercase">Temp</span>
                    <span className="font-bold text-[#1B1C1A]">{r.avgTemp} °C</span>
                  </div>
                  <div>
                    <span className="text-[#74796A] block text-[9px] uppercase">Rainfall</span>
                    <span className="font-bold text-[#2C4D03]">{r.annualRainfall} mm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

