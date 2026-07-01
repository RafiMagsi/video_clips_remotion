import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 4 — Mistake #3: Choosing Speed Over Architecture
//  Visual: Software tower (stacked layers) built on a cracking foundation
//          Cracks spread from base with SVG strokeDasharray animation
//          Warning indicators appear as instability grows
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const RED    = '#EF4444';

// Tower floor definitions (bottom to top)
const FLOORS = [
  { label: 'Users & Auth',    color: '#6366F1', w: 660 },
  { label: 'Core Business Logic', color: '#8B5CF6', w: 580 },
  { label: 'API Layer',       color: '#A78BFA', w: 500 },
  { label: 'Frontend (V3)',   color: '#C4B5FD', w: 420 },
  { label: 'AI Features',     color: '#DDD6FE', w: 340 },
];

// Crack paths (in foundation coordinate space, x=0 center)
const CRACKS = [
  { d: 'M 96 6 L 120 28 L 100 52 L 140 80',  len: 100 },
  { d: 'M 360 4 L 330 30 L 380 64 L 350 90', len: 108 },
  { d: 'M 600 8 L 580 35 L 630 68',           len: 85  },
];

const FoundationCracks: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width="756" height="96" viewBox="0 0 756 96" fill="none" style={{ display: 'block', marginTop: -4 }}>
    {/* Foundation block */}
    <rect x="0" y="0" width="756" height="96" rx="10"
      fill={`rgba(100,100,120,${0.12 + progress * 0.06})`}
      stroke={`rgba(${RED === '#EF4444' ? '239,68,68' : '100,100,120'},${0.15 + progress * 0.25})`}
      strokeWidth="1.5"
    />
    <text x="378" y="28" textAnchor="middle" fontSize="13" fontWeight="700"
      fill={`rgba(0,0,0,${0.35 + progress * 0.20})`} fontFamily="sans-serif">
      FOUNDATION
    </text>
    {/* Simulated brick pattern */}
    {[0,1,2].map(row =>
      [0,1,2,3,4,5].map(col => (
        <rect key={`${row}-${col}`}
          x={col * 126 + (row % 2) * 63 + 2} y={36 + row * 18}
          width="120" height="14" rx="2"
          fill="none"
          stroke={`rgba(0,0,0,${0.06 + progress * 0.04})`}
          strokeWidth="0.8"
        />
      ))
    )}
    {/* Animated cracks */}
    {CRACKS.map((crack, i) => {
      const crackDelay = i * 0.15;
      const crackP = Math.min(1, Math.max(0, (progress - crackDelay) / 0.6));
      return (
        <path key={i}
          d={crack.d}
          stroke={RED} strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray={`${crackP * crack.len} ${crack.len}`}
          opacity={crackP}
        />
      );
    })}
    {/* Warning indicators */}
    {progress > 0.4 && [126, 378, 630].map((cx, i) => {
      const wOp = Math.min(1, Math.max(0, (progress - 0.4 - i * 0.1) * 3));
      const pulse = 0.5 + Math.sin(((interpolate(progress, [0.4, 1.0], [0, 8])) + i * 2)) * 0.5;
      return (
        <g key={i} opacity={wOp * (0.6 + pulse * 0.4)}>
          <path d={`M${cx} 62 L${cx+14} 88 L${cx-14} 88 Z`}
            fill="none" stroke={RED} strokeWidth="2" strokeLinejoin="round"/>
          <text x={cx.toString()} y="83" textAnchor="middle" fontSize="11"
            fontWeight="900" fill={RED} fontFamily="sans-serif">!</text>
        </g>
      );
    })}
  </svg>
);

export const Slide4_Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const badgeSp = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  const h1Sp    = sp(frame, fps, 12, { stiffness: 68, damping: 14 });
  const h2Sp    = sp(frame, fps, 24, { stiffness: 68, damping: 14 });
  const subSp   = sp(frame, fps, 38, { stiffness: 65, damping: 14 });

  // Tower floors staggered from bottom
  const floorSps = FLOORS.map((_, i) =>
    sp(frame, fps, 52 + (FLOORS.length - 1 - i) * 14, { stiffness: 55, damping: 14 }),
  );

  // Foundation / crack progress
  const crackProgress = interpolate(frame, [88, 220], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const debtSp = sp(frame, fps, 200, { stiffness: 50, damping: 15 });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── MISTAKE #3 badge ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(badgeSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(badgeSp, [0, 1], [14, 0])}px)`,
        display: 'inline-flex', alignItems: 'center',
        background: 'rgba(255,107,43,0.12)', border: '1.5px solid rgba(255,107,43,0.32)',
        borderRadius: 20, padding: '7px 18px',
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: ORANGE, letterSpacing: '1.5px' }}>
          MISTAKE #3
        </span>
      </div>

      {/* ── "Choosing Speed" ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 258, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 88, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-3px', lineHeight: 1 }}>
          Choosing Speed
        </span>
      </div>

      {/* ── "Over Architecture" ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 352, left: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{
          fontSize: 88, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-3px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Over Architecture
        </span>
      </div>

      {/* ── Subtext ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 468, left: SAFE_H,
        opacity: interpolate(subSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 40, fontWeight: 600, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)' }}>
          Technical debt{' '}
          <span style={{ fontWeight: 900, color: RED }}>compounds fast.</span>
        </span>
      </div>

      {/* ── Software Tower ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 550, left: SAFE_H, right: SAFE_H,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        {FLOORS.map((floor, i) => {
          const s = floorSps[i];
          return (
            <div key={i} style={{
              width: floor.w, height: 52,
              background: floor.color,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: interpolate(s, [0, 0.28], [0, 1]),
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px) scaleX(${interpolate(s, [0, 1], [0.7, 1])})`,
              boxShadow: `0 4px 12px ${floor.color}50`,
            }}>
              <span style={{ fontSize: 15, fontWeight: 800, fontFamily: FONT_HEAD, color: 'rgba(255,255,255,0.90)', letterSpacing: '0.3px' }}>
                {floor.label}
              </span>
            </div>
          );
        })}

        {/* Foundation with animated cracks */}
        <div style={{ width: '100%', marginTop: 6 }}>
          <FoundationCracks progress={crackProgress} />
        </div>
      </div>

      {/* ── Technical Debt warning ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1108, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(debtSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(debtSp, [0, 1], [20, 0])}px)`,
        background: 'rgba(239,68,68,0.08)', borderRadius: 16,
        border: '1.5px solid rgba(239,68,68,0.28)', padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: RED }}>⚠</div>
        <span style={{ fontSize: 28, fontWeight: 700, fontFamily: FONT_HEAD, color: RED, lineHeight: 1.4 }}>
          Every shortcut today = 3× the work next quarter
        </span>
      </div>

    </SceneCanvas>
  );
};
