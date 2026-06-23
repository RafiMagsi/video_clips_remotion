import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CYAN } from '../colors';
import { bezierPoint, sBezierCPs } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
//  NeuralLine — Animated bezier line with traveling particles
//
//  Renders inside an SVG parent.  Requires <SharedSVGDefs/> in the SVG.
//  Uses useCurrentFrame() internally for continuous particle animation.
//
//  Usage:
//    const drawProgress = sp(frame, fps, delay);
//    <NeuralLine from={[thumb_x, thumb_y]} to={[center_x, center_y]}
//      color={CYAN} drawProgress={drawProgress} />
//
//  The line draws in as drawProgress goes from 0→1 (use sp() from parent).
//  Particles continuously travel along the curve when drawProgress > 0.
//
//  To change for different results:
//    • particleCount  — more particles = busier look (3 default)
//    • particleSpeed  — seconds per full traversal (1.8 default)
//    • color          — matches the source element's accent color
//    • cp1 / cp2      — pass explicit control points to override S-curve
// ─────────────────────────────────────────────────────────────────────────────

export interface NeuralLineProps {
  from:           [number, number];   // start point
  to:             [number, number];   // end point
  color?:         string;             // line + particle color (default CYAN)
  lineWidth?:     number;             // stroke width (default 1.5)
  drawProgress:   number;             // 0-1 controls the draw-in animation
  particleSpeed?: number;             // seconds per full traversal (default 1.8)
  particleCount?: number;             // number of particles (default 3)
  particleRadius?: number;            // particle dot radius (default 3.5)
  lineOpacity?:   number;             // max line opacity (default 0.55)
  glowFilterId?:  string;             // SVG filter ID (default 'glow-sm')
  opacity?:       number;             // overall group opacity (default 1)
  // Optional explicit bezier control points (auto-computed by default)
  cp1?:           [number, number];
  cp2?:           [number, number];
}

export const NeuralLine: React.FC<NeuralLineProps> = ({
  from, to,
  color          = CYAN,
  lineWidth      = 1.5,
  drawProgress,
  particleSpeed  = 1.8,
  particleCount  = 3,
  particleRadius = 3.5,
  lineOpacity    = 0.55,
  glowFilterId   = 'glow-sm',
  opacity        = 1,
  cp1: cp1Prop,
  cp2: cp2Prop,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  if (drawProgress < 0.01) return null;

  const [cp1, cp2] = cp1Prop && cp2Prop
    ? [[cp1Prop[0], cp1Prop[1]] as [number, number], [cp2Prop[0], cp2Prop[1]] as [number, number]]
    : sBezierCPs(from, to);

  // Draw-in via animated strokeDashoffset
  const dashLen  = 2200;
  const dashOffset = (1 - drawProgress) * dashLen;
  const currentLineOp = drawProgress * lineOpacity;

  // Traveling particles
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const phase = i / particleCount;
    const pt    = ((t / particleSpeed + phase) % 1);
    const [px, py] = bezierPoint(pt, from, cp1, cp2, to);
    const popIn = Math.sin(pt * Math.PI) * drawProgress;
    return { px, py, popIn };
  });

  const filterAttr = `url(#${glowFilterId})`;

  return (
    <g opacity={opacity}>
      {/* Line */}
      <path
        d={`M ${from[0]} ${from[1]} C ${cp1[0]} ${cp1[1]}, ${cp2[0]} ${cp2[1]}, ${to[0]} ${to[1]}`}
        fill="none"
        stroke={color}
        strokeWidth={lineWidth}
        strokeDasharray={`${dashLen}`}
        strokeDashoffset={dashOffset}
        opacity={currentLineOp}
        filter={filterAttr}
      />

      {/* Particles */}
      {particles.map(({ px, py, popIn }, i) => (
        <circle key={i}
          cx={px} cy={py} r={particleRadius}
          fill={color}
          opacity={popIn * 0.9}
          filter={filterAttr}
        />
      ))}
    </g>
  );
};
