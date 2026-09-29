export type AnomalyClass = 
  | 'Ghost Net'
  | 'Pipe'
  | 'Wreck'
  | 'Debris'
  | 'Subsea Cable'
  | 'Metal Cylinder'
  | 'Munitions / Ordnance'
  | 'Natural Rock / False Positive'
  | 'Other';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ReviewStatus = 'Pending Review' | 'Validated' | 'Reclassified' | 'Rejected';

export interface BoundingBox {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage 0-100
  height: number; // Percentage 0-100
}

export interface AcousticEvidence {
  shapeScore: number; // 0 - 100
  intensityScore: number; // 0 - 100
  shadowScore: number; // 0 - 100
  contextScore: number; // 0 - 100
  combinedScore: number; // 0 - 100
  whyFlagged: string[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  depthMeters: number;
  slantRangeMeters: number;
  altitudeMeters: number;
  headingDegrees: number;
  coordinateSource: string;
}

export interface ReviewRecord {
  status: ReviewStatus;
  reviewedBy?: string;
  reclassifiedTo?: AnomalyClass;
  timestamp?: string;
  notes?: string;
}

export interface Detection {
  id: string; // e.g. DET-001
  frameId: string;
  class: AnomalyClass;
  originalClass: AnomalyClass;
  confidence: number; // 0 - 100
  evidence: AcousticEvidence;
  risk: RiskLevel;
  riskFactors: string[];
  location: GeoLocation;
  box: BoundingBox;
  review: ReviewRecord;
  dimensionsEstimated?: string; // e.g., "14.2m x 3.8m"
  acousticSignature?: string; // e.g., "High-specular reflection with trailing low-backscatter shadow"
}

export interface SonarFrame {
  id: string; // surv_014_001.sonar
  name: string;
  surveyId: string;
  pingStart: number;
  pingEnd: number;
  rangeMeters: number; // e.g., 75
  frequencyKhz: number; // e.g., 455 or 900
  headingDegrees: number;
  depthMeters: number;
  timestamp: string;
  durationSeconds: number;
  fileSizeBytes?: string;
  detections: Detection[];
  rawImage: string;
  isAnalyzed: boolean;
  status: 'Unprocessed' | 'Processing Complete' | 'Analyzed';
}

export interface SurveyCalibration {
  soundVelocityMs: number; // e.g. 1524 m/s
  salinityPsu: number; // 35.0 PSU
  waterTemperatureC: number; // 26.4 C
  towfishLaybackM: number; // 42.8 m
  towfishAltitudeTargetM: number; // 8.0 m
  ihoOrderStandard: 'IHO S-44 Order 1a' | 'IHO S-44 Special Order' | 'IHO S-44 Order 1b';
  activeEngine: 'Edge YOLO-v11 Marine + SAS Triangulation' | 'PyTorch ResNet-101 DeepBackscatter';
}

export interface Survey {
  id: string; // SURV-2026-CHN-014
  name: string;
  trackId: string; // SSS-2026-014
  vesselName: string;
  surveyDate: string;
  coverageKm: number;
  sonarType: string;
  frequencyMode: string;
  navigationMetadataStatus: 'Available' | 'Degraded' | 'Missing';
  areaName: string;
  calibration: SurveyCalibration;
  frames: SonarFrame[];
  totalFrames: number;
  totalPings: number;
}

export interface PipelineStep {
  id: string;
  label: string;
  status: 'waiting' | 'active' | 'completed';
  durationMs: number;
  detail?: string;
}

export type SonarPalette = 'copper' | 'amber' | 'grayscale' | 'coolblue';
