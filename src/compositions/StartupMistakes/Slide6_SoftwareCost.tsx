import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 6 — Mistake #5: Treating Software As A Cost
//  Visual: Two-column split — LEFT: EXPENSE mindset (red), RIGHT: INVESTMENT mindset (green)
//          Animated arrow shows the transformation
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const RED    = '#EF4444';
const GREEN  = '#10B981';

const COST_ITEMS = [
  { label: 'Dev License', amount: '-$299/mo' },
  { label: 'Hosting',     amount: '-$180/mo' },
  { label: 'Tools',       amount: '-$450/mo' },
  { label: 'Dev Hours',   amount: '-$8,400' },
];

const GROWTH_ITEMS = [
  { label: 'Leads Automated',  value: '+340/mo' },
  { label: 'Support Tickets',  value: '-72%' },
  { label: 'Revenue Saved',    value: '+$12k/mo' },
  { label: 'Time Freed',       value: '160 hrs/mo' },
];

// Upward growth chart SVG
const GrowthChart: React.FC<{ progress: number; color: string }> = ({ progress }) => {
  const pts = [0, 0.15, 0.32, 0.52, 0.70, 0.88, 1.0];
  const w = 320, h = 80;
  const gap = w / (pts.length - 1);
  const visibleLen = Math.round(progress * (pts.length - 1));

  const pathD = pts.slice(0, visibleLen + 1).map((y, i) => {
    const px = i * gap;
    const py = h - y * h * 0.9 - 6;
    return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
  }).join(' ');

  const areaD = pathD + ` L ${visibleLen * gap} ${h} L 0 ${h} Z`;

  return (
    <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} fill="none">
      {visibleLen > 0 && (
        <>
          <path d={areaD} fill={`${GREEN}18`}/>
          <path d={pathD} stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          {/* End dot */}
          <circle
            cx={visibleLen * gap}
            cy={h - pts[visibleLen] * h * 0.9 - 6}
            r="5" fill={GREEN}
          />
        </>
      )}
    </svg>
  );
};

export const Slide6_SoftwareCost: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const badgeSp  = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  const h1Sp     = sp(frame, fps, 12, { stiffness: 68, damping: 14 });
  const h2Sp     = sp(frame, fps, 24, { stiffness: 68, damping: 14 });
  const subSp    = sp(frame, fps, 38, { stiffness: 65, damping: 14 });
  const leftSp   = sp(frame, fps, 56, { stiffness: 52, damping: 14 });
  const arrowSp  = sp(frame, fps,100, { stiffness: 48, damping: 14 });
  const rightSp  = sp(frame, fps,116, { stiffness: 52, damping: 14 });

  const chartProgress = interpolate(frame, [120, 250], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── MISTAKE #5 badge ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(badgeSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(badgeSp, [0, 1], [14, 0])}px)`,
        display: 'inline-flex', alignItems: 'center',
        background: 'rgba(255,107,43,0.12)', border: '1.5px solid rgba(255,107,43,0.32)',
        borderRadius: 20, padding: '7px 18px',
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: ORANGE, letterSpacing: '1.5px' }}>
          MISTAKE #5
        </span>
      </div>

      {/* ── "Treating Software" ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 258, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 84, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
          Treating Software
        </span>
      </div>

      {/* ── "As A Cost" ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 348, left: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{
          fontSize: 84, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-2.5px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          As A Cost
        </span>
      </div>

      {/* ── Subtext ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 460, left: SAFE_H,
        opacity: interpolate(subSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 40, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)' }}>
          Software should{' '}
          <span style={{ fontWeight: 900, color: GREEN }}>generate growth.</span>
        </span>
      </div>

      {/* ── Left: EXPENSE column ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 560, left: SAFE_H, width: 310,
        opacity: interpolate(leftSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(leftSp, [0, 1], [28, 0])}px)`,
        filter: blurFade(leftSp, 8),
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.88)', borderRadius: 18,
          border: '2px solid rgba(239,68,68,0.24)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(239,68,68,0.08)',
        }}>
          <div style={{
            background: 'rgba(239,68,68,0.10)', padding: '12px 16px',
            borderBottom: '1px solid rgba(239,68,68,0.12)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>💸</span>
            <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: RED, letterSpacing: '1px' }}>
              COST MINDSET
            </span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            {COST_ITEMS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: i < COST_ITEMS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}>
                <span style={{ fontSize: 16, fontFamily: FONT_HEAD, color: 'rgba(0,0,0,0.60)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: FONT_MONO, color: RED }}>{item.amount}</span>
              </div>
            ))}
            <div style={{
              marginTop: 10, paddingTop: 10,
              borderTop: '2px solid rgba(239,68,68,0.18)',
              textAlign: 'right', fontSize: 22, fontWeight: 900,
              fontFamily: FONT_HEAD, color: RED,
            }}>
              TOTAL EXPENSE
            </div>
          </div>
        </div>
      </div>

      {/* ── Transform arrow ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 730, left: SAFE_H + 322, width: 56,
        opacity: interpolate(arrowSp, [0, 0.30], [0, 1]),
        transform: `scale(${interpolate(arrowSp, [0, 1], [0.5, 1])})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="56" height="40" viewBox="0 0 56 40" fill="none">
          <defs>
            <linearGradient id="sm6-arr" x1="0" y1="20" x2="56" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={RED}/>
              <stop offset="100%" stopColor={GREEN}/>
            </linearGradient>
          </defs>
          <path d="M4 20 H44 M34 8 L50 20 L34 32"
            stroke="url(#sm6-arr)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Right: INVESTMENT column ──────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 560, right: SAFE_H, width: 310,
        opacity: interpolate(rightSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(rightSp, [0, 1], [28, 0])}px)`,
        filter: blurFade(rightSp, 8),
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.88)', borderRadius: 18,
          border: '2px solid rgba(16,185,129,0.24)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(16,185,129,0.08)',
        }}>
          <div style={{
            background: 'rgba(16,185,129,0.10)', padding: '12px 16px',
            borderBottom: '1px solid rgba(16,185,129,0.12)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>🚀</span>
            <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: GREEN, letterSpacing: '1px' }}>
              GROWTH MINDSET
            </span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            {GROWTH_ITEMS.map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: i < GROWTH_ITEMS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}>
                <span style={{ fontSize: 15, fontFamily: FONT_HEAD, color: 'rgba(0,0,0,0.60)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: FONT_MONO, color: GREEN }}>{item.value}</span>
              </div>
            ))}
            {/* Growth chart */}
            <div style={{ marginTop: 10 }}>
              <GrowthChart progress={chartProgress} color={GREEN}/>
            </div>
          </div>
        </div>
      </div>

    </SceneCanvas>
  );
};
