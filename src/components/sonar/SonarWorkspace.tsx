import React from 'react';
import { Survey, SonarFrame, Detection, SonarPalette } from '../../types/sonar';
import { SurveySidebar } from './SurveySidebar';
import { SonarViewer } from './SonarViewer';
import { EvidencePanel } from './EvidencePanel';

interface SonarWorkspaceProps {
  survey: Survey;
  currentFrame: SonarFrame;
  selectedDetection: Detection | null;
  onSelectFrame: (frameId: string) => void;
  onSelectDetection: (detection: Detection) => void;
  detectionMode: 'RAW' | 'AI';
  onToggleDetectionMode: (mode: 'RAW' | 'AI') => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  palette: SonarPalette;
  onChangePalette: (palette: SonarPalette) => void;
  onValidateDetection: (detectionId: string) => void;
  onReclassifyDetection: (detectionId: string) => void;
  onRejectDetection: (detectionId: string) => void;
  onOpenMapLocation: (detection: Detection) => void;
  onOpenImportModal: () => void;
}

export const SonarWorkspace: React.FC<SonarWorkspaceProps> = ({
  survey,
  currentFrame,
  selectedDetection,
  onSelectFrame,
  onSelectDetection,
  detectionMode,
  onToggleDetectionMode,
  onRunAnalysis,
  isAnalyzing,
  palette,
  onChangePalette,
  onValidateDetection,
  onReclassifyDetection,
  onRejectDetection,
  onOpenMapLocation,
  onOpenImportModal
}) => {
  return (
    <div className="flex-1 flex overflow-hidden w-full h-[calc(100vh-105px)]">
      {/* Zone 1: Left Survey Sidebar */}
      <SurveySidebar
        survey={survey}
        selectedFrameId={currentFrame.id}
        onSelectFrame={onSelectFrame}
        onOpenImportModal={onOpenImportModal}
      />

      {/* Zone 2: Center Large Sonar Viewer */}
      <SonarViewer
        frame={currentFrame}
        selectedDetection={selectedDetection}
        onSelectDetection={onSelectDetection}
        detectionMode={detectionMode}
        onToggleDetectionMode={onToggleDetectionMode}
        onRunAnalysis={onRunAnalysis}
        isAnalyzing={isAnalyzing}
        palette={palette}
        onChangePalette={onChangePalette}
      />

      {/* Zone 3: Right Acoustic Evidence Fusion & Review Panel */}
      <EvidencePanel
        detection={selectedDetection}
        onValidate={onValidateDetection}
        onReclassify={onReclassifyDetection}
        onReject={onRejectDetection}
        onOpenMapLocation={onOpenMapLocation}
      />
    </div>
  );
};
