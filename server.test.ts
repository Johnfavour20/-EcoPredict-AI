import test from 'node:test';
import assert from 'node:assert/strict';
import XLSX from 'xlsx';
import { analyzeDatasetBuffer } from './server';

test('parses CSV uploads into climate rows', () => {
  const csv = Buffer.from(
    'date,temperature,precipitation\n2024-01-01,27,12\n2024-01-02,28,15\n'
  );

  const dataset = analyzeDatasetBuffer(csv, 'sample.csv');

  assert.equal(dataset.rowCount, 2);
  assert.deepEqual(dataset.columns, ['date', 'temperature', 'precipitation']);
});

test('parses XLSX uploads into climate rows', () => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['date', 'temperature', 'precipitation'],
    ['2024-01-01', 27, 12],
    ['2024-01-02', 28, 15],
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const dataset = analyzeDatasetBuffer(Buffer.from(buffer), 'sample.xlsx');

  assert.equal(dataset.rowCount, 2);
  assert.equal(dataset.climateColumns.length >= 2, true);
});
