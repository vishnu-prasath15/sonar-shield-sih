import React, { useState } from 'react';
import { X, Check, Edit3, AlertCircle } from 'lucide-react';
import { Detection, AnomalyClass } from '../../types/sonar';

interface ReclassifyModalProps {
  detection: Detection;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReclassification: (detectionId: string, newClass: AnomalyClass, notes: string) => void;
}

const RECLASSIFY_OPTIONS: AnomalyClass[] = [
  'Ghost Net',
  'Pipe',
  'Wreck',
  'Debris',
  'Subsea Cable',
  'Metal Cylinder',
  'Munitions / Ordnance',
  'Natural Rock / False Positive',
  'Other'
];

export const ReclassifyModal: React.FC<ReclassifyModalProps> = ({
  detection,
  isOpen,
  onClose,
  onConfirmReclassification,
}) => {
  const [selectedClass, setSelectedClass] = useState<AnomalyClass>(detection.class);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmReclassification(
      detection.id,
      selectedClass,
      notes || `Reclassified by hydrographic operator from ${detection.class} to ${selectedClass}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-300 rounded-md shadow-elevated w-full max-w-md overflow-hidden text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Reclassify Acoustic Detection</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Detection ID:</span>
              <strong className="text-slate-800">{detection.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AI Initial Proposal:</span>
              <strong className="text-blue-700">{detection.originalClass} ({detection.confidence}%)</strong>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Select Operator Classification:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RECLASSIFY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSelectedClass(opt)}
                  className={`p-2 rounded text-left font-medium border text-[11px] transition-all flex items-center justify-between ${
                    selectedClass === opt
                      ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedClass === opt && (
                    <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Hydrographic Operator Log Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Visual verification confirms entangled trawl gear rather than isolated debris."
              className="w-full h-16 p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Classification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
