import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SCR_X, SCR_Y, SCR_W, SCR_H, SCR_R, PHONE_W, PHONE_H } from "./IPhone16Frame";

// ─── Brand colors (DropTicks AI logo + banner) ────────────────────
const CYAN    = "#00D4FF";
const BLUE    = "#2979FF";
const PURPLE  = "#7C4DFF";
const CYAN2   = "#00AAEE";
const MAGENTA = "#CC00BB";
const DEEP    = "#030A1E";

// ─── Loop-safe speed (k full cycles in 10 s) ─────────────────────
const TWO_PI = Math.PI * 2;
const spd    = (k: number) => (TWO_PI * k) / 10;

// ─── Deterministic pseudo-random (no Math.random — stable per frame) ─
const rng = (seed: number) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ─── Screen centre in PHONE_W×PHONE_H coordinate space ────────────
const CX = SCR_X + SCR_W / 2; // 350  (= PHONE_W / 2)
const CY = SCR_Y + SCR_H / 2; // 715

export const PhoneScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // ── Aurora blob positions (4 large soft colour orbs) ─────────────
  // Each orbits a different elliptical path at a loop-safe speed.
  const blobs = [
    {
      x: CX + 200 * Math.sin(t * spd(1)),
      y: CY - 280 + 180 * Math.cos(t * spd(1) + 0.4),
      rx: 310, ry: 250,
      color: CYAN, op: 0.70,
    },
    {
      x: CX - 180 * Math.cos(t * spd(2) + 1.1),
      y: CY + 220 + 150 * Math.sin(t * spd(2) + 0.8),
      rx: 290, ry: 230,
      color: PURPLE, op: 0.65,
    },
    {
      x: CX + 140 * Math.sin(t * spd(3) + 2.2),
      y: CY + 60  + 200 * Math.cos(t * spd(3) + 1.4),
      rx: 240, ry: 200,
      color: BLUE, op: 0.60,
    },
    {
      x: CX - 100 + 220 * Math.cos(t * spd(4) + 0.6),
      y: CY - 100 + 160 * Math.sin(t * spd(4) + 2.5),
      rx: 180, ry: 150,
      color: MAGENTA, op: 0.50,
    },
  ];

  // ── Floating particles (18 dots, float upward, loop seamlessly) ──
  const PCOUNT = 18;
  const particles = Array.from({ length: PCOUNT }, (_, i) => {
    const xFrac    = rng(i * 3.71);
    const yOffset  = rng(i * 7.13);
    const speed    = 0.025 + rng(i * 5.59) * 0.055;
    const size     = 2.5 + rng(i * 11.3) * 5;
    const cols     = [CYAN, BLUE, PURPLE, CYAN2, "#FFFFFF"];
    const color    = cols[Math.floor(rng(i * 13.7) * cols.length)];
    const opacity  = 0.45 + rng(i * 17.3) * 0.50;
    const pulse    = 0.7 + 0.3 * Math.sin(t * spd(1 + (i % 4)) + i);

    // yFrac moves upward and wraps — loop-safe because (y - speed*t) mod 1
    const yFrac = ((yOffset - speed * t) % 1 + 1) % 1;

    return {
      x: SCR_X + xFrac  * SCR_W,
      y: SCR_Y + yFrac  * SCR_H,
      r: size * pulse,
      color,
      opacity: opacity * pulse,
    };
  });

  // ── Horizontal scan beam (fast, loops via modulo) ─────────────────
  const SCAN_SPEED = 4.5; // px per frame
  const scanY = SCR_Y + ((frame * SCAN_SPEED) % (SCR_H + 80)) - 40;

  // ── Perspective grid vanishing point (top-centre of screen) ──────
  const VP_X = CX;
  const VP_Y = SCR_Y + 70;
  const GRID_LINES = 10;
  const gridOpacity = 0.10;

  // ── Centre play icon pulse ────────────────────────────────────────
  const playPulse = 0.88 + 0.12 * Math.sin(t * spd(2));
  const ringPulse = 0.5  + 0.5  * Math.sin(t * spd(3));

  return (
    <>
      <defs>
        {/* Screen base gradient */}
        <linearGradient id="ps-bg" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#040C22" />
          <stop offset="50%"  stopColor="#070F2A" />
          <stop offset="100%" stopColor="#040818" />
        </linearGradient>

        {/* Vignette (darkens screen edges for depth) */}
        <radialGradient id="ps-vig" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>

        {/* Aurora blur — large stdDeviation = soft glowing orb */}
        <filter id="aurora" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="62" />
        </filter>

        {/* Particle glow */}
        <filter id="pglow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Scan beam glow */}
        <filter id="sglow" x="-10%" y="-500%" width="120%" height="1100%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Play button glow */}
        <filter id="playglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="16" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Clip so aurora blobs don't overflow the screen rect */}
        <clipPath id="ps-clip">
          <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H} rx={SCR_R} ry={SCR_R} />
        </clipPath>
      </defs>

      {/* ── BASE ───────────────────────────────────────────────────── */}
      <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
        rx={SCR_R} ry={SCR_R} fill="url(#ps-bg)" />

      {/* ── AURORA BLOBS (clipped to screen) ──────────────────────── */}
      <g clipPath="url(#ps-clip)">
        {blobs.map((b, i) => (
          <ellipse key={i}
            cx={b.x} cy={b.y} rx={b.rx} ry={b.ry}
            fill={b.color} opacity={b.op}
            filter="url(#aurora)"
          />
        ))}

        {/* ── PERSPECTIVE GRID ─────────────────────────────────────── */}
        {/* Radiating lines from vanishing point */}
        {Array.from({ length: GRID_LINES }, (_, i) => {
          const spreadX  = SCR_X + (SCR_W / (GRID_LINES - 1)) * i;
          return (
            <line key={`vl-${i}`}
              x1={VP_X} y1={VP_Y}
              x2={spreadX} y2={SCR_Y + SCR_H}
              stroke={CYAN2} strokeWidth={0.8} opacity={gridOpacity}
            />
          );
        })}
        {/* Horizontal cross-lines, spacing widens toward bottom (perspective) */}
        {Array.from({ length: 10 }, (_, i) => {
          const frac  = i / 9;
          const y     = VP_Y + frac * frac * (SCR_Y + SCR_H - VP_Y); // quadratic spacing
          const lerpX = (x: number) => VP_X + (x - VP_X) * frac;
          return (
            <line key={`hl-${i}`}
              x1={lerpX(SCR_X)} y1={y}
              x2={lerpX(SCR_X + SCR_W)} y2={y}
              stroke={CYAN2} strokeWidth={0.8} opacity={gridOpacity * (0.4 + frac * 0.8)}
            />
          );
        })}

        {/* ── PARTICLES ─────────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y} r={p.r}
            fill={p.color} opacity={p.opacity}
            filter="url(#pglow)"
          />
        ))}

        {/* ── SCAN BEAM ─────────────────────────────────────────────── */}
        {/* Main line */}
        <rect x={SCR_X} y={scanY} width={SCR_W} height={2.5}
          fill={CYAN} opacity={0.50} filter="url(#sglow)" />
        {/* Wide diffuse glow below */}
        <rect x={SCR_X} y={scanY} width={SCR_W} height={28}
          fill={CYAN} opacity={0.06} />

        {/* ── VIGNETTE ──────────────────────────────────────────────── */}
        <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
          rx={SCR_R} ry={SCR_R} fill="url(#ps-vig)" />

        {/* ── CENTRE PLAY BUTTON ────────────────────────────────────── */}
        {/* Pulsing outer ring */}
        <circle cx={CX} cy={CY} r={110 * (0.90 + ringPulse * 0.10)}
          fill="none"
          stroke={CYAN} strokeWidth={1.5}
          opacity={0.20 + ringPulse * 0.18}
        />
        {/* Mid ring */}
        <circle cx={CX} cy={CY} r={88 * playPulse}
          fill="none"
          stroke={BLUE} strokeWidth={2}
          opacity={0.40}
          filter="url(#playglow)"
        />
        {/* Filled button */}
        <circle cx={CX} cy={CY} r={64 * playPulse}
          fill={BLUE} opacity={0.22} />
        <circle cx={CX} cy={CY} r={64 * playPulse}
          fill="none" stroke={CYAN} strokeWidth={2}
          opacity={0.80} filter="url(#playglow)" />
        {/* Play triangle */}
        <polygon
          points={`
            ${CX - 20},${CY - 28}
            ${CX + 40},${CY}
            ${CX - 20},${CY + 28}
          `}
          fill="white"
          opacity={0.90 * playPulse}
        />

        {/* ── "YOUR VIDEO HERE" label ───────────────────────────────── */}
        <text x={CX} y={CY + 112}
          textAnchor="middle"
          fill={CYAN} fontSize={20} fontWeight="600"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
          opacity={0.55}>
          Your video goes here
        </text>
      </g>

      {/* ── SCREEN EDGE INNER GLOW (brand cyan rim light) ─────────── */}
      <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
        rx={SCR_R} ry={SCR_R}
        fill="none"
        stroke={CYAN}
        strokeWidth={1.5}
        opacity={0.18 + 0.10 * Math.sin(t * spd(2))}
      />
    </>
  );
};
