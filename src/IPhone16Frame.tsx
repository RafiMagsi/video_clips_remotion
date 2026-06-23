import React from "react";

// ─── iPhone 16 — real-proportions frame ──────────────────────────────────────
// Real iPhone 16: ~87% screen-to-body. Glass goes nearly edge-to-edge.
// Thin aluminum chassis (~12px sides, ~10px top/bottom) wraps the glass.
// Dynamic Island at top of screen. Standard button layout.

export const PHONE_W = 700;
export const PHONE_H = 1430;
export const PHONE_R = 62;  // outer corner radius

// Thin aluminum frame ring (real iPhone proportions)
const ALUM = 13; // side & top/bottom chassis thickness in px

// Glass / screen region — near-edge-to-edge
export const SCR_X = ALUM;
export const SCR_Y = ALUM;
export const SCR_W = PHONE_W - ALUM * 2;  // 674
export const SCR_H = PHONE_H - ALUM * 2;  // 1404
export const SCR_R = 54;  // screen corner radius (matches inner face of chassis)

interface IPhone16FrameProps {
  children?: React.ReactNode;
}

export const IPhone16Frame: React.FC<IPhone16FrameProps> = ({ children }) => (
  <svg
    width={PHONE_W}
    height={PHONE_H}
    viewBox={`0 0 ${PHONE_W} ${PHONE_H}`}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      overflow: "visible",
      filter: [
        "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
        "drop-shadow(0 22px 55px rgba(0,0,0,0.65))",
        "drop-shadow(0 60px 120px rgba(0,0,0,0.30))",
      ].join(" "),
    }}
  >
    <defs>
      {/* ── Aluminum chassis — DropTicks brand gradient ── */}
      {/* Wraps around the glass like a real iPhone frame */}
      <linearGradient id="alum" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#1040D0" />
        <stop offset="28%"  stopColor="#2060F0" />
        <stop offset="55%"  stopColor="#00B8F0" />
        <stop offset="82%"  stopColor="#6030D8" />
        <stop offset="100%" stopColor="#4820B8" />
      </linearGradient>

      {/* Lighter left/top edge highlight (specular from light source) */}
      <linearGradient id="alum-hi" x1="0%" y1="0%" x2="55%" y2="55%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.40)" />
        <stop offset="50%"  stopColor="rgba(255,255,255,0.08)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
      </linearGradient>

      {/* Darker bottom-right edge */}
      <linearGradient id="alum-sh" x1="100%" y1="100%" x2="45%" y2="45%">
        <stop offset="0%"   stopColor="rgba(0,0,30,0.38)" />
        <stop offset="100%" stopColor="rgba(0,0,30,0.00)" />
      </linearGradient>

      {/* Glass front — subtle blue-tinted surface */}
      <linearGradient id="glass" x1="0%" y1="0%" x2="30%" y2="100%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.09)" />
        <stop offset="30%"  stopColor="rgba(255,255,255,0.03)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
      </linearGradient>

      {/* Button gradients */}
      <linearGradient id="btn-l" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#0830A8" />
        <stop offset="40%"  stopColor="#1850D8" />
        <stop offset="100%" stopColor="#3070F0" />
      </linearGradient>
      <linearGradient id="btn-r" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%"   stopColor="#3818A0" />
        <stop offset="40%"  stopColor="#5030C8" />
        <stop offset="100%" stopColor="#1850D8" />
      </linearGradient>

      {/* Screen content clip */}
      <clipPath id="scr-clip">
        <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H} rx={SCR_R} ry={SCR_R} />
      </clipPath>
    </defs>

    {/* ═══════════════════════════════════════════════
        1 — ALUMINUM CHASSIS BODY (outer silhouette)
            This is the thin frame ring you see on
            the sides of a real iPhone.
    ═══════════════════════════════════════════════ */}
    <rect x={0} y={0} width={PHONE_W} height={PHONE_H}
      rx={PHONE_R} ry={PHONE_R} fill="url(#alum)" />
    <rect x={0} y={0} width={PHONE_W} height={PHONE_H}
      rx={PHONE_R} ry={PHONE_R} fill="url(#alum-hi)" />
    <rect x={0} y={0} width={PHONE_W} height={PHONE_H}
      rx={PHONE_R} ry={PHONE_R} fill="url(#alum-sh)" />
    {/* Outer edge white specular line */}
    <rect x={0} y={0} width={PHONE_W} height={PHONE_H}
      rx={PHONE_R} ry={PHONE_R}
      fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} />

    {/* ═══════════════════════════════════════════════
        2 — GLASS FRONT PANEL (OLED black)
            Almost fills the entire face — only
            the thin aluminum chassis ring shows.
    ═══════════════════════════════════════════════ */}
    <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
      rx={SCR_R} ry={SCR_R} fill="#000000" />

    {/* ═══════════════════════════════════════════════
        3 — SCREEN CONTENT (children render here)
    ═══════════════════════════════════════════════ */}
    <g clipPath="url(#scr-clip)">
      {children}
    </g>

    {/* ═══════════════════════════════════════════════
        4 — GLASS SURFACE REFLECTION
            Sits above content, subtle shine.
    ═══════════════════════════════════════════════ */}
    <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}
      rx={SCR_R} ry={SCR_R} fill="url(#glass)" />

    {/* ═══════════════════════════════════════════════
        5 — DYNAMIC ISLAND
            Black pill cut into the display.
            Positioned 14px from top of screen.
    ═══════════════════════════════════════════════ */}
    <rect
      x={PHONE_W / 2 - 65} y={SCR_Y + 14}
      width={130} height={38}
      rx={19} ry={19}
      fill="#000000"
    />
    {/* Camera lens */}
    <circle cx={PHONE_W / 2 + 35} cy={SCR_Y + 33} r={11} fill="#0B0B14" />
    <circle cx={PHONE_W / 2 + 35} cy={SCR_Y + 33} r={7.5} fill="#14141E" />
    <circle cx={PHONE_W / 2 + 35} cy={SCR_Y + 33} r={4}   fill="#1C1C2A" />
    <circle cx={PHONE_W / 2 + 32} cy={SCR_Y + 30} r={1.8} fill="rgba(100,180,255,0.25)" />
    {/* Sensor dots */}
    <circle cx={PHONE_W / 2 - 22} cy={SCR_Y + 33} r={3.2} fill="#0A0A12" />
    <circle cx={PHONE_W / 2 - 10} cy={SCR_Y + 33} r={2.2} fill="#0A0A12" />

    {/* DI subtle outer glow ring (real DI has ambient light sensor) */}
    <rect
      x={PHONE_W / 2 - 65} y={SCR_Y + 14}
      width={130} height={38}
      rx={19} ry={19}
      fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1}
    />

    {/* ═══════════════════════════════════════════════
        6 — SIDE BUTTONS
            Protruding from chassis. Same brand gradient.
    ═══════════════════════════════════════════════ */}
    {/* Action button (left, top) */}
    <rect x={-7} y={226} width={10} height={52} rx={5}
      fill="url(#btn-l)" />
    <rect x={-7} y={226} width={10} height={52} rx={5}
      fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.7} />

    {/* Volume Up */}
    <rect x={-7} y={304} width={10} height={88} rx={5}
      fill="url(#btn-l)" />
    <rect x={-7} y={304} width={10} height={88} rx={5}
      fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.7} />

    {/* Volume Down */}
    <rect x={-7} y={410} width={10} height={88} rx={5}
      fill="url(#btn-l)" />
    <rect x={-7} y={410} width={10} height={88} rx={5}
      fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.7} />

    {/* Power button (right) */}
    <rect x={PHONE_W - 3} y={330} width={10} height={118} rx={5}
      fill="url(#btn-r)" />
    <rect x={PHONE_W - 3} y={330} width={10} height={118} rx={5}
      fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth={0.7} />

    {/* ═══════════════════════════════════════════════
        7 — BOTTOM DETAILS
    ═══════════════════════════════════════════════ */}
    {/* USB-C */}
    <rect x={PHONE_W/2 - 22} y={PHONE_H - 11} width={44} height={8} rx={4}
      fill="#000" stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} />
    {/* Speaker grilles */}
    {[-76,-65,-54,-43,-32,-21].map((dx, i) => (
      <circle key={`sl${i}`} cx={PHONE_W/2 + dx} cy={PHONE_H - 7} r={2.6}
        fill="#000" stroke="rgba(255,255,255,0.09)" strokeWidth={0.4} />
    ))}
    {[32,43,54,65,76,87].map((dx, i) => (
      <circle key={`sr${i}`} cx={PHONE_W/2 + dx} cy={PHONE_H - 7} r={2.6}
        fill="#000" stroke="rgba(255,255,255,0.09)" strokeWidth={0.4} />
    ))}

    {/* ═══════════════════════════════════════════════
        8 — HOME INDICATOR
    ═══════════════════════════════════════════════ */}
    <rect x={PHONE_W/2 - 68} y={PHONE_H - 26} width={136} height={5} rx={2.5}
      fill="rgba(255,255,255,0.30)" />
  </svg>
);
