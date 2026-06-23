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

// Frosted squares — lifecycle: spawn → fade-in → bob → fade-out → respawn elsewhere
// Canvas divided into a 2×5 grid (10 cells) so boxes never crowd each other.
const SQ_COUNT  = 10;
const SQ_FADE   = 18;                      // frames to fade in / out
const SQ_LIFE   = 104;                     // frames fully visible
const SQ_TOTAL  = SQ_FADE * 2 + SQ_LIFE;  // 140 frames per cycle (~4.7 s)
const SQ_COLS   = 2;                       // grid: 2 cols × 5 rows = 10 cells
const SQ_ROWS   = 5;
// Stable bob-phase per box (never changes between cycles)
const SQ_PHASES = Array.from({ length: SQ_COUNT }, (_, i) => rng(i * 13 + 4) * Math.PI * 2);

// ── Asteroid shooting stars ───────────────────────────────────────────────────
// Shape: narrow pointed tail → wide glowing head (comet/asteroid silhouette)
// Rendered with SVG path + radial gradient head + feGaussianBlur glow layers
const STAR_CYCLE = 120;  // frames between star A and star A again
const STAR_DUR   = 28;   // frames to cross the screen
const TAIL_LEN   = 680;  // px — long sweeping tail
// Head rendered as stacked soft-blur circles (like the Claude icon glow),
// no sharp bright core. tailHalfW controls how wide the tail is at the head.

// Static appearance config per star — positions are randomised per cycle
interface StarConfig {
  offset:     number;
  colorInner: string;
  colorOuter: string;
  tailHalfW:  number;
  ltr:        boolean;   // true = left→right,  false = right→left
}
const STAR_CONFIGS: StarConfig[] = [
  { offset: 18, colorInner: '#FF9040', colorOuter: '#FFE4B8', tailHalfW: 36, ltr: true  },
  { offset: 68, colorInner: '#FFAA55', colorOuter: '#FFF4E0', tailHalfW: 32, ltr: false },
];

// Full star definition (computed per cycle inside the component)
interface StarDef extends StarConfig {
  sx: number; sy: number;
  ex: number; ey: number;
}

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

  // ── Per-cycle random asteroid paths ──────────────────────────────────────
  // cycleIdx increments every 120 frames, re-seeding both asteroids with fresh
  // random Y positions and vertical drift so each pass looks different.
  const cycleIdx = Math.floor(frame / STAR_CYCLE);
  const cycle    = frame % STAR_CYCLE;

  // Build full StarDef for this cycle — only sx/ex are fixed (direction),
  // sy and ey are seeded random within the visible canvas height (160–1620).
  const STARS: StarDef[] = STAR_CONFIGS.map((cfg, si) => {
    const seed = cycleIdx * 17 + si * 8;   // unique seed per star per cycle
    return {
      ...cfg,
      sx: cfg.ltr ? -140 : 1220,
      sy: 160 + rng(seed + 0) * 1380,      // random start Y
      ex: cfg.ltr ? 1220 : -140,
      ey: 160 + rng(seed + 1) * 1380,      // random end Y (different → diagonal drift)
    };
  });

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

        {/* Frosted squares — spawn, animate, hide, respawn at new grid cell */}
        {Array.from({ length: SQ_COUNT }, (_, i) => {
          // Each box is staggered so they don't all appear/disappear together
          const stagger  = Math.round(i * SQ_TOTAL / SQ_COUNT);
          const cycleT   = frame + stagger;
          const cycleIdx = Math.floor(cycleT / SQ_TOTAL);
          const lifeF    = cycleT % SQ_TOTAL;  // 0 → SQ_TOTAL-1

          // Fade envelope (0→1 in, 1 flat, 1→0 out)
          let env: number;
          if      (lifeF < SQ_FADE)           env = lifeF / SQ_FADE;
          else if (lifeF > SQ_FADE + SQ_LIFE) env = (SQ_TOTAL - lifeF) / SQ_FADE;
          else                                 env = 1;
          if (env <= 0) return null;

          // Assign a unique grid cell per box per cycle.
          // Multiplying i by 7 (coprime to SQ_COUNT=10) guarantees a full permutation,
          // so no two boxes share a cell in the same cycle.
          const cellIdx = (i * 7 + cycleIdx * 3) % SQ_COUNT;
          const col     = cellIdx % SQ_COLS;
          const row     = Math.floor(cellIdx / SQ_ROWS);
          const cellW   = W / SQ_COLS;
          const cellH   = H / SQ_ROWS;

          // Random position within cell (seeded per box per cycle)
          const seed    = cycleIdx * 19 + i * 5;
          const size    = 44 + rng(seed + 2) * 52;        // 44–96 px
          const margin  = size * 0.65;
          const bx      = col * cellW + margin + rng(seed + 0) * (cellW - margin * 2);
          const by      = row * cellH + margin + rng(seed + 1) * (cellH - margin * 2);

          const bob   = Math.sin(t * Math.PI * 0.36 + SQ_PHASES[i]) * 9;
          const sqOp  = env * (0.38 + Math.sin(t * Math.PI * 0.26 + SQ_PHASES[i]) * 0.14);

          // Scale around box center so it pops in/out
          const scale = 0.40 + env * 0.60;
          const cx    = (bx + size / 2).toFixed(1);
          const cy    = (by + bob + size / 2).toFixed(1);

          return (
            <g key={i} transform={`translate(${cx},${cy}) scale(${scale.toFixed(3)})`}>
              <rect
                x={(-size / 2).toFixed(1)} y={(-size / 2).toFixed(1)}
                width={size} height={size} rx={11}
                fill={`rgba(255,255,255,${sqOp.toFixed(3)})`}
                stroke={`rgba(255,255,255,${(env * 0.82).toFixed(3)})`}
                strokeWidth={1.5}
              />
            </g>
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

          // Head radii — no sharp core, pure soft gradient stack
          const glowR  = 155 * arc;  // main glow ball
          const haloR  = 270 * arc;  // wide soft outer halo

          // Tail path: pointed tip → wide base at head
          const tailPath = [
            `M ${tx.toFixed(1)} ${ty.toFixed(1)}`,
            `L ${(hx + perpX * hw).toFixed(1)} ${(hy + perpY * hw).toFixed(1)}`,
            `L ${(hx - perpX * hw).toFixed(1)} ${(hy - perpY * hw).toFixed(1)}`,
            'Z',
          ].join(' ');

          const blurSoftId  = `pbg-ast-bs-${si}`;  // stdDev 12 — tail + inner glow
          const blurHaloId  = `pbg-ast-bh-${si}`;  // stdDev 28 — outer halo
          const tailGradId  = `pbg-ast-tg-${si}`;

          return (
            <g key={si}>
              <defs>
                {/* Tail — transparent tip → warm glow at base */}
                <linearGradient id={tailGradId} gradientUnits="userSpaceOnUse"
                  x1={tx} y1={ty} x2={hx} y2={hy}>
                  <stop offset="0%"   stopColor={star.colorOuter} stopOpacity="0"/>
                  <stop offset="45%"  stopColor={star.colorOuter} stopOpacity={arc * 0.35}/>
                  <stop offset="82%"  stopColor={star.colorInner} stopOpacity={arc * 0.65}/>
                  <stop offset="100%" stopColor={star.colorInner} stopOpacity={arc * 0.80}/>
                </linearGradient>

                <filter id={blurSoftId} x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="22"/>
                </filter>
                <filter id={blurHaloId} x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="50"/>
                </filter>
              </defs>

              {/* Layer 1: massive outer pastel halo — very diffuse, matches bg glow style */}
              <circle cx={hx} cy={hy} r={haloR}
                fill={star.colorOuter} opacity={arc * 0.28}
                filter={`url(#${blurHaloId})`}/>

              {/* Layer 2: tail body — blurred triangle */}
              <path d={tailPath}
                fill={`url(#${tailGradId})`}
                filter={`url(#${blurSoftId})`}/>

              {/* Layer 3: main head glow — large, softly blurred, warm orange */}
              {/* Same treatment as the orange cloud behind the Claude logo */}
              <circle cx={hx} cy={hy} r={glowR}
                fill={star.colorInner} opacity={arc * 0.42}
                filter={`url(#${blurHaloId})`}/>

              {/* Layer 4: tighter inner glow — slightly more saturated, still soft */}
              <circle cx={hx} cy={hy} r={glowR * 0.55}
                fill={star.colorInner} opacity={arc * 0.38}
                filter={`url(#${blurSoftId})`}/>
            </g>
          );
        })}

      </svg>
    </AbsoluteFill>
  );
};
