import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Calendar, 
  UserCheck, 
  Building,
  Anchor,
  Share2
} from 'lucide-react';
import { Survey, Detection } from '../../types/sonar';
import { 
  generateSurveyCSV, 
  generateSurveyJSON, 
  generateSurveyGeoJSON, 
  downloadFile 
} from '../../services/surveyDataService';

interface SurveyReportsProps {
  survey: Survey;
  detections: Detection[];
}

export const SurveyReports: React.FC<SurveyReportsProps> = ({
  survey,
  detections,
}) => {
  const [reportGenerated, setReportGenerated] = useState<boolean>(true);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const highPriorityCount = detections.filter(d => d.risk === 'HIGH').length;
  const validatedCount = detections.filter(d => d.review.status === 'Validated').length;
  const reclassifiedCount = detections.filter(d => d.review.status === 'Reclassified').length;
  const rejectedCount = detections.filter(d => d.review.status === 'Rejected').length;

  const handleExportCSV = () => {
    const csvContent = generateSurveyCSV(survey, detections);
    downloadFile(`SONAR_SHIELD_${survey.id}_REPORT.csv`, csvContent, 'text/csv');
    triggerNotice('CSV export generated & downloaded successfully.');
  };

  const handleExportJSON = () => {
    const jsonContent = generateSurveyJSON(survey, detections);
    downloadFile(`SONAR_SHIELD_${survey.id}_MANIFEST.json`, jsonContent, 'application/json');
    triggerNotice('Structured JSON Survey Manifest downloaded.');
  };

  const handleExportGeoJSON = () => {
    const geoJsonContent = generateSurveyGeoJSON(survey, detections);
    downloadFile(`SONAR_SHIELD_${survey.id}_GIS.geojson`, geoJsonContent, 'application/geo+json');
    triggerNotice('GeoJSON GIS spatial layer downloaded.');
  };

  const handlePrint = () => {
    window.print();
  };

  const triggerNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-y-auto bg-slate-100 text-slate-800 select-none p-6">
      {/* Top Action Toolbar */}
      <div className="max-w-5xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded border border-slate-200 shadow-subtle no-print">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Official Marine Anomaly Survey Report & Data Export
          </h2>
          <p className="text-xs text-slate-500">
            Compliant with International Hydrographic Organization (IHO S-44) anomaly reporting standards.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={handleExportGeoJSON}
            className="px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>EXPORT GEOJSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT REPORT</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Toast */}
      {exportNotice && (
        <div className="max-w-5xl mx-auto w-full mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Report Document Sheet (Styled for Screen & Clean A4 Print) */}
      <div className="max-w-5xl mx-auto w-full bg-white border border-slate-300 rounded shadow-md p-8 text-xs text-slate-800 space-y-6">
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                HYDROGRAPHIC ASSESSMENT
              </span>
              <span className="text-slate-400 font-mono text-xs">DOC REF: HYD-2026-0928-SS14</span>
            </div>
            <h1 className="text-xl font-bold text-slate-950 mt-1.5 tracking-tight">
              SONAR SHIELD — Marine Anomaly & Debris Intelligence Report
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Automated Acoustic Inference, Feature Fusion & Human Verification Audit
            </p>
          </div>

          <div className="text-right font-mono text-[11px] text-slate-600">
            <div>Date: <strong className="text-slate-900">{survey.surveyDate}</strong></div>
            <div>Authority: <strong className="text-slate-900">National Hydrographic Office</strong></div>
            <div>Classification: <strong className="text-emerald-700">UNRESTRICTED / MARITIME SAFETY</strong></div>
          </div>
        </div>

        {/* Survey Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Survey Mission</span>
            <strong className="text-slate-900 text-xs">{survey.id}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Survey Track ID</span>
            <strong className="text-slate-900 text-xs">{survey.trackId}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Vessel / Unit</span>
            <strong className="text-slate-900 text-xs">{survey.vesselName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Track Coverage</span>
            <strong className="text-slate-900 text-xs">{survey.coverageKm} km (150m swath)</strong>
          </div>
        </div>

        {/* Executive Anomaly Summary Strip */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 font-mono flex items-center">
            <span>1.0 EXECUTIVE OPERATIONAL SUMMARY</span>
          </h3>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Total Anomalies</span>
              <span className="text-xl font-bold font-mono text-slate-900">{detections.length}</span>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <span className="text-[10px] font-mono text-red-700 uppercase block">High Priority Hazards</span>
              <span className="text-xl font-bold font-mono text-red-700">{highPriorityCount}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
              <span className="text-[10px] font-mono text-emerald-700 uppercase block">Operator Validated</span>
              <span className="text-xl font-bold font-mono text-emerald-700">{validatedCount}</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <span className="text-[10px] font-mono text-blue-700 uppercase block">Pending Verification</span>
              <span className="text-xl font-bold font-mono text-blue-700">
                {detections.filter(d => d.review.status === 'Pending Review').length}
              </span>
            </div>
          </div>
        </div>

        {/* Comprehensive Detection Log Table */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 font-mono">
            2.0 GEOREFERENCED ANOMALY REGISTRY & ACOUSTIC EVIDENCE
          </h3>
          <div className="border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2.5 font-semibold">ID</th>
                  <th className="py-2 px-2.5 font-semibold">OBJECT CLASS</th>
                  <th className="py-2 px-2.5 font-semibold">CONFIDENCE</th>
                  <th className="py-2 px-2.5 font-semibold">EVIDENCE SCORE</th>
                  <th className="py-2 px-2.5 font-semibold">RISK</th>
                  <th className="py-2 px-2.5 font-semibold">COORDINATES</th>
                  <th className="py-2 px-2.5 font-semibold">DEPTH</th>
                  <th className="py-2 px-2.5 font-semibold">REVIEW STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {detections.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-2.5 font-bold text-slate-900">{d.id}</td>
                    <td className="py-2.5 px-2.5 font-sans font-semibold text-slate-800">
                      {d.class}
                      {d.dimensionsEstimated && (
                        <div className="text-[10px] text-slate-500 font-mono">{d.dimensionsEstimated}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5">{d.confidence}%</td>
                    <td className="py-2.5 px-2.5 font-bold text-blue-700">{d.evidence.combinedScore}%</td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        d.risk === 'HIGH' ? 'bg-red-100 text-red-800' : d.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {d.risk}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-[10px] text-slate-600">
                      {d.location.latitude.toFixed(4)}° N, {d.location.longitude.toFixed(4)}° E
                    </td>
                    <td className="py-2.5 px-2.5">{d.location.depthMeters} m</td>
                    <td className="py-2.5 px-2.5">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        d.review.status === 'Validated' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : d.review.status === 'Reclassified'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.review.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Evidence Summary for High-Priority Targets */}
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2 font-mono">
            3.0 HIGH-RISK ANOMALY FORENSIC BREAKDOWN
          </h3>
          <div className="space-y-3">
            {detections.filter(d => d.risk === 'HIGH').map((d) => (
              <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">{d.id}: Possible {d.class}</span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 font-mono font-bold text-[10px]">
                      HIGH RISK HAZARD
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Position: {d.location.latitude.toFixed(4)}°N, {d.location.longitude.toFixed(4)}°E (Depth {d.location.depthMeters}m)
                  </span>
                </div>

                <div className="text-[11px] text-slate-700">
                  <strong>Acoustic Evidence Factors: </strong>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-600">
                    {d.evidence.whyFlagged.map((why, idx) => (
                      <li key={idx}>{why}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200 flex justify-between font-mono">
                  <span>Sensor Slant Range: {d.location.slantRangeMeters}m</span>
                  <span>Review Audit: {d.review.status} {d.review.reviewedBy ? `(${d.review.reviewedBy})` : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off & Hydrographic Certification Section */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-[11px] font-mono">
          <div>
            <span className="text-slate-500 block uppercase text-[10px]">Lead Hydrographic Surveyor</span>
            <div className="mt-4 border-b border-slate-400 w-48" />
            <div className="text-slate-800 font-bold mt-1">Capt. S. Varma, M.Sc. Hydrography</div>
            <div className="text-slate-500 text-[10px]">Certified FIG/IHO/ICA Category A Surveyor</div>
          </div>

          <div>
            <span className="text-slate-500 block uppercase text-[10px]">System Validation Officer</span>
            <div className="mt-4 border-b border-slate-400 w-48" />
            <div className="text-slate-800 font-bold mt-1">SONAR SHIELD AI Processing Engine v1.4</div>
            <div className="text-slate-500 text-[10px]">Deterministic Multi-Feature Fusion Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
