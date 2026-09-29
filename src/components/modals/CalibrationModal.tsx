import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Check, 
  Compass, 
  Waves, 
  Cpu, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';
import { SurveyCalibration } from '../../types/sonar';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calibration: SurveyCalibration;
  onSaveCalibration: (cal: SurveyCalibration) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  calibration,
  onSaveCalibration
}) => {
  const [formData, setFormData] = useState<SurveyCalibration>(calibration);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCalibration(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-300 rounded-md shadow-elevated w-full max-w-lg overflow-hidden text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Hydrographic Sensor & Acoustic Calibration</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Group 1: Sound Velocity & Oceanographic Medium */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center text-[11px] uppercase tracking-wider">
              <Waves className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              1. Sound Velocity Profiler (SVP) Calibration
            </h4>
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <label className="block text-slate-600 text-[11px] mb-1 font-mono">
                  Sound Speed (m/s):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.soundVelocityMs}
                  onChange={(e) => setFormData({ ...formData, soundVelocityMs: Number(e.target.value) })}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] mb-1 font-mono">
                  Salinity (PSU):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.salinityPsu}
                  onChange={(e) => setFormData({ ...formData, salinityPsu: Number(e.target.value) })}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] mb-1 font-mono">
                  Water Temp (°C):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waterTemperatureC}
                  onChange={(e) => setFormData({ ...formData, waterTemperatureC: Number(e.target.value) })}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Towfish Geometry & USBL Positioning */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center text-[11px] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              2. Towfish Geometry & USBL Layback Offsets
            </h4>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <label className="block text-slate-600 text-[11px] mb-1 font-mono">
                  Towfish Layback (m):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.towfishLaybackM}
                  onChange={(e) => setFormData({ ...formData, towfishLaybackM: Number(e.target.value) })}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-[11px] mb-1 font-mono">
                  Target Altitude (m):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.towfishAltitudeTargetM}
                  onChange={(e) => setFormData({ ...formData, towfishAltitudeTargetM: Number(e.target.value) })}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Hydrographic Compliance Standard */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              3. IHO Hydrographic Survey Standard
            </h4>
            <select
              value={formData.ihoOrderStandard}
              onChange={(e) => setFormData({ ...formData, ihoOrderStandard: e.target.value as any })}
              className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="IHO S-44 Order 1a">IHO S-44 Order 1a (Navigational Fairways & Harbours)</option>
              <option value="IHO S-44 Special Order">IHO S-44 Special Order (Critical Underkeel Clearances)</option>
              <option value="IHO S-44 Order 1b">IHO S-44 Order 1b (Offshore Continental Shelf)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
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
              <span>Apply Calibrations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
