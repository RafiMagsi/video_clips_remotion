import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { sp, blurFade, fadeOut } from '../../common/utils';
import { PastelBackground } from '../../common/components';
import { FONT_HEAD } from '../../common/fonts';
import { Title } from '../IPhone16Frame/Title';

// ─────────────────────────────────────────────────────────────────────────────
//  Scene4_FollowSubscribe  — "Follow & Subscribe" CTA
//  Local frames 0–299  (10 s @ 30 fps), used inside a <Sequence>
//
//  Mobile safe zones:  top ≥ 160 px  |  bottom ≤ 1640 px  |  sides ≥ 52 px
//
//  Layout (y positions, all within safe zone):
//   y=245   DropTicks dark frosted card  (~165 px) → bottom≈410
//   y=460   "Follow &"        82 px black headline
//   y=548   "Subscribe."      82 px gradient headline
//   y=648   subtitle          34 px
//   y=706   accent underline  5 px, grows with spring
//   y=750   CTA Card 1 — Subscribe on YouTube   152 px  ← L
//   y=916   CTA Card 2 — Follow on Instagram    152 px  → R
//   y=1082  CTA Card 3 — Comment your question  152 px  ↑
//   y=1290  @dropticks  handle                   44 px
//   y=1368  tagline                              30 px → bottom≈1398 < 1640 ✓
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE  = '#FF6B2B';
const ORANGE2 = '#FFAA40';
const ORANGE3 = '#FFCC70';
const BLACK   = '#0A0A0A';
const RED     = '#EE2222';
const RED2    = '#FF6666';
const PURPLE  = '#833AB4';
const PINK    = '#E1306C';
const BLUE    = '#2060FF';
const BLUE2   = '#00BBFF';

// ── Sparkle helper ─────────────────────────────────────────────────────────
interface SparkleProps {
  x: number; y: number; size: number; color: string;
  shape: 'diamond' | 'cross' | 'ring';
  rot: number; op: number;
}
const Sparkle: React.FC<SparkleProps> = ({ x, y, size, color, shape, rot, op }) => {
  const s = size;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={op}>
      {shape === 'diamond' && (
        <polygon points={`0,${-s} ${s},0 0,${s} ${-s},0`} fill={color}/>
      )}
      {shape === 'cross' && (
        <>
          <rect x={-s * 0.2} y={-s} width={s * 0.4} height={s * 2} rx={s * 0.2} fill={color}/>
          <rect x={-s} y={-s * 0.2} width={s * 2} height={s * 0.4} rx={s * 0.2} fill={color}/>
        </>
      )}
      {shape === 'ring' && (
        <circle cx={0} cy={0} r={s} fill="none" stroke={color} strokeWidth={s * 0.35}/>
      )}
    </g>
  );
};

// ── CTA card component ─────────────────────────────────────────────────────
interface CtaCardProps {
  accentA: string;
  accentB: string;
  icon: React.ReactNode;
  headline: string;
  sub: string;
  badge?: React.ReactNode;
}
const CtaCard: React.FC<CtaCardProps> = ({ accentA, accentB, icon, headline, sub, badge }) => (
  <div style={{
    position: 'relative',
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.94)',
    borderRadius: 28,
    overflow: 'hidden',
    height: 152,
    boxShadow: [
      `0 4px 28px ${accentA}1A`,
      `0 0 0 1.5px ${accentA}28`,
      '0 2px 8px rgba(0,0,0,0.06)',
    ].join(', '),
  }}>
    {/* Left accent bar */}
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 7,
      background: `linear-gradient(180deg, ${accentA} 0%, ${accentB} 100%)`,
    }}/>

    {/* Icon bubble */}
    <div style={{
      marginLeft: 28, width: 70, height: 70, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${accentA}30 0%, ${accentB}10 100%)`,
      border: `2px solid ${accentA}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icon}
    </div>

    {/* Text */}
    <div style={{ marginLeft: 20, flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 32, fontWeight: 900, color: BLACK,
        fontFamily: FONT_HEAD, letterSpacing: '-0.6px', lineHeight: 1.18,
      }}>
        {headline}
      </div>
      <div style={{
        fontSize: 21, fontWeight: 700, color: 'rgba(0,0,0,0.38)',
        fontFamily: FONT_HEAD, marginTop: 6, lineHeight: 1.2,
      }}>
        {sub}
      </div>
    </div>

    {/* Right badge */}
    {badge && (
      <div style={{ marginRight: 28, flexShrink: 0, marginLeft: 16 }}>
        {badge}
      </div>
    )}

    {/* Chevron */}
    {!badge && (
      <div style={{ marginRight: 28, flexShrink: 0 }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
          stroke={accentA} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

export const Scene4_FollowSubscribe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W } = useVideoConfig();
  const t = frame / fps;

  const sceneOp = fadeOut(frame, 285, 299);

  // Logo card
  const logoSp = sp(frame, fps, 0, { stiffness: 70, damping: 14, mass: 1.1 });
  const logoY  = interpolate(logoSp, [0, 1], [-130, 0]);
  const logoOp = interpolate(logoSp, [0, 0.38], [0, 1]);
  const logoSc = interpolate(logoSp, [0, 1], [0.82, 1]);

  // Headlines
  const l1Sp = sp(frame, fps, 22, { stiffness: 90, damping: 16 });
  const l2Sp = sp(frame, fps, 32, { stiffness: 90, damping: 16 });
  const l3Sp = sp(frame, fps, 42, { stiffness: 84, damping: 16 });
  const lineY  = (s: number) => interpolate(s, [0, 1], [36, 0]);
  const lineOp = (s: number) => interpolate(s, [0, 0.20], [0, 1]);

  // Accent underline grows from left
  const accentSp = sp(frame, fps, 50, { stiffness: 52, damping: 18 });
  const accentW  = interpolate(accentSp, [0, 1], [0, 440]);
  const accentOp = interpolate(accentSp, [0, 0.18], [0, 1]);

  // CTA cards staggered
  const c1Sp = sp(frame, fps, 64,  { stiffness: 78, damping: 14 });
  const c2Sp = sp(frame, fps, 82,  { stiffness: 78, damping: 14 });
  const c3Sp = sp(frame, fps, 100, { stiffness: 76, damping: 14 });

  const c1X   = interpolate(c1Sp, [0, 1], [-(W + 120), 0]);
  const c1Op  = interpolate(c1Sp, [0, 0.16], [0, 1]);
  const c1Sc  = interpolate(c1Sp, [0, 0.7, 1], [0.92, 1.02, 1]);

  const c2X   = interpolate(c2Sp, [0, 1], [W + 120, 0]);
  const c2Op  = interpolate(c2Sp, [0, 0.16], [0, 1]);
  const c2Sc  = interpolate(c2Sp, [0, 0.7, 1], [0.92, 1.02, 1]);

  const c3Yd  = interpolate(c3Sp, [0, 1], [100, 0]);
  const c3Op  = interpolate(c3Sp, [0, 0.16], [0, 1]);
  const c3Sc  = interpolate(c3Sp, [0, 0.7, 1], [0.92, 1.02, 1]);

  // Handle + tagline
  const hSp = sp(frame, fps, 118, { stiffness: 64, damping: 16 });
  const hY  = interpolate(hSp, [0, 1], [28, 0]);
  const hOp = interpolate(hSp, [0, 0.28], [0, 1]);

  // Sparkle animations
  const sparkleOp = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const rot1 = (t * 38) % 360;
  const rot2 = (t * -25) % 360;
  const bob1 = Math.sin(t * Math.PI * 0.60) * 9;
  const bob2 = Math.sin(t * Math.PI * 0.45 + 1.2) * 7;
  const pulse = 0.55 + Math.sin(t * Math.PI * 0.80) * 0.28;

  // Blinking cursor
  const cursorOn = Math.floor(frame / 16) % 2 === 0;

  return (
    <AbsoluteFill style={{ opacity: sceneOp, overflow: 'hidden' }}>

      <PastelBackground />

      {/* ── Sparkles + glow halo ──────────────────────────────────────────── */}
      <svg
        width={W} height={1920}
        viewBox={`0 0 ${W} 1920`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        <defs>
          <filter id="s4-halo" x="-80%" y="-80%" width="360%" height="360%">
            <feGaussianBlur stdDeviation="52"/>
          </filter>
          <radialGradient id="s4-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={ORANGE2} stopOpacity="0.45"/>
            <stop offset="100%" stopColor={ORANGE}  stopOpacity="0.00"/>
          </radialGradient>
        </defs>

        {/* Warm glow behind logo card */}
        <ellipse cx={W / 2} cy={330} rx={360} ry={150}
          fill="url(#s4-glow)" filter="url(#s4-halo)"
          opacity={pulse * logoOp * 0.65}/>

        {/* Top-right rotating diamond */}
        <Sparkle x={978} y={298} size={13} color={ORANGE} shape="diamond" rot={rot1} op={sparkleOp * 0.55}/>
        {/* Smaller cross near top-right */}
        <Sparkle x={1018} y={455} size={8} color={ORANGE2} shape="cross" rot={rot1 * 0.6} op={sparkleOp * 0.38}/>
        {/* Left mid floating ring */}
        <g transform={`translate(22,${832 + bob1})`}>
          <Sparkle x={0} y={0} size={11} color={ORANGE} shape="ring" rot={0} op={sparkleOp * 0.44}/>
        </g>
        {/* Right mid floating diamond */}
        <g transform={`translate(1060,${998 + bob2})`}>
          <Sparkle x={0} y={0} size={10} color={ORANGE2} shape="diamond" rot={rot2} op={sparkleOp * 0.40}/>
        </g>
        {/* Bottom-left small cross */}
        <Sparkle x={36} y={1258} size={7} color={ORANGE3} shape="cross" rot={rot1 * 0.4} op={sparkleOp * 0.28}/>
      </svg>

      {/* ── DropTicks logo card ───────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 245, left: 106, right: 106,
        display: 'flex', justifyContent: 'center',
        opacity: logoOp,
        transform: `translateY(${logoY}px) scale(${logoSc})`,
        transformOrigin: 'top center',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(0, 6, 18, 0.76)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderRadius: 32,
          padding: '24px 56px 20px',
          boxShadow: [
            '0 12px 64px rgba(0,0,0,0.34)',
            '0 0 0 1px rgba(255,255,255,0.09)',
            'inset 0 1px 0 rgba(255,255,255,0.12)',
          ].join(', '),
        }}>
          <Title subtitle="AI Tools & Automation for Businesses"/>
        </div>
      </div>

      {/* ── Headline: "Follow &" ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 460, left: 106, right: 106,
        opacity: lineOp(l1Sp),
        transform: `translateY(${lineY(l1Sp)}px)`,
        filter: blurFade(l1Sp, 14),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 82, fontWeight: 900, color: BLACK,
          fontFamily: FONT_HEAD, letterSpacing: '-2.2px', lineHeight: 1.04, display: 'block',
        }}>
          Follow &amp;
        </span>
      </div>

      {/* ── Headline: "Subscribe." gradient ──────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 548, left: 106, right: 106,
        opacity: lineOp(l2Sp),
        transform: `translateY(${lineY(l2Sp)}px)`,
        filter: blurFade(l2Sp, 14),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 82, fontWeight: 900,
          fontFamily: FONT_HEAD, letterSpacing: '-2.2px', lineHeight: 1.04,
          display: 'inline-block',
          background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE2} 55%, ${ORANGE3} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          Subscribe.
        </span>
      </div>

      {/* ── Subtitle ─────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 648, left: 106, right: 106,
        opacity: lineOp(l3Sp),
        transform: `translateY(${lineY(l3Sp)}px)`,
        filter: blurFade(l3Sp, 8),
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: 'rgba(0,0,0,0.42)', fontFamily: FONT_HEAD }}>
          for more <span style={{ color: ORANGE }}>AI tools</span> &amp; automation
        </span>
      </div>

      {/* ── Animated accent underline ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 706, left: 106,
        height: 5, borderRadius: 3,
        width: accentW,
        opacity: accentOp,
        background: `linear-gradient(90deg, ${ORANGE} 0%, ${ORANGE2} 55%, transparent 100%)`,
        pointerEvents: 'none',
      }}/>

      {/* ── CTA Card 1: Subscribe on YouTube (slides from LEFT) ──────────── */}
      <div style={{
        position: 'absolute', top: 750, left: 106, right: 106,
        opacity: c1Op,
        transform: `translateX(${c1X}px) scale(${c1Sc})`,
        pointerEvents: 'none',
      }}>
        <CtaCard
          accentA={RED} accentB={RED2}
          headline="Subscribe on YouTube"
          sub="New AI videos every week 🔥"
          icon={
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
              stroke={RED} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
            </svg>
          }
          badge={
            <svg width={52} height={37} viewBox="0 0 52 37">
              <rect width={52} height={37} rx={8} fill="#FF0000"/>
              <polygon points="20,9 20,28 38,18.5" fill="white"/>
            </svg>
          }
        />
      </div>

      {/* ── CTA Card 2: Follow on Instagram (slides from RIGHT) ──────────── */}
      <div style={{
        position: 'absolute', top: 916, left: 106, right: 106,
        opacity: c2Op,
        transform: `translateX(${c2X}px) scale(${c2Sc})`,
        pointerEvents: 'none',
      }}>
        <CtaCard
          accentA={PINK} accentB={PURPLE}
          headline="Follow on Instagram"
          sub="AI tips & tools daily 📸"
          icon={
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none"
              stroke={PINK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          }
          badge={
            <svg width={44} height={44} viewBox="0 0 44 44">
              <defs>
                <linearGradient id="s4-igb2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#FFDC80"/>
                  <stop offset="30%"  stopColor="#F77737"/>
                  <stop offset="65%"  stopColor="#E1306C"/>
                  <stop offset="100%" stopColor="#833AB4"/>
                </linearGradient>
              </defs>
              <rect width={44} height={44} rx={11} fill="url(#s4-igb2)"/>
              <rect x={10} y={10} width={24} height={24} rx={6.5}
                fill="none" stroke="white" strokeWidth={2.4}/>
              <circle cx={22} cy={22} r={6.5}
                fill="none" stroke="white" strokeWidth={2.4}/>
              <circle cx={31.5} cy={12.5} r={2.4} fill="white"/>
            </svg>
          }
        />
      </div>

      {/* ── CTA Card 3: Comment (rises from BELOW) ───────────────────────── */}
      <div style={{
        position: 'absolute', top: 1082, left: 106, right: 106,
        opacity: c3Op,
        transform: `translateY(${c3Yd}px) scale(${c3Sc})`,
        pointerEvents: 'none',
      }}>
        <CtaCard
          accentA={BLUE} accentB={BLUE2}
          headline="Comment your question"
          sub="We reply to every one 👇"
          icon={
            <svg width={32} height={32} viewBox="0 0 24 24" fill={BLUE}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          }
          badge={
            <div style={{
              background: `linear-gradient(135deg, ${BLUE}18, ${BLUE2}08)`,
              border: `1.5px solid ${BLUE}30`,
              borderRadius: 14,
              padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: `${BLUE}CC`, fontFamily: FONT_HEAD }}>
                Ask AI...
              </span>
              <span style={{
                display: 'inline-block', width: 2, height: 18,
                background: BLUE, borderRadius: 2,
                opacity: cursorOn ? 1 : 0,
              }}/>
            </div>
          }
        />
      </div>

      {/* ── Handle ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1290,
        left: 0, right: 0, textAlign: 'center',
        opacity: hOp, transform: `translateY(${hY}px)`,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 10 }}>
          <div style={{ height: 2, width: 52, borderRadius: 2, background: `${ORANGE}40` }}/>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ORANGE, opacity: 0.70 }}/>
          <div style={{ height: 2, width: 52, borderRadius: 2, background: `${ORANGE}40` }}/>
        </div>
        <span style={{
          fontSize: 42, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-0.8px',
          display: 'inline-block',
          background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE2} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
        }}>
          @dropticksai
        </span>
      </div>

      {/* ── Tagline ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1372,
        left: 0, right: 0, textAlign: 'center',
        opacity: hOp * 0.72, transform: `translateY(${hY}px)`,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 26, fontWeight: 700, color: 'rgba(0,0,0,0.34)',
          fontFamily: FONT_HEAD, letterSpacing: '0.1px',
        }}>
          ✦ New videos every day ✦
        </span>
      </div>

    </AbsoluteFill>
  );
};
