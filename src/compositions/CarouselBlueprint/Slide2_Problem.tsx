import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 2 — The Core Problem
//
//  "The Rise of AI-Generated Bloat"
//  Visual: Clean code card vs AI bloat card (side by side)
//  3 bullet points
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const RED    = '#EF4444';
const GREEN  = '#10B981';

const BULLETS = [
  { bold: 'AI excels at syntax,', rest: ' but fails at intentional architecture.' },
  { bold: 'Pasting AI code blindly', rest: ' turns developers into glorified debuggers.' },
  { bold: 'The result:', rest: ' bloated codebases, hidden security bugs, and technical debt.' },
];

const CLEAN_LINES = [
  { n: '1', t: 'const', k: ' getUser ', p: '=', r: ' (id) => {' },
  { n: '2', t: '  return', k: ' db.users', p: '.find(', r: 'id);' },
  { n: '3', t: '};', k: '', p: '', r: '' },
];

const BLOAT_LINES = [
  '// Auto-generated — do not edit',
  '// TODO: review this later',
  'const getUserWithFallback = async (',
  '  userId, opts = {}, retries = 3',
  ') => {',
  '  try {',
  '    if (!userId) throw new Error(',
  "      'Invalid userId provided'",
  '    );',
  '    const result = await fetchUserById(',
  '      userId, { timeout: 5000, ...opts }',
  '    );',
  '    if (!result) return null;',
  '    return transformUserData(result);',
  '  } catch(err) {',
  '    // TODO: add proper logging',
  '    if (retries > 0) return retry(...)',
  '  }',
  '};',
];

export const Slide2_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const sub1Sp  = sp(frame, fps, 10, { stiffness: 68, damping: 14 });
  const head1Sp = sp(frame, fps, 20, { stiffness: 68, damping: 14 });
  const head2Sp = sp(frame, fps, 32, { stiffness: 68, damping: 14 });
  const panelSp = sp(frame, fps, 48, { stiffness: 50, damping: 14 });
  const bsp     = BULLETS.map((_, i) =>
    sp(frame, fps, 120 + i * 18, { stiffness: 60, damping: 14 }),
  );

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>


      {/* ── "The Rise of" (subhead) ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 260, left: SAFE_H,
        opacity: interpolate(sub1Sp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(sub1Sp, [0, 1], [20, 0])}px)`,
        filter: blurFade(sub1Sp, 8),
      }}>
        <span style={{ fontSize: 46, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.48)' }}>
          The Rise of
        </span>
      </div>

      {/* ── "AI-Generated" ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 316, left: SAFE_H,
        opacity: interpolate(head1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(head1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(head1Sp, 12),
      }}>
        <span style={{ fontSize: 84, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
          AI-Generated
        </span>
      </div>

      {/* ── "Bloat" (red) ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 406, left: SAFE_H,
        opacity: interpolate(head2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(head2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(head2Sp, 12),
      }}>
        <span style={{
          fontSize: 84, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-2.5px', lineHeight: 1,
          background: `linear-gradient(135deg, ${RED} 0%, ${ORANGE} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Bloat
        </span>
      </div>

      {/* ── Code panels ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 524, left: SAFE_H, right: SAFE_H,
        display: 'flex', gap: 16,
        opacity: interpolate(panelSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(panelSp, [0, 1], [36, 0])}px)`,
        filter: blurFade(panelSp, 8),
      }}>

        {/* Left: clean code */}
        <div style={{
          flex: 1,
          background: '#0F0C1A',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 0 0 2px rgba(16,185,129,0.32)',
        }}>
          {/* titlebar */}
          <div style={{
            height: 40, background: '#18142A',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }}/>
            <span style={{
              fontSize: 11, fontFamily: FONT_MONO, color: GREEN,
              marginLeft: 6, fontWeight: 700, letterSpacing: '0.5px',
            }}>✓ CLEAN</span>
          </div>
          {/* code */}
          <div style={{ padding: '14px 16px' }}>
            {CLEAN_LINES.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 2 }}>
                <span style={{ fontSize: 14, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.20)', width: 12, textAlign: 'right', flexShrink: 0 }}>{l.n}</span>
                <span style={{ fontSize: 14, fontFamily: FONT_MONO, lineHeight: 1.6 }}>
                  <span style={{ color: '#7C6FCD' }}>{l.t}</span>
                  <span style={{ color: '#F2ECE4' }}>{l.k}</span>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{l.p}</span>
                  <span style={{ color: '#A8E6CF' }}>{l.r}</span>
                </span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 12, fontFamily: FONT_MONO, color: GREEN, fontWeight: 700 }}>
              3 lines · intentional
            </div>
          </div>
        </div>

        {/* Right: AI bloat */}
        <div style={{
          flex: 1,
          background: '#1A0C0C',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: `0 8px 32px rgba(0,0,0,0.22), 0 0 0 2px rgba(239,68,68,0.32)`,
        }}>
          {/* titlebar */}
          <div style={{
            height: 40, background: '#2A1414',
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E' }}/>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F' }}/>
            <span style={{
              fontSize: 11, fontFamily: FONT_MONO, color: RED,
              marginLeft: 6, fontWeight: 700, letterSpacing: '0.5px',
            }}>⚠ AI BLOAT</span>
          </div>
          {/* code */}
          <div style={{ padding: '10px 16px', maxHeight: 308, overflow: 'hidden' }}>
            {BLOAT_LINES.map((l, i) => (
              <div key={i} style={{
                fontSize: 11, fontFamily: FONT_MONO,
                color: l.startsWith('//') ? 'rgba(239,68,68,0.55)' : 'rgba(255,200,200,0.55)',
                lineHeight: 1.56, whiteSpace: 'nowrap',
              }}>
                {l}
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 12, fontFamily: FONT_MONO, color: RED, fontWeight: 700 }}>
              19 lines · who wrote this?
            </div>
          </div>
        </div>
      </div>

      {/* ── Bullet points ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 912, left: SAFE_H, right: SAFE_H,
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

    </SceneCanvas>
  );
};
