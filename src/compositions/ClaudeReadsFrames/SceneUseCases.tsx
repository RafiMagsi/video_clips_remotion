import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  SceneUseCases — "Watch anything. Ask anything."
//  5 professional use-case cards for the /watch claude-video skill
//
//  Layout (canvas 1080 × 1920, SAFE_H=162, SAFE_TOP=160, SAFE_BOTTOM=1640):
//    y=180   Skill badge pill
//    y=240   Headline 1 "Watch anything."  (80px)
//    y=330   Headline 2 "Ask anything."    (80px)
//    y=456   Card 1  ─┐
//    y=668   Card 2   │ 5 cards × 196px + 16px gap = 1044px
//    y=880   Card 3   │
//    y=1092  Card 4   │
//    y=1304  Card 5  ─┘  → ends at y=1500
//    y=1530  Footer pill
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';

// ── Use-case data ─────────────────────────────────────────────────────────────
interface UseCase {
  icon:    string;
  title:   string;
  desc:    string;
  accent:  string;
  accentB: string;
}
const USES: UseCase[] = [
  {
    icon:    '🎯',
    title:   'Analyze viral content',
    desc:    'Reverse-engineer any hook. Claude sees the first frames and hears the opening line — shows exactly why it worked.',
    accent:  '#FF6B2B',
    accentB: '#FF9A50',
  },
  {
    icon:    '🐛',
    title:   'Debug from a recording',
    desc:    'Drop a .mov or .mp4. Claude reads every frame and pinpoints the exact moment something breaks.',
    accent:  '#7C3AED',
    accentB: '#A78BFA',
  },
  {
    icon:    '⚡',
    title:   'Summarize without watching',
    desc:    'Paste any URL. Get a structured breakdown of what was shown and said — in seconds, not minutes.',
    accent:  '#0284C7',
    accentB: '#38BDF8',
  },
  {
    icon:    '⏱',
    title:   'Jump to any timestamp',
    desc:    'Ask about the 2:30 mark. Claude focuses its entire frame budget on that window for sharper answers.',
    accent:  '#059669',
    accentB: '#34D399',
  },
  {
    icon:    '👁',
    title:   "Read what's on screen",
    desc:    "Slides, terminals, dashboards, code — Claude reads text inside the video frame, not just the audio.",
    accent:  '#DB2777',
    accentB: '#F472B6',
  },
];

// ── Card geometry ────────────────────────────────────────────────────────────
const CARD_H    = 210;   // tall enough for big text + comfortable padding
const CARD_GAP  = 14;
const CARDS_TOP = 456;   // starts well below the two headline lines

// ── Card component ───────────────────────────────────────────────────────────
interface CardProps { use: UseCase; cardSp: number; index: number; }

const UseCaseCard: React.FC<CardProps> = ({ use, cardSp, index }) => {
  const cardX  = interpolate(cardSp, [0, 1], [380, 0]);
  const cardOp = interpolate(cardSp, [0, 0.22], [0, 1]);

  return (
    <div style={{
      position: 'absolute',
      top:    CARDS_TOP + index * (CARD_H + CARD_GAP),
      left:   SAFE_H,
      right:  SAFE_H,
      height: CARD_H,
      opacity:   cardOp,
      transform: `translateX(${cardX}px)`,
      display: 'flex',
      borderRadius: 26,
      background: 'rgba(255,255,255,0.94)',
      boxShadow: [
        `0 2px 12px rgba(0,0,0,0.06)`,
        `0 8px 32px rgba(0,0,0,0.09)`,
        `0 0 0 1.5px rgba(0,0,0,0.055)`,
        `0 0 0 5px ${use.accent}12`,
      ].join(', '),
      overflow: 'hidden',
    }}>

      {/* Left accent bar */}
      <div style={{
        width: 7, height: '100%', flexShrink: 0,
        background: `linear-gradient(180deg, ${use.accent} 0%, ${use.accentB} 100%)`,
      }}/>

      {/* Icon bubble */}
      <div style={{
        width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${use.accent}20 0%, ${use.accentB}16 100%)`,
        border: `2px solid ${use.accent}28`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: 'auto 20px auto 20px',
        fontSize: 30,
      }}>
        {use.icon}
      </div>

      {/* Text block */}
      <div style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingRight: 20,
        gap: 9,
      }}>
        <div style={{
          fontSize: 34, fontWeight: 800, fontFamily: FONT_HEAD,
          color: BLACK, letterSpacing: '-0.6px', lineHeight: 1.12,
        }}>
          {use.title}
        </div>
        <div style={{
          fontSize: 22, fontWeight: 400, fontFamily: FONT_HEAD,
          color: 'rgba(0,0,0,0.50)', lineHeight: 1.50,
        }}>
          {use.desc}
        </div>
      </div>

      {/* Chevron */}
      <div style={{
        width: 44, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingRight: 14,
      }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 5L12.5 10L7.5 15"
            stroke={use.accent} strokeWidth="2.4"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const SceneUseCases: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  // ── Skill label pill ───────────────────────────────────────────────────────
  const labelSp = sp(frame, fps, 5, { stiffness: 70, damping: 16 });
  const labelOp = interpolate(labelSp, [0, 0.30], [0, 1]);
  const labelTY = interpolate(labelSp, [0, 1], [16, 0]);

  // ── Headline springs ───────────────────────────────────────────────────────
  const h1Sp  = sp(frame, fps, 12, { stiffness: 82, damping: 16 });
  const h2Sp  = sp(frame, fps, 22, { stiffness: 82, damping: 16 });
  const lineY = (s: number) => interpolate(s, [0, 1], [30, 0]);
  const lineOp = (s: number) => interpolate(s, [0, 0.22], [0, 1]);

  // ── Card springs (22-frame stagger starting at frame 38) ──────────────────
  const cardSprings = USES.map((_, i) =>
    sp(frame, fps, 38 + i * 22, { stiffness: 68, damping: 15 })
  );

  // ── Footer pill ────────────────────────────────────────────────────────────
  const footSp = sp(frame, fps, 220, { stiffness: 58, damping: 14 });
  const footOp = interpolate(footSp, [0, 0.30], [0, 1]);
  const footTY = interpolate(footSp, [0, 1], [18, 0]);

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── Skill label pill ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 180, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: labelOp, transform: `translateY(${labelTY}px)`,
        filter: blurFade(labelSp, 8),
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          background: 'rgba(255,255,255,0.82)',
          border: `1.5px solid ${ORANGE}30`,
          borderRadius: 28, padding: '9px 22px',
          boxShadow: `0 2px 14px rgba(255,107,43,0.10)`,
        }}>
          <div style={{
            width: 9, height: 9, borderRadius: '50%',
            background: `linear-gradient(135deg, ${ORANGE}, #FFA040)`,
          }}/>
          <span style={{
            fontSize: 16, fontWeight: 700, fontFamily: FONT_HEAD,
            color: ORANGE, letterSpacing: '0.6px',
          }}>
            claude-video  ·  /watch
          </span>
        </div>
      </div>

      {/* ── Headline 1: "Watch anything." ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 240, left: 0, right: 0,
        textAlign: 'center',
        opacity:   lineOp(h1Sp),
        transform: `translateY(${lineY(h1Sp)}px)`,
        filter:    blurFade(h1Sp, 12),
      }}>
        <span style={{
          fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD,
          letterSpacing: '-2.5px', lineHeight: 1.0, color: BLACK,
        }}>
          Watch anything.
        </span>
      </div>

      {/* ── Headline 2: "Ask anything." ───────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 330, left: 0, right: 0,
        textAlign: 'center',
        opacity:   lineOp(h2Sp),
        transform: `translateY(${lineY(h2Sp)}px)`,
        filter:    blurFade(h2Sp, 12),
      }}>
        <span style={{
          fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD,
          letterSpacing: '-2.5px', lineHeight: 1.0,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFA040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
          display: 'inline-block',
        }}>
          Ask anything.
        </span>
      </div>

      {/* ── Use-case cards ────────────────────────────────────────────────── */}
      {USES.map((use, i) => (
        <UseCaseCard
          key={i}
          use={use}
          cardSp={cardSprings[i]}
          index={i}
        />
      ))}

      {/* ── Footer pill ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: CARDS_TOP + USES.length * (CARD_H + CARD_GAP) - CARD_GAP + 32,
        left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: footOp, transform: `translateY(${footTY}px)`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 18,
          background: 'rgba(255,255,255,0.70)',
          border: '1.5px solid rgba(0,0,0,0.07)',
          borderRadius: 32, padding: '12px 28px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 600, fontFamily: FONT_HEAD,
            color: 'rgba(0,0,0,0.38)', letterSpacing: '0.2px',
          }}>
            Available on
          </span>
          {['Claude Code', 'claude.ai'].map((label, i) => (
            <span key={i} style={{
              fontSize: 15, fontWeight: 800, fontFamily: FONT_HEAD,
              background: `linear-gradient(90deg, ${ORANGE}, #FFA040)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', color: 'transparent',
              display: 'inline-block',
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>

    </SceneCanvas>
  );
};
