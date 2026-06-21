import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// ─── DropTicks AI brand colors ────────────────────────────────────
const CYAN    = "#00D4FF";
const BLUE    = "#2979FF";
const PURPLE  = "#7C4DFF";
const CYAN2   = "#00AAEE";
const MAGENTA = "#CC00BB";

// ─── Loop-safe speed helper ───────────────────────────────────────
const TWO_PI = Math.PI * 2;
const spd    = (k: number) => (TWO_PI * k) / 10; // k full cycles in 10 s

// ─── Deterministic pseudo-random (stable across frames) ───────────
const rng = (seed: number) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const WaveBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  const CX = W / 2;   // 540
  const CY = H / 2;   // 960

  // ── Aurora blobs (large — cover full canvas) ───────────────────
  // More blobs than PhoneScreen, larger radii, wider orbits.
  const blobs = [
    {
      x: CX + 360 * Math.sin(t * spd(1)),
      y: CY - 480 + 300 * Math.cos(t * spd(1) + 0.4),
      rx: 600, ry: 480,
      color: CYAN, op: 0.58,
    },
    {
      x: CX - 320 * Math.cos(t * spd(2) + 1.1),
      y: CY + 380 + 260 * Math.sin(t * spd(2) + 0.8),
      rx: 560, ry: 440,
      color: PURPLE, op: 0.52,
    },
    {
      x: CX + 260 * Math.sin(t * spd(3) + 2.2),
      y: CY + 120  + 380 * Math.cos(t * spd(3) + 1.4),
      rx: 480, ry: 400,
      color: BLUE, op: 0.48,
    },
    {
      x: CX - 200 + 400 * Math.cos(t * spd(4) + 0.6),
      y: CY - 200 + 300 * Math.sin(t * spd(4) + 2.5),
      rx: 380, ry: 320,
      color: MAGENTA, op: 0.40,
    },
    {
      // Extra cyan accent — quick, small, bright
      x: CX + 280 * Math.cos(t * spd(5) + 1.8),
      y: CY - 320 + 200 * Math.sin(t * spd(5) + 0.3),
      rx: 300, ry: 240,
      color: CYAN2, op: 0.38,
    },
  ];

  // ── Floating particles (30 across full canvas) ─────────────────
  const PCOUNT = 30;
  const particles = Array.from({ length: PCOUNT }, (_, i) => {
    const xFrac  = rng(i * 3.71);
    const yOff   = rng(i * 7.13);
    const speed  = 0.015 + rng(i * 5.59) * 0.040;
    const size   = 3 + rng(i * 11.3) * 8;
    const cols   = [CYAN, BLUE, PURPLE, CYAN2, "#FFFFFF", MAGENTA];
    const color  = cols[Math.floor(rng(i * 13.7) * cols.length)];
    const op     = 0.35 + rng(i * 17.3) * 0.55;
    const pulse  = 0.7 + 0.3 * Math.sin(t * spd(1 + (i % 5)) + i * 1.3);

    const yFrac  = ((yOff - speed * t) % 1 + 1) % 1;

    return {
      x:  xFrac * W,
      y:  yFrac * H,
      r:  size * pulse,
      color,
      op: op * pulse,
    };
  });

  // ── Canvas-wide scan beam ──────────────────────────────────────
  const scanY = ((frame * 3.8) % (H + 120)) - 60;

  // ── Perspective grid (vanishing point top-centre) ─────────────
  const VP_X = CX;
  const VP_Y = 60;
  const VLINES = 14;
  const HLINES = 12;

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0 }}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        {/* Very dark base */}
        <linearGradient id="cbg" x1="0%" y1="0%" x2="15%" y2="100%">
          <stop offset="0%"   stopColor="#020810" />
          <stop offset="45%"  stopColor="#040C1E" />
          <stop offset="80%"  stopColor="#060A18" />
          <stop offset="100%" stopColor="#030610" />
        </linearGradient>

        {/* Vignette — darkens corners so phone pops */}
        <radialGradient id="vig" cx="50%" cy="50%" r="72%">
          <stop offset="30%"  stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.65)" />
        </radialGradient>

        {/* Aurora blur — very large radius for full-canvas blobs */}
        <filter id="cbg-aurora" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="110" />
        </filter>

        {/* Particle glow */}
        <filter id="cbg-pglow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Scan beam glow */}
        <filter id="cbg-sglow" x="-5%" y="-500%" width="110%" height="1100%">
          <feGaussianBlur stdDeviation="12" result="b" />
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

      {/* ── PERSPECTIVE GRID ─────────────────────────────────────── */}
      {/* Radiating vertical lines */}
      {Array.from({ length: VLINES }, (_, i) => {
        const bx = (W / (VLINES - 1)) * i;
        return (
          <line key={`v${i}`}
            x1={VP_X} y1={VP_Y}
            x2={bx}   y2={H}
            stroke={CYAN2} strokeWidth={0.7} opacity={0.07}
          />
        );
      })}
      {/* Horizontal cross-lines with perspective spacing */}
      {Array.from({ length: HLINES }, (_, i) => {
        const frac = i / (HLINES - 1);
        const y    = VP_Y + frac * frac * (H - VP_Y);
        const lerp = (x: number) => VP_X + (x - VP_X) * frac;
        return (
          <line key={`h${i}`}
            x1={lerp(0)} y1={y}
            x2={lerp(W)} y2={y}
            stroke={CYAN2} strokeWidth={0.7}
            opacity={0.04 + frac * 0.07}
          />
        );
      })}

      {/* ── PARTICLES ────────────────────────────────────────────── */}
      {particles.map((p, i) => (
        <circle key={i}
          cx={p.x} cy={p.y} r={p.r}
          fill={p.color} opacity={p.op}
          filter="url(#cbg-pglow)"
        />
      ))}

      {/* ── SCAN BEAM ────────────────────────────────────────────── */}
      <rect x={0} y={scanY} width={W} height={3}
        fill={CYAN} opacity={0.30} filter="url(#cbg-sglow)" />
      <rect x={0} y={scanY} width={W} height={40}
        fill={CYAN} opacity={0.04} />

      {/* ── VIGNETTE (last, dims edges) ──────────────────────────── */}
      <rect width={W} height={H} fill="url(#vig)" />
    </svg>
  );
};
