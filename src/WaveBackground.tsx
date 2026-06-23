import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// ─── DropTicks AI — energized brand palette ───────────────────────
const CYAN    = "#00EEFF"; // electric cyan (hero)
const BLUE    = "#2060FF"; // vivid blue
const PURPLE  = "#8B2AFF"; // saturated purple
const PINK    = "#FF00BB"; // hot magenta-pink (energy accent)
const TEAL    = "#00FFB8"; // teal spark
const WHITE   = "#FFFFFF";

// ─── Loop-safe speed helper (k full cycles in 10 s) ──────────────
const TWO_PI  = Math.PI * 2;
const DUR     = 10;                               // video duration, seconds
const spd     = (k: number) => (TWO_PI * k) / DUR;

// ─── Deterministic pseudo-random (stable across every frame) ─────
const rng = (seed: number) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const WaveBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t  = frame / fps;
  const CX = W / 2;   // 540
  const CY = H / 2;   // 960

  // ── Aurora blobs — vivid, high-opacity, wide orbits ──────────
  const blobs = [
    {
      x: CX + 380 * Math.sin(t * spd(1)),
      y: CY - 520 + 320 * Math.cos(t * spd(1) + 0.4),
      rx: 620, ry: 500,
      color: CYAN, op: 0.78,
    },
    {
      x: CX - 340 * Math.cos(t * spd(2) + 1.1),
      y: CY + 400 + 280 * Math.sin(t * spd(2) + 0.8),
      rx: 580, ry: 460,
      color: PURPLE, op: 0.72,
    },
    {
      x: CX + 280 * Math.sin(t * spd(3) + 2.2),
      y: CY + 140 + 400 * Math.cos(t * spd(3) + 1.4),
      rx: 500, ry: 420,
      color: BLUE, op: 0.68,
    },
    {
      x: CX - 220 + 440 * Math.cos(t * spd(4) + 0.6),
      y: CY - 220 + 340 * Math.sin(t * spd(4) + 2.5),
      rx: 400, ry: 340,
      color: PINK, op: 0.60,
    },
    {
      x: CX + 300 * Math.cos(t * spd(5) + 1.8),
      y: CY - 380 + 240 * Math.sin(t * spd(5) + 0.3),
      rx: 320, ry: 260,
      color: TEAL, op: 0.52,
    },
  ];

  // ── Floating circle particles (28) ───────────────────────────
  const PCOUNT = 28;
  const particles = Array.from({ length: PCOUNT }, (_, i) => {
    const xFrac = rng(i * 3.71);
    const yOff  = rng(i * 7.13);
    const spd_p = 0.015 + rng(i * 5.59) * 0.042;
    const size  = 3 + rng(i * 11.3) * 9;
    const cols  = [CYAN, BLUE, PURPLE, TEAL, WHITE, PINK];
    const color = cols[Math.floor(rng(i * 13.7) * cols.length)];
    const op    = 0.40 + rng(i * 17.3) * 0.55;
    const pulse = 0.72 + 0.28 * Math.sin(t * spd(1 + (i % 4)) + i * 1.3);
    const yFrac = ((yOff - spd_p * t) % 1 + 1) % 1;
    return { x: xFrac * W, y: yFrac * H, r: size * pulse, color, op: op * pulse };
  });

  // ── Streak particles (18 — fast upward streaks / light trails) ─
  const SCOUNT = 18;
  const streaks = Array.from({ length: SCOUNT }, (_, i) => {
    const xFrac = rng(i * 5.17 + 500);
    const yOff  = rng(i * 9.31 + 600);
    const spd_s = 0.040 + rng(i * 3.71 + 700) * 0.090; // faster than circles
    const len   = 18 + rng(i * 7.11 + 800) * 55;
    const cols  = [CYAN, BLUE, PURPLE, WHITE, TEAL];
    const color = cols[Math.floor(rng(i * 11.3 + 900) * cols.length)];
    const op    = 0.22 + rng(i * 13.7 + 1000) * 0.42;
    const yFrac = ((yOff - spd_s * t) % 1 + 1) % 1;
    return { x: xFrac * W, y: yFrac * H, len, color, op };
  });

  // ── Perspective grid ─────────────────────────────────────────
  const VP_X   = CX;
  const VP_Y   = 40;
  const VLINES = 14;
  const HLINES = 12;

  // ── Canvas-wide scan beam ─────────────────────────────────────
  // 4.8 px/frame × 300 frames = 1440 px — wraps just past H+80 = 2000, fine
  const scanY = ((frame * 4.8) % (H + 100)) - 50;

  // ── Expanding pulse rings (3, offset by 100 frames each) ─────
  const RING_PERIOD = 300; // = durationInFrames — ensures perfect loop
  const rings = [0, 1, 2].map(i => {
    const rf       = (frame + i * 100) % RING_PERIOD;
    const progress = rf / RING_PERIOD; // 0→1 per cycle
    const maxR     = 700;
    return {
      r:   progress * maxR,
      op:  (1 - progress) * 0.50,
      color: [CYAN, PURPLE, BLUE][i],
    };
  });

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0 }}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        {/* Near-pure-black base gradient */}
        <linearGradient id="cbg" x1="0%" y1="0%" x2="12%" y2="100%">
          <stop offset="0%"   stopColor="#000508" />
          <stop offset="40%"  stopColor="#000A1A" />
          <stop offset="75%"  stopColor="#00060E" />
          <stop offset="100%" stopColor="#000306" />
        </linearGradient>

        {/* Vignette — light; let vivid colors through */}
        <radialGradient id="vig" cx="50%" cy="50%" r="72%">
          <stop offset="25%"  stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>

        {/* Aurora blur — huge, covers full canvas */}
        <filter id="cbg-aurora" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="115" />
        </filter>

        {/* Ray glow — medium soft blur */}
        <filter id="ray-glow" x="-10%" y="-5%" width="120%" height="110%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Particle glow */}
        <filter id="cbg-pglow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Scan beam glow */}
        <filter id="cbg-sglow" x="-5%" y="-600%" width="110%" height="1300%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Pulse ring glow */}
        <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── BASE ─────────────────────────────────────────────────── */}
      <rect width={W} height={H} fill="url(#cbg)" />

      {/* ── AURORA BLOBS ─────────────────────────────────────────── */}
      {blobs.map((b, i) => (
        <ellipse key={i}
          cx={b.x} cy={b.y} rx={b.rx} ry={b.ry}
          fill={b.color} opacity={b.op}
          filter="url(#cbg-aurora)"
        />
      ))}

      {/* ── ENERGY RAYS (from top-centre, fan downward) ──────────── */}
      {Array.from({ length: 8 }, (_, i) => {
        const frac   = i / 7; // 0 → 1
        const endX   = CX + (frac - 0.5) * W * 1.7;
        const endY   = H + 180;
        // center rays brighter; outer rays dimmer
        const cw     = 1 - Math.abs(frac - 0.5) * 1.6;
        const pulse  = 0.35 + 0.65 * Math.abs(Math.sin(t * spd(1 + i % 3) + i * 0.85));
        const rayOp  = Math.max(0, cw * 0.24 * pulse);
        const rayW   = 1.2 + cw * 3.0;
        const color  = i % 3 === 0 ? CYAN : i % 3 === 1 ? BLUE : PURPLE;
        return (
          <line key={`ray-${i}`}
            x1={CX} y1={-80}
            x2={endX} y2={endY}
            stroke={color}
            strokeWidth={rayW}
            opacity={rayOp}
            filter="url(#ray-glow)"
          />
        );
      })}

      {/* ── PERSPECTIVE GRID ─────────────────────────────────────── */}
      {Array.from({ length: VLINES }, (_, i) => (
        <line key={`v${i}`}
          x1={VP_X} y1={VP_Y}
          x2={(W / (VLINES - 1)) * i} y2={H}
          stroke={CYAN} strokeWidth={0.7} opacity={0.08}
        />
      ))}
      {Array.from({ length: HLINES }, (_, i) => {
        const frac = i / (HLINES - 1);
        const y    = VP_Y + frac * frac * (H - VP_Y);
        const lerp = (x: number) => VP_X + (x - VP_X) * frac;
        return (
          <line key={`h${i}`}
            x1={lerp(0)} y1={y}
            x2={lerp(W)} y2={y}
            stroke={CYAN} strokeWidth={0.7}
            opacity={0.04 + frac * 0.08}
          />
        );
      })}

      {/* ── EXPANDING PULSE RINGS ────────────────────────────────── */}
      {rings.map((ring, i) => (
        <circle key={`ring-${i}`}
          cx={CX} cy={CY}
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeWidth={2}
          opacity={ring.op}
          filter="url(#ring-glow)"
        />
      ))}

      {/* ── STREAK PARTICLES (fast light trails) ─────────────────── */}
      {streaks.map((s, i) => (
        <line key={`s-${i}`}
          x1={s.x} y1={s.y}
          x2={s.x} y2={s.y + s.len}
          stroke={s.color}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={s.op}
          filter="url(#cbg-pglow)"
        />
      ))}

      {/* ── CIRCLE PARTICLES (ambient floating dots) ─────────────── */}
      {particles.map((p, i) => (
        <circle key={i}
          cx={p.x} cy={p.y} r={p.r}
          fill={p.color} opacity={p.op}
          filter="url(#cbg-pglow)"
        />
      ))}

      {/* ── SCAN BEAM ────────────────────────────────────────────── */}
      <rect x={0} y={scanY - 1} width={W} height={3}
        fill={CYAN} opacity={0.45} filter="url(#cbg-sglow)" />
      <rect x={0} y={scanY} width={W} height={50}
        fill={CYAN} opacity={0.05} />

      {/* ── VIGNETTE (dims corners, phone centre pops) ───────────── */}
      <rect width={W} height={H} fill="url(#vig)" />
    </svg>
  );
};
