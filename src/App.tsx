import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/common/Header';
import { Navigation, NavTab } from './components/common/Navigation';
import { MetricStrip } from './components/common/MetricStrip';
import { SonarWorkspace } from './components/sonar/SonarWorkspace';
import { DetectionsPage } from './components/detections/DetectionsPage';
import { MarineMap } from './components/map/MarineMap';
import { ReviewQueue } from './components/review/ReviewQueue';
import { SurveyReports } from './components/reports/SurveyReports';
import { SurveyInfoPage } from './components/survey/SurveyInfoPage';
import { ReclassifyModal } from './components/modals/ReclassifyModal';
import { PipelineProgressModal } from './components/modals/PipelineProgressModal';
import { ImportSonarModal } from './components/modals/ImportSonarModal';
import { CalibrationModal } from './components/modals/CalibrationModal';
import { 
  Survey, 
  SonarFrame, 
  Detection, 
  SonarPalette, 
  AnomalyClass, 
  PipelineStep,
  SurveyCalibration
} from './types/sonar';
import { INITIAL_SURVEYS, HISTORICAL_SEEDED_DETECTIONS } from './services/surveyDataService';
import { mockInferenceService, PIPELINE_STEPS_TEMPLATE } from './services/mockInferenceService';

export const App: React.FC = () => {
  // Multi-Survey State Library
  const [surveys, setSurveys] = useState<Survey[]>(INITIAL_SURVEYS);
  const [activeSurveyId, setActiveSurveyId] = useState<string>('SURV-2026-CHN-014');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('survey_014_001.sonar');
  
  // Navigation & View
  const [activeTab, setActiveTab] = useState<NavTab>('sonar');

  // Sonar Viewer State
  const [detectionMode, setDetectionMode] = useState<'RAW' | 'AI'>('AI');
  const [selectedDetectionId, setSelectedDetectionId] = useState<string | null>('DET-001');
  const [palette, setPalette] = useState<SonarPalette>('copper');

  // Modal States
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showCalibrationModal, setShowCalibrationModal] = useState<boolean>(false);
  const [reclassifyTarget, setReclassifyTarget] = useState<Detection | null>(null);

  // AI Pipeline Execution State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showPipelineModal, setShowPipelineModal] = useState<boolean>(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(PIPELINE_STEPS_TEMPLATE);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [activePipelineStepId, setActivePipelineStepId] = useState<string>('');

  // Active Survey
  const currentSurvey = useMemo(() => {
    return surveys.find(s => s.id === activeSurveyId) || surveys[0];
  }, [surveys, activeSurveyId]);

  // Active Sonar Frame
  const currentFrame = useMemo(() => {
    return currentSurvey.frames.find(f => f.id === selectedFrameId) || currentSurvey.frames[0];
  }, [currentSurvey, selectedFrameId]);

  // All Detections (Current Survey Frames + Historical Validated Records)
  const allDetections = useMemo(() => {
    const frameDetections = currentSurvey.frames.flatMap(f => f.detections);
    return [...frameDetections, ...HISTORICAL_SEEDED_DETECTIONS];
  }, [currentSurvey]);

  // Selected Detection Object
  const selectedDetection = useMemo(() => {
    if (!selectedDetectionId) return null;
    return allDetections.find(d => d.id === selectedDetectionId) || null;
  }, [allDetections, selectedDetectionId]);

  // Metrics Calculations
  const totalAnomaliesCount = allDetections.length;
  const highRiskCount = allDetections.filter(d => d.risk === 'HIGH').length;
  const validatedCount = allDetections.filter(d => d.review.status === 'Validated').length;
  const pendingReviewCount = allDetections.filter(d => d.review.status === 'Pending Review').length;

  // Initialize first frame with detections if not analyzed yet
  React.useEffect(() => {
    if (!currentFrame.isAnalyzed) {
      const initialDetections = mockInferenceService.getDetectionsForFrame(currentFrame.id);
      setSurveys(prev => prev.map(s => {
        if (s.id === currentSurvey.id) {
          return {
            ...s,
            frames: s.frames.map(f => {
              if (f.id === currentFrame.id) {
                return {
                  ...f,
                  detections: initialDetections,
                  isAnalyzed: true,
                  status: 'Analyzed'
                };
              }
              return f;
            })
          };
        }
        return s;
      }));
    }
  }, [currentFrame.id, currentSurvey.id]);

  // Handler: Switch Active Survey Mission
  const handleSelectSurvey = useCallback((surveyId: string) => {
    setActiveSurveyId(surveyId);
    const targetSurvey = surveys.find(s => s.id === surveyId);
    if (targetSurvey && targetSurvey.frames.length > 0) {
      setSelectedFrameId(targetSurvey.frames[0].id);
      const frameDets = mockInferenceService.getDetectionsForFrame(targetSurvey.frames[0].id);
      if (frameDets.length > 0) {
        setSelectedDetectionId(frameDets[0].id);
      } else {
        setSelectedDetectionId(null);
      }
    }
  }, [surveys]);

  // Handler: Import New Sonar Acquisition File
  const handleImportFrame = useCallback((newFrame: SonarFrame) => {
    setSurveys(prev => prev.map(s => {
      if (s.id === currentSurvey.id) {
        return {
          ...s,
          frames: [...s.frames, newFrame],
          totalFrames: s.totalFrames + 1
        };
      }
      return s;
    }));
    setSelectedFrameId(newFrame.id);
    setSelectedDetectionId(null);
  }, [currentSurvey.id]);

  // Handler: Save Hydrographic Calibration
  const handleSaveCalibration = useCallback((cal: SurveyCalibration) => {
    setSurveys(prev => prev.map(s => {
      if (s.id === currentSurvey.id) {
        return {
          ...s,
          calibration: cal
        };
      }
      return s;
    }));
  }, [currentSurvey.id]);

  // Handler: Run AI Inference Pipeline
  const handleRunAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setShowPipelineModal(true);
    setPipelineLogs([]);

    try {
      const { detections } = await mockInferenceService.runInferencePipeline(
        currentFrame.id,
        {
          onStepChange: (stepId, steps) => {
            setActivePipelineStepId(stepId);
            setPipelineSteps(steps);
          },
          onLogMessage: (msg) => {
            setPipelineLogs(prev => [...prev, msg]);
          }
        }
      );

      setSurveys(prev => prev.map(s => {
        if (s.id === currentSurvey.id) {
          return {
            ...s,
            frames: s.frames.map(f => {
              if (f.id === currentFrame.id) {
                return {
                  ...f,
                  detections,
                  isAnalyzed: true,
                  status: 'Analyzed'
                };
              }
              return f;
            })
          };
        }
        return s;
      }));

      setDetectionMode('AI');

      if (detections.length > 0) {
        setSelectedDetectionId(detections[0].id);
      }
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowPipelineModal(false);
      }, 500);
    }
  }, [currentFrame.id, currentSurvey.id]);

  // Handler: Validate Detection
  const handleValidateDetection = useCallback((detectionId: string) => {
    setSurveys(prev => prev.map(s => ({
      ...s,
      frames: s.frames.map(f => ({
        ...f,
        detections: f.detections.map(d => {
          if (d.id === detectionId) {
            return {
              ...d,
              review: {
                status: 'Validated' as const,
                reviewedBy: 'Capt. S. Varma (Lead Hydrographer)',
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                notes: 'Acoustic evidence confirmed. Verified against bathymetric seabed model.'
              }
            };
          }
          return d;
        })
      }))
    })));
  }, []);

  // Handler: Open Reclassify Modal
  const handleOpenReclassifyModal = useCallback((detectionId: string) => {
    const target = allDetections.find(d => d.id === detectionId);
    if (target) {
      setReclassifyTarget(target);
    }
  }, [allDetections]);

  // Handler: Confirm Reclassification
  const handleConfirmReclassification = useCallback((
    detectionId: string, 
    newClass: AnomalyClass, 
    notes: string
  ) => {
    setSurveys(prev => prev.map(s => ({
      ...s,
      frames: s.frames.map(f => ({
        ...f,
        detections: f.detections.map(d => {
          if (d.id === detectionId) {
            return {
              ...d,
              class: newClass,
              review: {
                status: 'Reclassified' as const,
                reviewedBy: 'Capt. S. Varma (Lead Hydrographer)',
                reclassifiedTo: newClass,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                notes
              }
            };
          }
          return d;
        })
      }))
    })));
  }, []);

  // Handler: Reject Detection
  const handleRejectDetection = useCallback((detectionId: string) => {
    setSurveys(prev => prev.map(s => ({
      ...s,
      frames: s.frames.map(f => ({
        ...f,
        detections: f.detections.map(d => {
          if (d.id === detectionId) {
            return {
              ...d,
              review: {
                status: 'Rejected' as const,
                reviewedBy: 'Capt. S. Varma (Lead Hydrographer)',
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
                notes: 'Operator rejected anomaly. Classified as benign natural seabed ripple.'
              }
            };
          }
          return d;
        })
      }))
    })));
  }, []);

  // Handler: Select Detection and Navigate
  const handleSelectDetectionAndNavigate = useCallback((detection: Detection, targetView: NavTab) => {
    setSelectedFrameId(detection.frameId);
    setSelectedDetectionId(detection.id);
    setActiveTab(targetView);
    if (targetView === 'sonar') {
      setDetectionMode('AI');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-h-screen bg-slate-900 overflow-hidden font-sans">
      {/* 1. Production Operations Header */}
      <Header
        surveys={surveys}
        currentSurvey={currentSurvey}
        onSelectSurvey={handleSelectSurvey}
        onOpenImportModal={() => setShowImportModal(true)}
        onOpenCalibrationModal={() => setShowCalibrationModal(true)}
        totalAnomaliesCount={totalAnomaliesCount}
        highRiskCount={highRiskCount}
        validatedCount={validatedCount}
      />

      {/* 2. Compact Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingReviewCount={pendingReviewCount}
        totalDetectionsCount={allDetections.length}
        highRiskCount={highRiskCount}
      />

      {/* 3. Horizontal Metric Summary Strip */}
      <MetricStrip
        totalFrames={currentSurvey.totalFrames}
        candidateAnomalies={allDetections.length}
        highPriority={highRiskCount}
        validatedCount={validatedCount}
        coverageKm={currentSurvey.coverageKm}
      />

      {/* 4. Active Main Workspace View */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeTab === 'sonar' && (
          <SonarWorkspace
            survey={currentSurvey}
            currentFrame={currentFrame}
            selectedDetection={selectedDetection}
            onSelectFrame={(frameId) => {
              setSelectedFrameId(frameId);
              const targetFrame = currentSurvey.frames.find(f => f.id === frameId);
              if (targetFrame && targetFrame.detections.length > 0) {
                setSelectedDetectionId(targetFrame.detections[0].id);
              } else {
                setSelectedDetectionId(null);
              }
            }}
            onSelectDetection={(d) => setSelectedDetectionId(d.id)}
            detectionMode={detectionMode}
            onToggleDetectionMode={setDetectionMode}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
            palette={palette}
            onChangePalette={setPalette}
            onValidateDetection={handleValidateDetection}
            onReclassifyDetection={handleOpenReclassifyModal}
            onRejectDetection={handleRejectDetection}
            onOpenMapLocation={(d) => {
              setSelectedDetectionId(d.id);
              setActiveTab('map');
            }}
            onOpenImportModal={() => setShowImportModal(true)}
          />
        )}

        {activeTab === 'detections' && (
          <DetectionsPage
            detections={allDetections}
            onSelectDetectionAndNavigate={handleSelectDetectionAndNavigate}
            onValidateDetection={handleValidateDetection}
            onReclassifyDetection={handleOpenReclassifyModal}
          />
        )}

        {activeTab === 'map' && (
          <MarineMap
            survey={currentSurvey}
            detections={allDetections}
            selectedDetection={selectedDetection}
            onSelectDetection={(d) => setSelectedDetectionId(d.id)}
            onNavigateToSonar={(d) => {
              setSelectedFrameId(d.frameId);
              setSelectedDetectionId(d.id);
              setDetectionMode('AI');
              setActiveTab('sonar');
            }}
          />
        )}

        {activeTab === 'review' && (
          <ReviewQueue
            detections={allDetections}
            onValidateDetection={handleValidateDetection}
            onReclassifyDetection={handleOpenReclassifyModal}
            onRejectDetection={handleRejectDetection}
            onNavigateToSonar={(d) => {
              setSelectedFrameId(d.frameId);
              setSelectedDetectionId(d.id);
              setDetectionMode('AI');
              setActiveTab('sonar');
            }}
          />
        )}

        {activeTab === 'reports' && (
          <SurveyReports
            survey={currentSurvey}
            detections={allDetections}
          />
        )}

        {activeTab === 'survey' && (
          <SurveyInfoPage
            survey={currentSurvey}
            onNavigateToSonar={() => setActiveTab('sonar')}
          />
        )}
      </main>

      {/* Pipeline Execution Modal */}
      <PipelineProgressModal
        isOpen={showPipelineModal}
        steps={pipelineSteps}
        logs={pipelineLogs}
        activeStepId={activePipelineStepId}
      />

      {/* Reclassify Modal */}
      {reclassifyTarget && (
        <ReclassifyModal
          detection={reclassifyTarget}
          isOpen={!!reclassifyTarget}
          onClose={() => setReclassifyTarget(null)}
          onConfirmReclassification={handleConfirmReclassification}
        />
      )}

      {/* Import Sonar / XTF Modal */}
      <ImportSonarModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        surveyId={currentSurvey.id}
        onImportFrame={handleImportFrame}
      />

      {/* Hydrographic Calibration & Settings Modal */}
      <CalibrationModal
        isOpen={showCalibrationModal}
        onClose={() => setShowCalibrationModal(false)}
        calibration={currentSurvey.calibration}
        onSaveCalibration={handleSaveCalibration}
      />
    </div>
  );
};

export default App;
