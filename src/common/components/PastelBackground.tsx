import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { rng } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
//  PastelBackground
//
//  Soft, editorial light-mode background matching the reference video exactly.
//
//  Visual layers (bottom → top):
//  1. White/cream-lavender base gradient
//  2. Large warm orange radial glow — upper-center, behind the logo position
//  3. Soft honey/gold radial glow — lower-center
//  4. Cool lavender radial glow — upper-right
//  5. 28 floating colored particles (orange + purple + pink dots)
//  6. 10 frosted-glass rounded squares at screen edges
//
//  The orange glow (#2) is centered on the logo position so it appears to
//  radiate from the starburst logo in Scene1.
// ─────────────────────────────────────────────────────────────────────────────

// ── Pre-computed particles (stable — same position every frame) ──────────────
// Computed at module load, not inside the component, so they never change.
const PARTICLE_COUNT = 28;
interface Particle {
  x: number; y: number; r: number;
  color: string; driftX: number; driftY: number;
  phase: number; opacity: number;
}
const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const v = rng(i * 17 + 4);
  return {
    x:      rng(i * 17 + 1) * 1080,
    y:      rng(i * 17 + 2) * 1920,
    r:      2.5 + rng(i * 17 + 3) * 3.5,
    color:  v < 0.45 ? '#FF8C42' : v < 0.82 ? '#9B8FE8' : '#F4A0C0',
    driftX: (rng(i * 17 + 5) - 0.5) * 24,
    driftY: (rng(i * 17 + 6) - 0.5) * 20,
    phase:  rng(i * 17 + 7) * Math.PI * 2,
    opacity: 0.45 + rng(i * 17 + 8) * 0.55,
  };
});

// ── Floating edge squares ────────────────────────────────────────────────────
// Positioned partially off-screen. `right:true` → x is negative offset from right edge.
const SQUARES = [
  // Left edge
  { x: -22, y: 148,  s: 44, phase: 0.0  },
  { x: -28, y: 380,  s: 56, phase: 1.15 },
  { x: -24, y: 760,  s: 48, phase: 0.55 },
  { x: -20, y: 1060, s: 44, phase: 1.82 },
  { x: -26, y: 1400, s: 52, phase: 0.80 },
  // Right edge
  { x: -48, y: 122,  s: 88, phase: 2.20, right: true }, // large partially-visible corner
  { x: -44, y: 520,  s: 46, phase: 1.52, right: true },
  { x: -50, y: 900,  s: 52, phase: 0.28, right: true },
  { x: -46, y: 1240, s: 48, phase: 1.94, right: true },
  { x: -42, y: 1540, s: 44, phase: 2.62, right: true },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export const PastelBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {/* ── Base gradient — light lavender at top → warm cream at bottom ── */}
          <linearGradient id="pbg-base" x1="0" y1="0" x2="0" y2={H}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#EAE5FF"/>
            <stop offset="35%"  stopColor="#FFF4EF"/>
            <stop offset="100%" stopColor="#FFF0EC"/>
          </linearGradient>

          {/* ── Large orange/coral glow — upper center (behind logo at cy≈490) ── */}
          {/* This is the most prominent feature: big warm halo around the logo   */}
          <radialGradient id="pbg-logo-glow"
            gradientUnits="userSpaceOnUse"
            cx="540" cy="490" r="480"
            fx="540" fy="490">
            <stop offset="0%"   stopColor="#FFAA80" stopOpacity="0.72"/>
            <stop offset="40%"  stopColor="#FFB894" stopOpacity="0.48"/>
            <stop offset="75%"  stopColor="#FFC8A8" stopOpacity="0.20"/>
            <stop offset="100%" stopColor="#FFD4B8" stopOpacity="0"/>
          </radialGradient>

          {/* ── Honey/gold glow — lower center ────────────────────────────── */}
          <radialGradient id="pbg-honey"
            gradientUnits="userSpaceOnUse"
            cx="460" cy="1360" r="380"
            fx="460" fy="1360">
            <stop offset="0%"   stopColor="#F5D080" stopOpacity="0.52"/>
            <stop offset="60%"  stopColor="#F5D080" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#F5D080" stopOpacity="0"/>
          </radialGradient>

          {/* ── Cool lavender — upper right ────────────────────────────────── */}
          <radialGradient id="pbg-lavender"
            gradientUnits="userSpaceOnUse"
            cx="950" cy="340" r="480"
            fx="950" fy="340">
            <stop offset="0%"   stopColor="#C4B5FD" stopOpacity="0.55"/>
            <stop offset="60%"  stopColor="#DDD6FE" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0"/>
          </radialGradient>

          {/* ── Light pink — subtle center tie ─────────────────────────────── */}
          <radialGradient id="pbg-pink"
            gradientUnits="userSpaceOnUse"
            cx="540" cy="960" r="380"
            fx="540" fy="960">
            <stop offset="0%"   stopColor="#FCA5A5" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* ── Background layers ──────────────────────────────────────────── */}
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-base)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-logo-glow)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-honey)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-lavender)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-pink)"/>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {PARTICLES.map((p, i) => {
          const px = p.x + Math.sin(t * 0.28 + p.phase) * p.driftX;
          const py = p.y + Math.cos(t * 0.22 + p.phase) * p.driftY;
          return (
            <circle key={i} cx={px} cy={py} r={p.r}
              fill={p.color} opacity={p.opacity}/>
          );
        })}

        {/* ── Floating frosted squares ───────────────────────────────────── */}
        {SQUARES.map((sq, i) => {
          const bob = Math.sin(t * Math.PI * 0.36 + sq.phase) * 8;
          const rx  = (sq as any).right ? W + sq.x : sq.x;
          return (
            <rect key={i}
              x={rx} y={sq.y + bob}
              width={sq.s} height={sq.s}
              rx={10}
              fill="rgba(255,255,255,0.48)"
              stroke="rgba(255,255,255,0.82)"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
