import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  SceneTerminal_Watch — "Give Claude the ability to watch."
//  Demonstrates the /watch claude-video skill via animated terminal
//
//  Timeline (all frames are scene-relative, i.e. relative to Sequence start):
//    0–20   : scene enters, 3D camera spring settles
//   15–45   : headline blurs in above terminal
//   28–45   : terminal window springs in
//   42–90   : /watch command types out character by character
//   98–210  : output lines appear one by one (staggered springs)
//  210–285  : everything visible, camera drifts gently
//  285–299  : scene fade out
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE     = '#FF6B2B';
const BLACK      = '#0A0A0A';

// ── Terminal content ────────────────────────────────────────────────────────
const CMD = '/watch https://youtu.be/dQw4w9WgXcQ  what happens at 0:30?';

type LineType = 'header' | 'info' | 'success' | 'dim' | 'divider' | 'answer' | 'spacer';
interface TermLine { text: string; type: LineType; delay: number; }

const OUTPUT: TermLine[] = [
  { text: '  ◆  claude-video  v0.1.2',                   type: 'header',  delay: 98  },
  { text: '',                                              type: 'spacer',  delay: 103 },
  { text: '  ↓   Downloading...',                         type: 'info',    delay: 108 },
  { text: '      Never Gonna Give You Up  (3m 33s)',      type: 'dim',     delay: 116 },
  { text: '  ✓   Downloaded',                            type: 'success', delay: 130 },
  { text: '',                                              type: 'spacer',  delay: 133 },
  { text: '  ⚡  Extracting 60 frames  (0.28 fps)',       type: 'info',    delay: 138 },
  { text: '  ✓   Frames ready',                          type: 'success', delay: 154 },
  { text: '',                                              type: 'spacer',  delay: 157 },
  { text: '  ◎   Captions: native en  ✓',                type: 'success', delay: 162 },
  { text: '',                                              type: 'spacer',  delay: 165 },
  { text: '  ◈   Reading 60 frames + transcript...',      type: 'info',    delay: 170 },
  { text: '',                                              type: 'spacer',  delay: 175 },
  { text: '  ──────────────────────────────────────',     type: 'divider', delay: 182 },
  { text: '  At 0:30, camera cuts to a close-up —',      type: 'answer',  delay: 190 },
  { text: '  the hook has just landed.',                  type: 'answer',  delay: 200 },
];

// ── Terminal colour tokens ───────────────────────────────────────────────────
const T = {
  bg:       '#0F0C1A',
  titleBar: '#18142A',
  border:   'rgba(255,130,60,0.18)',
  text:     '#E2D9F3',
  prompt:   '#FF6B2B',
  cmd:      '#FFD080',
  success:  '#4CE88A',
  info:     '#82C8FF',
  dim:      'rgba(220,210,230,0.48)',
  header:   '#FFA050',
  divider:  'rgba(220,210,230,0.25)',
  answer:   '#FFF8F0',
};

// ─────────────────────────────────────────────────────────────────────────────

export const SceneTerminal_Watch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W } = useVideoConfig();

  // ── Scene fade out ─────────────────────────────────────────────────────────
  const sceneOp = fadeOut(frame, 285, 299);

  // ── Headline springs ───────────────────────────────────────────────────────
  const h1Sp   = sp(frame, fps, 15, { stiffness: 80, damping: 16 });
  const h2Sp   = sp(frame, fps, 25, { stiffness: 80, damping: 16 });
  const lineY  = (s: number) => interpolate(s, [0, 1], [28, 0]);
  const lineOp = (s: number) => interpolate(s, [0, 0.22], [0, 1]);

  // ── Terminal window entrance ────────────────────────────────────────────────
  const termSp    = sp(frame, fps, 28, { stiffness: 58, damping: 18 });
  const termScale = interpolate(termSp, [0, 1], [0.93, 1.0]);
  const termOp    = interpolate(termSp, [0, 0.35], [0, 1]);

  // ── Camera system ─────────────────────────────────────────────────────────
  const t = frame / fps;

  // 1. Entry spring — high tilted angle → settles to neutral over ~1.5 s
  const camSp      = sp(frame, fps, 4, { stiffness: 48, damping: 22 });
  const entryRotX  = interpolate(camSp, [0, 1], [14,  0]);
  const entryRotY  = interpolate(camSp, [0, 1], [-7,  0]);
  const entryScale = interpolate(camSp, [0, 1], [0.80, 1.0]);

  // 2. Orbit — camera sweeps ~240° of an elliptical arc around the terminal
  //    Parameterized 0→1 over frames 20–280 (active scene window)
  const orbitProg  = interpolate(frame, [20, 280], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const orbitAngle = orbitProg * Math.PI * 1.33;  // 0 → ~240 degrees
  //   sin(0..240°): 0 → +1 → 0 → –0.87   (sweeps right then comes back left)
  //   cos(0..240°): 1 →  0 → –1 → –0.5   (tilts down as it passes the side)
  const orbitRotY  =  Math.sin(orbitAngle) * 12;   // ±12° horizontal swing
  const orbitRotX  =  Math.cos(orbitAngle) * -4;   // ±4° vertical tilt (correlated)
  const orbitPanX  =  Math.sin(orbitAngle) * -22;  // ±22px lateral pan
  const orbitPanY  =  Math.sin(orbitAngle * 0.65) * 10; // ±10px gentle vertical

  // 3. Typing zoom — scale in as command types (frames 35→58), hold, zoom out (90→130)
  const typingZoom = interpolate(
    frame,
    [35, 58, 90, 130],
    [0, 0.18, 0.18, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // 4. Compose: entry spring fades to 0, orbit takes over; zoom punches on top
  const totalRotX  = entryRotX  + orbitRotX;
  const totalRotY  = entryRotY  + orbitRotY;
  const totalScale = entryScale * (1 + typingZoom);
  const totalPanX  = orbitPanX;
  const totalPanY  = orbitPanY;

  // ── Command typing ─────────────────────────────────────────────────────────
  // Characters reveal linearly between frame 42 and 90
  const charCount  = Math.floor(
    interpolate(frame, [42, 90], [0, CMD.length], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    })
  );
  const typedCmd   = CMD.slice(0, charCount);
  const typingDone = charCount >= CMD.length;
  // Blinking cursor after typing finishes
  const showCursor = !typingDone || (Math.floor(t * 2) % 2 === 0);

  // ── Footer badge ───────────────────────────────────────────────────────────
  const footSp = sp(frame, fps, 205, { stiffness: 60, damping: 14 });

  // ── Terminal geometry ──────────────────────────────────────────────────────
  const termW = W - 2 * SAFE_H;   // 756px
  const termH = 760;
  const termX = SAFE_H;           // 162px
  const termY = 530;

  // ── Line colour helper ─────────────────────────────────────────────────────
  const lineColor = (type: LineType): string => ({
    header:  T.header,
    info:    T.info,
    success: T.success,
    dim:     T.dim,
    divider: T.divider,
    answer:  T.answer,
    spacer:  'transparent',
  }[type]);

  // ── Line height per row ────────────────────────────────────────────────────
  const LINE_H = 33; // px (font 18px * lineHeight 1.55 ≈ 28, + breathing room)

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ══════════════════════════════════════════════════════════════════════
          3-D camera wrapper — perspective applied here, content inside rotates
         ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'absolute', inset: 0,
        perspective: '1400px',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: `rotateX(${totalRotX}deg) rotateY(${totalRotY}deg) scale(${totalScale}) translate(${totalPanX}px, ${totalPanY}px)`,
          transformOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
        }}>

          {/* ── Headline: "Give Claude" ─────────────────────────────────── */}
          <div style={{
            position: 'absolute', top: 310, left: 0, right: 0,
            textAlign: 'center',
            opacity:   lineOp(h1Sp),
            transform: `translateY(${lineY(h1Sp)}px)`,
            filter:    blurFade(h1Sp, 12),
          }}>
            <span style={{
              fontSize: 68, fontWeight: 900, letterSpacing: '-1.5px',
              color: BLACK, fontFamily: FONT_HEAD, lineHeight: 1.0,
            }}>Give Claude</span>
          </div>

          {/* ── Headline: "the ability to watch." ──────────────────────── */}
          <div style={{
            position: 'absolute', top: 388, left: 0, right: 0,
            textAlign: 'center',
            opacity:   lineOp(h2Sp),
            transform: `translateY(${lineY(h2Sp)}px)`,
            filter:    blurFade(h2Sp, 12),
          }}>
            <span style={{
              fontSize: 68, fontWeight: 900, letterSpacing: '-1.5px',
              background: `linear-gradient(135deg, ${ORANGE} 10%, #FFA040 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              fontFamily: FONT_HEAD, lineHeight: 1.0,
            }}>the ability to watch.</span>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              Terminal window
             ════════════════════════════════════════════════════════════════ */}
          <div style={{
            position: 'absolute',
            top:    termY,
            left:   termX,
            width:  termW,
            height: termH,
            borderRadius: 16,
            background: T.bg,
            border: `1.5px solid ${T.border}`,
            boxShadow: [
              `0 0 0 1px rgba(255,120,50,0.10)`,
              `0 2px 8px rgba(0,0,0,0.40)`,
              `0 16px 60px rgba(0,0,0,0.65)`,
              `0 40px 100px rgba(0,0,0,0.35)`,
              `0 0 80px rgba(255,100,40,0.08)`,
            ].join(', '),
            overflow: 'hidden',
            opacity: termOp,
            transform: `scale(${termScale})`,
            transformOrigin: '50% 0%',
          }}>

            {/* ── Title bar ──────────────────────────────────────────────── */}
            <div style={{
              height: 44,
              background: T.titleBar,
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center',
              padding: '0 18px',
              gap: 8,
              flexShrink: 0,
            }}>
              {/* Traffic lights */}
              {['#FF5F56','#FFBD2E','#27C93F'].map((c, i) => (
                <div key={i} style={{
                  width: 13, height: 13, borderRadius: '50%',
                  background: c, opacity: 0.9,
                  boxShadow: `0 0 6px ${c}88`,
                }}/>
              ))}
              {/* Window title */}
              <span style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                fontSize: 13, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.38)',
                letterSpacing: '0.3px',
              }}>
                claude  —  /watch
              </span>
            </div>

            {/* ── Terminal content ────────────────────────────────────────── */}
            <div style={{
              padding: '22px 26px 22px 26px',
              fontFamily: FONT_MONO,
              fontSize: 18,
              lineHeight: `${LINE_H}px`,
              color: T.text,
              overflowY: 'hidden',
            }}>

              {/* Prompt + typing command */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ color: T.prompt, fontWeight: 700, fontSize: 19 }}>$</span>
                <span style={{ color: T.cmd }}>
                  {typedCmd}
                  {showCursor && (
                    <span style={{
                      display: 'inline-block',
                      width: 2, height: '1.1em',
                      background: T.prompt,
                      marginLeft: 2,
                      verticalAlign: 'text-bottom',
                    }}/>
                  )}
                </span>
              </div>

              {/* Output lines — each springs in at its delay frame */}
              {OUTPUT.map((line, i) => {
                const lineSp  = sp(frame, fps, line.delay, { stiffness: 90, damping: 18 });
                const lineOpV = interpolate(lineSp, [0, 0.25], [0, 1]);
                const lineTY  = interpolate(lineSp, [0, 1],    [10, 0]);

                if (line.type === 'spacer') {
                  return <div key={i} style={{ height: LINE_H * 0.55 }}/>;
                }

                return (
                  <div key={i} style={{
                    height: LINE_H,
                    display: 'flex', alignItems: 'center',
                    opacity: lineOpV,
                    transform: `translateY(${lineTY}px)`,
                    color: lineColor(line.type),
                    fontSize: line.type === 'divider' ? 14 : 18,
                    letterSpacing: line.type === 'answer' ? '0.1px' : undefined,
                    fontWeight: line.type === 'answer' ? 500 : 400,
                    whiteSpace: 'pre',
                  }}>
                    {line.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Footer badge ──────────────────────────────────────────────── */}
          <div style={{
            position: 'absolute',
            top: termY + termH + 28,
            left: 0, right: 0,
            display: 'flex', justifyContent: 'center',
            opacity: interpolate(footSp, [0, 0.30], [0, 1]),
            transform: `translateY(${interpolate(footSp, [0, 1], [14, 0])}px)`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.72)',
              border: `1.5px solid rgba(255,107,43,0.22)`,
              borderRadius: 32,
              padding: '10px 24px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(255,107,43,0.10)',
            }}>
              <span style={{
                fontSize: 15, fontFamily: FONT_MONO,
                color: 'rgba(0,0,0,0.42)', letterSpacing: '0.3px',
              }}>
                github.com/bradautomates/claude-video
              </span>
              <span style={{
                fontSize: 13, fontWeight: 700,
                background: `linear-gradient(90deg, ${ORANGE}, #FFA040)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: FONT_HEAD,
                letterSpacing: '1px',
              }}>
                FREE
              </span>
            </div>
          </div>

        </div>{/* /camera inner */}
      </div>{/* /perspective wrapper */}

    </SceneCanvas>
  );
};
