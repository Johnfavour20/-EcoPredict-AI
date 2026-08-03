import { WestAfricaRegion, ClimateMetric, ModelPreset } from '../types';

export const HOTLINK_IMAGES = {
  // Hero dashboard mockup from prompt HTML
  dashboardMockup: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2SyhHetQRZioKLYvC1GcRcpcJTi5pgTZZckwRh7AenryWMKVCQ13y4IQwyH7GqmrfyDafq4tTbdBFPdb-Dq0aJ0NeDoJU-WCZu0bUYV-0pothQbzSHKikrr83sJCWNOjHIFCbEYYbMKrOGGCyfNfjFR52pW03Dhpk2K1Xi-XD7ZGGXFA4Br7U6ovGn1NSttzzis1BGave0mQn-XbWnwTcWt9Q3nl54FzGLAXIadE8GkqlwMRJn2z-oA",
  // Environmental research photography from prompt HTML
  researchPhoto: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnEgogzIZNHsGDwRFI0OIYzEMIHVuoDz91bT900o94N-oO2RZwn-CR6b7JPc8doyhpZQVUZGr--FE9Nir5jI6i9ch6q2Nk6KaxEzNKnIpHrRapvy5KD-DTviENv6ickOzjPcIYpwoMXpVy4qaqgoJTrBEL3BlB5zYFOjhmbzusHkGakXguSrF4u-d9-yOM8mQfxaAX6FIHOoZmVDBj-kb_-U03OXVyLEzQULMddVWAISWhO7YLjgq1KA"
};

export const WEST_AFRICA_REGIONS: WestAfricaRegion[] = [
  {
    id: 'sahel-central',
    name: 'Sahel Semi-Arid Belt',
    country: 'Niger / Mali / Burkina Faso',
    latitude: 15.2,
    longitude: 2.1,
    avgTemp: 29.8,
    annualRainfall: 420,
    droughtRiskIndex: 'High',
    monsoonOnsetDay: 168,
    historicalAccuracy: 95.1
  },
  {
    id: 'guinea-coast',
    name: 'Guinea Coastal Forest & Savannah',
    country: 'Ghana / Côte d\'Ivoire / Togo',
    latitude: 6.8,
    longitude: -1.5,
    avgTemp: 26.4,
    annualRainfall: 1450,
    droughtRiskIndex: 'Moderate',
    monsoonOnsetDay: 112,
    historicalAccuracy: 96.4
  },
  {
    id: 'niger-delta',
    name: 'Niger River Basin & Delta',
    country: 'Nigeria',
    latitude: 5.5,
    longitude: 6.2,
    avgTemp: 27.2,
    annualRainfall: 2100,
    droughtRiskIndex: 'Low',
    monsoonOnsetDay: 95,
    historicalAccuracy: 94.2
  },
  {
    id: 'senegal-valley',
    name: 'Senegal River Basin',
    country: 'Senegal / Mauritania',
    latitude: 16.1,
    longitude: -14.2,
    avgTemp: 28.5,
    annualRainfall: 380,
    droughtRiskIndex: 'Severe',
    monsoonOnsetDay: 185,
    historicalAccuracy: 93.8
  },
  {
    id: 'lake-chad',
    name: 'Lake Chad Hydrological Zone',
    country: 'Chad / N.E. Nigeria / Cameroon',
    latitude: 13.0,
    longitude: 14.5,
    avgTemp: 30.1,
    annualRainfall: 310,
    droughtRiskIndex: 'Severe',
    monsoonOnsetDay: 175,
    historicalAccuracy: 92.9
  }
];

export const HISTORICAL_CLIMATE_METRICS: ClimateMetric[] = [
  { year: 2018, temperatureAnomaly: +0.42, rainfall: 890, predictedTemp: +0.40, predictedRainfall: 885, confidenceLower: 850, confidenceUpper: 920 },
  { year: 2019, temperatureAnomaly: +0.58, rainfall: 910, predictedTemp: +0.55, predictedRainfall: 900, confidenceLower: 870, confidenceUpper: 935 },
  { year: 2020, temperatureAnomaly: +0.71, rainfall: 845, predictedTemp: +0.69, predictedRainfall: 850, confidenceLower: 810, confidenceUpper: 890 },
  { year: 2021, temperatureAnomaly: +0.84, rainfall: 820, predictedTemp: +0.81, predictedRainfall: 830, confidenceLower: 790, confidenceUpper: 870 },
  { year: 2022, temperatureAnomaly: +0.96, rainfall: 795, predictedTemp: +0.93, predictedRainfall: 800, confidenceLower: 760, confidenceUpper: 840 },
  { year: 2023, temperatureAnomaly: +1.12, rainfall: 815, predictedTemp: +1.08, predictedRainfall: 810, confidenceLower: 775, confidenceUpper: 845 },
  { year: 2024, temperatureAnomaly: +1.28, rainfall: 780, predictedTemp: +1.25, predictedRainfall: 785, confidenceLower: 740, confidenceUpper: 825 },
  { year: 2025, temperatureAnomaly: +1.39, rainfall: 765, predictedTemp: +1.37, predictedRainfall: 770, confidenceLower: 725, confidenceUpper: 815 },
  { year: 2026, temperatureAnomaly: +1.51, rainfall: 740, predictedTemp: +1.50, predictedRainfall: 745, confidenceLower: 700, confidenceUpper: 790 },
  { year: 2027, temperatureAnomaly: +1.64, rainfall: 725, predictedTemp: +1.62, predictedRainfall: 730, confidenceLower: 685, confidenceUpper: 775 }
];

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'm-ann-west-africa',
    name: 'ANN Regional Climate Network',
    algorithm: 'Artificial Neural Network (ANN)',
    r2: 0.938,
    mae: 0.18,
    rmse: 0.24,
    status: 'Trained & Operational',
    lastUpdated: '2026-08-01',
    datasetUsed: 'West Africa Climate Dataset (2020–2025)'
  },
  {
    id: 'm-linear-baseline',
    name: 'Multivariate Linear Regression Model',
    algorithm: 'Linear Regression',
    r2: 0.864,
    mae: 0.35,
    rmse: 0.42,
    status: 'Trained & Operational',
    lastUpdated: '2026-07-28',
    datasetUsed: 'West Africa Climate Dataset (2020–2025)'
  },
  {
    id: 'm-ann-sahel',
    name: 'ANN Sahel Precipitation Model',
    algorithm: 'Artificial Neural Network (ANN)',
    r2: 0.912,
    mae: 0.21,
    rmse: 0.28,
    status: 'Trained & Operational',
    lastUpdated: '2026-07-15',
    datasetUsed: 'Sahel Precipitation & Drought Index'
  },
  {
    id: 'm-linear-coastal',
    name: 'Coastal Linear Trend Model',
    algorithm: 'Linear Regression',
    r2: 0.842,
    mae: 0.38,
    rmse: 0.48,
    status: 'Idle',
    lastUpdated: '2026-06-10',
    datasetUsed: 'Lagos Coastal Erosion & Surge Telemetry'
  }
];
