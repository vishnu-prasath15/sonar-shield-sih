// High-fidelity Side-Scan Sonar (SSS) image generation & procedural acoustic simulator
// Emulates dual-channel (Port/Starboard) acoustic waterfall displays with realistic nadir, seabed reverberation, speckle, and target acoustic shadows.

export interface SonarRenderOptions {
  palette: 'copper' | 'amber' | 'grayscale' | 'coolblue';
  contrast: number; // 50 to 150 (default 100)
  brightness: number; // 50 to 150 (default 100)
  showNadirGuide: boolean;
  showRangeGrid: boolean;
}

// Color palettes for side-scan sonar visualization
export const SONAR_PALETTES = {
  copper: {
    name: 'Copper Sonar (Standard)',
    bg: [8, 4, 2],
    waterColumn: [18, 10, 4],
    seabedLow: [80, 42, 12],
    seabedMid: [165, 95, 30],
    seabedHigh: [225, 155, 60],
    highlight: [255, 230, 160],
    shadow: [4, 2, 1]
  },
  amber: {
    name: 'Amber Bronze (High Contrast)',
    bg: [10, 8, 2],
    waterColumn: [24, 18, 6],
    seabedLow: [95, 65, 15],
    seabedMid: [185, 130, 35],
    seabedHigh: [240, 185, 65],
    highlight: [255, 245, 190],
    shadow: [6, 4, 1]
  },
  coolblue: {
    name: 'Cool Marine Slate',
    bg: [6, 12, 20],
    waterColumn: [14, 26, 40],
    seabedLow: [40, 75, 105],
    seabedMid: [85, 135, 175],
    seabedHigh: [145, 195, 230],
    highlight: [220, 240, 255],
    shadow: [3, 7, 12]
  },
  grayscale: {
    name: 'Scientific Monochrome',
    bg: [8, 8, 8],
    waterColumn: [20, 20, 20],
    seabedLow: [70, 70, 70],
    seabedMid: [140, 140, 140],
    seabedHigh: [200, 200, 200],
    highlight: [255, 255, 255],
    shadow: [3, 3, 3]
  }
};

export function renderSonarFrameToCanvas(
  canvas: HTMLCanvasElement,
  frameId: string,
  options: SonarRenderOptions
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  const palette = SONAR_PALETTES[options.palette] || SONAR_PALETTES.copper;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Pseudo-random seed based on frameId
  let seed = 12345;
  for (let i = 0; i < frameId.length; i++) {
    seed = (seed * 31 + frameId.charCodeAt(i)) % 1000000;
  }
  const pseudoRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const midX = width / 2;
  const nadirHalfWidth = width * 0.08; // 8% nadir water column on each side

  // Contrast & brightness factors
  const contrastFactor = (options.contrast / 100);
  const brightnessFactor = (options.brightness / 100);

  // Generate synthetic acoustic backscatter map
  for (let y = 0; y < height; y++) {
    const yNorm = y / height;
    // Seabed ripple wave frequency
    const ripple = Math.sin(y * 0.08 + Math.cos(y * 0.03) * 4) * 0.12;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const distFromCenter = Math.abs(x - midX);

      let intensity = 0;

      if (distFromCenter < nadirHalfWidth) {
        // Water column (Nadir dead-zone with faint acoustic surface noise)
        const nadirNoise = (Math.sin(x * 0.5) * Math.cos(y * 0.5) + 1) * 0.08;
        intensity = 0.05 + nadirNoise + (pseudoRand() * 0.04);
      } else {
        // Seafloor acoustic return
        const distFromFirstReturn = distFromCenter - nadirHalfWidth;
        const swathWidth = midX - nadirHalfWidth;
        const normDist = distFromFirstReturn / swathWidth; // 0 (first return) to 1.0 (far range)

        // First bottom return is high intensity, then TVG curve with slight attenuation
        const firstReturnBoost = Math.exp(-normDist * 1.5) * 0.25;
        const rangeGain = Math.pow(1 - normDist * 0.35, 1.2);

        // Natural sand wave / sediment acoustic speckle
        const sedimentSpeckle = (pseudoRand() - 0.5) * 0.22;
        const sandWave = Math.sin(x * 0.04 + ripple * 20 + y * 0.02) * 0.14;

        intensity = (0.42 + firstReturnBoost + sandWave + sedimentSpeckle) * rangeGain;

        // Add frame-specific features / debris signatures into the raw acoustic image
        if (frameId.includes('001')) {
          // Feature 1: Ghost Net at Port Channel (x ~ 26%, y ~ 38%)
          const netX = width * 0.26;
          const netY = height * 0.38;
          const dx = x - netX;
          const dy = y - netY;
          const netDist = Math.sqrt(dx * dx * 1.8 + dy * dy);
          
          if (netDist < 36) {
            // Irregular tangled highlight
            const tangleNoise = Math.sin(x * 0.3) * Math.cos(y * 0.4) + Math.sin(x * 0.7);
            if (tangleNoise > -0.2) {
              intensity = 0.88 + pseudoRand() * 0.12;
            }
          } else if (dx < 0 && dx > -55 && Math.abs(dy) < 32) {
            // Acoustic shadow cast to the left (away from center)
            intensity = 0.02 + pseudoRand() * 0.03;
          }

          // Feature 2: Subsea Pipe at Starboard Channel (x ~ 72%, y ~ 28%)
          const pipeX = width * 0.72;
          const pipeY = height * 0.28;
          const pdx = x - pipeX;
          const pdy = y - pipeY;
          // Linear pipe line
          const lineDist = Math.abs(pdx * 0.3 + pdy - 8);
          if (lineDist < 5 && Math.abs(pdx) < 45 && Math.abs(pdy) < 50) {
            intensity = 0.95; // Strong metallic reflection
          } else if (pdx > 6 && pdx < 38 && Math.abs(pdy) < 48 && lineDist < 16) {
            // Shadow cast to the right (away from nadir)
            intensity = 0.03;
          }

          // Feature 3: Wreck at Port Channel (x ~ 32%, y ~ 72%)
          const wrkX = width * 0.32;
          const wrkY = height * 0.72;
          const wdx = x - wrkX;
          const wdy = y - wrkY;
          if (Math.abs(wdx) < 42 && Math.abs(wdy) < 28) {
            const ribPattern = Math.sin(wdy * 0.8) > 0.3 ? 0.92 : 0.65;
            intensity = ribPattern;
          } else if (wdx < -42 && wdx > -95 && Math.abs(wdy) < 34) {
            // Long acoustic shadow from large hull
            intensity = 0.01 + pseudoRand() * 0.02;
          }

          // Feature 4: Metallic Drum/Debris (x ~ 80%, y ~ 68%)
          const dbX = width * 0.80;
          const dbY = height * 0.68;
          const dbdx = x - dbX;
          const dbdy = y - dbY;
          if (dbdx * dbdx + dbdy * dbdy < 120) {
            intensity = 0.92;
          } else if (dbdx > 10 && dbdx < 35 && Math.abs(dbdy) < 14) {
            intensity = 0.02;
          }
        } else if (frameId.includes('002')) {
          // Feature: Subsea Cable across the swath
          const cableDx = Math.abs((x - midX * 1.3) + (y - height * 0.5) * 0.6);
          if (cableDx < 3 && distFromCenter > nadirHalfWidth) {
            intensity = 0.85;
          } else if (x > midX && (x - midX * 1.3) + (y - height * 0.5) * 0.6 > 3 && (x - midX * 1.3) + (y - height * 0.5) * 0.6 < 14) {
            intensity = 0.02;
          }

          // Anchor block (x ~ 30%, y ~ 45%)
          const abX = width * 0.30;
          const abY = height * 0.45;
          if (Math.abs(x - abX) < 18 && Math.abs(y - abY) < 18) {
            intensity = 0.94;
          } else if (x - abX < -18 && x - abX > -50 && Math.abs(y - abY) < 20) {
            intensity = 0.02;
          }
        } else if (frameId.includes('003')) {
          // Scattered container debris field (x ~ 70%, y ~ 50%)
          const cX = width * 0.70;
          const cY = height * 0.50;
          if (Math.abs(x - cX) < 35 && Math.abs(y - cY) < 22) {
            intensity = (Math.sin(x * 0.4) > 0) ? 0.95 : 0.7;
          } else if (x - cX > 35 && x - cX < 80 && Math.abs(y - cY) < 26) {
            intensity = 0.01;
          }
        }
      }

      // Apply contrast and brightness adjustments
      intensity = (intensity - 0.5) * contrastFactor + 0.5;
      intensity = intensity * brightnessFactor;
      intensity = Math.max(0, Math.min(1, intensity));

      // Map normalized intensity (0..1) to palette RGB
      let r = 0, g = 0, b = 0;
      if (intensity < 0.12) {
        // Shadow / dark water
        const t = intensity / 0.12;
        r = palette.shadow[0] + t * (palette.waterColumn[0] - palette.shadow[0]);
        g = palette.shadow[1] + t * (palette.waterColumn[1] - palette.shadow[1]);
        b = palette.shadow[2] + t * (palette.waterColumn[2] - palette.shadow[2]);
      } else if (intensity < 0.45) {
        // Low backscatter
        const t = (intensity - 0.12) / 0.33;
        r = palette.waterColumn[0] + t * (palette.seabedLow[0] - palette.waterColumn[0]);
        g = palette.waterColumn[1] + t * (palette.seabedLow[1] - palette.waterColumn[1]);
        b = palette.waterColumn[2] + t * (palette.seabedLow[2] - palette.waterColumn[2]);
      } else if (intensity < 0.78) {
        // Mid backscatter (typical seabed)
        const t = (intensity - 0.45) / 0.33;
        r = palette.seabedLow[0] + t * (palette.seabedMid[0] - palette.seabedLow[0]);
        g = palette.seabedLow[1] + t * (palette.seabedMid[1] - palette.seabedLow[1]);
        b = palette.seabedLow[2] + t * (palette.seabedMid[2] - palette.seabedLow[2]);
      } else if (intensity < 0.92) {
        // High backscatter
        const t = (intensity - 0.78) / 0.14;
        r = palette.seabedMid[0] + t * (palette.seabedHigh[0] - palette.seabedMid[0]);
        g = palette.seabedMid[1] + t * (palette.seabedHigh[1] - palette.seabedMid[1]);
        b = palette.seabedMid[2] + t * (palette.seabedHigh[2] - palette.seabedMid[2]);
      } else {
        // Specular highlight / metallic return
        const t = (intensity - 0.92) / 0.08;
        r = palette.seabedHigh[0] + t * (palette.highlight[0] - palette.seabedHigh[0]);
        g = palette.seabedHigh[1] + t * (palette.highlight[1] - palette.seabedHigh[1]);
        b = palette.seabedHigh[2] + t * (palette.highlight[2] - palette.seabedHigh[2]);
      }

      data[idx] = Math.round(r);
      data[idx + 1] = Math.round(g);
      data[idx + 2] = Math.round(b);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Overlay Nadir Center Line & Channel Markers
  if (options.showNadirGuide) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, height);
    ctx.stroke();

    // Nadir boundary lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(midX - nadirHalfWidth, 0);
    ctx.lineTo(midX - nadirHalfWidth, height);
    ctx.moveTo(midX + nadirHalfWidth, 0);
    ctx.lineTo(midX + nadirHalfWidth, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Overlay Range Graticule (e.g. 25m, 50m, 75m)
  if (options.showRangeGrid) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

    const steps = [0.25, 0.5, 0.75, 1.0];
    const swathWidth = midX - nadirHalfWidth;

    steps.forEach((s) => {
      const pX = midX - nadirHalfWidth - swathWidth * s;
      const sX = midX + nadirHalfWidth + swathWidth * s;

      if (pX > 0) {
        ctx.beginPath();
        ctx.moveTo(pX, 0);
        ctx.lineTo(pX, height);
        ctx.stroke();
        ctx.fillText(`-${Math.round(s * 75)}m`, pX + 4, 16);
      }
      if (sX < width) {
        ctx.beginPath();
        ctx.moveTo(sX, 0);
        ctx.lineTo(sX, height);
        ctx.stroke();
        ctx.fillText(`+${Math.round(s * 75)}m`, sX + 4, 16);
      }
    });

    // Horizontal ping lines
    for (let py = 100; py < height; py += 100) {
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
    }
  }
}
