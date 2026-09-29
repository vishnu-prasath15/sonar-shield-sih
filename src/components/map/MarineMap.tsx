import React, { useState, useRef } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  Crosshair, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  X, 
  Radio, 
  Navigation2,
  Anchor
} from 'lucide-react';
import { Detection, Survey } from '../../types/sonar';

interface MarineMapProps {
  survey: Survey;
  detections: Detection[];
  selectedDetection: Detection | null;
  onSelectDetection: (detection: Detection) => void;
  onNavigateToSonar: (detection: Detection) => void;
}

export const MarineMap: React.FC<MarineMapProps> = ({
  survey,
  detections,
  selectedDetection,
  onSelectDetection,
  onNavigateToSonar
}) => {
  const [zoom, setZoom] = useState<number>(1.1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer toggles
  const [showSwathCorridor, setShowSwathCorridor] = useState<boolean>(true);
  const [showBathymetry, setShowBathymetry] = useState<boolean>(true);
  const [showTrackline, setShowTrackline] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Active popup detection
  const [inspectDetection, setInspectDetection] = useState<Detection | null>(selectedDetection || (detections.length > 0 ? detections[0] : null));

  // Marine Coordinates Bounds (Bay of Bengal / Chennai Coastal Strip)
  // Lat: 13.0700 to 13.1000 N (bottom to top)
  // Lon: 80.2600 to 80.2900 E (left to right)
  const minLat = 13.0700, maxLat = 13.1000;
  const minLon = 80.2600, maxLon = 80.2900;

  // Convert GPS (lat, lon) to SVG canvas coordinates (0..900, 0..650)
  const gpsToCanvas = (lat: number, lon: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 900;
    const y = 650 - ((lat - minLat) / (maxLat - minLat)) * 650;
    return { x, y };
  };

  // Vessel Track Points
  const trackPoints = [
    { lat: 13.0730, lon: 80.2630 },
    { lat: 13.0762, lon: 80.2654 },
    { lat: 13.0790, lon: 80.2680 },
    { lat: 13.0827, lon: 80.2707 },
    { lat: 13.0850, lon: 80.2728 },
    { lat: 13.0885, lon: 80.2751 },
    { lat: 13.0920, lon: 80.2785 },
    { lat: 13.0960, lon: 80.2820 }
  ];

  const trackSvgPath = trackPoints.map((pt, i) => {
    const { x, y } = gpsToCanvas(pt.lat, pt.lon);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Swath Corridor Polygon (150m width envelope around survey track)
  const leftSwath = trackPoints.map(pt => {
    const { x, y } = gpsToCanvas(pt.lat, pt.lon - 0.0012);
    return `${x},${y}`;
  });
  const rightSwath = [...trackPoints].reverse().map(pt => {
    const { x, y } = gpsToCanvas(pt.lat, pt.lon + 0.0012);
    return `${x},${y}`;
  });
  const swathPolygonPoints = [...leftSwath, ...rightSwath].join(' ');

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex-1 flex h-[calc(100vh-105px)] overflow-hidden bg-slate-950 text-slate-100 select-none relative">
      {/* Map Left Control Sidebar & Legend */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-3.5 flex flex-col justify-between z-10 text-xs">
        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-sm tracking-tight mb-1">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Nautical GIS Workspace</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Projection: WGS84 / UTM-44N
            </p>
          </div>

          {/* Layer Controls */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              CHART LAYERS
            </span>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showTrackline}
                onChange={(e) => setShowTrackline(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Vessel Survey Track ({survey.trackId})</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showSwathCorridor}
                onChange={(e) => setShowSwathCorridor(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Side-Scan Swath (150m Corridor)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showBathymetry}
                onChange={(e) => setShowBathymetry(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Bathymetry Depth Contours</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Target ID Annotations</span>
            </label>
          </div>

          {/* Marine Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              ANOMALY STATUS LEGEND
            </span>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white/50 flex-shrink-0 animate-pulse" />
              <span>High Risk Anomaly</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white/50 flex-shrink-0" />
              <span>Medium Risk Anomaly</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white/50 flex-shrink-0" />
              <span>Validated by Operator</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-white/50 flex-shrink-0" />
              <span>Low Risk / Debris</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 pt-1">
              <span className="w-3 h-0.5 bg-blue-400 inline-block" />
              <span>Survey Trackline</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="w-3 h-3 bg-blue-900/40 border border-blue-500/30 inline-block" />
              <span>150m Sonar Coverage</span>
            </div>
          </div>
        </div>

        {/* Telemetry Status Footer */}
        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
          <div>Area: <strong>Chennai Anchorage</strong></div>
          <div>DGPS Quality: <strong className="text-emerald-400">Fixed RTK (±0.02m)</strong></div>
          <div>Active Targets: <strong className="text-white">{detections.length}</strong></div>
        </div>
      </div>

      {/* Main Map Interactive Canvas Viewport */}
      <div 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 relative overflow-hidden bg-[#0A1424] flex items-center justify-center ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Map Tool Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-1 bg-slate-900/90 border border-slate-700 p-1 rounded shadow-lg">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1.1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Reset Map View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive SVG Chart Container */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          className="relative w-[900px] h-[650px] bg-[#0c182d] border border-slate-800 rounded shadow-2xl"
        >
          <svg className="w-full h-full" viewBox="0 0 900 650">
            {/* Nautical Background Chart Grid (Graticules) */}
            <defs>
              <pattern id="nauticalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(30, 58, 100, 0.35)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="900" height="650" fill="url(#nauticalGrid)" />

            {/* Coastal Landmass (Western Shoreline on the left) */}
            <path
              d="M 0,0 L 120,0 Q 140,200 110,350 Q 80,480 130,650 L 0,650 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            <text x="35" y="320" fill="#64748b" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="bold" transform="rotate(-90 35 320)">
              MAINLAND COASTLINE
            </text>

            {/* Bathymetric Depth Contours (10m, 20m, 30m, 40m, 50m) */}
            {showBathymetry && (
              <g className="bathymetry-contours" opacity="0.6">
                {/* 15m contour */}
                <path d="M 170,0 Q 190,220 160,380 Q 140,500 180,650" fill="none" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="175" y="80" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono, monospace">15m</text>

                {/* 25m contour */}
                <path d="M 280,0 Q 300,200 270,360 Q 250,520 290,650" fill="none" stroke="#2563eb" strokeWidth="1" />
                <text x="285" y="100" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono, monospace">25m</text>

                {/* 35m contour */}
                <path d="M 450,0 Q 470,240 430,400 Q 410,540 460,650" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
                <text x="455" y="120" fill="#60a5fa" fontSize="10" fontFamily="JetBrains Mono, monospace">35m</text>

                {/* 45m contour */}
                <path d="M 680,0 Q 700,250 660,420 Q 640,550 700,650" fill="none" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="3 3" />
                <text x="685" y="140" fill="#3b82f6" fontSize="10" fontFamily="JetBrains Mono, monospace">45m</text>
              </g>
            )}

            {/* Side-Scan Sonar 150m Swath Corridor (Polygon) */}
            {showSwathCorridor && (
              <polygon
                points={swathPolygonPoints}
                fill="rgba(37, 99, 235, 0.15)"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
            )}

            {/* Vessel Trackline */}
            {showTrackline && (
              <path
                d={trackSvgPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Survey Waypoint Nodes */}
            {trackPoints.map((pt, i) => {
              const { x, y } = gpsToCanvas(pt.lat, pt.lon);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              );
            })}

            {/* Vessel Current Position & Towfish Acoustic Transducer Indicator */}
            {(() => {
              const vesselPos = gpsToCanvas(13.0850, 80.2728);
              return (
                <g transform={`translate(${vesselPos.x}, ${vesselPos.y})`}>
                  {/* Acoustic Pulse Wave Animation */}
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6">
                    <animate attributeName="r" values="6;26" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Towfish Body */}
                  <circle cx="0" cy="0" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Heading Vector */}
                  <line x1="0" y1="0" x2="3" y2="18" stroke="#f43f5e" strokeWidth="2" />
                  <text x="8" y="4" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                    RV SAMUDRA [4.2 kts]
                  </text>
                </g>
              );
            })()}

            {/* Georeferenced Anomaly Markers */}
            {detections.map((detection) => {
              const { x, y } = gpsToCanvas(detection.location.latitude, detection.location.longitude);
              const isSelected = inspectDetection?.id === detection.id;
              const isHighRisk = detection.risk === 'HIGH';
              const isMediumRisk = detection.risk === 'MEDIUM';
              const isValidated = detection.review.status === 'Validated';

              let pinColor = '#3b82f6';
              if (isValidated) pinColor = '#10b981';
              else if (isHighRisk) pinColor = '#ef4444';
              else if (isMediumRisk) pinColor = '#f59e0b';

              return (
                <g
                  key={detection.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectDetection(detection);
                    onSelectDetection(detection);
                  }}
                >
                  {/* Selected Ripple Ring */}
                  {isSelected && (
                    <circle cx="0" cy="0" r="14" fill="none" stroke={pinColor} strokeWidth="2" strokeDasharray="3 2" />
                  )}

                  {/* Marker Pin */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? "7" : "5.5"}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-150 group-hover:scale-125"
                  />

                  {/* High Risk Pulse Ring */}
                  {isHighRisk && !isValidated && (
                    <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.7" />
                  )}

                  {/* Label */}
                  {showLabels && (
                    <g transform="translate(10, 3)">
                      <rect x="-2" y="-9" width="76" height="15" rx="2" fill="#0f172a" stroke={pinColor} strokeWidth="0.8" opacity="0.9" />
                      <text x="2" y="2" fill="#f8fafc" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
                        {detection.id} [{detection.class.substring(0, 5)}]
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Latitude / Longitude Graticule Labels */}
            <g fill="#64748b" fontSize="9" fontFamily="JetBrains Mono, monospace">
              <text x="140" y="640">80.265°E</text>
              <text x="370" y="640">80.272°E</text>
              <text x="630" y="640">80.280°E</text>
              <text x="840" y="640">80.288°E</text>

              <text x="840" y="580">13.073°N</text>
              <text x="840" y="380">13.083°N</text>
              <text x="840" y="180">13.093°N</text>
            </g>
          </svg>
        </div>

        {/* Target Inspector Popup Drawer (Bottom Right) */}
        {inspectDetection && (
          <div className="absolute bottom-4 right-4 w-80 bg-slate-900 border border-slate-700 rounded shadow-2xl z-30 p-3.5 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center space-x-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  inspectDetection.review.status === 'Validated'
                    ? 'bg-emerald-500'
                    : inspectDetection.risk === 'HIGH'
                      ? 'bg-red-500'
                      : inspectDetection.risk === 'MEDIUM'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                }`} />
                <span className="font-bold text-white font-mono">{inspectDetection.id}</span>
                <span className="text-slate-400 font-semibold">• {inspectDetection.class}</span>
              </div>
              <button
                onClick={() => setInspectDetection(null)}
                className="text-slate-500 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Priority:</span>
                <strong className={`font-bold ${
                  inspectDetection.risk === 'HIGH' ? 'text-red-400' : inspectDetection.risk === 'MEDIUM' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {inspectDetection.risk}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Confidence:</span>
                <strong className="text-white">{inspectDetection.confidence}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Evidence Score:</span>
                <strong className="text-blue-400">{inspectDetection.evidence.combinedScore}%</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latitude:</span>
                <strong className="text-slate-200">{inspectDetection.location.latitude.toFixed(4)}° N</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Longitude:</span>
                <strong className="text-slate-200">{inspectDetection.location.longitude.toFixed(4)}° E</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seabed Depth:</span>
                <strong className="text-slate-200">{inspectDetection.location.depthMeters} m</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Review Status:</span>
                <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                  inspectDetection.review.status === 'Validated' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {inspectDetection.review.status}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => onNavigateToSonar(inspectDetection)}
                className="w-full py-1.5 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open in Sonar Viewer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
