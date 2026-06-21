import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

interface TitleProps {
  subtitle?: string;
}

// ─── DropTicks drop+checkmark logo — compact version ─────────────────────────
const DropTicksLogo: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = interpolate(progress, [0, 1], [0.3, 1], { extrapolateRight: "clamp" });
  const op    = interpolate(progress, [0, 0.5], [0, 1],  { extrapolateRight: "clamp" });
  return (
    <svg width={58} height={64} viewBox="0 0 100 110"
      style={{ transform: `scale(${scale})`, opacity: op, display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id="dp-g" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%"   stopColor="#2979FF" />
          <stop offset="50%"  stopColor="#00B4FF" />
          <stop offset="100%" stopColor="#00D4C8" />
        </linearGradient>
        <linearGradient id="dp-s" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#7C4DFF" />
          <stop offset="100%" stopColor="#2979FF" />
        </linearGradient>
      </defs>
      <path d="M50 5 C50 5 15 45 15 68 C15 87 31 100 50 100 C69 100 85 87 85 68 C85 45 50 5 50 5 Z"
        fill="url(#dp-g)" />
      <path d="M50 100 C31 100 15 87 15 68 C15 55 22 44 33 37 Z"
        fill="url(#dp-s)" opacity={0.7} />
      <ellipse cx={38} cy={42} rx={7} ry={13} fill="rgba(255,255,255,0.22)"
        transform="rotate(-20,38,42)" />
      <polyline points="28,66 44,82 74,50"
        fill="none" stroke="white" strokeWidth={9}
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 10 L81.8 17 L89 19 L81.8 21 L80 28 L78.2 21 L71 19 L78.2 17 Z" fill="#7C4DFF" />
      <path d="M89 4  L90.2 9  L95 10.5 L90.2 12 L89 17 L87.8 12 L83 10.5 L87.8 9 Z"
        fill="#00D4FF" opacity={0.8} />
    </svg>
  );
};

// ─── Sparkle icon ─────────────────────────────────────────────────────────────
const Spark: React.FC<{ size?: number; op?: number }> = ({ size = 13, op = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity: op, flexShrink: 0 }}>
    <path d="M12 2 L13.4 9.6 L21 12 L13.4 14.4 L12 22 L10.6 14.4 L3 12 L10.6 9.6 Z"
      fill="#00D4FF" />
  </svg>
);

// ─── Main Title ───────────────────────────────────────────────────────────────
export const Title: React.FC<TitleProps> = ({
  subtitle = "AI Tools & Automation for Businesses",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring  = spring({ frame, fps, config: { damping: 14, stiffness: 110, mass: 0.8 }, delay: 0 });
  const word1Spring = spring({ frame, fps, config: { damping: 18, stiffness: 130 }, delay: 5 });
  const word2Spring = spring({ frame, fps, config: { damping: 18, stiffness: 130 }, delay: 9 });

  const w1Y  = interpolate(word1Spring, [0, 1], [-40, 0]);
  const w1Op = interpolate(word1Spring, [0, 1], [0, 1]);
  const w2Y  = interpolate(word2Spring, [0, 1], [-40, 0]);
  const w2Op = interpolate(word2Spring, [0, 1], [0, 1]);

  const subOp = interpolate(frame, [18, 30], [0, 1], { extrapolateRight: "clamp" });
  const subY  = interpolate(frame, [18, 30], [12, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const lineW = interpolate(
    spring({ frame, fps, config: { damping: 22, stiffness: 80 }, delay: 12 }),
    [0, 1], [0, 140]
  );

  const sparkOp = 0.45 + 0.45 * Math.sin((frame / fps) * Math.PI * 1.4);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>

      {/* Logo + wordmark row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <DropTicksLogo progress={logoSpring} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1 }}>
          {/* "DropTicks" */}
          <span style={{
            transform: `translateY(${w1Y}px)`, opacity: w1Op, display: "inline-block",
            fontSize: 60, fontWeight: 900,
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            color: "#FFFFFF", letterSpacing: -1.5,
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}>
            DropTicks
          </span>
          {/* "AI" cyan */}
          <span style={{
            transform: `translateY(${w2Y}px)`, opacity: w2Op, display: "inline-block",
            fontSize: 60, fontWeight: 900,
            fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
            background: "linear-gradient(135deg, #00D4FF 0%, #2979FF 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: -1.5,
            filter: "drop-shadow(0 0 14px rgba(0,212,255,0.55))",
          }}>
            AI
          </span>
        </div>
      </div>

      {/* Accent underline */}
      <div style={{
        width: lineW, height: 3.5, borderRadius: 2,
        background: "linear-gradient(90deg, #2979FF 0%, #00D4FF 100%)",
        boxShadow: "0 0 14px rgba(0,212,255,0.65)",
      }} />

      {/* Subtitle */}
      <div style={{ transform: `translateY(${subY}px)`, opacity: subOp,
        display: "flex", alignItems: "center", gap: 8 }}>
        <Spark size={12} op={sparkOp * 0.7} />
        <p style={{
          margin: 0, fontSize: 22, fontWeight: 500,
          fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "rgba(255,255,255,0.68)", letterSpacing: 0.2, textAlign: "center",
        }}>
          {subtitle}
        </p>
        <Spark size={12} op={sparkOp * 0.5} />
      </div>
    </div>
  );
};
