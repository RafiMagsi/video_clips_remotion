import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  SceneDecode — "05 / DECODE"
//
//  "Every top creator. Decoded."
//  HOOK | VISUALS | TRENDS pills
//  3 creator cards: @mrbeast @garrytan @aliabdaal
//  Animated bezier lines converging → Obsidian vault icon
//  Analytics line chart at the bottom
//
//  Layout (1080 × 1920, SAFE_H=162):
//    y=192   Badge  "05 / DECODE"  (left)
//    y=268   "Every top creator."  (82px, black, left)
//    y=358   "Decoded."            (82px, indigo gradient, left)
//    y=456   Pills row  HOOK | VISUALS | TRENDS
//    y=518   Creator cards (244 × 180 px, 12px gap)
//    —       Full-canvas SVG for convergence lines
//    y=906   Obsidian vault icon (90 × 90, centered)
//    y=1010  "OBSIDIAN VAULT"  label
//    y=1090  Analytics line chart
// ─────────────────────────────────────────────────────────────────────────────

const INDIGO = '#6366F1';
const BLACK  = '#0A0A0A';

// ── 3 top YouTube creators ────────────────────────────────────────────────────
const CREATORS = [
  {
    handle:   '@mrbeast',
    gradient: 'linear-gradient(140deg, #8B0000 0%, #FF4444 45%, #1A0028 100%)',
    lineColor: '#FF4D4D',
  },
  {
    handle:   '@garrytan',
    gradient: 'linear-gradient(140deg, #7A2900 0%, #FF8800 45%, #2A1000 100%)',
    lineColor: '#FF8800',
  },
  {
    handle:   '@aliabdaal',
    gradient: 'linear-gradient(140deg, #1E3A8A 0%, #3B82F6 45%, #0A0F2A 100%)',
    lineColor: '#3B82F6',
  },
];

// ── Category pills ─────────────────────────────────────────────────────────────
const PILLS = ['HOOK', 'VISUALS', 'TRENDS'];

// ── Card geometry constants ────────────────────────────────────────────────────
const CARD_W   = 244;   // (756 - 2*12) / 3 = 244
const CARD_H   = 180;
const CARD_GAP = 12;
const CARD_TOP = 518;
// Card left positions on canvas (absolute x):
const CARD_XS  = CREATORS.map((_, i) => SAFE_H + i * (CARD_W + CARD_GAP));
// Card bottom-center positions (line start points):
const LINE_FROM = CARD_XS.map(x => ({ x: x + CARD_W / 2, y: CARD_TOP + CARD_H }));
// Obsidian icon center:
const OBS_CX = 540;
const OBS_CY = 950;
// Line end point (top of icon):
const LINE_TO_Y = OBS_CY - 50;

// ── Obsidian icon (faceted crystal in a white card) ───────────────────────────
const ObsidianIcon: React.FC<{ size: number }> = ({ size }) => {
  const g = size * 0.60;   // gem SVG size
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: 'rgba(255,255,255,0.96)',
      boxShadow: '0 6px 28px rgba(0,0,0,0.14), 0 0 0 1.5px rgba(0,0,0,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={g} height={g} viewBox="0 0 100 100" fill="none">
        {/* Outer hex shape */}
        <polygon points="50,6 83,26 83,74 50,94 17,74 17,26" fill="#1A1032"/>
        {/* Top-left facet (lightest) */}
        <polygon points="50,6 83,26 50,42" fill="rgba(255,255,255,0.30)"/>
        <polygon points="50,6 17,26 50,42" fill="rgba(255,255,255,0.18)"/>
        {/* Side facets */}
        <polygon points="83,26 83,74 50,42" fill="rgba(0,0,0,0.28)"/>
        <polygon points="17,26 17,74 50,42" fill="rgba(255,255,255,0.10)"/>
        {/* Bottom facets */}
        <polygon points="83,74 50,94 50,42" fill="rgba(0,0,0,0.22)"/>
        <polygon points="17,74 50,94 50,42" fill="rgba(0,0,0,0.12)"/>
        {/* Inner highlight */}
        <polygon points="50,6 83,26 50,42 17,26" fill="rgba(255,255,255,0.06)"/>
      </svg>
    </div>
  );
};

// ── Analytics line chart ───────────────────────────────────────────────────────
const CHART_X   = [0, 108, 216, 324, 432, 540, 648, 756, 864, 972, 1080];
const CHART_VAL = [0.42, 0.20, 0.62, 0.38, 0.78, 0.46, 0.84, 0.52, 0.70, 0.35, 0.88];
const CHART_TOP = 1110;
const CHART_BOT = 1440;
const chartY = (v: number) => CHART_BOT - v * (CHART_BOT - CHART_TOP);
const polyline = CHART_X.map((x, i) => `${x},${chartY(CHART_VAL[i])}`).join(' ');

// ─────────────────────────────────────────────────────────────────────────────

export const SceneDecode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  // Badge
  const badgeSp = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  // Headlines
  const h1Sp    = sp(frame, fps, 10, { stiffness: 78, damping: 16 });
  const h2Sp    = sp(frame, fps, 20, { stiffness: 78, damping: 16 });
  // Pills
  const pillsSp = sp(frame, fps, 42, { stiffness: 65, damping: 14 });
  // Cards staggered
  const cardSps = CREATORS.map((_, i) =>
    sp(frame, fps, 60 + i * 12, { stiffness: 62, damping: 14 })
  );
  // Convergence lines (frame-based)
  const lineProg  = interpolate(frame, [132, 188], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const LINE_LEN  = 500;   // estimated max bezier path length
  const lineOffset = LINE_LEN * (1 - lineProg);

  // Obsidian icon
  const obsSp = sp(frame, fps, 185, { stiffness: 58, damping: 14 });

  // Chart
  const chartSp = sp(frame, fps, 215, { stiffness: 48, damping: 14 });

  const lineOp = (s: number) => interpolate(s, [0, 0.22], [0, 1]);
  const lineY  = (s: number) => interpolate(s, [0, 1], [28, 0]);

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── "Every top creator." ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 268, left: SAFE_H,
        opacity: lineOp(h1Sp), transform: `translateY(${lineY(h1Sp)}px)`,
        filter: blurFade(h1Sp, 10),
      }}>
        <span style={{
          fontSize: 82, fontWeight: 900, fontFamily: FONT_HEAD,
          color: BLACK, letterSpacing: '-2px', lineHeight: 1,
        }}>
          Every top creator.
        </span>
      </div>

      {/* ── "Decoded." ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 356, left: SAFE_H,
        opacity: lineOp(h2Sp), transform: `translateY(${lineY(h2Sp)}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{
          fontSize: 82, fontWeight: 900, fontFamily: FONT_HEAD,
          letterSpacing: '-2px', lineHeight: 1,
          background: `linear-gradient(90deg, ${INDIGO} 0%, #818CF8 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
          display: 'inline-block',
        }}>
          Decoded.
        </span>
      </div>

      {/* ── Category pills: HOOK | VISUALS | TRENDS ──────────────────────── */}
      <div style={{
        position: 'absolute', top: 456, left: SAFE_H,
        display: 'flex', gap: 14,
        opacity: interpolate(pillsSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(pillsSp, [0, 1], [14, 0])}px)`,
      }}>
        {PILLS.map((label, i) => (
          <div key={i} style={{
            border: '1.5px solid #FF9040',
            borderRadius: 8, padding: '6px 18px',
            fontSize: 18, fontWeight: 800, fontFamily: FONT_HEAD,
            color: '#FF8030', letterSpacing: '2.5px',
            background: 'rgba(255,255,255,0.60)',
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* ── Creator cards ─────────────────────────────────────────────────── */}
      {CREATORS.map((c, i) => {
        const csp  = cardSps[i];
        const cOp  = interpolate(csp, [0, 0.30], [0, 1]);
        const cTY  = interpolate(csp, [0, 1], [32, 0]);
        const cSc  = 0.88 + csp * 0.12;
        const PLAY_R = 22;
        return (
          <div key={i} style={{
            position: 'absolute',
            top: CARD_TOP, left: CARD_XS[i],
            width: CARD_W, height: CARD_H,
            opacity: cOp,
            transform: `translateY(${cTY}px) scale(${cSc.toFixed(3)})`,
            transformOrigin: 'top center',
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.10)',
          }}>
            {/* Gradient background */}
            <div style={{ position: 'absolute', inset: 0, background: c.gradient }}/>
            {/* Vignette */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.12) 0%, transparent 60%)' }}/>
            {/* Play button */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: PLAY_R * 2, height: PLAY_R * 2, borderRadius: '50%',
                background: 'rgba(255,255,255,0.88)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 14px rgba(0,0,0,0.30)',
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderTop: '11px solid transparent',
                  borderBottom: '11px solid transparent',
                  borderLeft: '19px solid rgba(0,0,0,0.80)',
                  marginLeft: 4,
                }}/>
              </div>
            </div>
            {/* Handle label (below the card — rendered outside for clean layout) */}
          </div>
        );
      })}

      {/* Handle labels below each card */}
      {CREATORS.map((c, i) => {
        const csp = cardSps[i];
        return (
          <div key={i} style={{
            position: 'absolute',
            top: CARD_TOP + CARD_H + 10,
            left: CARD_XS[i],
            width: CARD_W,
            textAlign: 'center',
            opacity: interpolate(csp, [0, 0.30], [0, 1]),
            transform: `translateY(${interpolate(csp, [0, 1], [14, 0])}px)`,
          }}>
            <span style={{
              fontSize: 20, fontWeight: 600, fontFamily: FONT_HEAD,
              color: 'rgba(0,0,0,0.56)', letterSpacing: '-0.2px',
            }}>
              {c.handle}
            </span>
          </div>
        );
      })}

      {/* ── Convergence lines (full-canvas SVG) ──────────────────────────── */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        width={1080} height={1920} viewBox="0 0 1080 1920"
      >
        {CREATORS.map((c, i) => {
          const fx = LINE_FROM[i].x;
          const fy = LINE_FROM[i].y;
          const tx = OBS_CX;
          const ty = LINE_TO_Y;
          // Bezier: control points bend toward center then down
          const cp1x = fx, cp1y = fy + 120;
          const cp2x = tx, cp2y = ty - 80;
          const d = `M ${fx} ${fy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${tx} ${ty}`;
          return (
            <path key={i}
              d={d}
              stroke={c.lineColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
              strokeDasharray={LINE_LEN}
              strokeDashoffset={lineOffset}
              opacity="0.80"
            />
          );
        })}
      </svg>

      {/* ── Obsidian vault icon ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: OBS_CY - 45,
        left: OBS_CX - 45,
        opacity: interpolate(obsSp, [0, 0.30], [0, 1]),
        transform: `scale(${(0.40 + obsSp * 0.60).toFixed(3)})`,
        transformOrigin: 'center center',
        filter: blurFade(obsSp, 10),
      }}>
        <ObsidianIcon size={90}/>
      </div>

      {/* "OBSIDIAN VAULT" label */}
      <div style={{
        position: 'absolute', top: OBS_CY + 52, left: 0, right: 0,
        textAlign: 'center',
        opacity: interpolate(obsSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(obsSp, [0, 1], [10, 0])}px)`,
      }}>
        <span style={{
          fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO,
          color: 'rgba(0,0,0,0.45)', letterSpacing: '3px',
        }}>
          OBSIDIAN VAULT
        </span>
      </div>

      {/* ── Analytics line chart (atmospheric bottom element) ─────────────── */}
      <svg
        style={{
          position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
          opacity: interpolate(chartSp, [0, 0.40], [0, 1]),
        }}
        width={1080} height={1920} viewBox="0 0 1080 1920"
      >
        {/* Area fill */}
        <defs>
          <linearGradient id="sd-chart-fill" x1="0" y1={CHART_TOP} x2="0" y2={CHART_BOT} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={INDIGO} stopOpacity="0.14"/>
            <stop offset="100%" stopColor={INDIGO} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon
          points={`0,${CHART_BOT} ${polyline} 1080,${CHART_BOT}`}
          fill="url(#sd-chart-fill)"
        />
        {/* Line */}
        <polyline
          points={polyline}
          fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          opacity="0.55"
        />
        {/* Dots */}
        {CHART_X.map((x, i) => (
          <circle key={i} cx={x} cy={chartY(CHART_VAL[i])} r="5"
            fill={INDIGO} opacity="0.70"/>
        ))}
      </svg>

    </SceneCanvas>
  );
};
