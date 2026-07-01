import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 3 — Mistake #2: Ignoring User Feedback
//  Visual: Feedback message bubbles slide in from right, hold, then fade out
//          Roadmap board stays solid on left — contrast tells the story
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const INDIGO = '#6366F1';

const MESSAGES = [
  { text: '"The onboarding is confusing — we dropped off at step 2"', user: 'Alex M.', delay: 40  },
  { text: '"We really need a simpler dashboard view first"',         user: 'Sara K.', delay: 90  },
  { text: '"Where is the export feature? That\'s all we need"',     user: 'David R.', delay: 140 },
];

export const Slide3_Feedback: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const badgeSp = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  const h1Sp    = sp(frame, fps, 12, { stiffness: 68, damping: 14 });
  const h2Sp    = sp(frame, fps, 24, { stiffness: 68, damping: 14 });
  const subSp   = sp(frame, fps, 38, { stiffness: 65, damping: 14 });
  const panelSp = sp(frame, fps, 52, { stiffness: 52, damping: 14 });

  // Message enter→hold→exit animation
  const getMsgState = (delay: number) => {
    const enterEnd = delay + 22;
    const holdEnd  = enterEnd + 60;
    const exitEnd  = holdEnd + 28;
    const opacity = interpolate(frame, [delay, enterEnd, holdEnd, exitEnd], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    const x = interpolate(frame, [delay, enterEnd], [60, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
    return { opacity, x };
  };

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── MISTAKE #2 badge ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(badgeSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(badgeSp, [0, 1], [14, 0])}px)`,
        display: 'inline-flex', alignItems: 'center',
        background: 'rgba(255,107,43,0.12)', border: '1.5px solid rgba(255,107,43,0.32)',
        borderRadius: 20, padding: '7px 18px',
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: FONT_MONO, color: ORANGE, letterSpacing: '1.5px' }}>
          MISTAKE #2
        </span>
      </div>

      {/* ── "Ignoring User" ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 258, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(h1Sp, 12),
      }}>
        <span style={{ fontSize: 92, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-3px', lineHeight: 1 }}>
          Ignoring User
        </span>
      </div>

      {/* ── "Feedback" ───────────────────────────────────────────────────── */}
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
          Feedback
        </span>
      </div>

      {/* ── Subtext ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 472, left: SAFE_H,
        opacity: interpolate(subSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 42, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.50)', lineHeight: 1.45 }}>
          Build what customers{' '}
          <span style={{ fontWeight: 800, color: BLACK }}>need.</span>
          {' '}Not what you{' '}
          <span style={{ fontWeight: 800, color: ORANGE }}>assume.</span>
        </span>
      </div>

      {/* ── Two-panel visual ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 592, left: SAFE_H, right: SAFE_H,
        display: 'flex', gap: 16,
        opacity: interpolate(panelSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(panelSp, [0, 1], [28, 0])}px)`,
        filter: blurFade(panelSp, 8),
      }}>

        {/* LEFT: Roadmap board (solid, ignores feedback) */}
        <div style={{
          width: 280,
          background: '#0F0C1A',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
          border: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            height: 38, background: '#18142A',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }}/>
            <span style={{ fontSize: 12, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>roadmap.md</span>
          </div>
          <div style={{ padding: '14px 16px' }}>
            {['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9,
                fontSize: 13, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.65)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: ORANGE, flexShrink: 0 }}/>
                {f}
                {i < 2 && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#27C93F' }}>DONE</span>}
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 11, fontFamily: FONT_MONO, color: ORANGE }}>
              → Next sprint: Feature F, G, H...
            </div>
          </div>
        </div>

        {/* RIGHT: Feedback messages (sliding in, fading out) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', position: 'relative', minHeight: 330 }}>
          {MESSAGES.map((msg, i) => {
            const { opacity, x } = getMsgState(msg.delay);
            return (
              <div key={i} style={{
                position: 'absolute', top: i * 108,
                left: 0, right: 0,
                opacity,
                transform: `translateX(${x}px)`,
                background: 'rgba(255,255,255,0.90)',
                borderRadius: 16, padding: '14px 16px',
                border: `1.5px solid ${INDIGO}22`,
                boxShadow: `0 4px 16px ${INDIGO}10`,
              }}>
                {/* Chat bubble tail */}
                <div style={{
                  position: 'absolute', top: '50%', left: -10,
                  width: 0, height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '10px solid rgba(255,255,255,0.90)',
                  transform: 'translateY(-50%)',
                }}/>
                <div style={{ fontSize: 24, fontFamily: FONT_HEAD, color: BLACK, lineHeight: 1.45, fontWeight: 500, marginBottom: 6 }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 13, fontFamily: FONT_MONO, color: INDIGO, fontWeight: 700 }}>
                  — {msg.user}
                </div>
              </div>
            );
          })}

          {/* "Ignored" label that fades in */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            opacity: interpolate(frame, [180, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            background: 'rgba(239,68,68,0.12)',
            border: '1.5px solid rgba(239,68,68,0.30)',
            borderRadius: 14, padding: '8px 16px',
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, fontFamily: FONT_MONO, color: '#EF4444', letterSpacing: '1px' }}>
              ALL IGNORED
            </span>
          </div>
        </div>
      </div>

    </SceneCanvas>
  );
};
