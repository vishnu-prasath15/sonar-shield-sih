import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Eye, 
  MapPin, 
  Download,
  Check
} from 'lucide-react';
import { Detection, AnomalyClass, RiskLevel, ReviewStatus } from '../../types/sonar';

interface DetectionsPageProps {
  detections: Detection[];
  onSelectDetectionAndNavigate: (detection: Detection, targetView: 'sonar' | 'review' | 'map') => void;
  onValidateDetection: (detectionId: string) => void;
  onReclassifyDetection: (detectionId: string) => void;
}

type FilterCategory = 'ALL' | AnomalyClass | 'HIGH_RISK' | 'PENDING' | 'VALIDATED';

export const DetectionsPage: React.FC<DetectionsPageProps> = ({
  detections,
  onSelectDetectionAndNavigate,
  onValidateDetection,
  onReclassifyDetection
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'id' | 'confidence' | 'evidenceScore' | 'risk' | 'status'>('risk');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter and Search logic
  const filteredDetections = useMemo(() => {
    return detections.filter(d => {
      // Filter Category
      if (activeFilter === 'Ghost Net' && d.class !== 'Ghost Net') return false;
      if (activeFilter === 'Pipe' && d.class !== 'Pipe') return false;
      if (activeFilter === 'Wreck' && d.class !== 'Wreck') return false;
      if (activeFilter === 'Debris' && d.class !== 'Debris') return false;
      if (activeFilter === 'HIGH_RISK' && d.risk !== 'HIGH') return false;
      if (activeFilter === 'PENDING' && d.review.status !== 'Pending Review') return false;
      if (activeFilter === 'VALIDATED' && d.review.status !== 'Validated') return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = d.id.toLowerCase().includes(query);
        const matchClass = d.class.toLowerCase().includes(query);
        const matchFrame = d.frameId.toLowerCase().includes(query);
        const matchReasons = d.evidence.whyFlagged.some(r => r.toLowerCase().includes(query));
        if (!matchId && !matchClass && !matchFrame && !matchReasons) return false;
      }

      return true;
    });
  }, [detections, activeFilter, searchQuery]);

  // Sorting
  const sortedDetections = useMemo(() => {
    return [...filteredDetections].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'confidence') {
        comparison = a.confidence - b.confidence;
      } else if (sortField === 'evidenceScore') {
        comparison = a.evidence.combinedScore - b.evidence.combinedScore;
      } else if (sortField === 'risk') {
        const riskWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = riskWeight[a.risk] - riskWeight[b.risk];
      } else if (sortField === 'status') {
        comparison = a.review.status.localeCompare(b.review.status);
      }
      return sortAsc ? comparison : -comparison;
    });
  }, [filteredDetections, sortField, sortAsc]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filterButtons: { id: FilterCategory; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Anomalies', count: detections.length },
    { id: 'Ghost Net', label: 'Ghost Nets', count: detections.filter(d => d.class === 'Ghost Net').length },
    { id: 'Pipe', label: 'Pipes', count: detections.filter(d => d.class === 'Pipe').length },
    { id: 'Wreck', label: 'Wrecks', count: detections.filter(d => d.class === 'Wreck').length },
    { id: 'Debris', label: 'Debris', count: detections.filter(d => d.class === 'Debris').length },
    { id: 'HIGH_RISK', label: 'High Risk', count: detections.filter(d => d.risk === 'HIGH').length },
    { id: 'PENDING', label: 'Pending Review', count: detections.filter(d => d.review.status === 'Pending Review').length },
    { id: 'VALIDATED', label: 'Validated', count: detections.filter(d => d.review.status === 'Validated').length },
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-white text-slate-800 select-none">
      {/* Page Header & Controls Strip */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center">
            <TableIcon className="w-4 h-4 mr-2 text-blue-600" />
            Hydrographic Anomaly Registry & Detection Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive georeferenced anomaly log with explainable acoustic evidence scores and operator audit trail.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, class, reasons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded bg-white w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto">
        <span className="text-xs font-mono uppercase text-slate-400 mr-2 flex items-center">
          <Filter className="w-3 h-3 mr-1" />
          Filters:
        </span>
        {filterButtons.map(btn => (
          <button
            key={btn.id}
            onClick={() => setActiveFilter(btn.id)}
            className={`px-2.5 py-1 text-xs rounded font-medium transition-all flex items-center space-x-1.5 ${
              activeFilter === btn.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{btn.label}</span>
            {btn.count !== undefined && (
              <span className={`text-[10px] font-mono px-1 rounded ${
                activeFilter === btn.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
              }`}>
                {btn.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Detections Data Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 font-mono text-[11px]">
            <tr>
              <th 
                onClick={() => handleSort('id')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>DETECTION ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">CLASSIFICATION</th>
              <th 
                onClick={() => handleSort('confidence')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>CONFIDENCE</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('evidenceScore')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>EVIDENCE SCORE</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('risk')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>RISK PRIORITY</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold">COORDINATES</th>
              <th className="py-2.5 px-3 font-semibold">DEPTH</th>
              <th 
                onClick={() => handleSort('status')}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>REVIEW STATUS</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono">
            {sortedDetections.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No detections matching current filter.
                </td>
              </tr>
            ) : (
              sortedDetections.map((d) => {
                const isHighRisk = d.risk === 'HIGH';
                const isMediumRisk = d.risk === 'MEDIUM';
                const isValidated = d.review.status === 'Validated';
                const isReclassified = d.review.status === 'Reclassified';
                const isRejected = d.review.status === 'Rejected';

                return (
                  <tr 
                    key={d.id}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    {/* ID & Frame */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{d.id}</div>
                      <div className="text-[10px] text-slate-500">{d.frameId}</div>
                    </td>

                    {/* Class */}
                    <td className="py-3 px-3">
                      <div className="font-sans font-semibold text-slate-800 text-xs">
                        {d.class}
                      </div>
                      {d.dimensionsEstimated && (
                        <div className="text-[10px] text-slate-500">{d.dimensionsEstimated}</div>
                      )}
                    </td>

                    {/* Confidence */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{d.confidence}%</div>
                      <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${d.confidence}%` }} 
                        />
                      </div>
                    </td>

                    {/* Evidence Score */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-blue-700">{d.evidence.combinedScore}%</div>
                      <div className="text-[9px] text-slate-400 font-sans">Multi-fusion</div>
                    </td>

                    {/* Risk Priority */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighRisk 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : isMediumRisk 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                          isHighRisk ? 'bg-red-600' : isMediumRisk ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                        {d.risk}
                      </span>
                    </td>

                    {/* Coordinates */}
                    <td className="py-3 px-3 text-[11px] text-slate-600">
                      <div>{d.location.latitude.toFixed(4)}° N</div>
                      <div>{d.location.longitude.toFixed(4)}° E</div>
                    </td>

                    {/* Depth */}
                    <td className="py-3 px-3 text-[11px] text-slate-700">
                      {d.location.depthMeters} m
                    </td>

                    {/* Review Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        isValidated
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isReclassified
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : isRejected
                              ? 'bg-slate-200 text-slate-700 border border-slate-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {d.review.status}
                      </span>
                      {d.review.reviewedBy && (
                        <div className="text-[9px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                          by {d.review.reviewedBy}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectDetectionAndNavigate(d, 'sonar')}
                          title="Inspect in Sonar Analysis Workspace"
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium font-sans flex items-center space-x-1 shadow-xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => onSelectDetectionAndNavigate(d, 'map')}
                          title="Locate on Nautical GIS Map"
                          className="p-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-600"
                        >
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                        </button>
                        {d.review.status === 'Pending Review' && (
                          <button
                            onClick={() => onValidateDetection(d.id)}
                            title="Quick Validate"
                            className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Strip */}
      <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-500 flex justify-between items-center">
        <span>Showing {sortedDetections.length} of {detections.length} total hydrographic anomalies</span>
        <span>Standard: IHO S-44 Order 1a Navigational Safety Survey</span>
      </div>
    </div>
  );
};
