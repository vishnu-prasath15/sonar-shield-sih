import React from 'react';
import { 
  FolderGit2, 
  Layers, 
  Compass, 
  Radio, 
  Cpu, 
  HardDrive, 
  Navigation, 
  Anchor, 
  ShieldCheck, 
  FileCheck2,
  Activity,
  Calendar,
  Waves
} from 'lucide-react';
import { Survey } from '../../types/sonar';

interface SurveyInfoPageProps {
  survey: Survey;
  onNavigateToSonar: () => void;
}

export const SurveyInfoPage: React.FC<SurveyInfoPageProps> = ({
  survey,
  onNavigateToSonar
}) => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-y-auto bg-slate-50 text-slate-800 select-none p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header Card */}
        <div className="bg-white border border-slate-200 rounded p-6 shadow-subtle flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-bold border border-blue-200">
                ACTIVE SURVEY DATASET
              </span>
              <span className="text-slate-400 font-mono text-xs">IHO S-44 Compliant</span>
            </div>
            <h1 className="text-xl font-bold text-slate-950 mt-1">{survey.id} — {survey.name}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Georeferenced acoustic survey conducted along the outer shipping fairway and anchorage zones.
            </p>
          </div>

          <button
            onClick={onNavigateToSonar}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            Launch Sonar Workspace →
          </button>
        </div>

        {/* Acquisition & Sensor Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Acoustic Hardware */}
          <div className="bg-white border border-slate-200 rounded p-5 shadow-subtle space-y-3">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-slate-900 flex items-center">
              <Radio className="w-4 h-4 mr-2 text-blue-600" />
              1. Acoustic Transducer Specifications
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sensor Model:</span>
                <span className="font-semibold text-slate-900">Edgetech 4200-MP Dual SSS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Operating Frequencies:</span>
                <span className="font-semibold text-slate-900">455 kHz (Wide) / 900 kHz (High-Res)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Swath Width:</span>
                <span className="font-semibold text-slate-900">150 m (75m Port + 75m Starboard)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Across-Track Resolution:</span>
                <span className="font-semibold text-emerald-700">0.05 m (5 cm/pixel)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Slant-Range Correction:</span>
                <span className="font-semibold text-slate-900">Active Real-Time Nadir Bottom-Track</span>
              </div>
            </div>
          </div>

          {/* Card 2: Vessel & Navigation Telemetry */}
          <div className="bg-white border border-slate-200 rounded p-5 shadow-subtle space-y-3">
            <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-slate-900 flex items-center">
              <Compass className="w-4 h-4 mr-2 text-blue-600" />
              2. Navigation & Positioning Infrastructure
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Survey Vessel:</span>
                <span className="font-semibold text-slate-900">{survey.vesselName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Surface Positioning:</span>
                <span className="font-semibold text-slate-900">Trimble SPS855 DGPS RTK</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Subsea Positioning:</span>
                <span className="font-semibold text-slate-900">Sonardyne Ranger 2 USBL Transponder</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Horizontal Datum:</span>
                <span className="font-semibold text-slate-900">WGS84 / UTM Zone 44N</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Towfish Layback Offset:</span>
                <span className="font-semibold text-slate-900">42.8 m aft (Active cable counter)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Line Log */}
        <div className="bg-white border border-slate-200 rounded p-5 shadow-subtle space-y-3">
          <h3 className="font-bold text-xs font-mono uppercase tracking-wider text-slate-900 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-blue-600" />
            3. Survey Trackline Acquisition Log
          </h3>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[10px]">
                <tr>
                  <th className="p-2">FILE NAME</th>
                  <th className="p-2">PING RANGE</th>
                  <th className="p-2">HEADING</th>
                  <th className="p-2">DEPTH</th>
                  <th className="p-2">TIMESTAMP</th>
                  <th className="p-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {survey.frames.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900">{f.id}</td>
                    <td className="p-2">{f.pingStart} - {f.pingEnd}</td>
                    <td className="p-2">{f.headingDegrees}°</td>
                    <td className="p-2">{f.depthMeters} m</td>
                    <td className="p-2 text-slate-600">{f.timestamp}</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {f.isAnalyzed ? 'Analyzed' : 'Ready'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
