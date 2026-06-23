import React from 'react';
import { CYAN, GLASS_FILL, GLASS_FILL_OP, GLASS_BORDER_OP, GLASS_BORDER_W } from '../colors';

// ─────────────────────────────────────────────────────────────────────────────
//  GlassPanel — Glassmorphism panel primitive
//
//  Renders inside an SVG parent. Place a <SharedSVGDefs/> in the same SVG
//  to use the glowFilterId prop.
//
//  Usage:
//    <GlassPanel x={100} y={200} width={300} height={120} borderColor={VIOLET}>
//      {/* SVG children positioned within the panel */}
//      <text x={110} y={230} fill="white">Hello</text>
//    </GlassPanel>
//
//  To change for different results:
//    • borderColor   — matches the composition accent color
//    • fillOpacity   — lower = more transparent (0.5 = frosted, 0.95 = solid)
//    • radius        — corner rounding (14 default, 0 for sharp corners)
//    • glowFilterId  — set to 'glow-md' or 'glow-lg' for ambient halo
// ─────────────────────────────────────────────────────────────────────────────

export interface GlassPanelProps {
  x:            number;
  y:            number;
  width:        number;
  height:       number;
  radius?:      number;         // corner radius (default 14)
  fillColor?:   string;         // fill base color
  fillOpacity?: number;         // fill opacity 0-1 (default 0.90)
  borderColor?: string;         // border stroke color (default CYAN)
  borderOpacity?: number;       // border opacity 0-1 (default 0.55)
  borderWidth?: number;         // border stroke width (default 1.5)
  glowFilterId?: string;        // SVG filter ID for ambient glow halo
  glowOpacity?: number;         // glow halo opacity (default 0.05)
  glowPadding?: number;         // extra padding around glow rect (default 6)
  opacity?:     number;         // overall group opacity (for entrance animations)
  children?:    React.ReactNode; // SVG content rendered on top of the panel
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  x, y,
  width:        w,
  height:       h,
  radius:       r            = 14,
  fillColor                  = GLASS_FILL,
  fillOpacity                = GLASS_FILL_OP,
  borderColor                = CYAN,
  borderOpacity              = GLASS_BORDER_OP,
  borderWidth                = GLASS_BORDER_W,
  glowFilterId,
  glowOpacity                = 0.05,
  glowPadding                = 6,
  opacity                    = 1,
  children,
}) => (
  <g opacity={opacity}>
    {/* Ambient glow halo (optional) */}
    {glowFilterId && (
      <rect
        x={x - glowPadding}
        y={y - glowPadding}
        width={w + glowPadding * 2}
        height={h + glowPadding * 2}
        rx={r + glowPadding}
        fill={borderColor}
        opacity={glowOpacity}
        filter={`url(#${glowFilterId})`}
      />
    )}

    {/* Glass body */}
    <rect x={x} y={y} width={w} height={h} rx={r}
      fill={fillColor} fillOpacity={fillOpacity}/>

    {/* Outer border */}
    <rect x={x} y={y} width={w} height={h} rx={r}
      fill="none"
      stroke={borderColor}
      strokeWidth={borderWidth}
      opacity={borderOpacity}/>

    {/* Inner highlight (subtle inner rim) */}
    <rect
      x={x + 1.5} y={y + 1.5}
      width={w - 3} height={h - 3}
      rx={Math.max(0, r - 1.5)}
      fill="none"
      stroke={borderColor}
      strokeWidth={0.5}
      opacity={borderOpacity * 0.28}/>

    {children}
  </g>
);
