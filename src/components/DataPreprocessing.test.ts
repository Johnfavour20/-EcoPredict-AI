import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveDatasetContext } from './DataPreprocessing';

test('resolveDatasetContext falls back safely when no valid dataset is selected', () => {
  const result = resolveDatasetContext(
    null,
    [
      { id: 'ds-1', name: 'Dataset A', region: 'Sahel', uploadedDate: 'Oct 12, 2023', records: '10', totalRecordsNum: 10, featuresCount: 2, missingValues: 0, size: '1 KB', status: 'Verified', outputName: 'dataset_a' },
    ],
    'missing-dataset'
  );

  assert.equal(result.selectedDatasetId, 'ds-1');
  assert.equal(result.selectedDataset?.name, 'Dataset A');
  assert.equal(result.sourceDataset?.name, 'Dataset A');
});

test('resolveDatasetContext prioritizes uploaded data when present', () => {
  const uploadedDataset = {
    name: 'Uploaded rainfall',
    region: 'West Africa',
    rows: [{ timestamp: '2024-01-01', temperature_c: '28.1', rainfall_mm: '12.5' }],
    columns: ['timestamp', 'temperature_c', 'rainfall_mm'],
    climateColumns: [
      { name: 'timestamp', type: 'date' },
      { name: 'temperature_c', type: 'temperature' },
      { name: 'rainfall_mm', type: 'precipitation' },
    ],
  };

  const result = resolveDatasetContext(
    uploadedDataset,
    [
      { id: 'ds-1', name: 'Dataset A', region: 'Sahel', uploadedDate: 'Oct 12, 2023', records: '10', totalRecordsNum: 10, featuresCount: 2, missingValues: 0, size: '1 KB', status: 'Verified', outputName: 'dataset_a' },
    ],
    'ds-1'
  );

  assert.equal(result.selectedDatasetId, 'uploaded-dataset');
  assert.equal(result.sourceDataset?.name, 'Uploaded rainfall');
  assert.equal(result.datasetOptions[0].id, 'uploaded-dataset');
});
