export type ActiveView = 'landing' | 'platform' | 'about' | 'features' | 'login' | 'register' | 'forgot-password' | 'check-email' | 'reset-password' | 'password-reset-success';

export type PlatformTab = 
  | 'dashboard' 
  | 'datasets' 
  | 'preprocessing' 
  | 'models' 
  | 'prediction' 
  | 'evaluation' 
  | 'visualizations' 
  | 'reports'
  | 'settings';

export interface WestAfricaRegion {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  avgTemp: number; // in Celsius
  annualRainfall: number; // in mm
  droughtRiskIndex: 'Low' | 'Moderate' | 'High' | 'Severe';
  monsoonOnsetDay: number; // Day of year
  historicalAccuracy: number; // %
}

export interface ClimateMetric {
  year: number;
  temperatureAnomaly: number;
  rainfall: number;
  predictedTemp: number;
  predictedRainfall: number;
  confidenceLower: number;
  confidenceUpper: number;
}

export interface ModelPreset {
  id: string;
  name: string;
  algorithm: 'Linear Regression' | 'Artificial Neural Network (ANN)';
  r2: number; // Coefficient of Determination (0 to 1)
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Squared Error
  status: 'Trained & Operational' | 'Training' | 'Idle';
  lastUpdated: string;
  datasetUsed: string;
}

export interface AnalysisReport {
  id: string;
  region: string;
  metricType: string;
  reportMarkdown: string;
  timestamp: string;
}
