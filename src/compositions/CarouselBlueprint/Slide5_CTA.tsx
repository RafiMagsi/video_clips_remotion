import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 5 — The Conclusion (Call to Action)
//
//  "Coding is a Craft, Not a Prompt."
//  3 bullet points
//  CTA card: "What is your #1 rule? Drop a comment below! 👇"
//  Hashtag: #MakeCodingGreatAgain
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';

const BULLETS = [
  { bold: 'Great software', rest: ' is built on critical thinking, edge-case handling, and human intuition.' },
  { bold: 'Use AI as a', rest: ' high-speed calculator — not as your lead architect.' },
  { bold: "Let's bring back", rest: ' engineering mastery.' },
];

export const Slide5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const h1Sp    = sp(frame, fps, 10, { stiffness: 68, damping: 14 });
  const h2Sp    = sp(frame, fps, 20, { stiffness: 68, damping: 14 });
  const h3Sp    = sp(frame, fps, 32, { stiffness: 68, damping: 14 });
  const divSp   = sp(frame, fps, 48, { stiffness: 70, damping: 16 });
  const bsp     = BULLETS.map((_, i) =>
    sp(frame, fps, 60 + i * 18, { stiffness: 60, damping: 14 }),
  );
  const ctaSp   = sp(frame, fps,130, { stiffness: 50, damping: 14 });
  const hashSp  = sp(frame, fps,160, { stiffness: 55, damping: 15 });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>


      {/* ── "Coding is a" ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 262, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [30, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
          Coding is a
        </span>
      </div>

      {/* ── "Craft," (extra big) ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 348, left: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [26, 0])}px)`,
        filter: blurFade(h2Sp, 12),
      }}>
        <span style={{ fontSize: 108, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-4px', lineHeight: 1 }}>
          Craft,
        </span>
      </div>

      {/* ── "Not a Prompt." ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 460, left: SAFE_H,
        opacity: interpolate(h3Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h3Sp, [0, 1], [22, 0])}px)`,
        filter: blurFade(h3Sp, 10),
      }}>
        <span style={{
          fontSize: 72, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-2px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFA040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Not a Prompt.
        </span>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 574, left: SAFE_H, right: SAFE_H,
        height: 2, borderRadius: 1,
        background: 'rgba(0,0,0,0.08)',
        opacity: interpolate(divSp, [0, 0.5], [0, 1]),
        transform: `scaleX(${interpolate(divSp, [0, 1], [0, 1])})`,
        transformOrigin: 'left center',
      }}/>

      {/* ── Bullet points ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 596, left: SAFE_H, right: SAFE_H,
        background: 'rgba(255,255,255,0.86)',
        borderRadius: 24, padding: '22px 26px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1.5px rgba(0,0,0,0.05)',
      }}>
        {BULLETS.map((b, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14,
            marginBottom: i < BULLETS.length - 1 ? 18 : 0,
            opacity: interpolate(bsp[i], [0, 0.28], [0, 1]),
            transform: `translateX(${interpolate(bsp[i], [0, 1], [20, 0])}px)`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: ORANGE,
              flexShrink: 0, marginTop: 14,
            }}/>
            <span style={{ fontSize: 30, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.80)', lineHeight: 1.55 }}>
              <strong style={{ fontWeight: 800, color: BLACK }}>{b.bold}</strong>
              {b.rest}
            </span>
          </div>
        ))}
      </div>

      {/* ── CTA Card ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1020, left: SAFE_H, right: SAFE_H,
        background: '#0F0C1A',
        borderRadius: 24, padding: '32px 30px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.06)',
        border: '1.5px solid rgba(255,107,43,0.20)',
        opacity: interpolate(ctaSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(ctaSp, [0, 1], [36, 0])}px)`,
        filter: blurFade(ctaSp, 8),
      }}>
        {/* Decorative top bar */}
        <div style={{
          height: 4, borderRadius: 2,
          background: `linear-gradient(90deg, ${ORANGE} 0%, #FFA040 60%, transparent 100%)`,
          marginBottom: 22,
        }}/>

        <div style={{
          fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO,
          color: ORANGE, letterSpacing: '2px', marginBottom: 14,
        }}>
          YOUR TURN →
        </div>

        <div style={{
          fontSize: 34, fontWeight: 800, fontFamily: FONT_HEAD,
          color: '#F2ECE4', lineHeight: 1.42, marginBottom: 16,
        }}>
          What is your #1 rule for using AI in your workflow?
        </div>

        <div style={{
          fontSize: 28, fontWeight: 600, fontFamily: FONT_HEAD,
          color: 'rgba(242,236,228,0.60)', lineHeight: 1.4,
        }}>
          Drop a comment below! 👇
        </div>
      </div>

      {/* ── Hashtag ────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1430, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(hashSp, [0, 0.35], [0, 1]),
        transform: `translateY(${interpolate(hashSp, [0, 1], [14, 0])}px)`,
      }}>
        <span style={{
          fontSize: 26, fontWeight: 700, fontFamily: FONT_MONO,
          color: 'rgba(10,10,10,0.38)', letterSpacing: '0.5px',
        }}>
          #MakeCodingGreatAgain
        </span>
      </div>

    </SceneCanvas>
  );
};
