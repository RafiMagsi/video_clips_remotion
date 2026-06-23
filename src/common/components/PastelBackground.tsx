import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { rng } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
//  PastelBackground — animated editorial background, shared by all scenes
//
//  Layers (bottom → top):
//  1. Base cream/lavender gradient
//  2. Orange radial glow — breathes
//  3. Honey radial glow — offset breathing
//  4. Lavender radial glow — drifts its center
//  5. Pink center tie
//  6. 28 particles — glitter shimmer (opacity + radius)
//  7. 10 frosted edge squares — bob + opacity wave
//  8. 2 shooting stars per 120-frame cycle — asteroid shape:
//     big glowing head + narrow tapered tail, pastel blur treatment
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 28;
interface Particle {
  x: number; y: number; r: number;
  color: string; driftX: number; driftY: number;
  phase: number; opacity: number;
  freq: number;
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
    freq:   0.7 + rng(i * 17 + 9) * 1.6,
  };
});

const SQUARES = [
  { x: -22, y: 148,  s: 44, phase: 0.00 },
  { x: -28, y: 380,  s: 56, phase: 1.15 },
  { x: -24, y: 760,  s: 48, phase: 0.55 },
  { x: -20, y: 1060, s: 44, phase: 1.82 },
  { x: -26, y: 1400, s: 52, phase: 0.80 },
  { x: -48, y: 122,  s: 88, phase: 2.20, right: true },
  { x: -44, y: 520,  s: 46, phase: 1.52, right: true },
  { x: -50, y: 900,  s: 52, phase: 0.28, right: true },
  { x: -46, y: 1240, s: 48, phase: 1.94, right: true },
  { x: -42, y: 1540, s: 44, phase: 2.62, right: true },
] as const;

// ── Asteroid shooting stars ───────────────────────────────────────────────────
// Shape: narrow pointed tail → wide glowing head (comet/asteroid silhouette)
// Rendered with SVG path + radial gradient head + feGaussianBlur glow layers
const STAR_CYCLE = 120;  // frames between star A and star A again
const STAR_DUR   = 28;   // frames to cross the screen
const TAIL_LEN   = 280;  // px length of the tail

interface StarDef {
  sx: number; sy: number;
  ex: number; ey: number;
  offset: number;
  colorCore: string;   // bright inner core
  colorGlow: string;   // outer halo
  tailHalfW: number;   // half-width of tail at the head end (px)
}
const STARS: StarDef[] = [
  { sx: -80, sy: 260, ex: 1160, ey: 820,
    offset: 18,
    colorCore: '#FFE4B8', colorGlow: '#FF9040',
    tailHalfW: 18 },
  { sx: 1140, sy: 160, ex: 160, ey: 1140,
    offset: 68,
    colorCore: '#FFF4E0', colorGlow: '#FFAA55',
    tailHalfW: 16 },
];

// ─────────────────────────────────────────────────────────────────────────────

export const PastelBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  // ── Breathing glows ────────────────────────────────────────────────────────
  const glowPulse  = 0.68 + Math.sin(t * Math.PI * 0.55)        * 0.14;
  const honeyPulse = 0.48 + Math.sin(t * Math.PI * 0.38 + 1.80) * 0.12;
  const lavPulse   = 0.52 + Math.sin(t * Math.PI * 0.42 + 0.90) * 0.10;
  const lavCX      = 950 + Math.sin(t * Math.PI * 0.17)         * 32;
  const lavCY      = 340 + Math.sin(t * Math.PI * 0.11 + 0.60)  * 22;

  const cycle = frame % STAR_CYCLE;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', top: 0, left: 0 }}>

        <defs>
          <linearGradient id="pbg-base" x1="0" y1="0" x2="0" y2={H}
            gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#EAE5FF"/>
            <stop offset="35%"  stopColor="#FFF4EF"/>
            <stop offset="100%" stopColor="#FFF0EC"/>
          </linearGradient>

          <radialGradient id="pbg-logo-glow" gradientUnits="userSpaceOnUse"
            cx="540" cy="490" r="480" fx="540" fy="490">
            <stop offset="0%"   stopColor="#FFAA80" stopOpacity={glowPulse}/>
            <stop offset="40%"  stopColor="#FFB894" stopOpacity={glowPulse * 0.65}/>
            <stop offset="75%"  stopColor="#FFC8A8" stopOpacity={glowPulse * 0.27}/>
            <stop offset="100%" stopColor="#FFD4B8" stopOpacity="0"/>
          </radialGradient>

          <radialGradient id="pbg-honey" gradientUnits="userSpaceOnUse"
            cx="460" cy="1360" r="380" fx="460" fy="1360">
            <stop offset="0%"   stopColor="#F5D080" stopOpacity={honeyPulse}/>
            <stop offset="60%"  stopColor="#F5D080" stopOpacity={honeyPulse * 0.42}/>
            <stop offset="100%" stopColor="#F5D080" stopOpacity="0"/>
          </radialGradient>

          <radialGradient id="pbg-lavender" gradientUnits="userSpaceOnUse"
            cx={lavCX} cy={lavCY} r="480" fx={lavCX} fy={lavCY}>
            <stop offset="0%"   stopColor="#C4B5FD" stopOpacity={lavPulse}/>
            <stop offset="60%"  stopColor="#DDD6FE" stopOpacity={lavPulse * 0.46}/>
            <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0"/>
          </radialGradient>

          <radialGradient id="pbg-pink" gradientUnits="userSpaceOnUse"
            cx="540" cy="960" r="380" fx="540" fy="960">
            <stop offset="0%"   stopColor="#FCA5A5" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Background layers */}
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-base)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-logo-glow)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-honey)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-lavender)"/>
        <rect x={0} y={0} width={W} height={H} fill="url(#pbg-pink)"/>

        {/* Glitter particles */}
        {PARTICLES.map((p, i) => {
          const px     = p.x + Math.sin(t * 0.28 + p.phase) * p.driftX;
          const py     = p.y + Math.cos(t * 0.22 + p.phase) * p.driftY;
          const shimOp = p.opacity * (0.55 + 0.45 * Math.sin(t * p.freq * Math.PI * 2 + p.phase));
          const shimR  = p.r      * (0.75 + 0.25 * Math.sin(t * p.freq * Math.PI * 1.4 + p.phase + 0.9));
          return <circle key={i} cx={px} cy={py} r={shimR} fill={p.color} opacity={shimOp}/>;
        })}

        {/* Frosted edge squares */}
        {SQUARES.map((sq, i) => {
          const bob  = Math.sin(t * Math.PI * 0.36 + sq.phase) * 8;
          const sqOp = 0.36 + Math.sin(t * Math.PI * 0.26 + sq.phase) * 0.14;
          const rx   = (sq as any).right ? W + sq.x : sq.x;
          return (
            <rect key={i}
              x={rx} y={sq.y + bob} width={sq.s} height={sq.s} rx={10}
              fill={`rgba(255,255,255,${sqOp.toFixed(3)})`}
              stroke="rgba(255,255,255,0.82)" strokeWidth={1.5}/>
          );
        })}

        {/* ── Asteroid shooting stars ─────────────────────────────────────── */}
        {STARS.map((star, si) => {
          const sf = cycle - star.offset;
          if (sf < 0 || sf >= STAR_DUR) return null;

          const prog = sf / STAR_DUR;
          const arc  = Math.sin(prog * Math.PI); // 0→1→0 envelope

          // Head position
          const hx  = star.sx + (star.ex - star.sx) * prog;
          const hy  = star.sy + (star.ey - star.sy) * prog;

          // Tail tip: TAIL_LEN behind the head along trajectory
          const ddx = star.ex - star.sx;
          const ddy = star.ey - star.sy;
          const len = Math.sqrt(ddx * ddx + ddy * ddy);
          const ndx = ddx / len, ndy = ddy / len;
          const tx  = hx - ndx * TAIL_LEN;
          const ty  = hy - ndy * TAIL_LEN;

          // Perpendicular unit vector (for tail width)
          const perpX = -ndy, perpY = ndx;
          const hw    = star.tailHalfW * arc;  // half-width at head end, fades with arc

          // Asteroid head radii
          const coreR  = 18 * arc;   // bright inner core
          const innerR = 36 * arc;   // medium glow ring
          const outerR = 72 * arc;   // large soft halo

          // Tail path: pointed tip at (tx,ty) → widened base at head
          const tailPath = [
            `M ${tx.toFixed(1)} ${ty.toFixed(1)}`,
            `L ${(hx + perpX * hw).toFixed(1)} ${(hy + perpY * hw).toFixed(1)}`,
            `L ${(hx - perpX * hw).toFixed(1)} ${(hy - perpY * hw).toFixed(1)}`,
            'Z',
          ].join(' ');

          const blurId    = `pbg-ast-blur-${si}`;
          const blurBigId = `pbg-ast-blurbig-${si}`;
          const tailGradId = `pbg-ast-tail-${si}`;
          const headGradId = `pbg-ast-head-${si}`;

          return (
            <g key={si}>
              <defs>
                {/* Tail gradient — transparent tip → glow color at base */}
                <linearGradient id={tailGradId} gradientUnits="userSpaceOnUse"
                  x1={tx} y1={ty} x2={hx} y2={hy}>
                  <stop offset="0%"   stopColor={star.colorGlow} stopOpacity="0"/>
                  <stop offset="55%"  stopColor={star.colorGlow} stopOpacity={arc * 0.50}/>
                  <stop offset="100%" stopColor={star.colorGlow} stopOpacity={arc * 0.85}/>
                </linearGradient>

                {/* Head radial gradient — bright core → outer glow */}
                <radialGradient id={headGradId} gradientUnits="userSpaceOnUse"
                  cx={hx} cy={hy} r={outerR} fx={hx} fy={hy}>
                  <stop offset="0%"   stopColor={star.colorCore} stopOpacity={arc * 1.0}/>
                  <stop offset="25%"  stopColor={star.colorCore} stopOpacity={arc * 0.90}/>
                  <stop offset="55%"  stopColor={star.colorGlow}  stopOpacity={arc * 0.55}/>
                  <stop offset="100%" stopColor={star.colorGlow}  stopOpacity="0"/>
                </radialGradient>

                {/* Soft blur for tail and halo layers */}
                <filter id={blurId} x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="7"/>
                </filter>

                {/* Bigger blur for the outer pastel halo */}
                <filter id={blurBigId} x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="18"/>
                </filter>
              </defs>

              {/* Layer 1: wide outer pastel halo (very blurred, subtle) */}
              <circle cx={hx} cy={hy} r={outerR * 1.4}
                fill={star.colorGlow} opacity={arc * 0.22}
                filter={`url(#${blurBigId})`}/>

              {/* Layer 2: tail body — narrow triangle, blurred */}
              <path d={tailPath}
                fill={`url(#${tailGradId})`}
                filter={`url(#${blurId})`}/>

              {/* Layer 3: head radial glow (medium blur) */}
              <circle cx={hx} cy={hy} r={outerR}
                fill={`url(#${headGradId})`}
                filter={`url(#${blurId})`}/>

              {/* Layer 4: inner glow ring (sharper) */}
              <circle cx={hx} cy={hy} r={innerR}
                fill={star.colorGlow} opacity={arc * 0.70}/>

              {/* Layer 5: bright core (no blur — the "rock" point) */}
              <circle cx={hx} cy={hy} r={coreR}
                fill={star.colorCore} opacity={arc * 0.96}/>
            </g>
          );
        })}

      </svg>
    </AbsoluteFill>
  );
};
