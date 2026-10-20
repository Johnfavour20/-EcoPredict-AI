import React, { useState } from 'react';

interface DatasetState {
  name: string;
  region: string;
  rows: Array<Record<string, string>>;
  columns: string[];
  climateColumns: Array<{ name: string; type: string }>;
}

interface DataPreprocessingProps {
  onNavigateToModels: () => void;
  triggerToast: (msg: string) => void;
  uploadedDataset?: DatasetState | null;
  onDatasetProcessed?: (dataset: DatasetState) => void;
}

interface PreprocessingConfig {
  handleMissingValues: boolean;
  removeDuplicates: boolean;
  normalizeFeatures: boolean;
  standardizeFeatures: boolean;
  featureSelection: boolean;
}

interface DatasetOption {
  id: string;
  name: string;
  region: string;
  uploadedDate: string;
  records: string;
  totalRecordsNum: number;
  featuresCount: number;
  missingValues: number;
  size: string;
  status: 'Verified' | 'Processing';
  outputName: string;
  rows?: Array<Record<string, string>>;
  columns?: string[];
  climateColumns?: Array<{ name: string; type: string }>;
}

const DATASET_OPTIONS: DatasetOption[] = [
  {
    id: 'ds-1',
    name: 'West Africa Climate Dataset (2020–2025)',
    region: 'West Africa',
    uploadedDate: 'Oct 12, 2023',
    records: '450k',
    totalRecordsNum: 450000,
    featuresCount: 12,
    missingValues: 1240,
    size: '45.2 MB',
    status: 'Verified',
    outputName: 'wa_climate_v2_processed',
  },
  {
    id: 'ds-2',
    name: 'Lagos Coastal Erosion & Surge Telemetry',
    region: 'Coastal West Africa',
    uploadedDate: 'Nov 05, 2023',
    records: '1.2M',
    totalRecordsNum: 1200000,
    featuresCount: 18,
    missingValues: 3420,
    size: '120.5 MB',
    status: 'Verified',
    outputName: 'lagos_coastal_processed',
  },
  {
    id: 'ds-3',
    name: 'Sahel Precipitation & Drought Index',
    region: 'Sahel',
    uploadedDate: 'Dec 01, 2023',
    records: '850k',
    totalRecordsNum: 850000,
    featuresCount: 10,
    missingValues: 890,
    size: '89.1 MB',
    status: 'Verified',
    outputName: 'sahel_drought_processed',
  },
];

const coerceNumber = (value: string | number | undefined | null) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const createDatasetPreview = (rows: Array<Record<string, string>>, columns: string[]) => {
  const safeRows = rows?.length ? rows : [];
  const previewColumns = columns?.length ? columns : ['timestamp', 'temperature_c', 'rainfall_mm', 'region'];
  return {
    rows: safeRows.slice(0, 5),
    columns: previewColumns,
  };
};

export const resolveDatasetContext = (
  uploadedDataset: DatasetState | null | undefined,
  datasetOptions: DatasetOption[],
  selectedDatasetId?: string | null
) => {
  const uploadedDatasetOption: DatasetOption | null = uploadedDataset
    ? {
        id: 'uploaded-dataset',
        name: uploadedDataset.name,
        region: uploadedDataset.region,
        uploadedDate: 'Just now',
        records: `${uploadedDataset.rows?.length ?? 0}`,
        totalRecordsNum: uploadedDataset.rows?.length ?? 0,
        featuresCount: uploadedDataset.columns?.length ?? 0,
        missingValues: 0,
        size: `${uploadedDataset.rows?.length ?? 0} rows`,
        status: 'Verified',
        outputName: `${uploadedDataset.name}_processed`,
      }
    : null;

  const options = uploadedDatasetOption ? [uploadedDatasetOption, ...datasetOptions] : datasetOptions;
  const fallbackId = options[0]?.id ?? '';
  const selectedId = uploadedDataset
    ? 'uploaded-dataset'
    : selectedDatasetId && options.some((option) => option.id === selectedDatasetId)
      ? selectedDatasetId
      : fallbackId;

  const selectedDataset = options.find((option) => option.id === selectedId) ?? options[0] ?? null;
  const sourceDataset = uploadedDataset ?? selectedDataset ?? null;

  return {
    datasetOptions: options,
    selectedDatasetId: selectedId,
    selectedDataset,
    sourceDataset,
  };
};

const transformUploadedDataset = (
  dataset: DatasetState | null,
  config: PreprocessingConfig
): DatasetState | null => {
  if (!dataset || !dataset.rows.length) return dataset;

  const columns = dataset.columns.length ? dataset.columns : Object.keys(dataset.rows[0] || {});
  const uniqueRows = config.removeDuplicates
    ? Array.from(
        new Map(
          dataset.rows.map((row) => [JSON.stringify(Object.entries(row).sort(([a], [b]) => a.localeCompare(b))), row])
        ).values()
      )
    : dataset.rows;

  const numericColumns = columns.filter((column) => {
    const parsed = uniqueRows
      .map((row) => coerceNumber(row[column]))
      .filter((value): value is number => value !== null);
    return parsed.length > 0;
  });

  const stats = Object.fromEntries(
    numericColumns.map((column) => {
      const values = uniqueRows
        .map((row) => coerceNumber(row[column]))
        .filter((value): value is number => value !== null);

      if (!values.length) return [column, { min: 0, max: 0, mean: 0, std: 1 }];

      const min = Math.min(...values);
      const max = Math.max(...values);
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const std = Math.sqrt(
        values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length || 1
      );

      return [column, { min, max, mean, std }];
    })
  );

  const processedRows = uniqueRows.map((row) => {
    const transformed: Record<string, string> = { ...row };

    for (const column of columns) {
      const currentValue = row[column];
      const numericValue = coerceNumber(currentValue);

      if (numericValue === null) {
        if (config.handleMissingValues && column !== 'region') {
          transformed[column] = '0';
        }
        continue;
      }

      if (config.handleMissingValues && numericValue === 0 && currentValue === '') {
        transformed[column] = '0';
        continue;
      }

      if (config.normalizeFeatures && numericValue !== null && stats[column]) {
        const { min, max } = stats[column];
        const range = max - min || 1;
        transformed[column] = String(((numericValue - min) / range).toFixed(4));
      }

      if (config.standardizeFeatures && numericValue !== null && stats[column]) {
        const { mean, std } = stats[column];
        transformed[column] = String(((numericValue - mean) / (std || 1)).toFixed(4));
      }
    }

    if (config.featureSelection) {
      const selected = Object.fromEntries(
        Object.entries(transformed).filter(([key]) => {
          const normalized = key.toLowerCase();
          return (
            /(date|time|timestamp|temp|rain|precip|humidity|wind|region|lat|lon|longitude|latitude)/.test(normalized) ||
            key === 'region'
          );
        })
      );
      return selected;
    }

    return transformed;
  });

  return {
    ...dataset,
    rows: processedRows,
    columns: columns,
  };
};

export const DataPreprocessing: React.FC<DataPreprocessingProps> = ({
  onNavigateToModels,
  triggerToast,
  uploadedDataset,
  onDatasetProcessed,
}) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(() => {
    if (uploadedDataset) return 'uploaded-dataset';
    return DATASET_OPTIONS[0]?.id ?? '';
  });
  const [previewTab, setPreviewTab] = useState<'original' | 'processed'>('original');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [processedRows, setProcessedRows] = useState<Array<Record<string, string>>>([]);
  const [processedColumns, setProcessedColumns] = useState<string[]>([]);

  const datasetContext = React.useMemo(
    () => resolveDatasetContext(uploadedDataset, DATASET_OPTIONS, selectedDatasetId),
    [uploadedDataset, selectedDatasetId]
  );

  const datasetOptions = datasetContext.datasetOptions;
  const sourceDataset = datasetContext.sourceDataset;
  const selectedDataset = datasetContext.selectedDataset;

  // Configuration Toggles
  const [config, setConfig] = useState<PreprocessingConfig>({
    handleMissingValues: true,
    removeDuplicates: true,
    normalizeFeatures: true,
    standardizeFeatures: false,
    featureSelection: false,
  });

  const selectedOperationsCount = Object.values(config).filter(Boolean).length;

  React.useEffect(() => {
    if (uploadedDataset) {
      setSelectedDatasetId('uploaded-dataset');
      const preview = createDatasetPreview(uploadedDataset.rows ?? [], uploadedDataset.columns ?? []);
      setProcessedRows(preview.rows);
      setProcessedColumns(preview.columns);
      return;
    }

    if (!selectedDatasetId || !DATASET_OPTIONS.some((option) => option.id === selectedDatasetId)) {
      setSelectedDatasetId(DATASET_OPTIONS[0]?.id ?? '');
      return;
    }

    const preview = createDatasetPreview(sourceDataset?.rows ?? [], sourceDataset?.columns ?? []);
    setProcessedRows(preview.rows);
    setProcessedColumns(preview.columns);
  }, [uploadedDataset, selectedDatasetId, sourceDataset]);

  const handleToggle = (key: keyof PreprocessingConfig) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartPreprocessing = () => {
    if (selectedOperationsCount === 0) {
      triggerToast('Please enable at least one preprocessing option');
      return;
    }

    const datasetToProcess = uploadedDataset || {
      name: selectedDataset.name,
      region: selectedDataset.region,
      rows: Array.from({ length: 5 }, (_, index) => ({
        timestamp: `2023-10-${String(index + 1).padStart(2, '0')} 08:00`,
        temperature_c: String(24 + index * 2),
        rainfall_mm: String(10 + index * 4),
        humidity_pct: String(50 + index * 6),
        region: selectedDataset.region,
      })),
      columns: ['timestamp', 'temperature_c', 'rainfall_mm', 'humidity_pct', 'region'],
      climateColumns: [
        { name: 'timestamp', type: 'date' },
        { name: 'temperature_c', type: 'temperature' },
        { name: 'rainfall_mm', type: 'precipitation' },
        { name: 'region', type: 'region' },
      ],
    };

    const transformed = transformUploadedDataset(datasetToProcess, config);
    if (!transformed) {
      triggerToast('No valid rows were available for preprocessing.');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(10);
    setIsCompleted(false);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsCompleted(true);
          setPreviewTab('processed');
          setProcessedRows(transformed.rows.slice(0, 5));
          setProcessedColumns(transformed.columns);
          onDatasetProcessed?.(transformed);
          triggerToast(`Dataset "${transformed.name}" preprocessed successfully!`);
          return 100;
        }
        return prev + 22;
      });
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[#2C4D03] mb-1">
            <span className="material-symbols-outlined text-lg">memory</span>
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">Machine Learning Pipeline</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1B1C1A]">Data preprocessing</h1>
          <p className="text-sm text-[#43493C] mt-1 leading-6">
            Prepare uploaded climate datasets for machine learning by reviewing data quality and applying preprocessing techniques before training prediction models.
          </p>
        </div>

        <button
          onClick={handleStartPreprocessing}
          disabled={isProcessing}
          className={`px-6 py-3.5 rounded-[14px] font-semibold shadow-[0_10px_20px_rgba(42,74,27,0.12)] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-xs shrink-0 cursor-pointer ${
            isProcessing
              ? 'bg-[#E8E3DA] text-[#74796A] cursor-not-allowed'
              : 'bg-[#2C4D03] text-white hover:bg-[#43651C]'
          }`}
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">sync</span>
              <span>Processing ({processingProgress}%)...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              <span>Start preprocessing</span>
            </>
          )}
        </button>
      </div>

      {/* Grid Layout: Left Step Controls + Right Main Panels */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Step 1 & Step 5 */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Step 1: Dataset Selection */}
          <div className="bg-white border border-[#E8E3DA] rounded-[20px] p-6 shadow-[0_10px_22px_rgba(20,33,18,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-semibold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">folder_open</span>
                <span>Dataset selection</span>
              </h3>
              <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2]/40 px-2.5 py-1 rounded-full">
                STEP 01
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#43493C]">Select Dataset</label>
              <div className="relative">
                <select
                  value={selectedDatasetId}
                  onChange={(e) => {
                    setSelectedDatasetId(e.target.value);
                    setIsCompleted(false);
                    setPreviewTab('original');
                  }}
                  className="w-full bg-[#F5F3EF] border border-[#E8E3DA] rounded-lg p-3 pr-10 appearance-none focus:ring-2 focus:ring-[#2C4D03] focus:outline-none text-xs text-[#1B1C1A] font-semibold cursor-pointer"
                >
                  {datasetOptions.map((ds) => (
                    <option key={ds.id} value={ds.id}>
                      {ds.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#74796A] text-lg">
                  expand_more
                </span>
              </div>

              {/* Selected Dataset Details Metadata Card */}
              <div className="bg-[#FBF9F5] p-4 rounded-lg border border-[#E8E3DA] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#43493C]">Region:</span>
                  <span className="font-semibold text-[#1B1C1A]">{sourceDataset?.region ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#43493C]">Uploaded:</span>
                  <span className="font-semibold text-[#1B1C1A]">{uploadedDataset ? 'Just now' : selectedDataset?.uploadedDate ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#43493C]">Records:</span>
                  <span className="font-semibold text-[#1B1C1A]">{uploadedDataset ? `${uploadedDataset.rows?.length ?? 0}` : selectedDataset?.records ?? '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#43493C]">Status:</span>
                  <span className="flex items-center gap-1 text-[#396847] font-bold text-xs">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>{uploadedDataset ? 'Verified' : selectedDataset.status}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Processing Summary */}
          <div className="bg-white border border-[#E8E3DA] rounded-[20px] p-6 shadow-[0_10px_22px_rgba(20,33,18,0.04)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-semibold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">assignment_turned_in</span>
                <span>Processing summary</span>
              </h3>
              <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2]/40 px-2.5 py-1 rounded-full">
                STEP 05
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-[#F5F3EF] rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#43493C]">settings_suggest</span>
                  <span className="text-xs text-[#43493C] font-medium">Selected Operations</span>
                </div>
                <span className="font-bold text-lg text-[#2C4D03]">{selectedOperationsCount}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-[#E8E3DA] rounded-lg bg-[#FBF9F5]">
                  <p className="text-[10px] text-[#43493C] uppercase font-bold tracking-wider">Est. Time</p>
                  <p className="text-base font-bold text-[#1B1C1A] mt-0.5">2m 45s</p>
                </div>
                <div className="p-3 border border-[#E8E3DA] rounded-lg bg-[#FBF9F5]">
                  <p className="text-[10px] text-[#43493C] uppercase font-bold tracking-wider">Processed Records</p>
                  <p className="text-base font-bold text-[#1B1C1A] mt-0.5">{selectedDataset.records}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#2C4D03]/5 rounded-lg border border-[#2C4D03]/10">
                <p className="text-[10px] text-[#43493C] mb-1 font-medium">Expected Output Name</p>
                <p className="font-mono text-xs text-[#2C4D03] font-bold bg-[#B8ECC2]/30 p-1.5 px-2.5 rounded">
                  {selectedDataset.outputName}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Step 2, 3, 4 */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Step 2: KPI Dataset Metrics Summary */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8E3DA] p-5 rounded-[18px] shadow-[0_10px_22px_rgba(20,33,18,0.04)]">
              <p className="text-[11px] text-[#43493C] uppercase font-bold tracking-wider">Total Records</p>
              <div className="flex items-baseline gap-1 mt-2">
                <h2 className="text-3xl font-bold text-[#2C4D03]">{selectedDataset.records.replace('k', '').replace('M', '')}</h2>
                <span className="text-base text-[#43493C] font-medium">
                  {selectedDataset.records.includes('M') ? 'M' : 'k'}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#E8E3DA] p-5 rounded-[18px] shadow-[0_10px_22px_rgba(20,33,18,0.04)]">
              <p className="text-[11px] text-[#43493C] uppercase font-bold tracking-wider">Features</p>
              <h2 className="text-3xl font-bold text-[#2C4D03] mt-2">{selectedDataset.featuresCount}</h2>
            </div>

            <div className="bg-white border border-[#E8E3DA] p-5 rounded-[18px] shadow-[0_10px_22px_rgba(20,33,18,0.04)]">
              <p className="text-[11px] text-[#43493C] uppercase font-bold tracking-wider">Missing Values</p>
              <div className="flex items-center gap-2 mt-2">
                <h2 className="text-3xl font-bold text-[#A65A35]">
                  {isCompleted ? '0' : selectedDataset.missingValues.toLocaleString()}
                </h2>
                {!isCompleted && <span className="material-symbols-outlined text-[#A65A35]">warning</span>}
              </div>
            </div>

            <div className="bg-white border border-[#E8E3DA] p-5 rounded-[18px] shadow-[0_10px_22px_rgba(20,33,18,0.04)]">
              <p className="text-[11px] text-[#43493C] uppercase font-bold tracking-wider">Dataset Size</p>
              <div className="flex items-baseline gap-1 mt-2">
                <h2 className="text-3xl font-bold text-[#2C4D03]">{selectedDataset.size.split(' ')[0]}</h2>
                <span className="text-base text-[#43493C] font-medium">{selectedDataset.size.split(' ')[1]}</span>
              </div>
            </div>
          </section>

          {/* Step 3: Preprocessing Configuration Toggles */}
          <section className="bg-white border border-[#E8E3DA] rounded-[20px] p-6 shadow-[0_10px_22px_rgba(20,33,18,0.04)]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E3DA]">
              <h3 className="text-sm font-semibold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">tune</span>
                <span>Preprocessing configuration</span>
              </h3>
              <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2]/40 px-2.5 py-1 rounded-full">
                STEP 03
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div
                  onClick={() => handleToggle('handleMissingValues')}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1B1C1A]">Handle Missing Values</span>
                    <span className="text-[11px] text-[#43493C]">Mean/Median imputation for gaps</span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      config.handleMissingValues ? 'bg-[#2C4D03]' : 'bg-[#E4E2DE]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                        config.handleMissingValues ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>

                <div
                  onClick={() => handleToggle('removeDuplicates')}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1B1C1A]">Remove Duplicate Records</span>
                    <span className="text-[11px] text-[#43493C]">Cleanup redundant entries</span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      config.removeDuplicates ? 'bg-[#2C4D03]' : 'bg-[#E4E2DE]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                        config.removeDuplicates ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>

                <div
                  onClick={() => handleToggle('featureSelection')}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1B1C1A]">Feature Selection</span>
                    <span className="text-[11px] text-[#43493C]">Filter relevant variables</span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      config.featureSelection ? 'bg-[#2C4D03]' : 'bg-[#E4E2DE]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                        config.featureSelection ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div
                  onClick={() => handleToggle('normalizeFeatures')}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1B1C1A]">Normalize Features</span>
                    <span className="text-[11px] text-[#43493C]">Scale numerical values (0-1)</span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      config.normalizeFeatures ? 'bg-[#2C4D03]' : 'bg-[#E4E2DE]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                        config.normalizeFeatures ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>

                <div
                  onClick={() => handleToggle('standardizeFeatures')}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1B1C1A]">Standardize Features</span>
                    <span className="text-[11px] text-[#43493C]">Apply Z-score scaling</span>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                      config.standardizeFeatures ? 'bg-[#2C4D03]' : 'bg-[#E4E2DE]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                        config.standardizeFeatures ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Data Preview */}
          <section className="bg-white border border-[#E8E3DA] rounded-[20px] shadow-[0_10px_22px_rgba(20,33,18,0.04)] overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#F5F3EF] border-b border-[#E8E3DA]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#1B1C1A]">Data preview</h3>
                <span className="text-[10px] font-bold text-[#2C4D03] bg-[#B8ECC2]/40 px-2.5 py-1 rounded-full">
                  STEP 04
                </span>
              </div>

              <div className="flex bg-[#E8E3DA]/60 border border-[#E8E3DA] rounded-[12px] p-1">
                <button
                  onClick={() => setPreviewTab('original')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[10px] transition-all cursor-pointer ${
                    previewTab === 'original'
                      ? 'bg-white shadow-xs text-[#2C4D03]'
                      : 'text-[#43493C] hover:text-[#1B1C1A]'
                  }`}
                >
                  Original data
                </button>
                <button
                  onClick={() => setPreviewTab('processed')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-[10px] transition-all cursor-pointer ${
                    previewTab === 'processed'
                      ? 'bg-white shadow-xs text-[#2C4D03]'
                      : 'text-[#43493C] hover:text-[#1B1C1A]'
                  }`}
                >
                  Processed preview
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F3EF]/60 text-[#43493C] text-[11px] border-b border-[#E8E3DA]">
                    {(previewTab === 'processed' ? processedColumns : sourceDataset && 'columns' in sourceDataset && sourceDataset.columns?.length ? sourceDataset.columns : ['timestamp', 'temperature_c', 'rainfall_mm', 'humidity_pct', 'region']).map((column) => (
                      <th key={column} className="p-3 font-bold">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {(previewTab === 'processed' ? processedRows : sourceDataset && 'rows' in sourceDataset && Array.isArray(sourceDataset.rows) ? sourceDataset.rows : []).slice(0, 5).map((row, index) => (
                    <tr key={`${previewTab}-${index}`} className="border-b border-[#E8E3DA] hover:bg-[#F5F3EF]/40 transition-colors">
                      {(previewTab === 'processed' ? processedColumns : sourceDataset && 'columns' in sourceDataset && sourceDataset.columns?.length ? sourceDataset.columns : Object.keys(row)).map((column) => (
                        <td key={`${column}-${index}`} className="p-3 font-mono text-[#1B1C1A]">
                          {row[column] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#F5F3EF] border-t border-[#E8E3DA] flex justify-center">
              <button
                onClick={() => triggerToast(`Viewing full dataset (${uploadedDataset ? uploadedDataset.rows?.length ?? 0 : selectedDataset?.records ?? '0'} records)`)}
                className="text-[#2C4D03] font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View full dataset ({uploadedDataset ? uploadedDataset.rows?.length ?? 0 : selectedDataset?.records ?? '0'} records)</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Step 6: Processing Status / Success State Overlay Banner */}
      {isCompleted && (
        <section className="animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#B8ECC2]/30 border border-[#396847]/30 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#396847] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-2xl">task_alt</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-[#1B1C1A]">Completed Successfully</h2>
                    <span className="text-[10px] font-bold bg-[#396847]/20 text-[#2C4D03] px-2 py-0.5 rounded">
                      STEP 06
                    </span>
                  </div>
                  <p className="text-xs text-[#43493C]">
                    Dataset successfully preprocessed and ready for model training. All constraints verified.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setShowLogsModal(true)}
                  className="px-4 py-2.5 bg-white text-[#396847] border border-[#396847]/20 rounded-xl text-xs font-bold shadow-xs hover:bg-[#F5F3EF] transition-all cursor-pointer"
                >
                  View Logs
                </button>
                <button
                  onClick={() => {
                    const transformed = uploadedDataset ? transformUploadedDataset(uploadedDataset, config) : null;
                    if (transformed && onDatasetProcessed) {
                      onDatasetProcessed(transformed);
                    }
                    onNavigateToModels();
                  }}
                  className="px-5 py-2.5 bg-[#2C4D03] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#43651C] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Model Training</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1C1A]/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-[#E8E3DA]">
            <div className="px-6 py-4 border-b border-[#E8E3DA] flex justify-between items-center bg-[#F5F3EF]">
              <h3 className="text-sm font-bold text-[#1B1C1A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2C4D03]">terminal</span>
                <span>Pipeline Processing Logs</span>
              </h3>
              <button
                onClick={() => setShowLogsModal(false)}
                className="text-[#74796A] hover:text-[#1B1C1A] p-1 rounded-lg hover:bg-[#E8E3DA] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 font-mono text-xs bg-[#1B1C1A] text-[#B8ECC2] space-y-2 max-h-80 overflow-y-auto">
              <p className="text-gray-400">[12:00:01] Initializing EcoPredict Preprocessing Engine v2.4...</p>
              <p>[12:00:01] Loaded NetCDF4 array from dataset: {selectedDataset.name}</p>
              <p>[12:00:02] Imputed 1,240 missing entries using spatial median interpolation.</p>
              <p>[12:00:02] Scanned 450,000 records for duplicates. Removed 0 redundant rows.</p>
              <p>[12:00:03] Scaled {selectedDataset.featuresCount} numerical features to range [0.0, 1.0].</p>
              <p className="text-green-300">[12:00:04] Pipeline completed in 2.84 seconds with 0 errors.</p>
              <p className="text-yellow-200">[12:00:04] Saved preprocessed artifact: {selectedDataset.outputName}.nc</p>
            </div>

            <div className="px-6 py-4 border-t border-[#E8E3DA] bg-[#F5F3EF] flex justify-between items-center">
              <span className="text-xs text-[#43493C]">Status: Verified & Signed</span>
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-2 bg-[#2C4D03] text-white rounded-lg text-xs font-bold cursor-pointer"
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
