import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Move, 
  Ruler, 
  Sliders, 
  Sun, 
  RotateCcw, 
  Grid, 
  Play, 
  Layers, 
  Crosshair, 
  Eye, 
  EyeOff, 
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SonarFrame, Detection, SonarPalette } from '../../types/sonar';
import { renderSonarFrameToCanvas, SONAR_PALETTES } from '../../utils/sonarImageGenerator';

interface SonarViewerProps {
  frame: SonarFrame;
  selectedDetection: Detection | null;
  onSelectDetection: (detection: Detection) => void;
  detectionMode: 'RAW' | 'AI';
  onToggleDetectionMode: (mode: 'RAW' | 'AI') => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  palette: SonarPalette;
  onChangePalette: (p: SonarPalette) => void;
}

export const SonarViewer: React.FC<SonarViewerProps> = ({
  frame,
  selectedDetection,
  onSelectDetection,
  detectionMode,
  onToggleDetectionMode,
  onRunAnalysis,
  isAnalyzing,
  palette,
  onChangePalette
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Adjustments
  const [contrast, setContrast] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [showAdjustments, setShowAdjustments] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showNadir, setShowNadir] = useState<boolean>(true);

  // Measurement Tool
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);

  // Mouse Crosshair Telemetry
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; rangeMeters: number; side: 'PORT' | 'STBD' | 'NADIR'; depthEst: number } | null>(null);

  // Render canvas whenever frame, palette, contrast, brightness, or guides change
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 700;

    renderSonarFrameToCanvas(canvas, frame.id, {
      palette,
      contrast,
      brightness,
      showNadirGuide: showNadir,
      showRangeGrid: showGrid,
    });
  }, [frame.id, palette, contrast, brightness, showGrid, showNadir]);

  // Handle Zoom In / Out / Reset
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleFit = () => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
  };
  const handleReset = () => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
    setContrast(100);
    setBrightness(100);
    setMeasureMode(false);
    setMeasurePoints(null);
  };

  // Mouse / Pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (measureMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / zoom;
      const y = (e.clientY - rect.top - panOffset.y) / zoom;
      setIsMeasuring(true);
      setMeasurePoints({ x1: x, y1: y, x2: x, y2: y });
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Calculate acoustic telemetry relative to image
    const normX = (clientX - panOffset.x) / (rect.width * zoom);
    const midX = 0.5;
    const distFromCenter = normX - midX;
    const maxRange = frame.rangeMeters; // 75m
    const rangeVal = Math.abs(distFromCenter) * 2 * maxRange;

    let side: 'PORT' | 'STBD' | 'NADIR' = 'NADIR';
    if (distFromCenter < -0.08) side = 'PORT';
    else if (distFromCenter > 0.08) side = 'STBD';

    setCursorPos({
      x: clientX,
      y: clientY,
      rangeMeters: Math.round(rangeVal * 10) / 10,
      side,
      depthEst: Math.round((frame.depthMeters + (normX - 0.5) * 1.5) * 10) / 10
    });

    if (isPanning && !measureMode) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (isMeasuring && measurePoints) {
      const x = (clientX - panOffset.x) / zoom;
      const y = (clientY - panOffset.y) / zoom;
      setMeasurePoints(prev => prev ? { ...prev, x2: x, y2: y } : null);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsMeasuring(false);
  };

  // Calculate measured distance in physical meters
  const getMeasuredDistanceMeters = () => {
    if (!measurePoints || !containerRef.current) return null;
    const containerWidth = containerRef.current.clientWidth || 1000;
    const dx = Math.abs(measurePoints.x2 - measurePoints.x1);
    const dy = Math.abs(measurePoints.y2 - measurePoints.y1);
    const pixelDist = Math.sqrt(dx * dx + dy * dy);
    // 1000px = 150m total swath (75m port + 75m stbd) -> 0.15m per pixel
    const meters = (pixelDist / containerWidth) * 150;
    return meters.toFixed(2);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden relative select-none">
      {/* Top Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between z-20">
        {/* Left: Detection Mode Selector & Run AI Button */}
        <div className="flex items-center space-x-3">
          {/* Mode Toggle: RAW vs AI DETECTION */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => onToggleDetectionMode('RAW')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                detectionMode === 'RAW'
                  ? 'bg-slate-800 text-slate-100 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RAW
            </button>
            <button
              onClick={() => onToggleDetectionMode('AI')}
              className={`px-3 py-1 text-xs font-semibold rounded flex items-center space-x-1.5 transition-colors ${
                detectionMode === 'AI'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-blue-200" />
              <span>AI DETECTION</span>
            </button>
          </div>

          {/* RUN AI ANALYSIS Button */}
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-xs font-bold transition-all shadow-sm ${
              isAnalyzing
                ? 'bg-blue-800 text-blue-200 cursor-wait animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-2 focus:ring-emerald-400'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>PROCESSING PIPELINE...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-emerald-100" />
                <span>RUN AI ANALYSIS</span>
              </>
            )}
          </button>

          {frame.isAnalyzed && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              {frame.detections.length} candidate anomalies detected
            </span>
          )}
        </div>

        {/* Center: Color Palette Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded">
          <span className="text-[10px] uppercase font-mono text-slate-400 mr-1.5">Palette:</span>
          {(['copper', 'amber', 'coolblue', 'grayscale'] as SonarPalette[]).map((p) => (
            <button
              key={p}
              onClick={() => onChangePalette(p)}
              className={`px-2 py-0.5 text-[11px] rounded font-medium capitalize transition-colors ${
                palette === p
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {p === 'coolblue' ? 'Slate' : p}
            </button>
          ))}
        </div>

        {/* Right: Sonar Workspace Tool Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Fit to Window"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Measurement Tool */}
          <button
            onClick={() => {
              setMeasureMode(!measureMode);
              if (measureMode) setMeasurePoints(null);
            }}
            title="Measure Acoustic Distance"
            className={`p-1.5 rounded transition-colors flex items-center space-x-1 text-xs font-mono ${
              measureMode
                ? 'bg-amber-600 text-white ring-1 ring-amber-400'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span className="text-[10px]">Measure</span>
          </button>

          {/* Contrast & Brightness Popover Toggle */}
          <button
            onClick={() => setShowAdjustments(!showAdjustments)}
            title="Acoustic Contrast & Gain Adjustment"
            className={`p-1.5 rounded transition-colors ${
              showAdjustments
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Range Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Range Graticule"
            className={`p-1.5 rounded transition-colors ${
              showGrid
                ? 'bg-slate-800 text-blue-400'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          <button
            onClick={handleReset}
            title="Reset Viewer Controls"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Adjustments Dropdown Panel */}
      {showAdjustments && (
        <div className="absolute top-11 right-12 z-30 bg-slate-900 border border-slate-700 shadow-elevated p-3 rounded w-64 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200">Acoustic Gain Calibration</span>
            <button 
              onClick={() => { setContrast(100); setBrightness(100); }} 
              className="text-[10px] text-blue-400 hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Contrast Gain</span>
                <span className="font-mono text-slate-200">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Brightness / TVG</span>
                <span className="font-mono text-slate-200">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Central Viewport & Canvas Area */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 relative overflow-hidden bg-black flex items-center justify-center ${
          measureMode ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-crosshair'
        }`}
      >
        {/* Waterfall Container with Zoom & Pan */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning || isMeasuring ? 'none' : 'transform 0.1s ease-out'
          }}
          className="relative max-w-full max-h-full"
        >
          {/* Main Sonar Canvas */}
          <canvas
            ref={canvasRef}
            className="block shadow-2xl bg-black border border-slate-900"
            style={{ width: '900px', height: '620px' }}
          />

          {/* AI Detection Overlays (Only visible when AI DETECTION is active) */}
          {detectionMode === 'AI' && frame.isAnalyzed && frame.detections.map((detection) => {
            const isSelected = selectedDetection?.id === detection.id;
            const isHighRisk = detection.risk === 'HIGH';
            const isMediumRisk = detection.risk === 'MEDIUM';

            return (
              <div
                key={detection.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDetection(detection);
                }}
                style={{
                  left: `${detection.box.x}%`,
                  top: `${detection.box.y}%`,
                  width: `${detection.box.width}%`,
                  height: `${detection.box.height}%`,
                }}
                className={`absolute transition-all duration-150 cursor-pointer group ${
                  isSelected
                    ? 'border-2 border-blue-400 bg-blue-500/15 ring-2 ring-blue-400/40 z-20'
                    : isHighRisk
                      ? 'border border-red-500/90 bg-red-950/20 hover:border-red-400 hover:bg-red-900/30'
                      : isMediumRisk
                        ? 'border border-amber-500/90 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-900/30'
                        : 'border border-blue-500/80 bg-blue-950/20 hover:border-blue-300'
                }`}
              >
                {/* Technical Corner Bracket Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white/80" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white/80" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white/80" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white/80" />

                {/* Tag Label Header */}
                <div className={`absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-sm flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isHighRisk
                      ? 'bg-red-600 text-white'
                      : isMediumRisk
                        ? 'bg-amber-600 text-slate-900'
                        : 'bg-slate-800 text-slate-200'
                }`}>
                  <span>{detection.class.toUpperCase()}</span>
                  <span className="opacity-90 font-mono">[{detection.confidence}%]</span>
                </div>

                {/* Subtitle with Risk */}
                <div className="absolute -bottom-5 left-0 px-1 py-0.2 rounded text-[9px] font-mono font-semibold bg-slate-950/80 text-slate-300 border border-slate-800">
                  {detection.id} • {detection.risk} RISK
                </div>
              </div>
            );
          })}

          {/* Measurement Overlay Line */}
          {measurePoints && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
              <line
                x1={measurePoints.x1}
                y1={measurePoints.y1}
                x2={measurePoints.x2}
                y2={measurePoints.y2}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle cx={measurePoints.x1} cy={measurePoints.y1} r="4" fill="#F59E0B" />
              <circle cx={measurePoints.x2} cy={measurePoints.y2} r="4" fill="#F59E0B" />
              {getMeasuredDistanceMeters() && (
                <g transform={`translate(${(measurePoints.x1 + measurePoints.x2) / 2}, ${(measurePoints.y1 + measurePoints.y2) / 2 - 10})`}>
                  <rect x="-35" y="-12" width="70" height="20" rx="3" fill="#0F172A" stroke="#F59E0B" />
                  <text x="0" y="2" fill="#F59E0B" fontSize="11" fontFamily="JetBrains Mono, monospace" textAnchor="middle" fontWeight="bold">
                    {getMeasuredDistanceMeters()} m
                  </text>
                </g>
              )}
            </svg>
          )}
        </div>

        {/* Subtle Scale Bar Overlay */}
        <div className="absolute bottom-12 left-4 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded z-10 pointer-events-none text-xs font-mono">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
            <span>0m</span>
            <span>25m</span>
            <span>50m</span>
          </div>
          <div className="w-32 h-1.5 bg-slate-700 flex">
            <div className="w-1/2 h-full bg-slate-200 border-r border-slate-900" />
            <div className="w-1/2 h-full bg-slate-400" />
          </div>
          <div className="text-[9px] text-slate-400 text-center mt-0.5">Acoustic Scale</div>
        </div>

        {/* Channel Indicators */}
        <div className="absolute top-3 left-4 bg-slate-950/70 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800 pointer-events-none">
          PORT SWATH (-75m)
        </div>
        <div className="absolute top-3 right-4 bg-slate-950/70 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800 pointer-events-none">
          STARBOARD SWATH (+75m)
        </div>

        {/* Real-time Crosshair Cursor Telemetry Pill */}
        {cursorPos && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-[11px] font-mono text-slate-300 flex items-center space-x-3 pointer-events-none z-10 shadow-lg">
            <span className="flex items-center text-blue-400">
              <Crosshair className="w-3 h-3 mr-1 text-blue-400" />
              {cursorPos.side}: <strong className="ml-1 text-white">{cursorPos.rangeMeters} m</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span>Est Depth: <strong className="text-white">{cursorPos.depthEst} m</strong></span>
          </div>
        )}
      </div>

      {/* Permanent Bottom Sonar Telemetry Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 font-mono z-20">
        <div className="flex items-center space-x-6">
          <div>
            Ping: <strong className="text-slate-200 font-bold">{frame.pingStart.toString().padStart(6, '0')}</strong>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div>
            Range: <strong className="text-slate-200 font-bold">{frame.rangeMeters} m</strong> (Port/Stbd)
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div>
            Heading: <strong className="text-slate-200 font-bold">{frame.headingDegrees}°</strong>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div>
            Depth: <strong className="text-slate-200 font-bold">{frame.depthMeters} m</strong>
          </div>
          <div className="h-3 w-[1px] bg-slate-700" />
          <div>
            Resolution: <strong className="text-emerald-400">High (0.05 m/px)</strong>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>Zoom: <strong className="text-slate-200">{Math.round(zoom * 100)}%</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{frame.id}</span>
        </div>
      </div>
    </div>
  );
};
