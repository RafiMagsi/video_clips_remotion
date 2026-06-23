import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CYAN, BLUE, VIOLET, PINK, TEAL } from '../colors';
import { rng, osc } from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
//  WaveBackground — Full-canvas animated aurora background
//
//  Drop into any composition as the first child of AbsoluteFill.
//  Uses useVideoConfig() so it auto-adapts to any canvas size.
//
//  Usage:
//    <AbsoluteFill style={{ background: BG_BASE }}>
//      <WaveBackground />
//      ... your scene content ...
//    </AbsoluteFill>
//
//  To change for different results:
//    • showEnergyRays    — false to remove the fan-of-rays from top centre
//    • showPerspectiveGrid — false for a cleaner look
//    • showPulseRings    — false for less visual noise
//    • showScanBeam      — false when scenes have their own scan beam
//    • scanSpeed         — px per frame (default 4.8, higher = faster)
//    • auroraBlur        — gaussian blur for aurora blobs (default 115)
//    • Colors are hardcoded to the DropTicks AI brand palette.
//      To use different colors, duplicate this file and edit the
//      `blobs` array fill colors.
// ─────────────────────────────────────────────────────────────────────────────

export interface WaveBackgroundProps {
  showEnergyRays?:     boolean;  // fan of rays from top-centre (default true)
  showPerspectiveGrid?: boolean; // vanishing-point grid (default true)
  showPulseRings?:     boolean;  // expanding rings from centre (default true)
  showScanBeam?:       boolean;  // horizontal scan beam (default true)
  showParticles?:      boolean;  // floating dots + streaks (default true)
  scanSpeed?:          number;   // px/frame (default 4.8)
  auroraBlur?:         number;   // feGaussianBlur stdDeviation (default 115)
}

export const WaveBackground: React.FC<WaveBackgroundProps> = ({
  showEnergyRays     = true,
  showPerspectiveGrid = true,
  showPulseRings     = true,
  showScanBeam       = true,
  showParticles      = true,
  scanSpeed          = 4.8,
  auroraBlur         = 115,
}) => {
  const frame                    = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t  = frame / fps;
  const CX = W / 2;
  const CY = H / 2;

  // ── Aurora blobs (5 wide ellipses blurred into hazy clouds) ─────────────
  const blobs = [
    { x: CX + 380 * Math.sin(osc(t,1)*Math.PI),  y: CY - 520 + 320 * Math.cos(osc(t,1,10,0.4)*Math.PI), rx: 620, ry: 500, color: CYAN,   op: 0.78 },
    { x: CX - 340 * Math.cos(osc(t,2,10,1.1)*Math.PI), y: CY + 400 + 280 * Math.sin(osc(t,2,10,0.8)*Math.PI), rx: 580, ry: 460, color: VIOLET, op: 0.72 },
    { x: CX + 280 * Math.sin(osc(t,3,10,2.2)*Math.PI), y: CY + 140 + 400 * Math.cos(osc(t,3,10,1.4)*Math.PI), rx: 500, ry: 420, color: BLUE,   op: 0.68 },
    { x: CX - 220 + 440 * Math.cos(osc(t,4,10,0.6)*Math.PI), y: CY - 220 + 340 * Math.sin(osc(t,4,10,2.5)*Math.PI), rx: 400, ry: 340, color: PINK,   op: 0.60 },
    { x: CX + 300 * Math.cos(osc(t,5,10,1.8)*Math.PI), y: CY - 380 + 240 * Math.sin(osc(t,5,10,0.3)*Math.PI), rx: 320, ry: 260, color: TEAL,   op: 0.52 },
  ];

  // ── Floating circle particles (28) ────────────────────────────────────────
  const PCOUNT = 28;
  const particles = Array.from({ length: PCOUNT }, (_, i) => {
    const xFrac = rng(i * 3.71);
    const yOff  = rng(i * 7.13);
    const spd   = 0.015 + rng(i * 5.59) * 0.042;
    const size  = 3 + rng(i * 11.3) * 9;
    const cols  = [CYAN, BLUE, VIOLET, TEAL, '#FFFFFF', PINK];
    const color = cols[Math.floor(rng(i * 13.7) * cols.length)];
    const op    = 0.40 + rng(i * 17.3) * 0.55;
    const pulse = 0.72 + 0.28 * Math.sin(t * (Math.PI*2*(1+(i%4))/10) + i * 1.3);
    const yFrac = ((yOff - spd * t) % 1 + 1) % 1;
    return { x: xFrac * W, y: yFrac * H, r: size * pulse, color, op: op * pulse };
  });

  // ── Streak particles (18 fast upward light trails) ─────────────────────
  const SCOUNT = 18;
  const streaks = Array.from({ length: SCOUNT }, (_, i) => {
    const xFrac = rng(i * 5.17 + 500);
    const yOff  = rng(i * 9.31 + 600);
    const spd   = 0.040 + rng(i * 3.71 + 700) * 0.090;
    const len   = 18 + rng(i * 7.11 + 800) * 55;
    const cols  = [CYAN, BLUE, VIOLET, '#FFFFFF', TEAL];
    const color = cols[Math.floor(rng(i * 11.3 + 900) * cols.length)];
    const op    = 0.22 + rng(i * 13.7 + 1000) * 0.42;
    const yFrac = ((yOff - spd * t) % 1 + 1) % 1;
    return { x: xFrac * W, y: yFrac * H, len, color, op };
  });

  // ── Scan beam ─────────────────────────────────────────────────────────────
  const scanY = ((frame * scanSpeed) % (H + 100)) - 50;

  // ── Expanding pulse rings (3) ──────────────────────────────────────────────
  const RING_PERIOD = 300;
  const rings = [0, 1, 2].map(i => {
    const rf       = (frame + i * 100) % RING_PERIOD;
    const progress = rf / RING_PERIOD;
    return { r: progress * 700, op: (1 - progress) * 0.50, color: [CYAN, VIOLET, BLUE][i] };
  });

  // ── Perspective grid ────────────────────────────────────────────────────
  const VP_X = CX, VP_Y = 40;
  const VLINES = 14, HLINES = 12;

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}
      width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="wbg-base" x1="0%" y1="0%" x2="12%" y2="100%">
          <stop offset="0%"   stopColor="#000508"/>
          <stop offset="40%"  stopColor="#000A1A"/>
          <stop offset="75%"  stopColor="#00060E"/>
          <stop offset="100%" stopColor="#000306"/>
        </linearGradient>
        <radialGradient id="wbg-vig" cx="50%" cy="50%" r="72%">
          <stop offset="25%"  stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)"/>
        </radialGradient>
        <filter id="wbg-aurora" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation={auroraBlur}/>
        </filter>
        <filter id="wbg-ray" x="-10%" y="-5%" width="120%" height="110%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="wbg-pglow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="7" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="wbg-sglow" x="-5%" y="-600%" width="110%" height="1300%">
          <feGaussianBlur stdDeviation="14" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="wbg-ring" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Base */}
      <rect width={W} height={H} fill="url(#wbg-base)"/>

      {/* Aurora blobs */}
      {blobs.map((b, i) => (
        <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry}
          fill={b.color} opacity={b.op} filter="url(#wbg-aurora)"/>
      ))}

      {/* Energy rays */}
      {showEnergyRays && Array.from({ length: 8 }, (_, i) => {
        const frac  = i / 7;
        const endX  = CX + (frac - 0.5) * W * 1.7;
        const cw    = 1 - Math.abs(frac - 0.5) * 1.6;
        const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * (Math.PI*2*(1+i%3)/10) + i * 0.85));
        const rayOp = Math.max(0, cw * 0.24 * pulse);
        const rayW  = 1.2 + cw * 3.0;
        const color = i % 3 === 0 ? CYAN : i % 3 === 1 ? BLUE : VIOLET;
        return (
          <line key={`r${i}`}
            x1={CX} y1={-80} x2={endX} y2={H + 180}
            stroke={color} strokeWidth={rayW} opacity={rayOp}
            filter="url(#wbg-ray)"/>
        );
      })}

      {/* Perspective grid */}
      {showPerspectiveGrid && <>
        {Array.from({ length: VLINES }, (_, i) => (
          <line key={`v${i}`}
            x1={VP_X} y1={VP_Y}
            x2={(W / (VLINES - 1)) * i} y2={H}
            stroke={CYAN} strokeWidth={0.7} opacity={0.08}/>
        ))}
        {Array.from({ length: HLINES }, (_, i) => {
          const frac = i / (HLINES - 1);
          const y    = VP_Y + frac * frac * (H - VP_Y);
          const lx   = (x: number) => VP_X + (x - VP_X) * frac;
          return (
            <line key={`h${i}`}
              x1={lx(0)} y1={y} x2={lx(W)} y2={y}
              stroke={CYAN} strokeWidth={0.7} opacity={0.04 + frac * 0.08}/>
          );
        })}
      </>}

      {/* Pulse rings */}
      {showPulseRings && rings.map((ring, i) => (
        <circle key={i}
          cx={CX} cy={CY} r={ring.r}
          fill="none" stroke={ring.color} strokeWidth={2}
          opacity={ring.op} filter="url(#wbg-ring)"/>
      ))}

      {/* Particles */}
      {showParticles && <>
        {streaks.map((s, i) => (
          <line key={`sk${i}`}
            x1={s.x} y1={s.y} x2={s.x} y2={s.y + s.len}
            stroke={s.color} strokeWidth={1.5} strokeLinecap="round"
            opacity={s.op} filter="url(#wbg-pglow)"/>
        ))}
        {particles.map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y} r={p.r}
            fill={p.color} opacity={p.op}
            filter="url(#wbg-pglow)"/>
        ))}
      </>}

      {/* Scan beam */}
      {showScanBeam && <>
        <rect x={0} y={scanY - 1} width={W} height={3}
          fill={CYAN} opacity={0.45} filter="url(#wbg-sglow)"/>
        <rect x={0} y={scanY} width={W} height={50}
          fill={CYAN} opacity={0.05}/>
      </>}

      {/* Vignette */}
      <rect width={W} height={H} fill="url(#wbg-vig)"/>
    </svg>
  );
};
