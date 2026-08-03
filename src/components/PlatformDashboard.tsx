import React, { useState, useEffect } from 'react';
import { PlatformTab, WestAfricaRegion, ModelPreset } from '../types';
import { WEST_AFRICA_REGIONS, HISTORICAL_CLIMATE_METRICS, MODEL_PRESETS } from '../data/mockData';
import { DataPreprocessing } from './DataPreprocessing';
import { ModelTraining } from './ModelTraining';
import { ClimatePrediction } from './ClimatePrediction';
import { ModelEvaluation } from './ModelEvaluation';
import { ClimateVisualizations } from './ClimateVisualizations';
import { ClimateReports } from './ClimateReports';
import { PlatformSettings } from './PlatformSettings';

interface DatasetItem {
  id: string;
  name: string;
  region: string;
  records: string;
  uploadDate: string;
  status: 'Verified' | 'Processing' | 'Failed';
  format: string;
  size: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

interface PlatformDashboardProps {
  initialTab?: PlatformTab;
  onExitPlatform: () => void;
  userEmail?: string;
}

export const PlatformDashboard: React.FC<PlatformDashboardProps> = ({
  initialTab = 'dashboard',
  onExitPlatform,
  userEmail = 'researcher@ecopredict.ai',
}) => {
  const [activeTab, setActiveTab] = useState<PlatformTab>(initialTab);
  const [headerTab, setHeaderTab] = useState<'Research' | 'Projects' | 'Policy'>('Research');
  const [selectedRegion, setSelectedRegion] = useState<WestAfricaRegion>(WEST_AFRICA_REGIONS[0]);
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(MODEL_PRESETS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<'Daily' | 'Monthly' | 'Yearly'>('Yearly');

  // Datasets & Filtering state
  const [datasetSearch, setDatasetSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateRangeFilter, setDateRangeFilter] = useState('Date Range');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [datasets, setDatasets] = useState<DatasetItem[]>([
    {
      id: 'ds-1',
      name: 'Sahel Precipitation 2023',
      region: 'Sahel',
      records: '450k',
      uploadDate: 'Oct 12, 2023',
      status: 'Verified',
      format: 'CSV',
      size: '45.2 MB',
      icon: 'rainy',
      iconColor: 'text-[#2C4D03]',
      iconBg: 'bg-[#43651C]/10',
    },
    {
      id: 'ds-2',
      name: 'Lagos Coastal Erosion Hub',
      region: 'Coastal West Africa',
      records: '1.2M',
      uploadDate: 'Nov 05, 2023',
      status: 'Processing',
      format: 'GeoJSON',
      size: '120.5 MB',
      icon: 'waves',
      iconColor: 'text-[#785500]',
      iconBg: 'bg-[#785500]/10',
    },
    {
      id: 'ds-3',
      name: 'Ghana Drought Index',
      region: 'Gulf of Guinea',
      records: '3.8M',
      uploadDate: 'Dec 01, 2023',
      status: 'Failed',
      format: 'NetCDF',
      size: '890.1 MB',
      icon: 'landscape',
      iconColor: 'text-[#A65A35]',
      iconBg: 'bg-[#A65A35]/10',
    },
    {
      id: 'ds-4',
      name: 'Ivory Coast Reforestation',
      region: 'Upper Guinea',
      records: '85k',
      uploadDate: 'Jan 14, 2024',
      status: 'Verified',
      format: 'TIFF',
      size: '2.4 GB',
      icon: 'forest',
      iconColor: 'text-[#396847]',
      iconBg: 'bg-[#B8ECC2]/30',
    },
  ]);

  // Modal State for Upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalDatasetName, setModalDatasetName] = useState('West_Africa_Rainfall_v2');
  const [modalRegion, setModalRegion] = useState('West Africa');
  const [modalDescription, setModalDescription] = useState('');
  const [modalProgress, setModalProgress] = useState(75);
  const [modalFileName, setModalFileName] = useState('West_Africa_Rainfall_v2.csv');

  // Animated progress bar effect inside modal
  useEffect(() => {
    if (!isUploadModalOpen) return;
    const interval = setInterval(() => {
      setModalProgress((prev) => (prev < 99 ? prev + 1 : 99));
    }, 400);
    return () => clearInterval(interval);
  }, [isUploadModalOpen]);

  // AI Climate Analysis State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>(
    'Evaluate drought vulnerability and monsoon onset shift for West Africa over 2026-2030.'
  );

  const handleRunAiAnalysis = async () => {
    setAiLoading(true);
    setAiReport(null);

    try {
      const res = await fetch('/api/climate-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: selectedRegion.name + ' (' + selectedRegion.country + ')',
          metricType: 'Temperature & Monsoonal Precipitation Anomaly',
          forecastPeriod: '2026 - 2035',
          query: userQuery,
          customParameters: {
            droughtRisk: selectedRegion.droughtRiskIndex,
            currentAccuracy: selectedModel.accuracy,
            model: selectedModel.name,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiReport(data.report);
      } else {
        setAiReport(`### Analysis Error\n${data.error || 'Failed to analyze climate parameters.'}`);
      }
    } catch (err: any) {
      setAiReport(`### System Error\nUnable to connect to EcoPredict AI backend server: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const triggerToast = (msg: string) => {
    setExportToast(msg);
    setTimeout(() => setExportToast(null), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setModalFileName(file.name);
      setModalDatasetName(file.name.replace(/\.[^/.]+$/, ''));
      setIsUploadModalOpen(true);
    }
  };

  const handleConfirmUpload = () => {
    const newDs: DatasetItem = {
      id: `ds-${Date.now()}`,
      name: modalDatasetName || 'Uploaded Dataset',
      region: modalRegion,
      records: `${Math.floor(Math.random() * 500 + 100)}k`,
      uploadDate: 'Just now',
      status: 'Verified',
      format: modalFileName.endsWith('.nc') ? 'NetCDF' : modalFileName.endsWith('.tiff') ? 'TIFF' : 'CSV',
      size: `${(Math.random() * 80 + 10).toFixed(1)} MB`,
      icon: 'cloud_done',
      iconColor: 'text-[#2C4D03]',
      iconBg: 'bg-[#B8ECC2]/30',
    };
    setDatasets([newDs, ...datasets]);
    setIsUploadModalOpen(false);
    triggerToast(`Dataset "${newDs.name}" uploaded successfully!`);
  };

  const handleDeleteDataset = (id: string, name: string) => {
    setDatasets(datasets.filter((d) => d.id !== id));
    triggerToast(`Removed dataset "${name}"`);
  };

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(datasetSearch.toLowerCase()) ||
      ds.region.toLowerCase().includes(datasetSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ds.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1B1C1A] flex font-sans overflow-x-hidden selection:bg-[#43651C] selection:text-white">
      {/* Notification Toast */}
      {exportToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#2C4D03] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#43651C] animate-fadeIn">
          <span className="material-symbols-outlined text-[#B8ECC2]">check_circle</span>
          <div className="text-xs font-bold">{exportToast}</div>
        </div>
      )}

      {/* SideNavBar (Authenticated Shell - Collapsable Width) */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#FBF9F5] border-r border-[#E8E3DA] flex flex-col py-6 z-50 select-none transition-all duration-300 ${
          isSidebarCollapsed ? 'w-[72px] px-2' : 'w-[280px] px-4'
        }`}
      >
        {/* Sidebar Header / Logo + Collapse Toggle */}
        <div className={`mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-[#2C4D03] text-2xl font-bold shrink-0">eco</span>
              <div>
                <h1 className="text-lg font-bold text-[#2C4D03] leading-tight whitespace-nowrap">EcoPredict AI</h1>
                <p className="text-[10px] font-medium text-[#43493C]/70 whitespace-nowrap">Climate Research Platform</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#2C4D03]/10 flex items-center justify-center shrink-0" title="EcoPredict AI">
              <span className="material-symbols-outlined text-[#2C4D03] text-2xl font-bold">eco</span>
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-[#43493C] hover:bg-[#E8E3DA] transition-colors cursor-pointer shrink-0"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-lg">
              {isSidebarCollapsed ? 'side_navigation' : 'dock_to_right'}
            </span>
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 text-xs font-medium overflow-y-auto pr-1">
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            title={isSidebarCollapsed ? 'Dashboard' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'dashboard'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">dashboard</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
          </button>

          {/* 2. Dataset Management */}
          <button
            onClick={() => setActiveTab('datasets')}
            title={isSidebarCollapsed ? 'Dataset Management' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'datasets'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">folder_open</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Dataset Management</span>}
          </button>

          {/* 3. Data Preprocessing */}
          <button
            onClick={() => setActiveTab('preprocessing')}
            title={isSidebarCollapsed ? 'Data Preprocessing' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'preprocessing'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">memory</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Data Preprocessing</span>}
          </button>

          {/* 4. Model Training */}
          <button
            onClick={() => setActiveTab('models')}
            title={isSidebarCollapsed ? 'Model Training' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'models'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">psychology</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Model Training</span>}
          </button>

          {/* 5. Prediction */}
          <button
            onClick={() => setActiveTab('prediction')}
            title={isSidebarCollapsed ? 'Climate Prediction' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'prediction'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">batch_prediction</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Climate Prediction</span>}
          </button>

          {/* 6. Model Evaluation */}
          <button
            onClick={() => setActiveTab('evaluation')}
            title={isSidebarCollapsed ? 'Model Evaluation' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'evaluation'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">assessment</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Model Evaluation</span>}
          </button>

          {/* 7. Visualizations */}
          <button
            onClick={() => setActiveTab('visualizations')}
            title={isSidebarCollapsed ? 'Visualizations' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'visualizations'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">insights</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Visualizations</span>}
          </button>

          {/* 8. Reports */}
          <button
            onClick={() => setActiveTab('reports')}
            title={isSidebarCollapsed ? 'Reports' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'reports'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">description</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Reports</span>}
          </button>

          {/* 9. Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            title={isSidebarCollapsed ? 'Settings' : undefined}
            className={`w-full flex items-center gap-3 py-2 rounded-lg transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
            } ${
              activeTab === 'settings'
                ? 'bg-[#43651C] text-[#B8E189] font-bold shadow-xs'
                : 'text-[#43493C] hover:bg-[#F5F3EF]'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">settings</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Settings</span>}
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-[#E8E3DA] space-y-2 text-xs font-medium">
          <button
            onClick={() => triggerToast('Help Center available at support@ecopredict.ai')}
            title={isSidebarCollapsed ? 'Help Center' : undefined}
            className={`w-full flex items-center gap-3 py-2.5 text-[#43493C] hover:bg-[#F5F3EF] rounded-lg transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">help</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Help Center</span>}
          </button>

          <button
            onClick={onExitPlatform}
            title={isSidebarCollapsed ? 'Log Out' : undefined}
            className={`w-full flex items-center gap-3 py-2.5 text-[#BA1A1A] hover:bg-[#FFDAD6]/30 rounded-lg transition-colors cursor-pointer font-semibold ${
              isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">logout</span>
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main
        className={`min-h-screen flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-[72px] w-[calc(100%-72px)]' : 'ml-[280px] w-[calc(100%-280px)]'
        }`}
      >
        {/* TopAppBar */}
        <header
          className={`fixed top-0 right-0 h-16 bg-white/70 backdrop-blur-md border-b border-[#E8E3DA] z-40 flex justify-between items-center px-6 transition-all duration-300 ${
            isSidebarCollapsed ? 'w-[calc(100%-72px)]' : 'w-[calc(100%-280px)]'
          }`}
        >
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {(['Research', 'Projects', 'Policy'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHeaderTab(tab)}
                  className={`text-sm font-bold pb-1 transition-all cursor-pointer ${
                    headerTab === tab
                      ? 'text-[#2C4D03] border-b-2 border-[#2C4D03]'
                      : 'text-[#43493C] hover:text-[#2C4D03]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search input */}
            <div className="relative group hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#C4C9B8] text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models or datasets..."
                className="pl-10 pr-4 py-1.5 bg-[#F5F3EF] border border-[#E8E3DA] rounded-full text-xs text-[#1B1C1A] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none w-64 transition-all group-hover:border-[#74796A]"
              />
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-[#43493C] hover:bg-[#EFEEEA] transition-colors rounded-full relative cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#BA1A1A] rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-[#E8E3DA] p-3 text-xs z-50 space-y-2 animate-fadeIn">
                  <div className="font-bold text-[#2C4D03] pb-1 border-b border-[#E8E3DA]">
                    Notifications
                  </div>
                  <div className="p-2 bg-[#F5F3EF] rounded-lg">
                    <div className="font-semibold text-[#1B1C1A]">Model Training Completed</div>
                    <div className="text-[10px] text-[#43493C]">Sahel_Precip_v4-final finalized 10 mins ago</div>
                  </div>
                  <div className="p-2 bg-[#F5F3EF] rounded-lg">
                    <div className="font-semibold text-[#1B1C1A]">Critical Anomaly Alert</div>
                    <div className="text-[10px] text-[#BA1A1A]">High confidence flood alert: Accra</div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E3DA] cursor-pointer shadow-xs shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiTDIj9xrBUSdqsihQLzZ4wwk5PzmWFHt71bi4btwm5lt7ItRQXq2dxprUHMeiMW6z0EYpIBwKVggDBLv5vuh7RI-8XB9Q6dzwBm3p6clCCrWfsUZh_l3QvUfpnH3fNJ77pj_H7gL2UJeL6E5lM6o9VqJruqXHasWHHUlL5_GMX2ZobvXU2aGck_OlhA6koSbLvfU9Ot7JVoVaNRWSI8caObz58azu70qIwXcgP0vLFU_SM1lzX5L3CQ"
                alt="Dr. Arisaka"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="mt-16 p-6 space-y-6 max-w-[1440px] mx-auto w-full">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <section className="relative overflow-hidden rounded-xl bg-[#2C4D03] text-white p-8 flex flex-col md:flex-row justify-between items-center shadow-sm">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold mb-2">Welcome Back, Dr. Arisaka</h2>
                  <p className="text-base opacity-90 mb-6 leading-relaxed">
                    Monitor regional anomalies, refine predictive climate models, and export high-fidelity research reports for West African policy makers.
                  </p>
                  <label className="bg-[#C6F096] hover:bg-[#B8E189] text-[#0F2000] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer inline-flex text-xs">
                    <span className="material-symbols-outlined text-lg">upload_file</span>
                    <span>Upload Dataset</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="hidden lg:block relative z-10 w-64 h-48 rounded-lg overflow-hidden border border-[#C6F096]/20 shadow-lg shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5LBUuOmwPuQk7a4lzokE4ydkYqdC7sfRDHoVaewyTjLFbGehe42ao0zSPKTUigKJfL_jDDl4L335zYTUpHg1TaUmK0XOzKEsijC0v6bvc4PEufVVEozxLe9WYzQDHZXrgyI4QSc1dpEhWFnudDyIW7iDeh7bTcMqSDmtRx2GHwMxt8ng169DZr1Ufl1XzLZ6NmHZkGKAdI_ZvvsQAlUj5FWlb2gkRwHrAGs0FZe1LMTQ0C7L7ceNcBQ"
                    alt="Atmospheric wind patterns and heat maps"
                    className="w-full h-full object-cover"
                  />
                </div>
              </section>

              {/* KPI Cards Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white border border-[#E8E3DA] p-6 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[#43493C] font-semibold text-xs">Total Datasets</span>
                    <span className="material-symbols-outlined text-[#2C4D03] bg-[#C6F096]/30 p-2 rounded-lg">
                      storage
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold block text-[#1B1C1A]">128</span>
                    <div className="flex items-center gap-1 mt-1 text-[#396847]">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      <span className="text-xs font-semibold">+12% this month</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white border border-[#E8E3DA] p-6 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[#43493C] font-semibold text-xs">Models Trained</span>
                    <span className="material-symbols-outlined text-[#2C4D03] bg-[#C6F096]/30 p-2 rounded-lg">
                      model_training
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold block text-[#1B1C1A]">42</span>
                    <div className="flex items-center gap-1 mt-1 text-[#396847]">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span className="text-xs font-semibold">8 Pending Review</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white border border-[#E8E3DA] p-6 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[#43493C] font-semibold text-xs">Climate Predictions</span>
                    <span className="material-symbols-outlined text-[#2C4D03] bg-[#C6F096]/30 p-2 rounded-lg">
                      online_prediction
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold block text-[#1B1C1A]">1,240</span>
                    <div className="flex items-center gap-1 mt-1 text-[#A65A35]">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <span className="text-xs font-semibold">4 Critical Anomalies</span>
                    </div>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white border border-[#E8E3DA] p-6 rounded-xl flex flex-col justify-between shadow-xs">
                  <div className="flex justify-between items-start">
                    <span className="text-[#43493C] font-semibold text-xs">Best Accuracy</span>
                    <span className="material-symbols-outlined text-[#2C4D03] bg-[#C6F096]/30 p-2 rounded-lg">
                      target
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold block text-[#1B1C1A]">98.4%</span>
                    <div className="flex items-center gap-1 mt-1 text-[#396847]">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      <span className="text-xs font-semibold">Top Performance</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Climate Overview & Activity */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Large Chart */}
                <div className="lg:col-span-8 bg-white border border-[#E8E3DA] rounded-xl p-6 flex flex-col h-[480px] shadow-xs">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#1B1C1A]">
                        West Africa: Temperature Trends
                      </h3>
                      <p className="text-xs text-[#43493C]">Sahel Regional Projection (2020 – 2030)</p>
                    </div>
                    <div className="flex gap-2">
                      {(['Daily', 'Monthly', 'Yearly'] as const).map((period) => (
                        <button
                          key={period}
                          onClick={() => setChartPeriod(period)}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                            chartPeriod === period
                              ? 'bg-[#2C4D03] text-white'
                              : 'bg-[#EFEEEA] hover:bg-[#EAE8E4] text-[#43493C]'
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Chart Visualization */}
                  <div className="flex-1 relative flex items-end overflow-hidden border-l border-b border-[#E8E3DA] pb-2 pl-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
                      <div className="border-t border-[#74796A]"></div>
                      <div className="border-t border-[#74796A]"></div>
                      <div className="border-t border-[#74796A]"></div>
                      <div className="border-t border-[#74796A]"></div>
                    </div>

                    <div className="relative w-full h-full">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 600 240">
                        {/* Area Gradient */}
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#43651C" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#43651C" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        <path
                          d="M 20 180 Q 80 160 140 120 T 260 140 T 380 60 T 500 90 T 580 40 L 580 230 L 20 230 Z"
                          fill="url(#tempGradient)"
                        />

                        <polyline
                          fill="none"
                          stroke="#2C4D03"
                          strokeWidth="3.5"
                          points="20,180 80,160 140,120 200,150 260,140 320,100 380,60 440,80 500,90 580,40"
                        />

                        {/* Peak marker */}
                        <g className="group cursor-pointer">
                          <circle
                            cx="380"
                            cy="60"
                            r="6"
                            className="fill-[#5A3F00] stroke-white stroke-2 shadow-lg"
                          />
                          <foreignObject x="320" y="10" width="120" height="40">
                            <div className="bg-[#30312E] text-[#F2F0ED] px-2 py-1 rounded text-[10px] font-semibold text-center shadow-md">
                              2023 Peak: 34.2°C
                            </div>
                          </foreignObject>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="lg:col-span-4 bg-white border border-[#E8E3DA] rounded-xl p-6 flex flex-col shadow-xs">
                  <h3 className="text-lg font-bold text-[#1B1C1A] mb-6">Recent Activity</h3>
                  <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Item 1 */}
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-[#E8E3DA]">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#B8ECC2] text-[#396847] flex items-center justify-center rounded-full z-10">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                      </div>
                      <div className="mb-1">
                        <p className="text-xs font-semibold text-[#1B1C1A]">Model Training Completed</p>
                        <p className="text-[11px] text-[#43493C]">Sahel_Precip_v4-final finalized</p>
                      </div>
                      <span className="text-[10px] text-[#74796A]">10 mins ago</span>
                    </div>

                    {/* Item 2 */}
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-[#E8E3DA]">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#C6F096] text-[#2C4D03] flex items-center justify-center rounded-full z-10">
                        <span className="material-symbols-outlined text-sm">upload</span>
                      </div>
                      <div className="mb-1">
                        <p className="text-xs font-semibold text-[#1B1C1A]">New Dataset Uploaded</p>
                        <p className="text-[11px] text-[#43493C]">Lagos_Coastline_Erosion_2024.csv</p>
                      </div>
                      <span className="text-[10px] text-[#74796A]">2 hours ago</span>
                    </div>

                    {/* Item 3 */}
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-[#E8E3DA]">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#FFDEA7] text-[#5A3F00] flex items-center justify-center rounded-full z-10">
                        <span className="material-symbols-outlined text-sm">warning</span>
                      </div>
                      <div className="mb-1">
                        <p className="text-xs font-semibold text-[#1B1C1A]">Anomaly Detected</p>
                        <p className="text-[11px] text-[#43493C]">High confidence flood alert: Accra</p>
                      </div>
                      <span className="text-[10px] text-[#74796A]">5 hours ago</span>
                    </div>

                    {/* Item 4 */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-[#E4E2DE] text-[#43493C] flex items-center justify-center rounded-full z-10">
                        <span className="material-symbols-outlined text-sm">description</span>
                      </div>
                      <div className="mb-1">
                        <p className="text-xs font-semibold text-[#1B1C1A]">Report Exported</p>
                        <p className="text-[11px] text-[#43493C]">Q4 Policy Brief - Nigeria</p>
                      </div>
                      <span className="text-[10px] text-[#74796A]">Yesterday</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Actions Grid */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <label className="group flex flex-col items-center justify-center p-6 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:shadow-sm transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-[#2C4D03] mb-3 group-hover:scale-110 transition-transform">
                    upload_file
                  </span>
                  <span className="text-xs font-bold text-[#1B1C1A]">Upload Dataset</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  onClick={() => {
                    setActiveTab('preprocessing');
                    triggerToast('Switched to Preprocessing Pipeline');
                  }}
                  className="group flex flex-col items-center justify-center p-6 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-3xl text-[#2C4D03] mb-3 group-hover:scale-110 transition-transform">
                    auto_fix_high
                  </span>
                  <span className="text-xs font-bold text-[#1B1C1A]">Preprocessing</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('models');
                    triggerToast('Initiating Model Training Setup');
                  }}
                  className="group flex flex-col items-center justify-center p-6 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-3xl text-[#2C4D03] mb-3 group-hover:scale-110 transition-transform">
                    model_training
                  </span>
                  <span className="text-xs font-bold text-[#1B1C1A]">Train Model</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('prediction');
                    triggerToast('Opening Prediction Generator');
                  }}
                  className="group flex flex-col items-center justify-center p-6 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#2C4D03] hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-3xl text-[#2C4D03] mb-3 group-hover:scale-110 transition-transform">
                    batch_prediction
                  </span>
                  <span className="text-xs font-bold text-[#1B1C1A]">Generate Prediction</span>
                </button>
              </section>

              {/* Data Tables */}
              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Model Status Table */}
                <div className="bg-white border border-[#E8E3DA] rounded-xl overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-[#E8E3DA] flex justify-between items-center bg-[#F5F3EF]">
                    <h3 className="text-sm font-bold text-[#1B1C1A]">Model Status</h3>
                    <button
                      onClick={() => setActiveTab('models')}
                      className="text-[#2C4D03] font-semibold text-xs hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F5F3EF]/50 text-[#43493C] text-[11px] font-medium border-b border-[#E8E3DA]">
                        <th className="px-6 py-2">Model Name</th>
                        <th className="px-6 py-2">Status</th>
                        <th className="px-6 py-2">Last Updated</th>
                        <th className="px-6 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3DA]">
                      <tr className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="px-6 py-3 text-xs font-bold text-[#1B1C1A]">Sahel_Precip_v4</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8ECC2] text-[#3D6C4B] text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 bg-[#396847] rounded-full animate-pulse"></span>
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-3 text-[11px] text-[#43493C]">2024-10-24 14:20</td>
                        <td className="px-6 py-3">
                          <button className="text-[#2C4D03] material-symbols-outlined text-lg cursor-pointer">
                            more_vert
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-[#FFFFFF] transition-colors">
                        <td className="px-6 py-3 text-xs font-bold text-[#1B1C1A]">Gulf_Temp_Anom_v2</td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4E2DE] text-[#43493C] text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 bg-[#74796A] rounded-full"></span>
                            Training
                          </span>
                        </td>
                        <td className="px-6 py-3 text-[11px] text-[#43493C]">2024-10-25 09:12</td>
                        <td className="px-6 py-3">
                          <button className="text-[#2C4D03] material-symbols-outlined text-lg cursor-pointer">
                            more_vert
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Recent Datasets Table */}
                <div className="bg-white border border-[#E8E3DA] rounded-xl overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-[#E8E3DA] flex justify-between items-center bg-[#F5F3EF]">
                    <h3 className="text-sm font-bold text-[#1B1C1A]">Recent Datasets</h3>
                    <button
                      onClick={() => setActiveTab('datasets')}
                      className="text-[#2C4D03] font-semibold text-xs hover:underline cursor-pointer"
                    >
                      Manage Repository
                    </button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F5F3EF]/50 text-[#43493C] text-[11px] font-medium border-b border-[#E8E3DA]">
                        <th className="px-6 py-2">Dataset Name</th>
                        <th className="px-6 py-2">Records</th>
                        <th className="px-6 py-2">Status</th>
                        <th className="px-6 py-2">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3DA]">
                      {datasets.slice(0, 4).map((ds) => (
                        <tr key={ds.id} className="hover:bg-[#FFFFFF] transition-colors">
                          <td className="px-6 py-3 text-xs font-bold text-[#1B1C1A] flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-[#2C4D03]">{ds.icon}</span>
                            <span>{ds.name}</span>
                          </td>
                          <td className="px-6 py-3 text-[11px] text-[#43493C]">{ds.records}</td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ds.status === 'Verified'
                                  ? 'bg-[#B8ECC2] text-[#3D6C4B]'
                                  : ds.status === 'Processing'
                                  ? 'bg-[#FFDEA7] text-[#5A3F00]'
                                  : 'bg-[#FFDAD6] text-[#93000A]'
                              }`}
                            >
                              {ds.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-[11px] text-[#43493C]">{ds.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Footer */}
              <footer className="mt-8 py-6 flex justify-between items-center border-t border-[#E8E3DA] opacity-70 text-xs">
                <span>© 2024 EcoPredict AI. Confidential Climate Research Data.</span>
                <div className="flex gap-4">
                  <button onClick={() => triggerToast('Privacy Policy: End-to-End Encrypted')} className="hover:underline cursor-pointer">
                    Privacy Policy
                  </button>
                  <button onClick={() => triggerToast('Terms of Service: Authorized Researchers Only')} className="hover:underline cursor-pointer">
                    Terms of Service
                  </button>
                </div>
              </footer>
            </>
          )}

          {/* TAB 2: DATASETS MANAGEMENT */}
          {activeTab === 'datasets' && (
            <div className="space-y-6">
              {/* Page Header Section */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-2">
                <div>
                  <h2 className="text-3xl font-bold text-[#1B1C1A]">Dataset Management</h2>
                  <p className="text-sm text-[#43493C] mt-1 max-w-2xl">
                    Upload, organize, and manage regional climate datasets for West African environmental analysis.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 bg-[#2C4D03] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#43651C] active:scale-95 transition-all shadow-sm text-xs shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">upload</span>
                  <span>Upload Dataset</span>
                </button>
              </div>

              {/* Summary KPI Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 border border-[#E8E3DA] rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#43493C] font-medium">Total Datasets</span>
                    <span className="material-symbols-outlined text-[#2C4D03]">folder_zip</span>
                  </div>
                  <div className="text-3xl font-bold text-[#1B1C1A]">128</div>
                  <div className="mt-2 text-xs text-[#396847] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    <span>+12 this month</span>
                  </div>
                </div>

                <div className="bg-white p-6 border border-[#E8E3DA] rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#43493C] font-medium">Total Records</span>
                    <span className="material-symbols-outlined text-[#5A3F00]">storage</span>
                  </div>
                  <div className="text-3xl font-bold text-[#1B1C1A]">4.2M</div>
                  <div className="mt-2 text-xs text-[#43493C]/70 font-normal">Across 15 regions</div>
                </div>

                <div className="bg-white p-6 border border-[#E8E3DA] rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#43493C] font-medium">Latest Upload</span>
                    <span className="material-symbols-outlined text-[#A65A35]">schedule</span>
                  </div>
                  <div className="text-sm font-bold text-[#1B1C1A] truncate">Niger Delta Rainfall</div>
                  <div className="mt-2 text-xs text-[#43493C]">Uploaded 2h ago</div>
                </div>

                <div className="bg-white p-6 border border-[#E8E3DA] rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#43493C] font-medium">Active Datasets</span>
                    <span className="material-symbols-outlined text-[#396847]">verified</span>
                  </div>
                  <div className="text-3xl font-bold text-[#1B1C1A]">84</div>
                  <div className="mt-2 inline-block">
                    <span className="text-[10px] font-bold text-[#3D6C4B] px-2 py-0.5 bg-[#B8ECC2]/40 rounded-md">
                      Healthy Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Area: Filters & Table */}
              <div className="bg-white border border-[#E8E3DA] rounded-xl shadow-xs overflow-hidden">
                {/* Filter Bar */}
                <div className="p-4 border-b border-[#E8E3DA] flex flex-wrap items-center gap-4 bg-[#F5F3EF]">
                  <div className="relative flex-1 min-w-[280px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#74796A] text-lg">
                      search
                    </span>
                    <input
                      type="text"
                      value={datasetSearch}
                      onChange={(e) => setDatasetSearch(e.target.value)}
                      placeholder="Search datasets by name or region..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E3DA] rounded-lg text-xs text-[#1B1C1A] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white border border-[#E8E3DA] rounded-lg px-3 py-2 text-xs text-[#43493C] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>Verified</option>
                      <option>Processing</option>
                      <option>Failed</option>
                    </select>

                    <select
                      value={dateRangeFilter}
                      onChange={(e) => setDateRangeFilter(e.target.value)}
                      className="bg-white border border-[#E8E3DA] rounded-lg px-3 py-2 text-xs text-[#43493C] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none cursor-pointer"
                    >
                      <option>Date Range</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last Quarter</option>
                    </select>

                    <button
                      onClick={() => triggerToast('Sorted datasets by latest updated')}
                      className="flex items-center gap-1 px-3 py-2 border border-[#E8E3DA] bg-white rounded-lg text-xs text-[#43493C] hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">sort</span>
                      <span>Sort</span>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F3EF]/60 border-b border-[#E8E3DA]">
                        <th className="px-6 py-3 text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                          Dataset Name
                        </th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                          Region
                        </th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                          Records
                        </th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                          Upload Date
                        </th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#43493C] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-[11px] font-bold text-[#43493C] uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E3DA]">
                      {filteredDatasets.map((ds) => (
                        <tr key={ds.id} className="hover:bg-[#F5F3EF]/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg ${ds.iconBg} flex items-center justify-center shrink-0`}>
                                <span className={`material-symbols-outlined ${ds.iconColor}`}>{ds.icon}</span>
                              </div>
                              <div>
                                <div className="text-xs font-bold text-[#1B1C1A]">{ds.name}</div>
                                <div className="text-[10px] text-[#43493C]">
                                  {ds.format} • {ds.size}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-[#43493C] font-medium">{ds.region}</td>
                          <td className="px-6 py-4 text-xs text-[#1B1C1A] font-semibold">{ds.records}</td>
                          <td className="px-6 py-4 text-xs text-[#43493C]">{ds.uploadDate}</td>
                          <td className="px-6 py-4">
                            {ds.status === 'Verified' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8ECC2] text-[#3D6C4B] text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 bg-[#396847] rounded-full"></span>
                                Verified
                              </span>
                            )}
                            {ds.status === 'Processing' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDEA7] text-[#5E4200] text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 bg-[#5A3F00] rounded-full animate-pulse"></span>
                                Processing
                              </span>
                            )}
                            {ds.status === 'Failed' && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFDAD6] text-[#93000A] text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 bg-[#BA1A1A] rounded-full"></span>
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => triggerToast(`Inspecting dataset details for ${ds.name}`)}
                                className="p-1.5 text-[#2C4D03] hover:bg-[#2C4D03]/10 rounded transition-colors cursor-pointer"
                                title="View Details"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                              <button
                                onClick={() => triggerToast(`Downloading ${ds.name} (${ds.size})`)}
                                className="p-1.5 text-[#43493C] hover:bg-[#E8E3DA] rounded transition-colors cursor-pointer"
                                title="Download Data"
                              >
                                <span className="material-symbols-outlined text-lg">cloud_download</span>
                              </button>
                              <button
                                onClick={() => handleDeleteDataset(ds.id, ds.name)}
                                className="p-1.5 text-[#BA1A1A] hover:bg-[#FFDAD6] rounded transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-white border-t border-[#E8E3DA] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                  <span className="text-[#43493C]">
                    Showing 1 to {filteredDatasets.length} of 128 datasets
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled
                      className="p-1.5 rounded border border-[#E8E3DA] text-[#43493C] opacity-40 cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="px-3 py-1 rounded bg-[#2C4D03] text-white font-bold text-xs">1</button>
                    <button className="px-3 py-1 rounded hover:bg-[#F5F3EF] text-[#43493C] text-xs">2</button>
                    <button className="px-3 py-1 rounded hover:bg-[#F5F3EF] text-[#43493C] text-xs">3</button>
                    <span className="px-1 text-[#74796A]">...</span>
                    <button className="px-3 py-1 rounded hover:bg-[#F5F3EF] text-[#43493C] text-xs">32</button>
                    <button className="p-1.5 rounded border border-[#E8E3DA] text-[#43493C] hover:bg-[#F5F3EF] cursor-pointer">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATA PREPROCESSING */}
          {activeTab === 'preprocessing' && (
            <DataPreprocessing
              onNavigateToModels={() => setActiveTab('models')}
              triggerToast={triggerToast}
            />
          )}

          {/* TAB 4: MODEL TRAINING */}
          {activeTab === 'models' && (
            <ModelTraining
              onNavigateToPrediction={() => setActiveTab('prediction')}
              triggerToast={triggerToast}
            />
          )}

          {/* TAB 5: CLIMATE PREDICTION */}
          {activeTab === 'prediction' && (
            <ClimatePrediction
              onNavigateToEvaluation={() => setActiveTab('evaluation')}
              triggerToast={triggerToast}
            />
          )}

          {/* TAB 6: MODEL EVALUATION */}
          {activeTab === 'evaluation' && (
            <ModelEvaluation
              onNavigateToVisualizations={() => setActiveTab('visualizations')}
              triggerToast={triggerToast}
            />
          )}

          {/* TAB 7: VISUALIZATIONS */}
          {activeTab === 'visualizations' && (
            <ClimateVisualizations triggerToast={triggerToast} />
          )}

          {/* TAB 8: REPORTS */}
          {activeTab === 'reports' && (
            <ClimateReports
              triggerToast={triggerToast}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <PlatformSettings triggerToast={triggerToast} />
          )}

          {/* TAB 5: AI ANALYST / SETTINGS */}
          {activeTab === 'ai-analyst' && (
            <div className="p-6 bg-white rounded-xl border border-[#E8E3DA] shadow-xs space-y-6">
              <div className="pb-4 border-b border-[#E8E3DA]">
                <h3 className="text-xl font-bold text-[#2C4D03] flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                  <span>Gemini Climate Science Analyst</span>
                </h3>
                <p className="text-xs text-[#43493C]">
                  Generate automated executive policy briefs and scientific summaries using Gemini 2.5 server-side AI.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1B1C1A] mb-1">Research Prompt / Scenario</label>
                  <textarea
                    rows={3}
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    className="w-full p-3 bg-[#F5F3EF] border border-[#E8E3DA] rounded-xl text-xs text-[#1B1C1A] focus:outline-none focus:ring-2 focus:ring-[#2C4D03]"
                  />
                </div>

                <button
                  onClick={handleRunAiAnalysis}
                  disabled={aiLoading}
                  className="px-6 py-3 bg-[#2C4D03] hover:bg-[#43651C] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">psychology</span>
                  <span>{aiLoading ? 'Analyzing Climate Data...' : 'Run Gemini Analysis'}</span>
                </button>

                {aiReport && (
                  <div className="p-6 bg-[#FBF9F5] border border-[#E8E3DA] rounded-xl text-xs space-y-3">
                    <div className="font-bold text-[#2C4D03] text-sm pb-2 border-b border-[#E8E3DA]">
                      Executive Scientific Brief
                    </div>
                    <div className="whitespace-pre-line text-[#1B1C1A] leading-relaxed">{aiReport}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Contextual Floating Action Button (FAB) */}
      <button
        onClick={() => {
          setActiveTab('ai-analyst');
          triggerToast('Quick Action: Gemini AI Analyst Loaded');
        }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#43651C] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group cursor-pointer border border-[#C6F096]/30"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
        <span className="absolute right-full mr-4 bg-[#30312E] text-[#F2F0ED] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none">
          Quick Create Project
        </span>
      </button>

      {/* Upload New Dataset Modal Overlay */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1C1A]/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-[#E8E3DA] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E8E3DA] flex items-center justify-between bg-[#F5F3EF]">
              <h3 className="text-base font-bold text-[#1B1C1A]">Upload New Dataset</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-[#74796A] hover:text-[#1B1C1A] p-1 rounded-lg hover:bg-[#E8E3DA] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
              {/* Drag and Drop File Upload Area */}
              <div className="border-2 border-dashed border-[#2C4D03]/30 hover:border-[#2C4D03] bg-[#F5F3EF]/50 hover:bg-[#F5F3EF] p-6 rounded-xl text-center space-y-3 transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-12 h-12 bg-[#B8ECC2]/30 text-[#2C4D03] rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1B1C1A]">
                    Drag and drop your CSV or NetCDF files here
                  </div>
                  <div className="text-[11px] text-[#43493C] mt-1">
                    or <span className="text-[#2C4D03] font-semibold underline">browse files</span> from your computer
                  </div>
                </div>
                <div className="text-[10px] text-[#74796A]">Supports .csv, .nc, .tiff, .geojson up to 2GB</div>
              </div>

              {/* Dataset Name */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C1A] mb-1.5">Dataset Name</label>
                <input
                  type="text"
                  value={modalDatasetName}
                  onChange={(e) => setModalDatasetName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] rounded-lg text-xs text-[#1B1C1A] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none"
                  placeholder="e.g. West_Africa_Rainfall_v2"
                />
              </div>

              {/* Region Selection */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C1A] mb-1.5">Region</label>
                <select
                  value={modalRegion}
                  onChange={(e) => setModalRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] rounded-lg text-xs text-[#1B1C1A] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none cursor-pointer"
                >
                  <option>West Africa</option>
                  <option>East Africa</option>
                  <option>Southeast Asia</option>
                  <option>Amazon Basin</option>
                  <option>Coastal West Africa</option>
                  <option>Sahel</option>
                  <option>Gulf of Guinea</option>
                </select>
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-xs font-bold text-[#1B1C1A] mb-1.5">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Describe the source and intent of this data..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8E3DA] rounded-lg text-xs text-[#1B1C1A] focus:ring-2 focus:ring-[#2C4D03] focus:outline-none"
                ></textarea>
              </div>

              {/* Progress Bar */}
              <div className="bg-[#F5F3EF] p-4 rounded-xl space-y-2 border border-[#E8E3DA]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#1B1C1A] truncate max-w-[280px]">
                    Uploading {modalFileName}
                  </span>
                  <span className="font-bold text-[#2C4D03]">{modalProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#E8E3DA] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2C4D03] rounded-full transition-all duration-300"
                    style={{ width: `${modalProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#E8E3DA] bg-[#F5F3EF] flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-[#E8E3DA] bg-white rounded-lg text-xs font-bold text-[#43493C] hover:bg-[#E8E3DA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                className="flex items-center gap-2 px-5 py-2 bg-[#2C4D03] text-white rounded-lg text-xs font-bold hover:bg-[#43651C] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">cloud_upload</span>
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
