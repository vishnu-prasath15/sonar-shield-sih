import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Layers, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { PipelineStep } from '../../types/sonar';

interface PipelineProgressModalProps {
  isOpen: boolean;
  steps: PipelineStep[];
  logs: string[];
  activeStepId: string;
}

export const PipelineProgressModal: React.FC<PipelineProgressModalProps> = ({
  isOpen,
  steps,
  logs,
  activeStepId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="bg-slate-900 border border-slate-700 rounded shadow-2xl w-full max-w-xl overflow-hidden text-xs text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
            <h3 className="font-bold text-sm tracking-wide text-white font-mono">
              AI ACOUSTIC INFERENCE PIPELINE
            </h3>
          </div>
          <span className="font-mono text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            ENGINE: YOLO-V11 + SAS FUSION
          </span>
        </div>

        {/* Steps Visual List */}
        <div className="p-4 space-y-2.5 bg-slate-900/90">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isWaiting = step.status === 'waiting';

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded border transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-950/70 border-blue-500 text-blue-100 shadow-md ring-1 ring-blue-400/40'
                    : isCompleted
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 font-mono text-[10px] font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : (
                      <span className="text-slate-600 border border-slate-700 w-5 h-5 rounded flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className={`font-semibold ${isActive ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                    {step.detail && isActive && (
                      <p className="text-[10px] font-mono text-blue-300 mt-0.5 animate-pulse">
                        › {step.detail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="font-mono text-[10px] text-right">
                  {isCompleted ? (
                    <span className="text-emerald-400 font-semibold">DONE</span>
                  ) : isActive ? (
                    <span className="text-blue-400 font-semibold animate-pulse">PROCESSING</span>
                  ) : (
                    <span className="text-slate-600">QUEUED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Terminal Output Box */}
        <div className="px-4 py-2.5 bg-black border-t border-slate-800 font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1 border-b border-slate-800 pb-0.5">
            <Terminal className="w-3 h-3 text-slate-400" />
            <span>INFERENCE TELEMETRY LOG</span>
          </div>
          <div className="space-y-0.5">
            {logs.slice(-3).map((log, i) => (
              <div key={i} className="text-slate-300 truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
