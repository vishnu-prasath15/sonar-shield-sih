import React, { useState } from 'react';
import { 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Eye, 
  ShieldAlert, 
  Clock, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Detection, AnomalyClass } from '../../types/sonar';

interface ReviewQueueProps {
  detections: Detection[];
  onValidateDetection: (detectionId: string) => void;
  onReclassifyDetection: (detectionId: string) => void;
  onRejectDetection: (detectionId: string) => void;
  onNavigateToSonar: (detection: Detection) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  detections,
  onValidateDetection,
  onReclassifyDetection,
  onRejectDetection,
  onNavigateToSonar
}) => {
  // Priority sorting: Pending High Risk -> Pending Medium -> Pending Low -> Already Reviewed
  const sortedQueue = [...detections].sort((a, b) => {
    const isPendingA = a.review.status === 'Pending Review' ? 1 : 0;
    const isPendingB = b.review.status === 'Pending Review' ? 1 : 0;
    if (isPendingA !== isPendingB) return isPendingB - isPendingA;

    const riskWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return riskWeight[b.risk] - riskWeight[a.risk];
  });

  const pendingCount = detections.filter(d => d.review.status === 'Pending Review').length;
  const highRiskPendingCount = detections.filter(d => d.review.status === 'Pending Review' && d.risk === 'HIGH').length;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-50 text-slate-800 select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center">
            <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
            Human-in-the-Loop Hydrographic Review Queue
          </h2>
          <p className="text-xs text-slate-500">
            Operational triage queue ranked by maritime risk score and acoustic evidence certainty.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs font-semibold flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            {pendingCount} Pending Triage
          </span>
          {highRiskPendingCount > 0 && (
            <span className="px-3 py-1 rounded bg-red-50 border border-red-200 text-red-900 font-mono text-xs font-semibold flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-red-600 animate-pulse" />
              {highRiskPendingCount} High Risk Urgent
            </span>
          )}
        </div>
      </div>

      {/* Queue List Cards */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedQueue.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="font-semibold text-slate-700">Review Queue Empty</p>
            <p className="text-xs text-slate-500">All candidate detections have been triaged.</p>
          </div>
        ) : (
          sortedQueue.map((detection) => {
            const isHighRisk = detection.risk === 'HIGH';
            const isMediumRisk = detection.risk === 'MEDIUM';
            const isPending = detection.review.status === 'Pending Review';
            const isValidated = detection.review.status === 'Validated';
            const isReclassified = detection.review.status === 'Reclassified';
            const isRejected = detection.review.status === 'Rejected';

            return (
              <div
                key={detection.id}
                className={`p-4 rounded border transition-all bg-white shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isPending && isHighRisk
                    ? 'border-red-300 ring-1 ring-red-200/60'
                    : isPending && isMediumRisk
                      ? 'border-amber-300'
                      : isValidated
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200'
                }`}
              >
                {/* Left Block: Target Identity & Risk */}
                <div className="flex items-center space-x-3.5 min-w-[220px]">
                  <div className={`px-2.5 py-1.5 rounded font-mono text-xs font-bold text-center flex flex-col items-center justify-center min-w-[65px] ${
                    isHighRisk 
                      ? 'bg-red-100 text-red-800 border border-red-300' 
                      : isMediumRisk 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    <span className="text-[10px] uppercase font-sans font-medium">Risk</span>
                    <span>{detection.risk}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 font-mono text-xs">
                        {detection.id}
                      </span>
                      <span className="text-xs font-semibold text-blue-900">
                        {detection.class}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {detection.location.latitude.toFixed(4)}°N, {detection.location.longitude.toFixed(4)}°E • {detection.location.depthMeters}m
                    </div>
                  </div>
                </div>

                {/* Center Block: AI Metrics & Forensic Reasons */}
                <div className="flex-1 max-w-xl text-xs space-y-1">
                  <div className="flex items-center space-x-4 font-mono text-[11px]">
                    <span>AI Confidence: <strong className="text-slate-900">{detection.confidence}%</strong></span>
                    <span>Evidence Score: <strong className="text-blue-700">{detection.evidence.combinedScore}%</strong></span>
                    <span>Frame: <strong className="text-slate-600">{detection.frameId}</strong></span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    <strong className="text-slate-800 font-semibold">Evidence trigger: </strong>
                    <span>{detection.evidence.whyFlagged[0]}</span>
                    {detection.evidence.whyFlagged.length > 1 && (
                      <span className="text-slate-500"> • {detection.evidence.whyFlagged[1]}</span>
                    )}
                  </div>
                </div>

                {/* Right Block: Status & Actions */}
                <div className="flex items-center space-x-2 min-w-[260px] justify-end">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => onValidateDetection(detection.id)}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Validate</span>
                      </button>

                      <button
                        onClick={() => onReclassifyDetection(detection.id)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Reclassify</span>
                      </button>

                      <button
                        onClick={() => onRejectDetection(detection.id)}
                        className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-red-50 text-slate-700 hover:text-red-700 font-medium text-xs transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        isValidated
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isReclassified
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-200 text-slate-700'
                      }`}>
                        {detection.review.status}
                      </span>
                      {detection.review.reviewedBy && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {detection.review.reviewedBy}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => onNavigateToSonar(detection)}
                    title="Inspect in Sonar Viewer"
                    className="p-1.5 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
