import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 3 — The New Standard (Rule #1)
//
//  "The Architect First, Delegate Second Rule"
//  Architecture diagram: Human → Design → AI fills in
//  3 bullet points
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const INDIGO = '#6366F1';

const BULLETS = [
  { bold: 'Never ask AI', rest: ' to design your system architecture or database schemas.' },
  { bold: 'Define your data flows,', rest: ' logic, and state management manually first.' },
  { bold: 'Use AI only', rest: ' to fill in isolated, repetitive utility functions.' },
];

// Architecture diagram SVG component
const ArchDiagram: React.FC<{ progress: number }> = ({ progress }) => {
  const lineOp = Math.min(1, progress * 2.5);
  const boxOp  = Math.min(1, Math.max(0, (progress - 0.2) * 2.0));
  const aiOp   = Math.min(1, Math.max(0, (progress - 0.5) * 2.5));

  return (
    <svg
      width="756" height="258"
      viewBox="0 0 756 258"
      fill="none"
      style={{ display: 'block' }}
    >
      {/* ── Human Architect box (top center) ──────────────────────────── */}
      <g opacity={boxOp}>
        <rect x="243" y="8" width="270" height="72" rx="14"
          fill={INDIGO} fillOpacity="0.10"
          stroke={INDIGO} strokeWidth="2" strokeOpacity="0.70"
        />
        {/* Brain icon (simple circle + lines) */}
        <circle cx="281" cy="44" r="18" fill={INDIGO} fillOpacity="0.18" stroke={INDIGO} strokeWidth="1.5"/>
        <path d="M272 44 Q281 36 290 44" stroke={INDIGO} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M272 44 Q281 52 290 44" stroke={INDIGO} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <text x="308" y="40" fontSize="16" fontWeight="800" fill={INDIGO} fontFamily="sans-serif">YOU</text>
        <text x="308" y="59" fontSize="13" fontWeight="500" fill={INDIGO} fontFamily="sans-serif" opacity="0.72">ARCHITECT</text>
      </g>

      {/* ── Down arrow from Human to boxes ─────────────────────────────── */}
      <g opacity={lineOp}>
        <line x1="378" y1="80" x2="378" y2="108"
          stroke={INDIGO} strokeWidth="2" strokeDasharray="4 3" strokeOpacity="0.60"
        />
        {/* Split: left branch */}
        <line x1="378" y1="108" x2="172" y2="108" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.40"/>
        {/* Split: right branch */}
        <line x1="378" y1="108" x2="584" y2="108" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.40"/>
        {/* Arrow down left */}
        <line x1="172" y1="108" x2="172" y2="130" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.40"/>
        {/* Arrow down center */}
        <line x1="378" y1="108" x2="378" y2="130" stroke={INDIGO} strokeWidth="2" strokeOpacity="0.40"/>
        {/* Arrow down right */}
        <line x1="584" y1="108" x2="584" y2="130" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.40"/>
      </g>

      {/* ── Middle row: 3 architecture pillars ─────────────────────────── */}
      <g opacity={boxOp}>
        {/* System Design */}
        <rect x="72" y="130" width="200" height="58" rx="12"
          fill="rgba(99,102,241,0.08)" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.50"
        />
        <text x="172" y="156" textAnchor="middle" fontSize="14" fontWeight="800" fill={INDIGO} fontFamily="sans-serif">System</text>
        <text x="172" y="174" textAnchor="middle" fontSize="14" fontWeight="600" fill={INDIGO} fontFamily="sans-serif" opacity="0.72">Architecture</text>

        {/* DB Schema */}
        <rect x="278" y="130" width="200" height="58" rx="12"
          fill="rgba(99,102,241,0.08)" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.50"
        />
        <text x="378" y="156" textAnchor="middle" fontSize="14" fontWeight="800" fill={INDIGO} fontFamily="sans-serif">Data</text>
        <text x="378" y="174" textAnchor="middle" fontSize="14" fontWeight="600" fill={INDIGO} fontFamily="sans-serif" opacity="0.72">Flow &amp; Schema</text>

        {/* State Mgmt */}
        <rect x="484" y="130" width="200" height="58" rx="12"
          fill="rgba(99,102,241,0.08)" stroke={INDIGO} strokeWidth="1.5" strokeOpacity="0.50"
        />
        <text x="584" y="156" textAnchor="middle" fontSize="14" fontWeight="800" fill={INDIGO} fontFamily="sans-serif">State</text>
        <text x="584" y="174" textAnchor="middle" fontSize="14" fontWeight="600" fill={INDIGO} fontFamily="sans-serif" opacity="0.72">Management</text>
      </g>

      {/* ── Down arrow to AI zone ───────────────────────────────────────── */}
      <g opacity={aiOp}>
        <line x1="378" y1="188" x2="378" y2="208" stroke={ORANGE} strokeWidth="2" strokeOpacity="0.60"/>
        <path d="M372 202 L378 212 L384 202" fill={ORANGE} fillOpacity="0.60"/>
      </g>

      {/* ── AI utilities zone ──────────────────────────────────────────── */}
      <g opacity={aiOp}>
        <rect x="72" y="214" width="612" height="38" rx="10"
          fill="rgba(255,107,43,0.10)"
          stroke={ORANGE} strokeWidth="1.5" strokeOpacity="0.55"
          strokeDasharray="5 3"
        />
        <text x="378" y="238" textAnchor="middle" fontSize="14" fontWeight="700" fill={ORANGE} fontFamily="sans-serif">
          🤖 AI fills in: utility functions · boilerplate · repetitive code
        </text>
      </g>
    </svg>
  );
};

export const Slide3_Standard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const pre1Sp  = sp(frame, fps, 10, { stiffness: 68, damping: 14 });
  const head1Sp = sp(frame, fps, 18, { stiffness: 68, damping: 14 });
  const head2Sp = sp(frame, fps, 28, { stiffness: 68, damping: 14 });
  const head3Sp = sp(frame, fps, 38, { stiffness: 68, damping: 14 });
  const diagSp  = sp(frame, fps, 52, { stiffness: 50, damping: 14 });
  const bsp     = BULLETS.map((_, i) =>
    sp(frame, fps, 110 + i * 18, { stiffness: 60, damping: 14 }),
  );

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>


      {/* ── "The" ──────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 262, left: SAFE_H,
        opacity: interpolate(pre1Sp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(pre1Sp, [0, 1], [18, 0])}px)`,
        filter: blurFade(pre1Sp, 8),
      }}>
        <span style={{ fontSize: 46, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.46)' }}>
          The
        </span>
      </div>

      {/* ── "Architect First," ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 316, left: SAFE_H,
        opacity: interpolate(head1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(head1Sp, [0, 1], [28, 0])}px)`,
        filter: blurFade(head1Sp, 12),
      }}>
        <span style={{ fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
          Architect First,
        </span>
      </div>

      {/* ── "Delegate Second" ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 402, left: SAFE_H,
        opacity: interpolate(head2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(head2Sp, [0, 1], [24, 0])}px)`,
        filter: blurFade(head2Sp, 12),
      }}>
        <span style={{
          fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-2.5px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFA040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          Delegate Second
        </span>
      </div>

      {/* ── "Rule." ────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 488, left: SAFE_H,
        opacity: interpolate(head3Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(head3Sp, [0, 1], [20, 0])}px)`,
        filter: blurFade(head3Sp, 10),
      }}>
        <span style={{ fontSize: 80, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-2.5px', lineHeight: 1 }}>
          Rule.
        </span>
      </div>

      {/* ── Architecture diagram ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 600, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(diagSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(diagSp, [0, 1], [32, 0])}px)`,
        filter: blurFade(diagSp, 8),
      }}>
        <ArchDiagram progress={diagSp} />
      </div>

      {/* ── Bullet points ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 888, left: SAFE_H, right: SAFE_H,
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
