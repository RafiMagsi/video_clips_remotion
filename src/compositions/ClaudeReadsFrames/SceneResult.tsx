import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  SceneResult — "04 / RESULT"
//
//  "30 min" (strikethrough, coral) → arrow → "2 min" (teal)
//  "Broken down. Rewritten. Done."
//  Dark terminal window with Claude's analysis output
//
//  Layout (1080 × 1920, SAFE_H=162):
//    y=192   Badge pill  "04 / RESULT"
//    y=278   30 min → arrow → 2 min  (148px numbers, flex row)
//    y=490   "Broken down. Rewritten. Done."
//    y=576   Terminal window
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const CORAL  = '#FF6060';   // "30 min" crossed-out
const TEAL   = '#10B981';   // "2 min"

const BULLETS: { bold: string; rest: string }[] = [
  { bold: 'Hook analysis',      rest: ' — why the first 3 seconds made viewers stay and share' },
  { bold: 'Thumbnail formula',  rest: ': color, contrast, expression — fully decoded' },
  { bold: 'Pacing & edit cuts', rest: ': re-engagement loops and viral momentum mapped out' },
  { bold: 'Comment sentiment',  rest: ' across 10k+ reactions, clustered by timestamp' },
  { bold: 'Replication guide',  rest: ': 7 exact tactics you can copy for your next video' },
];

// ─────────────────────────────────────────────────────────────────────────────

export const SceneResult: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  // ── Springs ────────────────────────────────────────────────────────────────
  const badgeSp = sp(frame, fps,  4, { stiffness: 70, damping: 16 });

  // "30 min" — left side
  const oldSp   = sp(frame, fps, 12, { stiffness: 70, damping: 14 });

  // Arrow: frame-based draw (not spring, feels more mechanical)
  const arrowP  = interpolate(frame, [30, 58], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // "2 min" — right side
  const newSp   = sp(frame, fps, 52, { stiffness: 65, damping: 13 });

  // Headline
  const headSp  = sp(frame, fps, 74, { stiffness: 70, damping: 15 });

  // Terminal window
  const termSp  = sp(frame, fps, 92, { stiffness: 52, damping: 16 });

  // Bullet lines staggered
  const bulletSps = BULLETS.map((_, i) =>
    sp(frame, fps, 110 + i * 14, { stiffness: 60, damping: 14 })
  );
  const summSp  = sp(frame, fps, 184, { stiffness: 55, damping: 14 });

  const ARR_L = 160;  // px — arrow SVG width

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>


      {/* ── 30 min ─── arrow ─── 2 min ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 278, left: SAFE_H, right: SAFE_H,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* "30 min" with overlay strikethrough */}
        <div style={{
          display: 'inline-flex', alignItems: 'flex-end', gap: 10,
          opacity: interpolate(oldSp, [0, 0.25], [0, 1]),
          transform: `scale(${(0.55 + oldSp * 0.45).toFixed(3)})`,
          transformOrigin: 'left bottom',
          filter: blurFade(oldSp, 14),
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{
              fontSize: 148, fontWeight: 900, fontFamily: FONT_HEAD,
              color: CORAL, letterSpacing: '-5px', lineHeight: 1, display: 'block',
            }}>
              30
            </span>
            {/* Bold strikethrough overlay */}
            <div style={{
              position: 'absolute', top: '47%', left: -4, right: -4,
              height: 10, background: CORAL, borderRadius: 3,
              transform: 'translateY(-50%)',
            }}/>
          </div>
          <span style={{
            fontSize: 52, fontWeight: 600, fontFamily: FONT_HEAD,
            color: 'rgba(0,0,0,0.36)', lineHeight: 1, marginBottom: 18,
          }}>
            min
          </span>
        </div>

        {/* Arrow (animated draw) */}
        <div style={{ flexShrink: 0, opacity: arrowP }}>
          <svg width={ARR_L} height={44} viewBox={`0 0 ${ARR_L} 44`} fill="none">
            <defs>
              <linearGradient id="sr-arr-g" x1="0" y1="22" x2={ARR_L} y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={CORAL}/>
                <stop offset="100%" stopColor={TEAL}/>
              </linearGradient>
            </defs>
            <line
              x1="4" y1="22" x2={ARR_L - 20} y2="22"
              stroke="url(#sr-arr-g)" strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={`${arrowP * (ARR_L - 24)} ${ARR_L}`}
            />
            <path
              d={`M${ARR_L - 24} 12 L${ARR_L - 4} 22 L${ARR_L - 24} 32`}
              stroke={TEAL} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              opacity={arrowP > 0.65 ? (arrowP - 0.65) / 0.35 : 0}
            />
          </svg>
        </div>

        {/* "2 min" */}
        <div style={{
          display: 'inline-flex', alignItems: 'flex-end', gap: 10,
          opacity: interpolate(newSp, [0, 0.25], [0, 1]),
          transform: `scale(${(0.55 + newSp * 0.45).toFixed(3)})`,
          transformOrigin: 'right bottom',
          filter: blurFade(newSp, 14),
        }}>
          <span style={{
            fontSize: 148, fontWeight: 900, fontFamily: FONT_HEAD,
            color: TEAL, letterSpacing: '-5px', lineHeight: 1,
          }}>
            2
          </span>
          <span style={{
            fontSize: 52, fontWeight: 600, fontFamily: FONT_HEAD,
            color: 'rgba(0,0,0,0.36)', lineHeight: 1, marginBottom: 18,
          }}>
            min
          </span>
        </div>
      </div>

      {/* ── "Broken down. Rewritten. Done." ──────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 490, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(headSp, [0, 0.22], [0, 1]),
        transform: `translateY(${interpolate(headSp, [0, 1], [24, 0])}px)`,
        filter: blurFade(headSp, 10),
        lineHeight: 1,
      }}>
        <span style={{
          fontSize: 54, fontWeight: 800, fontFamily: FONT_HEAD,
          color: BLACK, letterSpacing: '-1px',
        }}>
          Broken down. Rewritten.{' '}
        </span>
        <span style={{
          fontSize: 54, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-1px',
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFA040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Done.
        </span>
      </div>

      {/* ── Terminal window ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 578, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(termSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(termSp, [0, 1], [38, 0])}px)`,
        filter: blurFade(termSp, 8),
        background: '#0F0C1A',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.30), 0 0 0 1px rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,130,60,0.16)',
      }}>
        {/* Title bar */}
        <div style={{
          height: 44, background: '#18142A',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F56' }}/>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }}/>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27C93F' }}/>
          <span style={{
            flex: 1, textAlign: 'center', marginLeft: -52,
            fontSize: 14, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.38)',
          }}>
            claude-watch-result.mov
          </span>
        </div>

        {/* Bullet list */}
        <div style={{ padding: '18px 22px 22px' }}>
          {BULLETS.map((b, i) => (
            <div key={i} style={{
              fontSize: 18, fontFamily: FONT_MONO,
              color: 'rgba(255,255,255,0.70)', lineHeight: 1.62, marginBottom: 7,
              opacity: interpolate(bulletSps[i], [0, 0.28], [0, 1]),
              transform: `translateX(${interpolate(bulletSps[i], [0, 1], [16, 0])}px)`,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.26)', marginRight: 10 }}>{i + 1}.</span>
              <span style={{ fontWeight: 700, color: '#F2ECE4' }}>{b.bold}</span>
              {b.rest}
            </div>
          ))}

          {/* Speed win summary */}
          <div style={{
            marginTop: 18, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            fontSize: 17, fontFamily: FONT_MONO, color: '#FF9060', lineHeight: 1.55,
            opacity: interpolate(summSp, [0, 0.30], [0, 1]),
            transform: `translateX(${interpolate(summSp, [0, 1], [12, 0])}px)`,
          }}>
            <span style={{ fontWeight: 700 }}>↑ Speed win:</span>
            {' '}~10× faster than watching manually. Every insight is timestamped.
          </div>
        </div>
      </div>

    </SceneCanvas>
  );
};
