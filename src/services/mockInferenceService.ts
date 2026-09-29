// Mock AI Inference & Acoustic Evidence Fusion Engine
// Structured to mirror a FastAPI + PyTorch / YOLO-v11 + Marine Acoustic Feature Fusion backend architecture.

import { Detection, PipelineStep } from '../types/sonar';

export interface AnalysisPipelineCallback {
  onStepChange: (stepId: string, steps: PipelineStep[]) => void;
  onLogMessage?: (msg: string) => void;
}

export const PIPELINE_STEPS_TEMPLATE: PipelineStep[] = [
  { id: 'io', label: 'Loading sonar frame telemetry & raw pings', status: 'waiting', durationMs: 400, detail: 'Reading 1,024 pings from SSS-2026-014 raw acoustic stream' },
  { id: 'denoise', label: 'Slant-range correction & speckle noise reduction', status: 'waiting', durationMs: 450, detail: 'Applying Lee filter (5x5) & nadir bottom-track slant removal' },
  { id: 'tvg', label: 'Time Varied Gain (TVG) & contrast normalization', status: 'waiting', durationMs: 400, detail: 'Calibrating acoustic backscatter decibel gain curve (455 kHz)' },
  { id: 'yolo', label: 'Deep neural object candidate proposal (YOLO-Marine)', status: 'waiting', durationMs: 650, detail: 'Inference across 1024x1024 acoustic tile patches (ResNet backbone)' },
  { id: 'fusion', label: 'Acoustic evidence fusion & shadow triangulation', status: 'waiting', durationMs: 500, detail: 'Computing shadow-to-height ratio & spatial context cross-entropy' },
  { id: 'calibration', label: 'Confidence calibration & operational risk triage', status: 'waiting', durationMs: 350, detail: 'Evaluating navigation hazard & benthic ecological entanglement risk' },
  { id: 'complete', label: 'Analysis complete & metadata georeferenced', status: 'waiting', durationMs: 200, detail: '4 candidate anomalies generated with full audit trace' }
];

export class MockInferenceService {
  /**
   * Simulates end-to-end multi-stage inference pipeline deterministically.
   * Can be replaced directly with:
   * const res = await fetch('/api/v1/sonar/analyze', { method: 'POST', body: ... });
   */
  public async runInferencePipeline(
    frameId: string,
    callback?: AnalysisPipelineCallback
  ): Promise<{ detections: Detection[]; executionTimeMs: number }> {
    const startTime = performance.now();
    const steps: PipelineStep[] = PIPELINE_STEPS_TEMPLATE.map(s => ({ ...s, status: 'waiting' }));

    for (let i = 0; i < steps.length; i++) {
      steps[i].status = 'active';
      if (callback) {
        callback.onStepChange(steps[i].id, [...steps]);
        if (callback.onLogMessage && steps[i].detail) {
          callback.onLogMessage(`[${new Date().toISOString().substring(11, 19)}] [AI-PIPELINE] ${steps[i].detail}`);
        }
      }

      await new Promise(resolve => setTimeout(resolve, steps[i].durationMs));
      steps[i].status = 'completed';
    }

    const detections = this.getDetectionsForFrame(frameId);
    const executionTimeMs = Math.round(performance.now() - startTime);

    return { detections, executionTimeMs };
  }

  /**
   * Deterministic detection profiles based on frame acquisition ID.
   */
  public getDetectionsForFrame(frameId: string): Detection[] {
    if (frameId.includes('001')) {
      return [
        {
          id: 'DET-001',
          frameId: 'survey_014_001.sonar',
          class: 'Ghost Net',
          originalClass: 'Ghost Net',
          confidence: 91,
          evidence: {
            shapeScore: 82,
            intensityScore: 91,
            shadowScore: 94,
            contextScore: 87,
            combinedScore: 89,
            whyFlagged: [
              'Irregular elongated structure with entangled strand geometry',
              'Consistent acoustic shadow cast behind elevated mass (height est: 1.4m)',
              'Intensity backscatter contrast (+14.2 dB) with surrounding silt seabed',
              'Context inconsistent with natural sediment or bedrock formations'
            ]
          },
          risk: 'HIGH',
          riskFactors: [
            'Potential navigation obstruction for shallow-draft fishing vessels',
            'Severe marine-life & turtle entanglement hazard (monofilament synthetic net)',
            'Artificial high-tensile polymer acoustic reflection signature'
          ],
          location: {
            latitude: 13.0827,
            longitude: 80.2707,
            depthMeters: 32.4,
            slantRangeMeters: 42.1,
            altitudeMeters: 8.2,
            headingDegrees: 184.2,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 21,
            y: 32,
            width: 12,
            height: 14
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '14.8m x 4.2m (Tangled Mass)',
          acousticSignature: 'High-specular multi-point return with distinctive trailing acoustic void'
        },
        {
          id: 'DET-002',
          frameId: 'survey_014_001.sonar',
          class: 'Pipe',
          originalClass: 'Pipe',
          confidence: 84,
          evidence: {
            shapeScore: 89,
            intensityScore: 86,
            shadowScore: 78,
            contextScore: 71,
            combinedScore: 81,
            whyFlagged: [
              'Continuous linear high-aspect-ratio cylindrical geometry',
              'Uniform specular acoustic reflection along primary longitudinal axis',
              'Parallel uniform acoustic shadow with sharp cutoff edge',
              'Oriented perpendicular to natural seabed tidal ripple direction'
            ]
          },
          risk: 'MEDIUM',
          riskFactors: [
            'Possible exposed industrial pipeline or decommissioned discharge conduit',
            'Subsea infrastructure anchor-snag hazard',
            'Unanchored section prone to benthic scour migration'
          ],
          location: {
            latitude: 13.0831,
            longitude: 80.2714,
            depthMeters: 33.1,
            slantRangeMeters: 51.6,
            altitudeMeters: 8.1,
            headingDegrees: 184.2,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 68,
            y: 22,
            width: 9,
            height: 16
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '22.4m length x 0.85m diameter',
          acousticSignature: 'Linear high-dB acoustic ridge with clean parallel shadow buffer'
        },
        {
          id: 'DET-003',
          frameId: 'survey_014_001.sonar',
          class: 'Wreck',
          originalClass: 'Wreck',
          confidence: 88,
          evidence: {
            shapeScore: 85,
            intensityScore: 88,
            shadowScore: 92,
            contextScore: 79,
            combinedScore: 86,
            whyFlagged: [
              'Structured geometric hull outline with exposed structural ribs',
              'Prominent elongated acoustic shadow indicating high vertical profile (3.6m above seabed)',
              'Multi-faceted corner reflector returns from collapsed timber/steel bulkheads',
              'Localized scour hollow depression in surrounding sand seabed'
            ]
          },
          risk: 'HIGH',
          riskFactors: [
            'Critical submerged navigation hazard for coastal maritime traffic',
            'Entangled lost longlines observed clinging to superstructure',
            'Historical or unrecorded vessel casualty requiring hydrographic notice to mariners'
          ],
          location: {
            latitude: 13.0842,
            longitude: 80.2720,
            depthMeters: 31.8,
            slantRangeMeters: 38.9,
            altitudeMeters: 8.3,
            headingDegrees: 184.2,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 26,
            y: 65,
            width: 14,
            height: 16
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '18.5m x 6.2m (Collapsed Trawler Hull)',
          acousticSignature: 'Complex multi-ridge specular cluster with dense extended shadow'
        },
        {
          id: 'DET-004',
          frameId: 'survey_014_001.sonar',
          class: 'Debris',
          originalClass: 'Debris',
          confidence: 76,
          evidence: {
            shapeScore: 74,
            intensityScore: 81,
            shadowScore: 72,
            contextScore: 68,
            combinedScore: 74,
            whyFlagged: [
              'Isolated compact high-density point target on flat seabed',
              'Sharp distinct acoustic shadow matching cylindrical container geometry',
              'High acoustic reflectance characteristic of steel drum / metal container',
              'Isolated occurrence without geological bedrock continuity'
            ]
          },
          risk: 'LOW',
          riskFactors: [
            'Localized anthropogenic metallic litter',
            'Low direct navigation impact at 32m chart depth',
            'Potential chemical/oil containment risk if intact'
          ],
          location: {
            latitude: 13.0850,
            longitude: 80.2728,
            depthMeters: 32.7,
            slantRangeMeters: 58.2,
            altitudeMeters: 8.0,
            headingDegrees: 184.2,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 77,
            y: 63,
            width: 7,
            height: 9
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '1.2m x 0.9m (Industrial Drum/Canister)',
          acousticSignature: 'Compact specular core with sharp conical acoustic shadow'
        }
      ];
    } else if (frameId.includes('002')) {
      return [
        {
          id: 'DET-005',
          frameId: 'survey_014_002.sonar',
          class: 'Subsea Cable',
          originalClass: 'Subsea Cable',
          confidence: 86,
          evidence: {
            shapeScore: 92,
            intensityScore: 83,
            shadowScore: 79,
            contextScore: 88,
            combinedScore: 85,
            whyFlagged: [
              'Continuous narrow linear feature traversing entire starboard swath',
              'Intermittent span loops elevated off seafloor with localized shadows',
              'Known charted telecommunications landing corridor'
            ]
          },
          risk: 'MEDIUM',
          riskFactors: [
            'Subsea critical infrastructure',
            'Trawl board impact or anchor snagging exposure',
            'Suspended cable loop span hazard'
          ],
          location: {
            latitude: 13.0885,
            longitude: 80.2751,
            depthMeters: 34.0,
            slantRangeMeters: 46.5,
            altitudeMeters: 8.4,
            headingDegrees: 184.0,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 58,
            y: 35,
            width: 32,
            height: 25
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '45m+ linear trace (Armored Cable)',
          acousticSignature: 'High-contrast fine line with periodic seabed touchdown points'
        },
        {
          id: 'DET-006',
          frameId: 'survey_014_002.sonar',
          class: 'Metal Cylinder',
          originalClass: 'Metal Cylinder',
          confidence: 82,
          evidence: {
            shapeScore: 86,
            intensityScore: 84,
            shadowScore: 80,
            contextScore: 75,
            combinedScore: 81,
            whyFlagged: [
              'Rectangular prismatic reflection with sharp perpendicular edges',
              'Consistent flat-topped acoustic shadow indicating cast concrete / metal block',
              'Mooring sinker anchor signature'
            ]
          },
          risk: 'LOW',
          riskFactors: [
            'Disused mooring sinker block',
            'Benthic habitat disruption'
          ],
          location: {
            latitude: 13.0872,
            longitude: 80.2742,
            depthMeters: 33.8,
            slantRangeMeters: 34.2,
            altitudeMeters: 8.3,
            headingDegrees: 184.0,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 24,
            y: 40,
            width: 9,
            height: 11
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '2.4m x 2.4m x 1.2m',
          acousticSignature: 'High-intensity rectangular return'
        }
      ];
    } else if (frameId.includes('003')) {
      return [
        {
          id: 'DET-008',
          frameId: 'survey_014_003.sonar',
          class: 'Debris',
          originalClass: 'Debris',
          confidence: 79,
          evidence: {
            shapeScore: 78,
            intensityScore: 85,
            shadowScore: 82,
            contextScore: 74,
            combinedScore: 80,
            whyFlagged: [
              'Multiple clustered geometric objects with high backscatter intensity',
              'Linear corrugated metallic roof signature',
              'Scattered debris field trailing downstream from primary impact point'
            ]
          },
          risk: 'HIGH',
          riskFactors: [
            'Lost ISO shipping container wreckage',
            'Subsea navigation obstacle',
            'Scattered metal panel edges hazardous to bottom trawling'
          ],
          location: {
            latitude: 13.0920,
            longitude: 80.2785,
            depthMeters: 35.2,
            slantRangeMeters: 55.0,
            altitudeMeters: 8.5,
            headingDegrees: 183.8,
            coordinateSource: 'Towfish USBL + Vessel DGPS Navigation Metadata'
          },
          box: {
            x: 65,
            y: 42,
            width: 15,
            height: 18
          },
          review: {
            status: 'Pending Review'
          },
          dimensionsEstimated: '12.2m x 2.4m (Container remnants)',
          acousticSignature: 'Corrugated metallic cluster return with jagged shadow border'
        }
      ];
    }

    // Frame 004 is clean baseline seabed (natural sand wave backscatter without anthropogenic anomalies)
    return [];
  }
}

export const mockInferenceService = new MockInferenceService();
