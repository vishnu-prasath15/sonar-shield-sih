import React from 'react';
import { 
  Compass, 
  Layers, 
  Radio, 
  ShieldCheck, 
  UploadCloud, 
  Sliders, 
  Activity,
  HardDrive,
  CheckCircle2,
  Waves
} from 'lucide-react';
import { Survey } from '../../types/sonar';

interface HeaderProps {
  surveys: Survey[];
  currentSurvey: Survey;
  onSelectSurvey: (surveyId: string) => void;
  onOpenImportModal: () => void;
  onOpenCalibrationModal: () => void;
  totalAnomaliesCount: number;
  highRiskCount: number;
  validatedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  surveys,
  currentSurvey,
  onSelectSurvey,
  onOpenImportModal,
  onOpenCalibrationModal,
  totalAnomaliesCount,
  highRiskCount,
  validatedCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 select-none">
      {/* Top Main Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Left: Brand & Product Info */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider text-base text-white">SONAR SHIELD</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-semibold">
                OPERATIONAL PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Marine Debris & Anomaly Intelligence System
            </p>
          </div>
        </div>

        {/* Center: Survey Selector & Live Metadata */}
        <div className="flex items-center space-x-3 bg-slate-950/70 border border-slate-800 px-3.5 py-1.5 rounded">
          <span className="text-xs text-slate-400 font-medium flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Active Survey:
          </span>
          <select 
            value={currentSurvey.id}
            onChange={(e) => onSelectSurvey(e.target.value)}
            className="bg-slate-900 text-slate-100 text-xs font-mono font-semibold border border-slate-700 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {surveys.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.areaName}
              </option>
            ))}
          </select>
          <span className="text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-2">
            Track: <strong className="text-slate-200">{currentSurvey.trackId}</strong>
          </span>
          <span className="text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-2">
            Coverage: <strong className="text-slate-200">{currentSurvey.coverageKm} km</strong>
          </span>
        </div>

        {/* Right: Operational Telemetry & Sensor Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Live Ingestion Link Status */}
          <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              Sensor Link: <strong className="text-emerald-400">ONLINE ({currentSurvey.frequencyMode.split(' ')[0]})</strong>
            </span>
          </div>

          {/* Calibration / Settings Button */}
          <button
            onClick={onOpenCalibrationModal}
            title="Configure Sound Velocity, Towfish Layback & IHO Compliance"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-[11px]">SVP {currentSurvey.calibration?.soundVelocityMs || 1524} m/s</span>
          </button>

          {/* Import Real Sonar Acquisition File Button */}
          <button
            onClick={onOpenImportModal}
            title="Import Raw Sonar / XTF / JSF acquisition files into current survey"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>IMPORT SONAR / XTF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
