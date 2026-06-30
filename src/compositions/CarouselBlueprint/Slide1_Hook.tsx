import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 1 — The Hook (Cover)
//
//  "AI didn't kill coding. It just made copy-pasting faster."
//  CMD+C ➡ CMD+V key visual
//  "Make Coding Great Again."
//  Footer: Swipe to see the new standard ➡️
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';

export const Slide1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const line1Sp = sp(frame, fps, 12, { stiffness: 68, damping: 14 });
  const line2Sp = sp(frame, fps, 22, { stiffness: 68, damping: 14 });
  const line3Sp = sp(frame, fps, 38, { stiffness: 68, damping: 14 });
  const keySp   = sp(frame, fps, 52, { stiffness: 52, damping: 14 });
  const divSp   = sp(frame, fps, 76, { stiffness: 70, damping: 16 });
  const make1Sp = sp(frame, fps, 84, { stiffness: 68, damping: 14 });
  const make2Sp = sp(frame, fps, 96, { stiffness: 68, damping: 14 });
  const footSp  = sp(frame, fps,118, { stiffness: 55, damping: 15 });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      <div style={{
        position: 'absolute', top: 268, left: SAFE_H,
        opacity: interpolate(line1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(line1Sp, [0, 1], [32, 0])}px)`,
        filter: blurFade(line1Sp, 12),
      }}>
        <span style={{
          fontSize: 92, fontWeight: 900, fontFamily: FONT_HEAD,
          color: BLACK, letterSpacing: '-3px', lineHeight: 1,
        }}>
          AI didn't
        </span>
      </div>

      {/* ── "kill coding." ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 368, left: SAFE_H,
        opacity: interpolate(line2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(line2Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(line2Sp, 12),
      }}>
        <span style={{
          fontSize: 92, fontWeight: 900, fontFamily: FONT_HEAD,
          color: BLACK, letterSpacing: '-3px', lineHeight: 1,
        }}>
          kill coding.
        </span>
      </div>

      {/* ── "It just made copy-pasting faster." ───────────────────────────── */}
      <div style={{
        position: 'absolute', top: 490, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(line3Sp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(line3Sp, [0, 1], [20, 0])}px)`,
        filter: blurFade(line3Sp, 8),
        lineHeight: 1.3,
      }}>
        <span style={{ fontSize: 44, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)' }}>
          It just made{' '}
        </span>
        <span style={{
          fontSize: 44, fontWeight: 800, fontFamily: FONT_HEAD, letterSpacing: '-1px',
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFA040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          copy-pasting
        </span>
        <span style={{ fontSize: 44, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)' }}>
          {' '}faster.
        </span>
      </div>

      {/* ── CMD+C ➡ CMD+V key visual ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 596, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28,
        opacity: interpolate(keySp, [0, 0.28], [0, 1]),
        transform: `scale(${interpolate(keySp, [0, 1], [0.76, 1])}) translateY(${interpolate(keySp, [0, 1], [28, 0])}px)`,
        filter: blurFade(keySp, 10),
      }}>
        {/* ⌘C key */}
        <div style={{
          width: 208, height: 136,
          background: 'white',
          border: '2px solid rgba(0,0,0,0.10)',
          borderRadius: 22,
          boxShadow: '0 8px 0 rgba(0,0,0,0.16), 0 12px 24px rgba(0,0,0,0.10)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <span style={{
            fontSize: 46, fontWeight: 900, fontFamily: FONT_HEAD,
            color: BLACK, lineHeight: 1,
          }}>⌘C</span>
          <span style={{
            fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO,
            color: 'rgba(0,0,0,0.32)', letterSpacing: '2.5px',
          }}>COPY</span>
        </div>

        {/* Arrow */}
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
          <path
            d="M4 20 H44 M34 6 L52 20 L34 34"
            stroke={ORANGE} strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        {/* ⌘V key — orange (the "villain") */}
        <div style={{
          width: 208, height: 136,
          background: ORANGE,
          border: '2px solid rgba(180,70,10,0.20)',
          borderRadius: 22,
          boxShadow: '0 8px 0 rgba(160,55,0,0.38), 0 12px 24px rgba(255,107,43,0.26)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <span style={{
            fontSize: 46, fontWeight: 900, fontFamily: FONT_HEAD,
            color: 'white', lineHeight: 1,
          }}>⌘V</span>
          <span style={{
            fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO,
            color: 'rgba(255,255,255,0.68)', letterSpacing: '2.5px',
          }}>PASTE</span>
        </div>
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 782, left: SAFE_H, right: SAFE_H,
        height: 2, borderRadius: 1,
        background: 'rgba(0,0,0,0.08)',
        opacity: interpolate(divSp, [0, 0.5], [0, 1]),
        transform: `scaleX(${interpolate(divSp, [0, 1], [0, 1])})`,
        transformOrigin: 'left center',
      }}/>

      {/* ── "Make Coding" ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 818, left: SAFE_H,
        opacity: interpolate(make1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(make1Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(make1Sp, 10),
      }}>
        <span style={{
          fontSize: 78, fontWeight: 900, fontFamily: FONT_HEAD,
          color: BLACK, letterSpacing: '-2.5px', lineHeight: 1,
        }}>
          Make Coding
        </span>
      </div>

      {/* ── "Great Again." ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 906, left: SAFE_H,
        opacity: interpolate(make2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(make2Sp, [0, 1], [22, 0])}px)`,
        filter: blurFade(make2Sp, 10),
      }}>
        <span style={{
          fontSize: 78, fontWeight: 900, fontFamily: FONT_HEAD,
          letterSpacing: '-2.5px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB060 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Great Again.
        </span>
      </div>

      {/* ── Swipe footer ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1560, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(footSp, [0, 0.35], [0, 1]),
        transform: `translateY(${interpolate(footSp, [0, 1], [14, 0])}px)`,
      }}>
        <span style={{
          fontSize: 30, fontWeight: 600, fontFamily: FONT_HEAD,
          color: 'rgba(10,10,10,0.42)', letterSpacing: '0.2px',
        }}>
          Swipe to see the new standard ➡️
        </span>
      </div>

    </SceneCanvas>
  );
};
