import React from 'react';
import { 
  Folder, 
  CheckCircle2, 
  Radio, 
  Layers, 
  Compass, 
  UploadCloud,
  FileCode,
  HardDrive
} from 'lucide-react';
import { Survey } from '../../types/sonar';

interface SurveySidebarProps {
  survey: Survey;
  selectedFrameId: string;
  onSelectFrame: (frameId: string) => void;
  onOpenImportModal: () => void;
}

export const SurveySidebar: React.FC<SurveySidebarProps> = ({
  survey,
  selectedFrameId,
  onSelectFrame,
  onOpenImportModal
}) => {
  const analyzedCount = survey.frames.filter(f => f.isAnalyzed).length;
  const progressPercent = Math.round((analyzedCount / survey.frames.length) * 100);

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto text-xs text-slate-700 select-none">
      {/* Sidebar Header: Survey Acquisition Summary */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            SURVEY ACQUISITION
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
            Operational
          </span>
        </div>
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">{survey.id}</h2>
        <p className="text-[11px] text-slate-500 truncate mt-0.5">{survey.name}</p>
      </div>

      {/* Metadata Attributes List */}
      <div className="p-3 border-b border-slate-200 space-y-2 bg-white text-[11px]">
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-500">Sensor Model:</span>
          <span className="font-semibold text-slate-800 font-mono">Dual SSS (CHIRP)</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-500">Survey Track:</span>
          <span className="font-semibold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
            {survey.trackId}
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-500">Acoustic Freq:</span>
          <span className="font-medium text-slate-700 text-[10px]">{survey.frequencyMode}</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-500">Navigation Link:</span>
          <span className="font-medium text-emerald-700 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            {survey.navigationMetadataStatus} (USBL/DGPS)
          </span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span className="text-slate-500">Track Coverage:</span>
          <span className="font-semibold text-slate-800 font-mono">{survey.coverageKm} km</span>
        </div>
      </div>

      {/* Survey Coverage & Processing Progress Bar */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/50">
        <div className="flex justify-between text-[11px] mb-1.5">
          <span className="text-slate-600 font-medium">Batch Pipeline Progress</span>
          <span className="font-mono font-bold text-slate-800">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
          <span>{analyzedCount} / {survey.frames.length} frames indexed</span>
          <span>150m swath corridor</span>
        </div>
      </div>

      {/* Sonar Frames Explorer */}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center">
            <Folder className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            ACQUISITION FILES ({survey.frames.length})
          </span>
          <button
            onClick={onOpenImportModal}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-0.5 hover:underline"
          >
            <UploadCloud className="w-3 h-3 mr-0.5" />
            <span>+ Import</span>
          </button>
        </div>

        <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
          {survey.frames.map((frame) => {
            const isSelected = frame.id === selectedFrameId;
            const anomalyCount = frame.detections.length;
            const hasHighRisk = frame.detections.some(d => d.risk === 'HIGH');

            return (
              <button
                key={frame.id}
                onClick={() => onSelectFrame(frame.id)}
                className={`w-full text-left p-2.5 rounded border transition-all duration-150 flex flex-col relative ${
                  isSelected
                    ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300/60 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-xs font-semibold ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                    {frame.id}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                  <span>Ping: {frame.pingStart.toString().padStart(6, '0')}-{frame.pingEnd.toString().padStart(6, '0')}</span>
                  <span>{frame.fileSizeBytes || '31.4 MB'}</span>
                </div>

                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">{frame.depthMeters}m depth ({frame.frequencyKhz}kHz)</span>
                  {frame.isAnalyzed ? (
                    <span className={`px-1.5 py-0.2 rounded font-mono font-semibold ${
                      anomalyCount > 0 
                        ? hasHighRisk
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {anomalyCount > 0 ? `${anomalyCount} Anomaly` : '0 Clean Seafloor'}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Unprocessed</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vessel & Sensor Telemetry Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 font-mono space-y-1">
        <div>Vessel: <strong className="text-slate-700">{survey.vesselName}</strong></div>
        <div>Datum: <strong className="text-slate-700">WGS84 / UTM Zone 44N</strong></div>
        <div className="text-[9px] text-slate-400">Standard: {survey.calibration?.ihoOrderStandard || 'IHO S-44 Order 1a'}</div>
      </div>
    </aside>
  );
};
