import test from 'node:test';
import assert from 'node:assert/strict';

import { buildClimateForecastFromRows, buildTrainingPayloadFromRows } from './forecast';

test('buildClimateForecastFromRows generates an actual forecast from uploaded climate rows', () => {
  const rows = [
    { timestamp: '2024-01-01', temperature_c: 27.4, rainfall_mm: 14.2, region: 'Sahel' },
    { timestamp: '2024-01-02', temperature_c: 28.1, rainfall_mm: 11.6, region: 'Sahel' },
    { timestamp: '2024-01-03', temperature_c: 26.9, rainfall_mm: 18.4, region: 'Sahel' },
    { timestamp: '2024-01-04', temperature_c: 29.5, rainfall_mm: 20.1, region: 'Sahel' },
    { timestamp: '2024-01-05', temperature_c: 30.1, rainfall_mm: 17.6, region: 'Sahel' },
    { timestamp: '2024-01-06', temperature_c: 31.2, rainfall_mm: 15.9, region: 'Sahel' },
  ];

  const result = buildClimateForecastFromRows(rows, ['timestamp', 'temperature_c', 'rainfall_mm', 'region'], [
    { name: 'timestamp', type: 'date' },
    { name: 'temperature_c', type: 'temperature' },
    { name: 'rainfall_mm', type: 'precipitation' },
    { name: 'region', type: 'region' },
  ], 'Sahel rainfall dataset');

  assert.equal(result.success, true);
  assert.equal(result.datasetName, 'Sahel rainfall dataset');
  assert.ok(result.forecast.length >= 3);
  assert.ok(result.metrics.r2 >= 0.5);
  assert.ok(result.metrics.confidence >= 70);
  assert.ok(result.summary.toLowerCase().includes('sahel'));
});

test('buildTrainingPayloadFromRows produces a real training payload from processed climate rows', () => {
  const rows = [
    { timestamp: '2024-01-01', temperature_c: 27.4, rainfall_mm: 14.2, region: 'Sahel' },
    { timestamp: '2024-01-02', temperature_c: 28.1, rainfall_mm: 11.6, region: 'Sahel' },
    { timestamp: '2024-01-03', temperature_c: 26.9, rainfall_mm: 18.4, region: 'Sahel' },
    { timestamp: '2024-01-04', temperature_c: 29.5, rainfall_mm: 20.1, region: 'Sahel' },
    { timestamp: '2024-01-05', temperature_c: 30.1, rainfall_mm: 17.6, region: 'Sahel' },
    { timestamp: '2024-01-06', temperature_c: 31.2, rainfall_mm: 15.9, region: 'Sahel' },
  ];

  const result = buildTrainingPayloadFromRows(
    rows,
    ['timestamp', 'temperature_c', 'rainfall_mm', 'region'],
    [
      { name: 'timestamp', type: 'date' },
      { name: 'temperature_c', type: 'temperature' },
      { name: 'rainfall_mm', type: 'precipitation' },
      { name: 'region', type: 'region' },
    ],
    'Sahel rainfall dataset',
    'Sahel',
    'Artificial Neural Network (ANN)',
    { epochs: 150, learningRate: 0.005, hiddenLayers: '128 x 64 x 32' }
  );

  if (result.success === false) {
    throw new Error(result.error);
  }

  assert.equal(result.model.algorithm, 'Artificial Neural Network (ANN)');
  assert.ok(result.trainingId.startsWith('TR-'));
  assert.ok(result.metrics.r2 >= 0.5);
  assert.equal(result.datasetSummary.rowCount, 6);
  assert.ok(result.forecast.length >= 3);
});
