import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { CYAN, BLUE, VIOLET, TEAL } from '../../common/colors';

// ─────────────────────────────────────────────────────────────────────────────
//  Title — DropTicks AI wordmark + subtitle
//
//  Renders the animated logo, "DropTicks AI" wordmark, accent underline,
//  and subtitle text.  Used at the top of IPhoneComposition.
//
//  Usage:
//    <Title subtitle="Your Subtitle Here" />
//
//  To change for different results:
//    • subtitle — the small text under the wordmark
//    • fontSize  — main wordmark (62), subtitle (22) — adjust via style overrides
//    • The DropTicks logo SVG path (the drop shape) can be recolored via colors.ts
// ─────────────────────────────────────────────────────────────────────────────

// ── DropTicks logo drop + checkmark mark ─────────────────────────────────────
const DropTicksLogo: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 1], [0.3, 1], { extrapolateRight: 'clamp' });
  const op    = interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <svg width={60} height={66} viewBox="0 0 100 110"
      style={{ transform: `scale(${scale})`, opacity: op, display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id="dp-g" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%"   stopColor={BLUE}/>
          <stop offset="50%"  stopColor="#00B4FF"/>
          <stop offset="100%" stopColor={CYAN}/>
        </linearGradient>
        <linearGradient id="dp-s" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={VIOLET}/>
          <stop offset="100%" stopColor={BLUE}/>
        </linearGradient>
        <filter id="dp-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M50 5 C50 5 15 45 15 68 C15 87 31 100 50 100 C69 100 85 87 85 68 C85 45 50 5 50 5 Z"
        fill="url(#dp-g)" filter="url(#dp-glow)"/>
      <path d="M50 100 C31 100 15 87 15 68 C15 55 22 44 33 37 Z"
        fill="url(#dp-s)" opacity={0.75}/>
      <ellipse cx={38} cy={42} rx={7} ry={13} fill="rgba(255,255,255,0.22)"
        transform="rotate(-20,38,42)"/>
      <polyline points="28,66 44,82 74,50"
        fill="none" stroke="white" strokeWidth={9}
        strokeLinecap="round" strokeLinejoin="round"/>
      {/* Sparkle accents */}
      <path d="M80 10 L81.8 17 L89 19 L81.8 21 L80 28 L78.2 21 L71 19 L78.2 17 Z" fill={VIOLET}/>
      <path d="M89 4  L90.2 9  L95 10.5 L90.2 12 L89 17 L87.8 12 L83 10.5 L87.8 9 Z"
        fill={CYAN} opacity={0.85}/>
    </svg>
  );
};

// ── Sparkle star icon ─────────────────────────────────────────────────────────
const Spark: React.FC<{ size?: number; op?: number; color?: string }> = ({
  size = 13, op = 1, color = CYAN,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: op, flexShrink: 0 }}>
    <path d="M12 2 L13.4 9.6 L21 12 L13.4 14.4 L12 22 L10.6 14.4 L3 12 L10.6 9.6 Z"
      fill={color}/>
  </svg>
);

// ── Main Title component ──────────────────────────────────────────────────────
interface TitleProps {
  subtitle?: string;
}

export const Title: React.FC<TitleProps> = ({
  subtitle = 'AI Tools & Automation for Businesses',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const logoSpring  = spring({ frame, fps, config: { damping: 13, stiffness: 120, mass: 0.8 }, delay: 0 });
  const word1Spring = spring({ frame, fps, config: { damping: 16, stiffness: 140 }, delay: 4 });
  const word2Spring = spring({ frame, fps, config: { damping: 16, stiffness: 140 }, delay: 8 });

  const w1Y  = interpolate(word1Spring, [0, 1], [-45, 0]);
  const w1Op = interpolate(word1Spring, [0, 1], [0, 1]);
  const w2Y  = interpolate(word2Spring, [0, 1], [-45, 0]);
  const w2Op = interpolate(word2Spring, [0, 1], [0, 1]);

  const subOp = interpolate(frame, [16, 28], [0, 1], { extrapolateRight: 'clamp' });
  const subY  = interpolate(frame, [16, 28], [14, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const lineW = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 85 }, delay: 11 }),
    [0, 1], [0, 150],
  );

  // Breathing glow — 2 cycles per 10s
  const glow  = 0.5 + 0.5 * Math.sin(t * (Math.PI * 2 * 2) / 10);
  const spark = 0.4 + 0.6 * Math.abs(Math.sin(t * (Math.PI * 2) / 10));
  const aiGlow = `drop-shadow(0 0 ${8 + glow * 14}px rgba(0,220,255,${0.55 + glow * 0.35}))`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>

      {/* Logo + wordmark row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <DropTicksLogo progress={logoSpring}/>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, lineHeight: 1 }}>
          {/* "DropTicks" */}
          <span style={{
            transform: `translateY(${w1Y}px)`, opacity: w1Op, display: 'inline-block',
            fontSize: 62, fontWeight: 900,
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            color: '#FFFFFF', letterSpacing: -1.5,
            textShadow: '0 2px 24px rgba(0,0,0,0.55), 0 0 40px rgba(0,100,255,0.20)',
          }}>
            DropTicks
          </span>
          {/* "AI" — vivid cyan breathing glow */}
          <span style={{
            transform: `translateY(${w2Y}px)`, opacity: w2Op, display: 'inline-block',
            fontSize: 62, fontWeight: 900,
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            background: `linear-gradient(135deg, ${CYAN} 0%, ${BLUE} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: -1.5,
            filter: aiGlow,
          }}>
            AI
          </span>
        </div>
      </div>

      {/* Accent underline shimmer */}
      <div style={{
        width: lineW, height: 4, borderRadius: 2,
        background: `linear-gradient(90deg, ${VIOLET} 0%, ${BLUE} 35%, ${CYAN} 65%, ${TEAL} 100%)`,
        boxShadow: `0 0 ${14 + glow * 10}px rgba(0,220,255,${0.65 + glow * 0.25})`,
      }}/>

      {/* Subtitle */}
      <div style={{ transform: `translateY(${subY}px)`, opacity: subOp,
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <Spark size={13} op={spark * 0.75} color={CYAN}/>
        <p style={{
          margin: 0, fontSize: 22, fontWeight: 500,
          fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          color: 'rgba(255,255,255,0.70)', letterSpacing: 0.2, textAlign: 'center',
        }}>
          {subtitle}
        </p>
        <Spark size={13} op={spark * 0.55} color={VIOLET}/>
      </div>
    </div>
  );
};
