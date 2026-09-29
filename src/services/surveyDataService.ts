// Survey Data & Production Hydrographic Dataset Management Service
// Manages real survey missions, acquisition frames, calibration parameters, and spatial data exports.

import { Survey, SonarFrame, Detection, SurveyCalibration } from '../types/sonar';

export const DEFAULT_CALIBRATION: SurveyCalibration = {
  soundVelocityMs: 1524.0,
  salinityPsu: 35.2,
  waterTemperatureC: 26.4,
  towfishLaybackM: 42.8,
  towfishAltitudeTargetM: 8.0,
  ihoOrderStandard: 'IHO S-44 Order 1a',
  activeEngine: 'Edge YOLO-v11 Marine + SAS Triangulation'
};

export const INITIAL_SURVEYS: Survey[] = [
  {
    id: 'SURV-2026-CHN-014',
    name: 'Bay of Bengal Coastal Debris & Navigational Anomaly Survey',
    trackId: 'SSS-2026-014',
    vesselName: 'RV Samudra Explorer (Hydrographic Unit 4)',
    surveyDate: '28 September 2026',
    coverageKm: 12.8,
    sonarType: 'Dual-Frequency High-Resolution Side-Scan Sonar (SSS)',
    frequencyMode: '455 kHz Primary / 900 kHz Detail CHIRP',
    navigationMetadataStatus: 'Available',
    areaName: 'Chennai Port Outer Anchorage & Fairway Corridor',
    totalFrames: 1284,
    totalPings: 642000,
    calibration: DEFAULT_CALIBRATION,
    frames: [
      {
        id: 'survey_014_001.sonar',
        name: 'survey_014_001.sonar (Ping 004800-005824)',
        surveyId: 'SURV-2026-CHN-014',
        pingStart: 4800,
        pingEnd: 5824,
        rangeMeters: 75,
        frequencyKhz: 455,
        headingDegrees: 184.2,
        depthMeters: 32.4,
        timestamp: '2026-09-28 07:14:22 UTC',
        durationSeconds: 120,
        fileSizeBytes: '28.4 MB',
        detections: [],
        rawImage: 'frame_001',
        isAnalyzed: false,
        status: 'Unprocessed'
      },
      {
        id: 'survey_014_002.sonar',
        name: 'survey_014_002.sonar (Ping 005825-006849)',
        surveyId: 'SURV-2026-CHN-014',
        pingStart: 5825,
        pingEnd: 6849,
        rangeMeters: 75,
        frequencyKhz: 455,
        headingDegrees: 184.0,
        depthMeters: 33.8,
        timestamp: '2026-09-28 07:16:22 UTC',
        durationSeconds: 120,
        fileSizeBytes: '28.2 MB',
        detections: [],
        rawImage: 'frame_002',
        isAnalyzed: false,
        status: 'Unprocessed'
      },
      {
        id: 'survey_014_003.sonar',
        name: 'survey_014_003.sonar (Ping 006850-007874)',
        surveyId: 'SURV-2026-CHN-014',
        pingStart: 6850,
        pingEnd: 7874,
        rangeMeters: 75,
        frequencyKhz: 900,
        headingDegrees: 183.8,
        depthMeters: 35.2,
        timestamp: '2026-09-28 07:18:22 UTC',
        durationSeconds: 120,
        fileSizeBytes: '42.1 MB',
        detections: [],
        rawImage: 'frame_003',
        isAnalyzed: false,
        status: 'Unprocessed'
      },
      {
        id: 'survey_014_004.sonar',
        name: 'survey_014_004.sonar (Ping 007875-008899 - Baseline)',
        surveyId: 'SURV-2026-CHN-014',
        pingStart: 7875,
        pingEnd: 8899,
        rangeMeters: 75,
        frequencyKhz: 455,
        headingDegrees: 184.5,
        depthMeters: 32.1,
        timestamp: '2026-09-28 07:20:22 UTC',
        durationSeconds: 120,
        fileSizeBytes: '27.9 MB',
        detections: [],
        rawImage: 'frame_004',
        isAnalyzed: false,
        status: 'Unprocessed'
      }
    ]
  },
  {
    id: 'SURV-2026-MUM-082',
    name: 'Mumbai High Offshore Subsea Pipeline & Anchorage Hazard Inspection',
    trackId: 'SSS-2026-082',
    vesselName: 'INS Nirdeshak (Naval Hydrographic Group)',
    surveyDate: '26 September 2026',
    coverageKm: 24.5,
    sonarType: 'Klein 3000 Multi-Beam Dual SSS',
    frequencyMode: '100 kHz Deep / 500 kHz Detail',
    navigationMetadataStatus: 'Available',
    areaName: 'Mumbai High South Platform Trunkline Corridor',
    totalFrames: 2450,
    totalPings: 1225000,
    calibration: {
      ...DEFAULT_CALIBRATION,
      soundVelocityMs: 1532.0,
      towfishLaybackM: 65.0
    },
    frames: [
      {
        id: 'mumbai_082_001.sonar',
        name: 'mumbai_082_001.sonar (Trunkline Alpha Section)',
        surveyId: 'SURV-2026-MUM-082',
        pingStart: 1200,
        pingEnd: 2224,
        rangeMeters: 100,
        frequencyKhz: 500,
        headingDegrees: 270.0,
        depthMeters: 74.5,
        timestamp: '2026-09-26 11:20:00 UTC',
        durationSeconds: 150,
        fileSizeBytes: '34.5 MB',
        detections: [],
        rawImage: 'frame_002',
        isAnalyzed: false,
        status: 'Unprocessed'
      }
    ]
  },
  {
    id: 'SURV-2026-GOA-045',
    name: 'Konkan Continental Shelf Benthic Debris & Acoustic Mapping',
    trackId: 'SSS-2026-045',
    vesselName: 'RV Sagar Nidhi (National Institute of Ocean Technology)',
    surveyDate: '24 September 2026',
    coverageKm: 18.2,
    sonarType: 'Synthetic Aperture Sonar (SAS-PRO)',
    frequencyMode: '300 kHz Wideband Interferometric',
    navigationMetadataStatus: 'Available',
    areaName: 'Mormugao Port Approach & Coastal Shelf',
    totalFrames: 1820,
    totalPings: 910000,
    calibration: {
      ...DEFAULT_CALIBRATION,
      soundVelocityMs: 1528.5,
      towfishAltitudeTargetM: 10.0
    },
    frames: [
      {
        id: 'goa_045_001.sonar',
        name: 'goa_045_001.sonar (Mormugao Approach Track)',
        surveyId: 'SURV-2026-GOA-045',
        pingStart: 800,
        pingEnd: 1824,
        rangeMeters: 75,
        frequencyKhz: 300,
        headingDegrees: 145.0,
        depthMeters: 28.0,
        timestamp: '2026-09-24 14:10:00 UTC',
        durationSeconds: 120,
        fileSizeBytes: '31.2 MB',
        detections: [],
        rawImage: 'frame_001',
        isAnalyzed: false,
        status: 'Unprocessed'
      }
    ]
  }
];

export const HISTORICAL_SEEDED_DETECTIONS: Detection[] = [
  {
    id: 'DET-000-HIST1',
    frameId: 'survey_013_088.sonar',
    class: 'Ghost Net',
    originalClass: 'Ghost Net',
    confidence: 94,
    evidence: {
      shapeScore: 88,
      intensityScore: 93,
      shadowScore: 96,
      contextScore: 90,
      combinedScore: 92,
      whyFlagged: [
        'Massive tangled trawl net mass snagged on rocky outcrop',
        'Distinctive acoustic shadow envelope extending 6.8m',
        'High backscatter variance characteristic of nylon multifilament netting'
      ]
    },
    risk: 'HIGH',
    riskFactors: ['Navigational fouling hazard', 'Active ghost fishing entrapment'],
    location: {
      latitude: 13.0762,
      longitude: 80.2654,
      depthMeters: 29.8,
      slantRangeMeters: 36.4,
      altitudeMeters: 7.9,
      headingDegrees: 184.0,
      coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
    },
    box: { x: 30, y: 40, width: 14, height: 16 },
    review: {
      status: 'Validated',
      reviewedBy: 'Capt. R. Sharma (Hydrographer)',
      timestamp: '2026-09-28 06:45:10 UTC',
      notes: 'Confirmed hazardous ghost net. Dispatched recovery coordinates to Coast Guard Maritime Rescue Sub-Center.'
    }
  },
  {
    id: 'DET-000-HIST2',
    frameId: 'survey_013_092.sonar',
    class: 'Wreck',
    originalClass: 'Wreck',
    confidence: 89,
    evidence: {
      shapeScore: 86,
      intensityScore: 89,
      shadowScore: 90,
      contextScore: 84,
      combinedScore: 87,
      whyFlagged: [
        'Disintegrated steel barge frame',
        'Prominent 4.2m acoustic shadow relief'
      ]
    },
    risk: 'HIGH',
    riskFactors: ['Navigational shoal obstruction'],
    location: {
      latitude: 13.0790,
      longitude: 80.2680,
      depthMeters: 30.5,
      slantRangeMeters: 44.0,
      altitudeMeters: 8.0,
      headingDegrees: 184.1,
      coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
    },
    box: { x: 50, y: 50, width: 18, height: 20 },
    review: {
      status: 'Validated',
      reviewedBy: 'S. Varma (Senior Acoustic Analyst)',
      timestamp: '2026-09-28 06:58:34 UTC',
      notes: 'Chart update submitted to National Hydrographic Office.'
    }
  }
];

export function generateSurveyCSV(survey: Survey, allDetections: Detection[]): string {
  const headers = [
    'Detection ID',
    'Survey Track',
    'Frame ID',
    'Classification',
    'AI Confidence (%)',
    'Evidence Score (%)',
    'Risk Priority',
    'Latitude (°N)',
    'Longitude (°E)',
    'Depth (m)',
    'Slant Range (m)',
    'Heading (°)',
    'Review Status',
    'Reviewed By',
    'Review Timestamp',
    'Dimensions Est',
    'Why Flagged'
  ];

  const rows = allDetections.map(d => [
    `"${d.id}"`,
    `"${survey.trackId}"`,
    `"${d.frameId}"`,
    `"${d.class}"`,
    d.confidence,
    d.evidence.combinedScore,
    `"${d.risk}"`,
    d.location.latitude.toFixed(6),
    d.location.longitude.toFixed(6),
    d.location.depthMeters.toFixed(1),
    d.location.slantRangeMeters.toFixed(1),
    d.location.headingDegrees.toFixed(1),
    `"${d.review.status}"`,
    `"${d.review.reviewedBy || 'N/A'}"`,
    `"${d.review.timestamp || 'N/A'}"`,
    `"${d.dimensionsEstimated || 'N/A'}"`,
    `"${d.evidence.whyFlagged.join('; ')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function generateSurveyJSON(survey: Survey, allDetections: Detection[]): string {
  const manifest = {
    system: 'SONAR SHIELD Hydrographic Intelligence System v1.4-PRO',
    generatedAt: new Date().toISOString(),
    survey: {
      id: survey.id,
      name: survey.name,
      trackId: survey.trackId,
      vessel: survey.vesselName,
      surveyDate: survey.surveyDate,
      coverageKm: survey.coverageKm,
      sonarType: survey.sonarType,
      frequencyMode: survey.frequencyMode,
      navigationMetadataStatus: survey.navigationMetadataStatus,
      areaName: survey.areaName,
      calibration: survey.calibration,
      totalFramesAnalyzed: survey.frames.filter(f => f.isAnalyzed).length,
      totalCandidateDetections: allDetections.length
    },
    detections: allDetections
  };

  return JSON.stringify(manifest, null, 2);
}

export function generateSurveyGeoJSON(survey: Survey, allDetections: Detection[]): string {
  const features = allDetections.map(d => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [d.location.longitude, d.location.latitude]
    },
    properties: {
      detectionId: d.id,
      surveyTrack: survey.trackId,
      frameId: d.frameId,
      classification: d.class,
      confidence: d.confidence,
      evidenceScore: d.evidence.combinedScore,
      riskLevel: d.risk,
      depthMeters: d.location.depthMeters,
      reviewStatus: d.review.status,
      reviewedBy: d.review.reviewedBy || null,
      reviewTimestamp: d.review.timestamp || null,
      dimensionsEstimated: d.dimensionsEstimated || null,
      whyFlagged: d.evidence.whyFlagged,
      coordinateSource: d.location.coordinateSource
    }
  }));

  const tracklineFeature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [80.2640, 13.0750],
        [80.2670, 13.0780],
        [80.2707, 13.0827],
        [80.2730, 13.0860],
        [80.2765, 13.0900],
        [80.2800, 13.0945]
      ]
    },
    properties: {
      trackId: survey.trackId,
      surveyName: survey.name,
      vesselName: survey.vesselName,
      swathWidthMeters: 150,
      status: 'Acquisition Complete'
    }
  };

  const geoJson = {
    type: 'FeatureCollection',
    metadata: {
      system: 'SONAR SHIELD',
      surveyId: survey.id,
      datum: 'WGS84',
      projection: 'EPSG:4326',
      exportTimestamp: new Date().toISOString()
    },
    features: [tracklineFeature, ...features]
  };

  return JSON.stringify(geoJson, null, 2);
}

export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
