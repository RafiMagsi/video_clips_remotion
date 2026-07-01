import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 5 — Mistake #4: No Analytics, No Visibility
//  Visual: 3 metric dashboard cards with charts emptying and values → "???"
//          Question marks appear across the screen as data fades
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const RED    = '#EF4444';

const METRICS = [
  { label: 'Monthly Revenue', value: '$24,800', fade: '$???', bars: [0.85, 0.62, 0.78, 0.45, 0.90, 0.55], color: '#10B981' },
  { label: 'MRR Growth',      value: '+18.4%',  fade: '???%', bars: [0.40, 0.55, 0.68, 0.72, 0.80, 0.75], color: '#6366F1' },
  { label: 'Churn Rate',      value: '2.3%',    fade: '?%',  bars: [0.28, 0.22, 0.30, 0.18, 0.25, 0.20], color: ORANGE   },
];

const MetricCard: React.FC<{
  metric: typeof METRICS[0];
  fadeProgress: number;
  entryOp: number;
  entryY: number;
}> = ({ metric, fadeProgress, entryOp, entryY }) => {
  const valueOp  = 1 - Math.min(1, fadeProgress * 3);
  const questionOp = Math.min(1, (fadeProgress - 0.2) * 3);

  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.88)',
      borderRadius: 18, padding: '16px 14px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: `1.5px solid ${fadeProgress > 0.3 ? 'rgba(239,68,68,0.20)' : 'rgba(0,0,0,0.05)'}`,
      opacity: entryOp,
      transform: `translateY(${entryY}px)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Label */}
      <div style={{ fontSize: 12, fontFamily: FONT_MONO, color: 'rgba(0,0,0,0.40)', letterSpacing: '0.8px', marginBottom: 8 }}>
        {metric.label.toUpperCase()}
      </div>

      {/* Value */}
      <div style={{ position: 'relative', height: 60, marginBottom: 10 }}>
        <div style={{
          position: 'absolute', inset: 0,
          fontSize: 40, fontWeight: 900, fontFamily: FONT_HEAD,
          color: metric.color, lineHeight: 1,
          opacity: valueOp,
        }}>
          {metric.value}
        </div>
        <div style={{
          position: 'absolute', inset: 0,
          fontSize: 40, fontWeight: 900, fontFamily: FONT_HEAD,
          color: RED, lineHeight: 1,
          opacity: questionOp,
        }}>
          {metric.fade}
        </div>
      </div>

      {/* Mini bar chart */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 48 }}>
        {metric.bars.map((h, i) => {
          const barH = h * 48 * (1 - fadeProgress * 0.85);
          return (
            <div key={i} style={{
              flex: 1, borderRadius: '4px 4px 0 0',
              height: Math.max(2, barH),
              background: fadeProgress > 0.3
                ? `rgba(239,68,68,${0.20 + (1 - h) * 0.3})`
                : metric.color,
              transition: 'background 0.3s',
              opacity: 1 - fadeProgress * 0.5,
            }}/>
          );
        })}
      </div>

      {/* Question mark overlay */}
      {questionOp > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD,
          color: RED, opacity: questionOp * 0.12,
          pointerEvents: 'none',
        }}>?</div>
      )}
    </div>
  );
};

export const Slide5_Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const badgeSp  = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  const h1Sp     = sp(frame, fps, 12, { stiffness: 68, damping: 14 });
  const h2Sp     = sp(frame, fps, 24, { stiffness: 68, damping: 14 });
  const subSp    = sp(frame, fps, 38, { stiffness: 65, damping: 14 });
  const cardsSp  = sp(frame, fps, 56, { stiffness: 50, damping: 14 });

  // Cards fade out (data disappearing)
  const fadeProgress = interpolate(frame, [80, 210], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // "You're flying blind" label
  const blindSp = sp(frame, fps, 190, { stiffness: 50, damping: 15 });

  const entryOp = interpolate(cardsSp, [0, 0.28], [0, 1]);
  const entryY  = interpolate(cardsSp, [0, 1], [32, 0]);

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── MISTAKE #4 badge ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(badgeSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(badgeSp, [0, 1], [14, 0])}px)`,
        display: 'inline-flex', alignItems: 'center',
        background: 'rgba(255,107,43,0.12)', border: '1.5px solid rgba(255,107,43,0.32)',
        borderRadius: 20, padding: '7px 18px',
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: ORANGE, letterSpacing: '1.5px' }}>
          MISTAKE #4
        </span>
      </div>

      {/* ── "No Analytics" ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 258, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 92, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-3px', lineHeight: 1 }}>
          No Analytics
        </span>
      </div>

      {/* ── "No Visibility" ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 354, left: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{
          fontSize: 92, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-3px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          No Visibility
        </span>
      </div>

      {/* ── Subtext ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 472, left: SAFE_H,
        opacity: interpolate(subSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 40, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)' }}>
          You can't improve what you{' '}
          <span style={{ fontWeight: 900, color: RED }}>don't measure.</span>
        </span>
      </div>

      {/* ── Dashboard header ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 568, left: SAFE_H, right: SAFE_H,
        background: '#0F0C1A', borderRadius: '14px 14px 0 0',
        display: 'flex', alignItems: 'center', padding: '0 16px', height: 40,
        opacity: entryOp,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56', marginRight: 6 }}/>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', marginRight: 6 }}/>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }}/>
        <span style={{ fontSize: 13, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.35)', marginLeft: 12 }}>
          analytics-dashboard — {fadeProgress > 0.5 ? 'NO DATA' : 'live'}
        </span>
        <div style={{
          marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
          background: fadeProgress > 0.5 ? RED : '#27C93F',
        }}/>
      </div>

      {/* ── Metric cards ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 608, left: SAFE_H, right: SAFE_H,
        display: 'flex', gap: 12,
      }}>
        {METRICS.map((m, i) => (
          <MetricCard
            key={i}
            metric={m}
            fadeProgress={Math.min(1, Math.max(0, (fadeProgress - i * 0.08) * 1.2))}
            entryOp={entryOp}
            entryY={entryY}
          />
        ))}
      </div>

      {/* ── "You're flying blind" ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 862, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(blindSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(blindSp, [0, 1], [20, 0])}px)`,
        background: 'rgba(239,68,68,0.08)', borderRadius: 16,
        border: '1.5px solid rgba(239,68,68,0.26)', padding: '18px 22px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, fontFamily: FONT_HEAD, color: RED, marginBottom: 8 }}>
          You're flying blind.
        </div>
        <div style={{ fontSize: 26, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.55)', lineHeight: 1.5 }}>
          Without data, every decision is a guess.
        </div>
      </div>

    </SceneCanvas>
  );
};
