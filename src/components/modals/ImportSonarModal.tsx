import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCode, 
  Check, 
  Radio, 
  Layers, 
  Cpu, 
  AlertCircle,
  Download,
  ExternalLink,
  HardDrive,
  Database
} from 'lucide-react';
import { SonarFrame } from '../../types/sonar';
import { downloadFile } from '../../services/surveyDataService';

interface ImportSonarModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  onImportFrame: (frame: SonarFrame) => void;
}

export const ImportSonarModal: React.FC<ImportSonarModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  onImportFrame
}) => {
  const [fileName, setFileName] = useState<string>('survey_014_005_ext.sonar');
  const [rangeMeters, setRangeMeters] = useState<number>(75);
  const [frequencyKhz, setFrequencyKhz] = useState<number>(455);
  const [pingStart, setPingStart] = useState<number>(8900);
  const [pingEnd, setPingEnd] = useState<number>(9924);
  const [depthMeters, setDepthMeters] = useState<number>(34.2);
  const [headingDegrees, setHeadingDegrees] = useState<number>(184.0);
  const [fileFormat, setFileFormat] = useState<string>('eXtended Triton Format (.xtf)');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFrame: SonarFrame = {
      id: fileName.trim() || `survey_014_${Date.now().toString().slice(-3)}.sonar`,
      name: `${fileName.trim()} (Ping ${pingStart}-${pingEnd})`,
      surveyId,
      pingStart,
      pingEnd,
      rangeMeters,
      frequencyKhz,
      headingDegrees,
      depthMeters,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      durationSeconds: 120,
      fileSizeBytes: '32.6 MB',
      detections: [],
      rawImage: 'frame_001',
      isAnalyzed: false,
      status: 'Unprocessed'
    };

    onImportFrame(newFrame);
    onClose();
  };

  // Helper to generate instant realistic sample sonar data files for local testing
  const handleDownloadSampleFile = (format: 'xtf' | 'jsf' | 'sonar' | 'sgy') => {
    let content = '';
    let mimeType = 'application/octet-stream';
    let downloadedName = '';

    if (format === 'xtf') {
      downloadedName = 'SSS_BAY_OF_BENGAL_TRACK014.xtf';
      content = `XTF_HEADER_V1.40\n` +
        `SONAR_TYPE=EDGE_TECH_4200_DUAL_SSS\n` +
        `FREQUENCY=455KHZ_CHIRP\n` +
        `CHANNELS=2 (PORT=1, STARBOARD=2)\n` +
        `RANGE_METERS=75.0\n` +
        `SOUND_VELOCITY=1524.0 m/s\n` +
        `DATUM=WGS84\n` +
        `PING_COUNT=1024\n` +
        `ACQUISITION_TIMESTAMP=2026-09-28T07:14:22Z\n` +
        `[BINARY ACOUSTIC PING STREAM 455kHz / 900kHz - 1024 PINGS INDEXED]`;
    } else if (format === 'jsf') {
      downloadedName = 'EDGETECH_4200_ACQUISITION_PINGS.jsf';
      content = `JSF_PROTOCOL_REV_1.26\n` +
        `SUBSYSTEM=SIDE_SCAN_SONAR_HIGH_DEF\n` +
        `FREQ_KHZ=900\n` +
        `SAMPLE_RATE=40000\n` +
        `USBL_LAYBACK=42.8m\n` +
        `TOWFISH_ALTITUDE=8.2m\n` +
        `[EDGETECH ACOUSTIC PACKETS 0x1600 / 0x0080 COMPLIANT]`;
    } else if (format === 'sonar') {
      downloadedName = 'survey_014_005_deepwater.sonar';
      content = `RAW_SONAR_STREAM_V3\n` +
        `SURVEY=SURV-2026-CHN-014\n` +
        `LAT_START=13.0827\n` +
        `LON_START=80.2707\n` +
        `DEPTH_METERS=32.4\n` +
        `SWATH_WIDTH=150.0\n` +
        `[SIDE SCAN ACOUSTIC WATERFALL DATA - PORT/STARBOARD 1024 CHANNELS]`;
    } else if (format === 'sgy') {
      downloadedName = 'SEABED_ACOUSTIC_GRID_LINE14.sgy';
      content = `C01 SEG Y STANDARD ACOUSTIC SIDE SCAN FORMAT\n` +
        `C02 CLIENT: NATIONAL HYDROGRAPHIC OFFICE\n` +
        `C03 SURVEY: BAY OF BENGAL ANOMALY CORRIDOR\n` +
        `C04 SAMPLE INTERVAL: 25 microsec, TRACES PER ENVELOPE: 2048\n` +
        `[SEG-Y TRACE HEADERS AND REFLECTION AMPLITUDES]`;
    }

    downloadFile(downloadedName, content, mimeType);
    setDownloadSuccess(`Downloaded test sample: ${downloadedName}`);
    setFileName(downloadedName);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-300 rounded-md shadow-elevated w-full max-w-xl overflow-hidden text-xs text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Import Acoustic Sonar Acquisition File</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Notice Banner */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded text-[11px] flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Quick-Download Sample Test Files Section */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 font-mono text-[10px] uppercase flex items-center">
                <Database className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Quick Test Sample Acoustic Files
              </span>
              <span className="text-[10px] text-slate-400">Instant Download</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Click any sample file below to download a ready-to-test sonar acquisition file with headers:
            </p>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDownloadSampleFile('xtf')}
                className="p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-colors flex flex-col items-start"
              >
                <span className="font-mono font-bold text-blue-700 text-xs">.XTF</span>
                <span className="text-[9px] text-slate-500">Triton Format</span>
                <span className="text-[9px] text-blue-600 mt-1 flex items-center">
                  <Download className="w-2.5 h-2.5 mr-0.5" /> Download
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadSampleFile('jsf')}
                className="p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-colors flex flex-col items-start"
              >
                <span className="font-mono font-bold text-blue-700 text-xs">.JSF</span>
                <span className="text-[9px] text-slate-500">EdgeTech Stream</span>
                <span className="text-[9px] text-blue-600 mt-1 flex items-center">
                  <Download className="w-2.5 h-2.5 mr-0.5" /> Download
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadSampleFile('sonar')}
                className="p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-colors flex flex-col items-start"
              >
                <span className="font-mono font-bold text-blue-700 text-xs">.SONAR</span>
                <span className="text-[9px] text-slate-500">Raw Dual SSS</span>
                <span className="text-[9px] text-blue-600 mt-1 flex items-center">
                  <Download className="w-2.5 h-2.5 mr-0.5" /> Download
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadSampleFile('sgy')}
                className="p-2 rounded bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-400 text-left transition-colors flex flex-col items-start"
              >
                <span className="font-mono font-bold text-blue-700 text-xs">.SGY</span>
                <span className="text-[9px] text-slate-500">SEG-Y Grid</span>
                <span className="text-[9px] text-blue-600 mt-1 flex items-center">
                  <Download className="w-2.5 h-2.5 mr-0.5" /> Download
                </span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer">
            <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-1" />
            <div className="font-semibold text-slate-800">Select or drop raw sonar files from local disk</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
              Accepted: .XTF, .SONAR, .JSF, .SGY, .DAT (eXtended Triton & EdgeTech High-Definition)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Acquisition File Name:
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Acoustic Format:
              </label>
              <select
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="eXtended Triton Format (.xtf)">eXtended Triton Format (.xtf)</option>
                <option value="EdgeTech JSF Stream (.jsf)">EdgeTech JSF Stream (.jsf)</option>
                <option value="Raw Side-Scan Sonar (.sonar)">Raw Side-Scan Sonar (.sonar)</option>
                <option value="SEG-Y Acoustic Grid (.sgy)">SEG-Y Acoustic Grid (.sgy)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Swath Range (m):
              </label>
              <select
                value={rangeMeters}
                onChange={(e) => setRangeMeters(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
              >
                <option value="50">50 m (Port/Stbd)</option>
                <option value="75">75 m (Port/Stbd)</option>
                <option value="100">100 m (Port/Stbd)</option>
                <option value="150">150 m (Port/Stbd)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Frequency Mode:
              </label>
              <select
                value={frequencyKhz}
                onChange={(e) => setFrequencyKhz(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
              >
                <option value="455">455 kHz Primary</option>
                <option value="900">900 kHz Detail</option>
                <option value="1600">1600 kHz SAS-PRO</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Chart Depth (m):
              </label>
              <input
                type="number"
                step="0.1"
                value={depthMeters}
                onChange={(e) => setDepthMeters(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Ping Sequence:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={pingStart}
                  onChange={(e) => setPingStart(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs"
                />
                <span>-</span>
                <input
                  type="number"
                  value={pingEnd}
                  onChange={(e) => setPingEnd(Number(e.target.value))}
                  className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Vessel Heading (°):
              </label>
              <input
                type="number"
                step="0.1"
                value={headingDegrees}
                onChange={(e) => setHeadingDegrees(Number(e.target.value))}
                className="w-full p-1.5 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
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
              <span>Ingest & Index Acquisition</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
