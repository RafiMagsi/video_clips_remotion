import React from 'react';
import { CYAN } from '../colors';

// ─────────────────────────────────────────────────────────────────────────────
//  LabelPill — Tag / pill label primitive
//
//  Renders inside an SVG parent.
//  Centered at (x, y).
//
//  Usage:
//    <LabelPill x={540} y={200} label="AI ANALYSIS" color={CYAN} />
//
//  To change for different results:
//    • width / height — adjust pill size to fit different label lengths
//    • fontSize       — default 19, reduce for longer labels
//    • uppercase      — false to preserve casing
//    • opacity        — animate with fade() for entrance effects
// ─────────────────────────────────────────────────────────────────────────────

export interface LabelPillProps {
  x:          number;  // center X
  y:          number;  // center Y
  label:      string;
  color?:     string;  // border + text color (default CYAN)
  width?:     number;  // pill width  (default 210)
  height?:    number;  // pill height (default 44)
  fontSize?:  number;  // (default 19)
  opacity?:   number;  // group opacity 0-1 (default 1)
  uppercase?: boolean; // transform label to uppercase (default true)
}

export const LabelPill: React.FC<LabelPillProps> = ({
  x, y, label,
  color     = CYAN,
  width:  w = 210,
  height: h = 44,
  fontSize  = 19,
  opacity   = 1,
  uppercase = true,
}) => (
  <g opacity={opacity}>
    {/* Background fill */}
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2}
      fill={`${color}18`}/>

    {/* Border */}
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2}
      fill="none" stroke={color} strokeWidth={1.1} opacity={0.7}/>

    {/* Label text */}
    <text
      x={x} y={y + fontSize * 0.38}
      fill={color}
      fontSize={fontSize}
      fontFamily="system-ui, -apple-system, 'SF Pro Text', sans-serif"
      fontWeight="800"
      textAnchor="middle"
      letterSpacing={1.5}>
      {uppercase ? label.toUpperCase() : label}
    </text>
  </g>
);
