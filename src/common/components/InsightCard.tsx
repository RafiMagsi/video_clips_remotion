import React from 'react';
import { WHITE } from '../colors';
import { rng } from '../utils';
import { GlassPanel } from './GlassPanel';
import { ProgressBar } from './ProgressBar';

// ─────────────────────────────────────────────────────────────────────────────
//  InsightCard — AI insight card with icon, label, progress bar, sparklines
//
//  Composes GlassPanel + ProgressBar.  Renders inside an SVG parent.
//  Requires <SharedSVGDefs/> in the SVG for the glow filter.
//
//  Usage:
//    const entrance     = sp(frame, fps, card.delay);
//    const barProgress  = fade(frame, card.delay+12, card.delay+28);
//    const sparkProgress = fade(frame, card.delay+18, card.delay+32);
//    const side = card.x < W/2 ? -1 : 1;
//
//    <InsightCard
//      x={card.x} y={card.y}
//      label={card.label} icon={card.icon} color={card.color}
//      progressValue={card.val}
//      entrance={entrance}
//      barProgress={barProgress}
//      sparklineProgress={sparkProgress}
//      offsetX={(1 - entrance) * side * 90}
//      seed={cardIndex}
//    />
//
//  To change for different results:
//    • width/height     — default 332×130 matches ClaudeReadsFrames layout
//    • progressValue    — 0-100, the number shown and bar target
//    • icon             — any string/emoji rendered in the icon circle
//    • offsetX          — drive slide-in by passing (1-entrance)*±90
// ─────────────────────────────────────────────────────────────────────────────

export interface InsightCardProps {
  x:                number;
  y:                number;
  width?:           number;   // card width  (default 332)
  height?:          number;   // card height (default 130)
  label:            string;   // main label text
  icon?:            string;   // emoji / text shown in icon circle
  color:            string;   // accent color (border, bar, text)
  progressValue:    number;   // 0-100  target percentage
  entrance:         number;   // 0-1 spring entrance → opacity + scale
  barProgress:      number;   // 0-1 how far the bar fills to progressValue
  sparklineProgress: number;  // 0-1 sparkline bar opacity
  offsetX?:         number;   // X translation for slide-in (default 0)
  seed?:            number;   // seed for sparkline determinism (default 0)
  glowFilterId?:    string;   // SVG filter ID (default 'glow-md')
}

export const InsightCard: React.FC<InsightCardProps> = ({
  x, y,
  width:  W       = 332,
  height: H       = 130,
  label, icon     = '●',
  color,
  progressValue,
  entrance,
  barProgress,
  sparklineProgress,
  offsetX         = 0,
  seed            = 0,
  glowFilterId    = 'glow-md',
}) => {
  if (entrance < 0.01) return null;

  const barW = barProgress * (W - 70) * (progressValue / 100);

  return (
    <g opacity={entrance} transform={`translate(${offsetX}, 0)`}>
      <GlassPanel
        x={x} y={y} width={W} height={H} radius={13}
        borderColor={color}
        glowFilterId={glowFilterId}
        glowOpacity={0.04}
        glowPadding={3}>

        {/* Top color accent bar */}
        <rect x={x} y={y} width={W} height={3} rx={1.5}
          fill={color} opacity={0.9}/>

        {/* Icon circle */}
        <circle cx={x + 26} cy={y + 42} r={18}
          fill={`${color}20`}/>
        <text x={x + 16} y={y + 51}
          fontSize={20} fill={color}
          fontFamily="system-ui, -apple-system, sans-serif">
          {icon}
        </text>

        {/* Label */}
        <text x={x + 54} y={y + 34}
          fill={WHITE} fontSize={20} fontWeight="700"
          fontFamily="system-ui, -apple-system, 'SF Pro Text', sans-serif">
          {label}
        </text>

        {/* Progress bar */}
        <ProgressBar
          x={x + 54} y={y + 54}
          width={W - 70} height={6} radius={3}
          progress={barProgress * (progressValue / 100)}
          color={color}
          showDot={false}
        />

        {/* Percentage value */}
        <text x={x + W - 10} y={y + 102}
          fill={color} fontSize={28} fontWeight="800"
          textAnchor="end"
          fontFamily="system-ui, -apple-system, 'SF Pro Display', sans-serif">
          {progressValue}%
        </text>

        {/* Sparkline bars */}
        {Array.from({ length: 8 }, (_, bi) => {
          const bh = 12 + rng(seed * 20 + bi) * 24;
          return (
            <rect key={bi}
              x={x + 56 + bi * 18}
              y={y + H - 16 - bh}
              width={12}
              height={bh * sparklineProgress}
              rx={2}
              fill={color}
              opacity={0.22}
            />
          );
        })}

      </GlassPanel>
    </g>
  );
};
