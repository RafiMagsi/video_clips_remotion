import React from 'react';
import { CYAN } from '../colors';

// ─────────────────────────────────────────────────────────────────────────────
//  ProgressBar — Animated horizontal progress bar primitive
//
//  Renders inside an SVG parent.  Requires <SharedSVGDefs/> in the SVG
//  if using glowFilterId.
//
//  Usage:
//    const prog = fade(frame, startFrame, endFrame) * width;
//    <ProgressBar x={50} y={200} width={400} progress={fade(...)} color={CYAN}/>
//
//  progress is a 0-1 float.  The bar fills from x to x + progress * width.
//
//  To change for different results:
//    • progress     — animate with fade() or spring() from parent
//    • showDot      — false for compact bars (e.g. inside thumbnails)
//    • height       — thinner (3) for small cards, thicker (8) for big players
//    • glowFilterId — 'glow-sm' for subtle, 'glow-md' for vivid
// ─────────────────────────────────────────────────────────────────────────────

export interface ProgressBarProps {
  x:             number;
  y:             number;
  width:         number;
  height?:       number;   // bar thickness (default 5)
  radius?:       number;   // corner rounding (default 2.5)
  progress:      number;   // 0-1 fill fraction
  color?:        string;   // fill + dot color (default CYAN)
  trackOpacity?: number;   // track opacity (default 0.08)
  showDot?:      boolean;  // show playhead dot (default true)
  dotRadius?:    number;   // playhead dot radius (default 6)
  glowFilterId?: string;   // SVG filter ID for fill glow
  opacity?:      number;   // group opacity (default 1)
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  x, y,
  width:       w,
  height:      h          = 5,
  radius:      r          = 2.5,
  progress,
  color                   = CYAN,
  trackOpacity            = 0.08,
  showDot                 = true,
  dotRadius               = 6,
  glowFilterId,
  opacity                 = 1,
}) => {
  const fillW = Math.max(r * 2, progress * w);

  return (
    <g opacity={opacity}>
      {/* Track */}
      <rect x={x} y={y} width={w} height={h} rx={r}
        fill={`rgba(255,255,255,${trackOpacity})`}/>

      {/* Fill */}
      <rect x={x} y={y} width={fillW} height={h} rx={r}
        fill={color}
        filter={glowFilterId ? `url(#${glowFilterId})` : undefined}/>

      {/* Playhead dot */}
      {showDot && (
        <circle
          cx={x + fillW}
          cy={y + h / 2}
          r={dotRadius}
          fill={color}
          filter={glowFilterId ? `url(#${glowFilterId})` : undefined}/>
      )}
    </g>
  );
};
