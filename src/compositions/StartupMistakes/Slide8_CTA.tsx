import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 8 — CTA
//  "What Should You Automate First?"
//  Visual: Dark operations-center card with glowing "SYSTEM" text
//          Comment bubble with glow pulse, CTA instructions
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const GREEN  = '#10B981';

export const Slide8_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const h1Sp    = sp(frame, fps,  8, { stiffness: 68, damping: 14 });
  const h2Sp    = sp(frame, fps, 20, { stiffness: 68, damping: 14 });
  const divSp   = sp(frame, fps, 34, { stiffness: 70, damping: 16 });
  const cardSp  = sp(frame, fps, 48, { stiffness: 50, damping: 14 });
  const sysGlow = sp(frame, fps, 88, { stiffness: 42, damping: 12 });
  const step1Sp = sp(frame, fps,120, { stiffness: 58, damping: 14 });
  const step2Sp = sp(frame, fps,140, { stiffness: 58, damping: 14 });
  const step3Sp = sp(frame, fps,160, { stiffness: 58, damping: 14 });
  const hashSp  = sp(frame, fps,190, { stiffness: 52, damping: 15 });

  // "SYSTEM" glow pulse
  const glowPulse = 0.6 + Math.sin(frame * 0.08) * 0.4;

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── "What Should" ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [30, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
          What Should
        </span>
      </div>

      {/* ── "You Automate First?" ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 280, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{
          fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-2.5px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          You Automate First?
        </span>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 400, left: SAFE_H, right: SAFE_H,
        height: 2, borderRadius: 1,
        background: `linear-gradient(90deg, ${ORANGE}, rgba(255,107,43,0.08))`,
        opacity: interpolate(divSp, [0, 0.5], [0, 1]),
        transform: `scaleX(${interpolate(divSp, [0, 1], [0, 1])})`,
        transformOrigin: 'left center',
      }}/>

      {/* ── Dark AI operations card ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 430, left: SAFE_H, right: SAFE_H,
        background: '#0F0C1A',
        borderRadius: 28, overflow: 'hidden',
        boxShadow: `0 16px 64px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.06), 0 0 ${80 * glowPulse * interpolate(sysGlow, [0, 1], [0, 1])}px rgba(255,107,43,0.18)`,
        border: '1.5px solid rgba(255,107,43,0.16)',
        opacity: interpolate(cardSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(cardSp, [0, 1], [36, 0])}px)`,
        filter: blurFade(cardSp, 8),
      }}>
        {/* Top bar */}
        <div style={{
          height: 44, background: '#18142A',
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8,
          borderBottom: '1px solid rgba(255,107,43,0.12)',
        }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F56' }}/>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD2E' }}/>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27C93F' }}/>
          <span style={{ fontSize: 13, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.30)', marginLeft: 8 }}>
            ai-systems.studio — DropTicks AI
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN }}/>
            <span style={{ fontSize: 11, fontFamily: FONT_MONO, color: GREEN, fontWeight: 700 }}>LIVE</span>
          </div>
        </div>

        {/* "SYSTEM" hero text with glow */}
        <div style={{
          padding: '36px 32px 28px',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Glow behind text */}
          <div style={{
            position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 500, height: 120,
            background: `radial-gradient(ellipse, rgba(255,107,43,${0.18 * glowPulse * interpolate(sysGlow, [0, 1], [0, 1])}) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}/>

          <div style={{
            fontSize: 14, fontWeight: 700, fontFamily: FONT_MONO,
            color: ORANGE, letterSpacing: '3px', marginBottom: 14,
            opacity: interpolate(sysGlow, [0, 0.4], [0, 1]),
          }}>
            COMMENT BELOW
          </div>

          {/* Comment bubble */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: `rgba(255,107,43,${0.14 + glowPulse * 0.06 * interpolate(sysGlow, [0, 1], [0, 1])})`,
            border: `2px solid rgba(255,107,43,${0.35 + glowPulse * 0.15 * interpolate(sysGlow, [0, 1], [0, 1])})`,
            borderRadius: 20, padding: '18px 52px',
            boxShadow: `0 0 ${40 * glowPulse * interpolate(sysGlow, [0, 1], [0, 1])}px rgba(255,107,43,0.22)`,
            marginBottom: 20,
            opacity: interpolate(sysGlow, [0, 0.30], [0, 1]),
            transform: `scale(${interpolate(sysGlow, [0, 1], [0.8, 1])})`,
          }}>
            <span style={{
              fontSize: 64, fontWeight: 900, fontFamily: FONT_HEAD,
              letterSpacing: '-1px', lineHeight: 1,
              background: `linear-gradient(135deg, ${ORANGE} 0%, #FFD080 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', color: 'transparent',
            }}>
              SYSTEM
            </span>
          </div>

          {/* Steps */}
          {[
            { text: 'Comment "SYSTEM" below', sp: step1Sp, delay: 120 },
            { text: 'Tell us what your business does', sp: step2Sp, delay: 140 },
            { text: "We'll suggest an AI system you could build", sp: step3Sp, delay: 160 },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 2 ? 12 : 0,
              opacity: interpolate(step.sp, [0, 0.30], [0, 1]),
              transform: `translateX(${interpolate(step.sp, [0, 1], [24, 0])}px)`,
              textAlign: 'left',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: `rgba(255,107,43,0.20)`, border: `1.5px solid rgba(255,107,43,0.38)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, fontFamily: FONT_MONO, color: ORANGE }}>
                  {i + 1}
                </span>
              </div>
              <span style={{ fontSize: 26, fontWeight: 600, fontFamily: FONT_HEAD, color: 'rgba(242,236,228,0.72)', lineHeight: 1.4 }}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hashtag footer ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1430, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(hashSp, [0, 0.35], [0, 1]),
        transform: `translateY(${interpolate(hashSp, [0, 1], [14, 0])}px)`,
      }}>
        <span style={{
          fontSize: 24, fontWeight: 700, fontFamily: FONT_MONO,
          color: 'rgba(10,10,10,0.36)', letterSpacing: '0.5px',
        }}>
          #BuildSystemsNotFeatures
        </span>
      </div>

    </SceneCanvas>
  );
};
