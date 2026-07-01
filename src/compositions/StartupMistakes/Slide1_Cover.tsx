import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 1 — Cover
//  "5 Software Mistakes Startups Make"
//  Visual: Flashing warning triangles + dashboard wireframe animating in
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';

// Pulsing warning triangle
const WarnTriangle: React.FC<{ x: number; pulse: number; delay: number; frame: number }> = ({ x, pulse, delay, frame }) => {
  const op = interpolate(Math.sin((frame - delay) * 0.12), [-1, 1], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <g transform={`translate(${x}, 0)`} opacity={op * pulse}>
      <path d="M40 4 L76 68 L4 68 Z" fill="none" stroke={ORANGE} strokeWidth="3.5" strokeLinejoin="round"/>
      <text x="40" y="57" textAnchor="middle" fontSize="26" fontWeight="900" fill={ORANGE} fontFamily="sans-serif">!</text>
    </g>
  );
};

// Startup dashboard wireframe
const DashWireframe: React.FC<{ progress: number }> = ({ progress }) => {
  const op = Math.min(1, progress * 3);
  const lineW = Math.min(1, Math.max(0, (progress - 0.2) * 3));
  return (
    <svg width="756" height="190" viewBox="0 0 756 190" fill="none" style={{ display: 'block' }}>
      {/* Nav bar */}
      <rect x="0" y="0" width={756 * lineW} height="30" rx="6"
        fill={`rgba(255,107,43,${0.08 * op})`} stroke={`rgba(255,107,43,${0.30 * op})`} strokeWidth="1"/>
      {/* Three chart panels */}
      {[0, 1, 2].map(i => {
        const bx = 8 + i * 252;
        const panelP = Math.min(1, Math.max(0, (progress - 0.1 - i * 0.08) * 4));
        return (
          <g key={i} opacity={panelP}>
            <rect x={bx} y="44" width="236" height="138" rx="10"
              fill={`rgba(255,255,255,${0.06 * op})`}
              stroke={`rgba(255,107,43,${0.22 * op})`} strokeWidth="1.2"/>
            {/* Mini bar chart inside panel */}
            {[0, 1, 2, 3, 4].map(j => {
              const bh = 18 + (j % 3) * 22;
              return <rect key={j} x={bx + 12 + j * 44} y={44 + 138 - 16 - bh} width="30" height={bh} rx="4"
                fill={`rgba(255,107,43,${(0.18 + j * 0.06) * op})`}/>;
            })}
          </g>
        );
      })}
      {/* Connecting lines */}
      {lineW > 0.3 && (
        <>
          <line x1="126" y1="44" x2="126" y2="182" stroke={`rgba(255,107,43,${0.14 * op})`} strokeWidth="1" strokeDasharray="4 4"/>
          <line x1="378" y1="44" x2="378" y2="182" stroke={`rgba(255,107,43,${0.14 * op})`} strokeWidth="1" strokeDasharray="4 4"/>
          <line x1="630" y1="44" x2="630" y2="182" stroke={`rgba(255,107,43,${0.14 * op})`} strokeWidth="1" strokeDasharray="4 4"/>
        </>
      )}
    </svg>
  );
};

export const Slide1_Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  // Subtle push-in scale (simulate camera push)
  const pushScale = interpolate(frame, [0, 299], [1.0, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const warnSp  = sp(frame, fps,  6, { stiffness: 60, damping: 14 });
  const numSp   = sp(frame, fps, 18, { stiffness: 55, damping: 13 });
  const line1Sp = sp(frame, fps, 34, { stiffness: 68, damping: 14 });
  const line2Sp = sp(frame, fps, 46, { stiffness: 68, damping: 14 });
  const divSp   = sp(frame, fps, 60, { stiffness: 70, damping: 16 });
  const subSp   = sp(frame, fps, 68, { stiffness: 62, damping: 14 });
  const dashSp  = sp(frame, fps, 88, { stiffness: 50, damping: 14 });
  const footSp  = sp(frame, fps,118, { stiffness: 55, damping: 15 });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${pushScale})`,
        transformOrigin: 'center center',
      }}>

        {/* ── Warning triangles ────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 192, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          opacity: interpolate(warnSp, [0, 0.30], [0, 1]),
          transform: `translateY(${interpolate(warnSp, [0, 1], [22, 0])}px)`,
          filter: blurFade(warnSp, 8),
        }}>
          <svg width="276" height="76" viewBox="0 0 276 76">
            <WarnTriangle x={0}   pulse={warnSp} delay={0}  frame={frame}/>
            <WarnTriangle x={100} pulse={warnSp} delay={8}  frame={frame}/>
            <WarnTriangle x={200} pulse={warnSp} delay={16} frame={frame}/>
          </svg>
        </div>

        {/* ── "5" ──────────────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 282, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(numSp, [0, 0.25], [0, 1]),
          transform: `translateY(${interpolate(numSp, [0, 1], [60, 0])}px) scale(${interpolate(numSp, [0, 1], [0.7, 1])})`,
          filter: blurFade(numSp, 16),
        }}>
          <span style={{
            fontSize: 210, fontWeight: 900, fontFamily: FONT_HEAD, lineHeight: 1, letterSpacing: '-8px',
            background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB060 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', color: 'transparent',
          }}>5</span>
        </div>

        {/* ── "Software Mistakes" ──────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 542, left: SAFE_H,
          opacity: interpolate(line1Sp, [0, 0.25], [0, 1]),
          transform: `translateY(${interpolate(line1Sp, [0, 1], [30, 0])}px)`,
          filter: blurFade(line1Sp, 12),
        }}>
          <span style={{ fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
            Software Mistakes
          </span>
        </div>

        {/* ── "Startups Make" ──────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 632, left: SAFE_H,
          opacity: interpolate(line2Sp, [0, 0.25], [0, 1]),
          transform: `translateY(${interpolate(line2Sp, [0, 1], [24, 0])}px)`,
          filter: blurFade(line2Sp, 10),
        }}>
          <span style={{ fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
            Startups Make
          </span>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 754, left: SAFE_H, right: SAFE_H,
          height: 2, borderRadius: 1,
          background: `linear-gradient(90deg, ${ORANGE}, rgba(255,107,43,0.10))`,
          opacity: interpolate(divSp, [0, 0.5], [0, 1]),
          transform: `scaleX(${interpolate(divSp, [0, 1], [0, 1])})`,
          transformOrigin: 'left center',
        }}/>

        {/* ── Subtext ──────────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 782, left: SAFE_H, right: SAFE_H,
          opacity: interpolate(subSp, [0, 0.28], [0, 1]),
          transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
          filter: blurFade(subSp, 8),
        }}>
          <span style={{ fontSize: 40, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.52)', lineHeight: 1.55, display: 'block' }}>
            Most startups don't fail because of bad ideas.
          </span>
          <span style={{
            fontSize: 40, fontWeight: 700, fontFamily: FONT_HEAD, lineHeight: 1.55, display: 'block', marginTop: 4,
            background: `linear-gradient(135deg, ${ORANGE} 0%, #FF9040 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', color: 'transparent',
          }}>
            They fail because of bad software decisions.
          </span>
        </div>

        {/* ── Dashboard wireframe ──────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 1020, left: SAFE_H, right: SAFE_H,
          opacity: interpolate(dashSp, [0, 0.30], [0, 1]),
          transform: `translateY(${interpolate(dashSp, [0, 1], [30, 0])}px)`,
          filter: blurFade(dashSp, 8),
        }}>
          <DashWireframe progress={dashSp} />
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 1560, left: 0, right: 0, textAlign: 'center',
          opacity: interpolate(footSp, [0, 0.35], [0, 1]),
          transform: `translateY(${interpolate(footSp, [0, 1], [14, 0])}px)`,
        }}>
          <span style={{ fontSize: 28, fontWeight: 600, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.40)', letterSpacing: '0.2px' }}>
            Swipe to learn what to avoid ➡️
          </span>
        </div>

      </div>
    </SceneCanvas>
  );
};
