import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  MapPin, 
  Layers, 
  FileCheck2, 
  Info, 
  Tag, 
  Sparkles,
  AlertTriangle,
  UserCheck,
  Check,
  Edit3
} from 'lucide-react';
import { Detection, ReviewStatus } from '../../types/sonar';

interface EvidencePanelProps {
  detection: Detection | null;
  onValidate: (detectionId: string) => void;
  onReclassify: (detectionId: string) => void;
  onReject: (detectionId: string) => void;
  onOpenMapLocation?: (detection: Detection) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  detection,
  onValidate,
  onReclassify,
  onReject,
  onOpenMapLocation
}) => {
  if (!detection) {
    return (
      <aside className="w-84 bg-white border-l border-slate-200 flex flex-col h-full text-xs text-slate-700 select-none">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
          <h3 className="font-bold text-slate-900 text-sm">ACOUSTIC EVIDENCE FUSION</h3>
          <p className="text-[11px] text-slate-500">Multi-feature anomaly inspection</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Activity className="w-6 h-6 text-slate-400" />
          </div>
          <p className="font-medium text-slate-600 text-sm">No Anomaly Selected</p>
          <p className="text-[11px] mt-1 text-slate-500 max-w-[200px]">
            Select a candidate bounding box in the Sonar Viewer or run AI analysis to inspect acoustic evidence fusion.
          </p>
        </div>
      </aside>
    );
  }

  const { evidence, location, review, risk, confidence } = detection;
  const isHighRisk = risk === 'HIGH';
  const isMediumRisk = risk === 'MEDIUM';

  const isValidated = review.status === 'Validated';
  const isReclassified = review.status === 'Reclassified';
  const isRejected = review.status === 'Rejected';

  return (
    <aside className="w-84 bg-white border-l border-slate-200 flex flex-col h-full overflow-y-auto text-xs text-slate-700 select-none">
      {/* Header with Candidate Name & ID */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
            CANDIDATE ANOMALY
          </span>
          <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 border border-slate-300">
            {detection.id}
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-950 flex items-center justify-between">
          <span>Possible {detection.class}</span>
        </h3>
        {detection.dimensionsEstimated && (
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
            Est. Size: <strong className="text-slate-700">{detection.dimensionsEstimated}</strong>
          </p>
        )}
      </div>

      {/* Section 1: ACOUSTIC EVIDENCE FUSION (The Key Innovation) */}
      <div className="p-3.5 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-900 text-[11px] tracking-tight">
              ACOUSTIC EVIDENCE FUSION
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Calibrated Weights</span>
        </div>

        {/* Feature Breakdown Bars */}
        <div className="space-y-2 text-[11px]">
          {/* Shape */}
          <div>
            <div className="flex justify-between mb-1 font-mono">
              <span className="text-slate-600">Shape / Morphology</span>
              <span className="font-bold text-slate-800">{evidence.shapeScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${evidence.shapeScore}%` }} 
              />
            </div>
          </div>

          {/* Intensity */}
          <div>
            <div className="flex justify-between mb-1 font-mono">
              <span className="text-slate-600">Backscatter Intensity</span>
              <span className="font-bold text-slate-800">{evidence.intensityScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${evidence.intensityScore}%` }} 
              />
            </div>
          </div>

          {/* Acoustic Shadow */}
          <div>
            <div className="flex justify-between mb-1 font-mono">
              <span className="text-slate-600">Acoustic Shadow Contrast</span>
              <span className="font-bold text-slate-800">{evidence.shadowScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-emerald-600 rounded-full" 
                style={{ width: `${evidence.shadowScore}%` }} 
              />
            </div>
          </div>

          {/* Context */}
          <div>
            <div className="flex justify-between mb-1 font-mono">
              <span className="text-slate-600">Seabed Context Inconsistency</span>
              <span className="font-bold text-slate-800">{evidence.contextScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${evidence.contextScore}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Combined Evidence Score Box */}
        <div className="p-2.5 rounded bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
              Evidence Score
            </div>
            <div className="text-[10px] text-slate-400">Explainable Multi-Criteria Metric</div>
          </div>
          <div className="text-xl font-bold font-mono text-blue-400">
            {evidence.combinedScore}%
          </div>
        </div>

        {/* WHY FLAGGED Section */}
        <div className="pt-1">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold mb-1.5">
            WHY FLAGGED
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600">
            {evidence.whyFlagged.map((reason, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-blue-600 mr-1.5 font-bold">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 2: AI CONFIDENCE & RISK PRIORITY */}
      <div className="p-3.5 border-b border-slate-200 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-slate-50 border border-slate-200 rounded">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
              AI CONFIDENCE
            </span>
            <span className="text-base font-bold font-mono text-slate-900">
              {confidence}%
            </span>
          </div>

          <div className={`p-2 border rounded ${
            isHighRisk 
              ? 'bg-red-50 border-red-200 text-red-900' 
              : isMediumRisk 
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <span className="text-[10px] font-mono uppercase font-semibold block opacity-80">
              RISK PRIORITY
            </span>
            <span className={`text-base font-bold font-mono flex items-center ${
              isHighRisk ? 'text-red-700' : isMediumRisk ? 'text-amber-700' : 'text-blue-700'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${
                isHighRisk ? 'bg-red-600 animate-pulse' : isMediumRisk ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              {risk}
            </span>
          </div>
        </div>

        {/* Risk factors */}
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">
            RISK FACTORS
          </span>
          <div className="space-y-1">
            {detection.riskFactors.map((factor, idx) => (
              <div key={idx} className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1.5 text-amber-600 flex-shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: HUMAN EXPERT REVIEW (Interactive workflow) */}
      <div className="p-3.5 border-b border-slate-200 space-y-2.5 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-700 font-bold flex items-center">
            <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-600" />
            HUMAN EXPERT REVIEW
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            isValidated
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : isReclassified
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : isRejected
                  ? 'bg-slate-200 text-slate-700 border border-slate-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {review.status}
          </span>
        </div>

        {/* Review Action Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onValidate(detection.id)}
            className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition-colors ${
              isValidated
                ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Check className="w-3 h-3" />
            <span>VALIDATE</span>
          </button>

          <button
            onClick={() => onReclassify(detection.id)}
            className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition-colors ${
              isReclassified
                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>RECLASSIFY</span>
          </button>

          <button
            onClick={() => onReject(detection.id)}
            className={`py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition-colors ${
              isRejected
                ? 'bg-red-800 text-white ring-2 ring-red-400'
                : 'bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-700 border border-slate-300'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>REJECT</span>
          </button>
        </div>

        {/* Review Audit Detail */}
        {review.reviewedBy && (
          <div className="p-2 rounded bg-white border border-slate-200 text-[10px] space-y-0.5 font-mono">
            <div className="text-emerald-700 font-semibold">
              ✓ Validated by: {review.reviewedBy}
            </div>
            <div className="text-slate-500">Timestamp: {review.timestamp}</div>
            {review.notes && <div className="text-slate-600 mt-1 italic">"{review.notes}"</div>}
          </div>
        )}
      </div>

      {/* Section 4: GEOLOCATION & NAVIGATION METADATA */}
      <div className="p-3.5 space-y-2 bg-white flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
            GEOLOCATION
          </span>
          {onOpenMapLocation && (
            <button
              onClick={() => onOpenMapLocation(detection)}
              className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              View on Map →
            </button>
          )}
        </div>

        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Latitude:</span>
            <span className="font-bold text-slate-900">{location.latitude.toFixed(4)}° N</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Longitude:</span>
            <span className="font-bold text-slate-900">{location.longitude.toFixed(4)}° E</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Seabed Depth:</span>
            <span className="font-bold text-slate-900">{location.depthMeters} m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Slant Range:</span>
            <span className="font-bold text-slate-900">{location.slantRangeMeters} m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Heading:</span>
            <span className="font-bold text-slate-900">{location.headingDegrees}°</span>
          </div>
          <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
            Source: <span className="text-slate-700">{location.coordinateSource}</span>
          </div>
        </div>

        {/* Required Accuracy Disclaimer Note */}
        <p className="text-[10px] text-slate-400 italic">
          * Coordinates shown from available survey/navigation metadata.
        </p>
      </div>
    </aside>
  );
};
