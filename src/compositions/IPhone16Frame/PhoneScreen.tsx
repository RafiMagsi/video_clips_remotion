import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { CYAN, BLUE, VIOLET, PINK, TEAL, WHITE } from '../../common/colors';
import { rng } from '../../common/utils';
import { SCR_X, SCR_Y, SCR_W, SCR_H, SCR_R } from './IPhone16Frame';

// ─────────────────────────────────────────────────────────────────────────────
//  PhoneScreen — Animated placeholder for the iPhone screen
//
//  Renders when SHOW_VIDEO = false in IPhoneComposition.
//  Shows aurora blobs, perspective grid, particles, spinning rings,
//  a scan beam, and a "play" button with "Your video goes here" label.
//
//  This component renders as SVG content inside <IPhone16Frame>.
//  It uses <defs> at the start so the clip region is respected.
//
//  To change for different results:
//    • PCOUNT — number of floating particles (default 22)
//    • SCOUNT — number of streak trails (default 12)
//    • scanSpeed — scan beam speed in px/frame (default 5.2)
//    • Ring radii (r=70, 92, 118) can be adjusted for different scale feel
// ─────────────────────────────────────────────────────────────────────────────

const TWO_PI = Math.PI * 2;
const spd    = (k: number) => (TWO_PI * k) / 10; // k cycles per 10s

// Screen centre in PHONE_W × PHONE_H coordinate space
const CX = SCR_X + SCR_W / 2; // 350
const CY = SCR_Y + SCR_H / 2; // 715

// Ring circumferences for stroke-dashoffset animation
const C_INNER = 2 * Math.PI * 70;  // ≈ 439.8
const C_MID   = 2 * Math.PI * 92;  // ≈ 578.1
const C_OUTER = 2 * Math.PI * 118; // ≈ 741.4

export const PhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Aurora blobs
  const blobs = [
    { x: CX + 200 * Math.sin(t * spd(1)),          y: CY - 290 + 190 * Math.cos(t * spd(1) + 0.4),   rx: 320, ry: 260, color: CYAN,   op: 0.82 },
    { x: CX - 185 * Math.cos(t * spd(2) + 1.1),    y: CY + 230 + 160 * Math.sin(t * spd(2) + 0.8),   rx: 300, ry: 245, color: VIOLET, op: 0.76 },
    { x: CX + 145 * Math.sin(t * spd(3) + 2.2),    y: CY + 70  + 210 * Math.cos(t * spd(3) + 1.4),   rx: 255, ry: 215, color: BLUE,   op: 0.70 },
    { x: CX - 105 + 240 * Math.cos(t * spd(4) + 0.6), y: CY - 110 + 175 * Math.sin(t * spd(4) + 2.5), rx: 195, ry: 165, color: PINK,   op: 0.62 },
  ];

  // Floating circle particles
  const PCOUNT = 22;
  const particles = Array.from({ length: PCOUNT }, (_, i) => {
    const xFrac  = rng(i * 3.71);
    const yOff   = rng(i * 7.13);
    const speed  = 0.022 + rng(i * 5.59) * 0.058;
    const size   = 2.5 + rng(i * 11.3) * 6;
    const cols   = [CYAN, BLUE, VIOLET, TEAL, WHITE];
    const color  = cols[Math.floor(rng(i * 13.7) * cols.length)];
    const op     = 0.50 + rng(i * 17.3) * 0.46;
    const pulse  = 0.72 + 0.28 * Math.sin(t * spd(1 + (i % 4)) + i);
    const yFrac  = ((yOff - speed * t) % 1 + 1) % 1;
    return { x: SCR_X + xFrac * SCR_W, y: SCR_Y + yFrac * SCR_H, r: size * pulse, color, op: op * pulse };
  });

  // Streak particles
  const SCOUNT = 12;
  const streaks = Array.from({ length: SCOUNT }, (_, i) => {
    const xFrac = rng(i * 5.17 + 200);
    const yOff  = rng(i * 9.31 + 300);
    const speed = 0.038 + rng(i * 3.71 + 400) * 0.08;
    const len   = 14 + rng(i * 7.11 + 500) * 45;
    const cols  = [CYAN, BLUE, VIOLET, WHITE, TEAL];
    const color = cols[Math.floor(rng(i * 11.3 + 600) * cols.length)];
    const op    = 0.20 + rng(i * 13.7 + 700) * 0.38;
    const yFrac = ((yOff - speed * t) % 1 + 1) % 1;
    return { x: SCR_X + xFrac * SCR_W, y: SCR_Y + yFrac * SCR_H, len, color, op };
  });

  const scanY = SCR_Y + ((frame * 5.2) % (SCR_H + 80)) - 40;

  // Perspective grid
  const VP_X    = CX;
  const VP_Y    = SCR_Y + 65;
  const GLINES  = 10;
  const gridOp  = 0.11;

  const playPulse  = 0.88 + 0.12 * Math.sin(t * spd(2));
  const innerOff   = -(4 * t * C_INNER) / 10;
  const midOff     = +(1 * t * C_MID)   / 10;
  const outerOff   = +(2 * t * C_OUTER) / 10;
  const ringGlow   = 0.55 + 0.45 * Math.sin(t * spd(3));

  return (
    <>
      <defs>
        <linearGradient id="ps-bg" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#030D26"/>
          <stop offset="50%"  stopColor="#06102E"/>
          <stop offset="100%" stopColor="#040A1E"/>
        </linearGradient>
        <radialGradient id="ps-vig" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.50)"/>
        </radialGradient>
        <filter id="ps-aurora" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="65"/>
        </filter>
        <filter id="ps-pglow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ps-sglow" x="-10%" y="-500%" width="120%" height="1100%">
          <feGaussianBlur stdDeviation="9" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="ps-playglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="18" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="ps-clip">
          <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H} rx={SCR_R} ry={SCR_R}/>
        </clipPath>
      </defs>

      {/* Base */}
      <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H} rx={SCR_R} ry={SCR_R} fill="url(#ps-bg)"/>

      <g clipPath="url(#ps-clip)">
        {/* Aurora blobs */}
        {blobs.map((b, i) => (
          <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry}
            fill={b.color} opacity={b.op} filter="url(#ps-aurora)"/>
        ))}

        {/* Perspective grid */}
        {Array.from({ length: GLINES }, (_, i) => (
          <line key={`vl${i}`}
            x1={VP_X} y1={VP_Y}
            x2={SCR_X + (SCR_W / (GLINES - 1)) * i} y2={SCR_Y + SCR_H}
            stroke={CYAN} strokeWidth={0.8} opacity={gridOp}/>
        ))}
        {Array.from({ length: 10 }, (_, i) => {
          const frac = i / 9;
          const y    = VP_Y + frac * frac * (SCR_Y + SCR_H - VP_Y);
          const lx   = (x: number) => VP_X + (x - VP_X) * frac;
          return (
            <line key={`hl${i}`}
              x1={lx(SCR_X)} y1={y} x2={lx(SCR_X + SCR_W)} y2={y}
              stroke={CYAN} strokeWidth={0.8} opacity={gridOp * (0.4 + frac * 0.9)}/>
          );
        })}

        {/* Streaks */}
        {streaks.map((s, i) => (
          <line key={i}
            x1={s.x} y1={s.y} x2={s.x} y2={s.y + s.len}
            stroke={s.color} strokeWidth={1.4} strokeLinecap="round"
            opacity={s.op} filter="url(#ps-pglow)"/>
        ))}

        {/* Particles */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r}
            fill={p.color} opacity={p.op} filter="url(#ps-pglow)"/>
        ))}

        {/* Scan beam */}
        <rect x={SCR_X} y={scanY} width={SCR_W} height={2.5}
          fill={CYAN} opacity={0.65} filter="url(#ps-sglow)"/>
        <rect x={SCR_X} y={scanY} width={SCR_W} height={32}
          fill={CYAN} opacity={0.07}/>

        {/* Vignette */}
        <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
          rx={SCR_R} ry={SCR_R} fill="url(#ps-vig)"/>

        {/* Spinning rings */}
        <circle cx={CX} cy={CY} r={118} fill="none" stroke={VIOLET} strokeWidth={1.4}
          strokeDasharray={`${C_OUTER/6*0.55} ${C_OUTER/6*0.45}`}
          strokeDashoffset={outerOff}
          opacity={0.30 + 0.15 * Math.sin(t * spd(1))}/>
        <circle cx={CX} cy={CY} r={92} fill="none" stroke={BLUE} strokeWidth={1.8}
          strokeDasharray={`${C_MID/5*0.60} ${C_MID/5*0.40}`}
          strokeDashoffset={midOff}
          opacity={0.40 + 0.20 * Math.sin(t * spd(2))}
          filter="url(#ps-playglow)"/>
        <circle cx={CX} cy={CY} r={70} fill="none" stroke={CYAN} strokeWidth={2.2}
          strokeDasharray={`${C_INNER/8*0.55} ${C_INNER/8*0.45}`}
          strokeDashoffset={innerOff}
          opacity={0.55 + 0.25 * ringGlow}
          filter="url(#ps-playglow)"/>

        {/* Play button */}
        <circle cx={CX} cy={CY} r={52 * playPulse} fill={BLUE} opacity={0.25}/>
        <circle cx={CX} cy={CY} r={52 * playPulse} fill="none" stroke={CYAN}
          strokeWidth={2.5} opacity={0.90} filter="url(#ps-playglow)"/>
        <polygon points={`${CX-16},${CY-24} ${CX+34},${CY} ${CX-16},${CY+24}`}
          fill="white" opacity={0.95 * playPulse}/>

        {/* "Your video goes here" label */}
        <text x={CX} y={CY + 108} textAnchor="middle"
          fill={CYAN} fontSize={20} fontWeight="600"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          opacity={0.50}>
          Your video goes here
        </text>
      </g>

      {/* Screen edge glow */}
      <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
        rx={SCR_R} ry={SCR_R} fill="none" stroke={CYAN} strokeWidth={2}
        opacity={0.22 + 0.14 * Math.sin(t * spd(2))}/>
    </>
  );
};
