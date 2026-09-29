import React from 'react';
import { 
  Film, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Navigation2, 
  Gauge
} from 'lucide-react';

interface MetricStripProps {
  totalFrames: number;
  candidateAnomalies: number;
  highPriority: number;
  validatedCount: number;
  coverageKm: number;
  vesselSpeedKnots?: number;
}

export const MetricStrip: React.FC<MetricStripProps> = ({
  totalFrames,
  candidateAnomalies,
  highPriority,
  validatedCount,
  coverageKm,
  vesselSpeedKnots = 4.2
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700 shadow-subtle select-none">
      <div className="flex items-center space-x-6">
        {/* Metric 1: Sonar Frames */}
        <div className="flex items-center space-x-2">
          <Film className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Sonar Frames:</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {totalFrames.toLocaleString()}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Metric 2: Candidate Anomalies */}
        <div className="flex items-center space-x-2">
          <Target className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Candidate Anomalies:</span>
          <span className="font-mono font-bold text-blue-700 text-sm">
            {candidateAnomalies}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Metric 3: High Priority */}
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">High Priority:</span>
          <span className="font-mono font-bold text-red-600 text-sm px-1.5 py-0.2 bg-red-50 rounded border border-red-200">
            {highPriority}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Metric 4: Validated */}
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Validated:</span>
          <span className="font-mono font-bold text-emerald-700 text-sm">
            {validatedCount}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Metric 5: Survey Coverage */}
        <div className="flex items-center space-x-2">
          <Navigation2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">Track Coverage:</span>
          <span className="font-mono font-semibold text-slate-800 text-xs">
            {coverageKm} km (150m swath)
          </span>
        </div>
      </div>

      {/* Hydrographic Towfish Status */}
      <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-500">
        <span className="flex items-center">
          <Gauge className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Vessel Speed: <strong className="ml-1 text-slate-700">{vesselSpeedKnots} kts</strong>
        </span>
        <span className="text-slate-300">•</span>
        <span>Towfish Altitude: <strong className="text-slate-700">8.2 m</strong></span>
        <span className="text-slate-300">•</span>
        <span>Sampling: <strong className="text-slate-700">0.05 m/px</strong></span>
      </div>
    </div>
  );
};
