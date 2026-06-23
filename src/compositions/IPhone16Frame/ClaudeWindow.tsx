import React from 'react';
import { interpolate } from 'remotion';
import { CYAN, VIOLET, TEAL, BLUE, WHITE } from '../../common/colors';

// ─────────────────────────────────────────────────────────────────────────────
//  ClaudeWindow — renders as an HTML foreignObject inside the phone SVG.
//
//  This component simulates a Claude.ai chat conversation where the user
//  asks Claude to analyze their video. The response streams in with staggered
//  metric cards, progress bars, and a viral verdict.
//
//  Props:
//   • localFrame — frame number relative to when the window appears (0 = first frame shown)
//   • width / height — phone screen dimensions (default: 674 × 1404)
//
//  Timeline (localFrame):
//   0-8   : Header fades in
//   8-20  : User bubble slides in
//   20-40 : "Analyzing…" typing indicator
//   38-55 : Opening text fades in
//   55-75 : Metric row 1 (Hook)
//   75-95 : Metric row 2 (Emotion)
//   95-115: Metric row 3 (Pacing)
//   115-145: Verdict card
//   145+  : Cursor blinks
//
//  To customise:
//   • METRICS — label, value, color, icon for each analysis row
//   • USER_MESSAGE — the question shown in the user bubble
//   • VERDICT_TEXT — the final verdict string
// ─────────────────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const fade  = (f: number, a: number, b: number) => clamp((f - a) / (b - a), 0, 1);

const USER_MESSAGE  = 'Analyze my video for viral potential ⚡';
const VERDICT_TEXT  = '🚀  HIGH VIRAL POTENTIAL';

const METRICS = [
  { label: 'Hook Strength',    val: 94, color: CYAN,   icon: '⚡', delay: 55 },
  { label: 'Emotional Peak',   val: 87, color: VIOLET, icon: '🎭', delay: 76 },
  { label: 'Pacing Score',     val: 91, color: TEAL,   icon: '🎬', delay: 97 },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export const ClaudeWindow: React.FC<{
  localFrame: number;
  width?:     number;
  height?:    number;
}> = ({ localFrame, width = 674, height = 1404 }) => {
  const f = localFrame;

  // Animation helpers
  const headerOp    = fade(f, 0, 12);
  const userSlide   = interpolate(fade(f, 8, 22), [0, 1], [30, 0]);
  const userOp      = fade(f, 8, 22);
  const thinkingOp  = clamp(fade(f, 20, 32) - fade(f, 38, 48), 0, 1);
  const dotIdx      = Math.floor((f / 6) % 3);
  const openOp      = fade(f, 38, 56);
  const verdictOp   = fade(f, 115, 138);
  const verdictSlide = interpolate(fade(f, 115, 138), [0, 1], [20, 0]);

  // Fonts — these look good at phone-SVG scale (~0.6x display)
  const BASE     = height / 1404;  // scale factor
  const px       = (n: number) => `${Math.round(n * BASE)}px`;
  const pxN      = (n: number)  => Math.round(n * BASE);

  const headerH  = pxN(88);
  const bodyPad  = pxN(24);
  const bubbleR  = pxN(22);
  const userFS   = pxN(26);
  const labelFS  = pxN(22);
  const descFS   = pxN(19);
  const barH     = pxN(8);

  return (
    <div
      // xmlns is required for HTML inside SVG foreignObject
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Helvetica Neue', sans-serif",
        background: '#0D1117',
        color: '#E6EDF3',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{
        height: headerH,
        borderBottom: '1px solid #21262D',
        display: 'flex',
        alignItems: 'center',
        gap: pxN(14),
        padding: `0 ${pxN(20)}px`,
        opacity: headerOp,
        flexShrink: 0,
        background: '#0D1117',
      }}>
        {/* Back arrow */}
        <div style={{ fontSize: pxN(28), color: '#8B949E', lineHeight: 1 }}>‹</div>

        {/* Claude avatar */}
        <div style={{
          width: pxN(44), height: pxN(44),
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #CC785C 0%, #E8A87C 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: WHITE, fontSize: pxN(24), fontWeight: 800,
          flexShrink: 0,
        }}>
          C
        </div>

        {/* Name + model */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: pxN(26), fontWeight: 700, color: WHITE, lineHeight: 1.2 }}>
            Claude
          </div>
          <div style={{ fontSize: pxN(18), color: '#8B949E', lineHeight: 1.2 }}>
            claude‑sonnet‑4‑5
          </div>
        </div>

        {/* Online dot */}
        <div style={{
          width: pxN(10), height: pxN(10),
          borderRadius: '50%', background: '#3FB950',
          flexShrink: 0,
        }}/>
      </div>

      {/* ── MESSAGES AREA ─────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        padding: `${pxN(24)}px ${bodyPad}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: pxN(18),
      }}>

        {/* User bubble */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          opacity: userOp,
          transform: `translateY(${userSlide}px)`,
        }}>
          <div style={{
            background: '#1F5CDB',
            borderRadius: `${bubbleR}px ${pxN(6)}px ${bubbleR}px ${bubbleR}px`,
            padding: `${pxN(14)}px ${pxN(18)}px`,
            maxWidth: '80%',
            fontSize: userFS,
            lineHeight: 1.4,
            fontWeight: 500,
          }}>
            {USER_MESSAGE}
          </div>
        </div>

        {/* Claude "thinking" */}
        {thinkingOp > 0.01 && (
          <div style={{
            display: 'flex', gap: pxN(12), alignItems: 'flex-start',
            opacity: thinkingOp,
          }}>
            <div style={{
              width: pxN(36), height: pxN(36), borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #CC785C 0%, #E8A87C 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: WHITE, fontSize: pxN(20), fontWeight: 800,
            }}>C</div>
            <div style={{
              background: '#21262D',
              borderRadius: `${pxN(6)}px ${bubbleR}px ${bubbleR}px ${bubbleR}px`,
              padding: `${pxN(12)}px ${pxN(18)}px`,
              fontSize: userFS,
              display: 'flex', alignItems: 'center', gap: pxN(8),
            }}>
              <span style={{ color: '#8B949E', marginRight: pxN(4) }}>Analyzing</span>
              {['●', '●', '●'].map((dot, di) => (
                <span key={di} style={{
                  fontSize: pxN(14),
                  color: CYAN,
                  opacity: dotIdx === di ? 1 : 0.28,
                  transition: 'opacity 0.2s',
                }}>{dot}</span>
              ))}
            </div>
          </div>
        )}

        {/* Claude response bubble */}
        {openOp > 0.01 && (
          <div style={{
            display: 'flex', gap: pxN(12), alignItems: 'flex-start',
            opacity: openOp,
          }}>
            {/* Avatar */}
            <div style={{
              width: pxN(36), height: pxN(36), borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #CC785C 0%, #E8A87C 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: WHITE, fontSize: pxN(20), fontWeight: 800, marginTop: pxN(2),
            }}>C</div>

            {/* Bubble */}
            <div style={{
              background: '#161B22',
              border: '1px solid #30363D',
              borderRadius: `${pxN(6)}px ${bubbleR}px ${bubbleR}px ${bubbleR}px`,
              padding: `${pxN(18)}px ${pxN(20)}px`,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: pxN(14),
            }}>
              {/* Opening line */}
              <div style={{ fontSize: labelFS, color: '#E6EDF3', lineHeight: 1.4, fontWeight: 500 }}>
                I've analyzed your video! Here's what I found:
              </div>

              {/* Metric rows */}
              {METRICS.map((m) => {
                const mOp  = fade(f, m.delay, m.delay + 18);
                const barW = fade(f, m.delay + 8, m.delay + 28) * m.val;
                if (mOp < 0.01) return null;
                return (
                  <div key={m.label} style={{ opacity: mOp }}>
                    {/* Label row */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: pxN(8), marginBottom: pxN(6),
                    }}>
                      <span style={{ fontSize: pxN(22) }}>{m.icon}</span>
                      <span style={{
                        fontSize: labelFS, fontWeight: 700, color: m.color,
                        flex: 1, letterSpacing: 0.3,
                      }}>{m.label}</span>
                      <span style={{
                        fontSize: pxN(24), fontWeight: 900, color: m.color,
                      }}>{m.val}%</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      width: '100%', height: barH,
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: barH / 2, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${barW}%`, height: '100%',
                        background: `linear-gradient(90deg, ${m.color}88 0%, ${m.color} 100%)`,
                        borderRadius: barH / 2,
                        transition: 'width 0.1s linear',
                      }}/>
                    </div>
                  </div>
                );
              })}

              {/* Verdict */}
              {verdictOp > 0.01 && (
                <div style={{
                  marginTop: pxN(4),
                  padding: `${pxN(14)}px ${pxN(16)}px`,
                  background: `${CYAN}12`,
                  border: `1px solid ${CYAN}55`,
                  borderRadius: pxN(12),
                  opacity: verdictOp,
                  transform: `translateY(${verdictSlide}px)`,
                  display: 'flex', alignItems: 'center', gap: pxN(10),
                }}>
                  <div style={{
                    fontSize: pxN(24), fontWeight: 900, color: CYAN,
                    letterSpacing: 1.5,
                  }}>
                    {VERDICT_TEXT}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── INPUT BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: `${pxN(14)}px ${bodyPad}px`,
        borderTop: '1px solid #21262D',
        flexShrink: 0,
        background: '#0D1117',
        opacity: headerOp,
      }}>
        <div style={{
          background: '#21262D',
          borderRadius: pxN(28),
          padding: `${pxN(14)}px ${pxN(22)}px`,
          fontSize: labelFS,
          color: '#8B949E',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Reply to Claude…</span>
          <span style={{ color: CYAN, fontSize: pxN(26), fontWeight: 700 }}>↑</span>
        </div>
      </div>
    </div>
  );
};
