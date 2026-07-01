import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Slide 7 — The Solution: Build Systems. Not Features.
//  Visual: 6-node connected network graph — nodes appear, edges draw in
//          Metric counter animates up as the system connects
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';
const GREEN  = '#10B981';
const INDIGO = '#6366F1';

// Node positions relative to SVG viewBox 756×340
const NODES = [
  { id: 'app',   x: 378, y:  46, label: 'Mobile App',  color: INDIGO,  delay: 52 },
  { id: 'web',   x: 168, y: 148, label: 'Web Platform', color: '#8B5CF6', delay: 66 },
  { id: 'ai',    x: 588, y: 148, label: 'AI Agents',   color: ORANGE,  delay: 80 },
  { id: 'auto',  x:  96, y: 272, label: 'Automation',  color: '#F59E0B', delay: 94 },
  { id: 'dash',  x: 378, y: 316, label: 'Analytics',   color: GREEN,   delay: 108 },
  { id: 'crm',   x: 660, y: 272, label: 'CRM',         color: '#EC4899', delay: 122 },
];

// Edges: pairs of node indices
const EDGES: [number, number, number][] = [
  [0, 1, 68], [0, 2, 82], [1, 3, 96], [2, 5, 110],
  [3, 4, 124], [4, 5, 138], [0, 4, 152], [1, 2, 166],
];

const NetworkGraph: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Compute sp for each edge
  const edgeProgress = EDGES.map(([, , delay]) =>
    sp(frame, fps, delay, { stiffness: 55, damping: 15 }),
  );
  const nodeProgress = NODES.map(node =>
    sp(frame, fps, node.delay, { stiffness: 60, damping: 14 }),
  );

  return (
    <svg width="756" height="350" viewBox="0 0 756 350" fill="none" style={{ display: 'block' }}>
      {/* Draw edges */}
      {EDGES.map(([a, b], i) => {
        const na = NODES[a], nb = NODES[b];
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const prog = Math.min(1, edgeProgress[i]);
        const drawnLen = prog * len;

        return (
          <g key={i}>
            {/* Background line */}
            <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="rgba(0,0,0,0.06)" strokeWidth="2"/>
            {/* Animated drawn line */}
            <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={`url(#sm7-edge-${i})`} strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${drawnLen} ${len}`}
              opacity={prog}
            />
            {/* Data flow pulse (small moving dot) */}
            {prog > 0.8 && (
              <circle r="4" fill={NODES[a].color}
                opacity={0.7 * Math.sin((frame - EDGES[i][2]) * 0.15 + i) * 0.5 + 0.5}>
                <animateMotion dur="2s" repeatCount="indefinite"
                  path={`M${na.x},${na.y} L${nb.x},${nb.y}`}/>
              </circle>
            )}
            <defs>
              <linearGradient id={`sm7-edge-${i}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={NODES[a].color}/>
                <stop offset="100%" stopColor={NODES[b].color}/>
              </linearGradient>
            </defs>
          </g>
        );
      })}

      {/* Draw nodes */}
      {NODES.map((node, i) => {
        const p = nodeProgress[i];
        const scale = interpolate(p, [0, 1], [0, 1]);
        const op    = interpolate(p, [0, 0.25], [0, 1]);
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} opacity={op}>
            <g transform={`scale(${scale})`}>
              {/* Glow ring */}
              <circle r="36" fill={node.color} fillOpacity="0.10"/>
              {/* Main circle */}
              <circle r="28" fill="white" stroke={node.color} strokeWidth="2.5"
                filter={`drop-shadow(0 4px 12px ${node.color}40)`}/>
              {/* Label inside */}
              <text textAnchor="middle" y="5" fontSize="11" fontWeight="800"
                fill={node.color} fontFamily="sans-serif">
                {node.label.split(' ')[0]}
              </text>
              {node.label.includes(' ') && (
                <text textAnchor="middle" y="19" fontSize="10" fontWeight="600"
                  fill={node.color} fontFamily="sans-serif" opacity="0.75">
                  {node.label.split(' ')[1]}
                </text>
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
};

export const Slide7_Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  const h1Sp   = sp(frame, fps,  6, { stiffness: 68, damping: 14 });
  const h2Sp   = sp(frame, fps, 18, { stiffness: 68, damping: 14 });
  const divSp  = sp(frame, fps, 30, { stiffness: 70, damping: 16 });
  const subSp  = sp(frame, fps, 38, { stiffness: 62, damping: 14 });
  const graphSp= sp(frame, fps, 50, { stiffness: 50, damping: 14 });

  // Rising metric counter
  const metricCount = Math.round(interpolate(frame, [160, 270], [0, 2847], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  const metricSp = sp(frame, fps, 155, { stiffness: 50, damping: 15 });

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── "BUILD SYSTEMS." ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 192, left: SAFE_H,
        opacity: interpolate(h1Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h1Sp, [0, 1], [32, 0])}px)`,
        filter: blurFade(h1Sp, 14),
      }}>
        <span style={{ fontSize: 96, fontWeight: 900, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-3.5px', lineHeight: 1 }}>
          BUILD SYSTEMS.
        </span>
      </div>

      {/* ── "NOT FEATURES." ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 296, left: SAFE_H,
        opacity: interpolate(h2Sp, [0, 0.25], [0, 1]),
        transform: `translateY(${interpolate(h2Sp, [0, 1], [26, 0])}px)`,
        filter: blurFade(h2Sp, 12),
      }}>
        <span style={{
          fontSize: 96, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '-3.5px', lineHeight: 1,
          background: `linear-gradient(135deg, ${ORANGE} 0%, #FFB040 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>
          NOT FEATURES.
        </span>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 422, left: SAFE_H, right: SAFE_H,
        height: 2, borderRadius: 1,
        background: `linear-gradient(90deg, ${ORANGE}, rgba(255,107,43,0.08))`,
        opacity: interpolate(divSp, [0, 0.5], [0, 1]),
        transform: `scaleX(${interpolate(divSp, [0, 1], [0, 1])})`,
        transformOrigin: 'left center',
      }}/>

      {/* ── Subtext ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 448, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(subSp, [0, 0.28], [0, 1]),
        transform: `translateY(${interpolate(subSp, [0, 1], [18, 0])}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 40, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(10,10,10,0.52)', lineHeight: 1.55 }}>
          The best startups build for{' '}
          <span style={{ fontWeight: 800, color: GREEN }}>growth</span>,{' '}
          <span style={{ fontWeight: 800, color: ORANGE }}>automation</span>,
          {' '}and{' '}
          <span style={{ fontWeight: 800, color: INDIGO }}>scale</span>.
        </span>
      </div>

      {/* ── Network graph ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 590, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(graphSp, [0, 0.30], [0, 1]),
        filter: blurFade(graphSp, 6),
      }}>
        <NetworkGraph frame={frame} fps={fps} />
      </div>

      {/* ── Rising metrics ───────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 968, left: SAFE_H, right: SAFE_H,
        display: 'flex', gap: 12,
        opacity: interpolate(metricSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(metricSp, [0, 1], [20, 0])}px)`,
      }}>
        {[
          { label: 'Actions automated', value: metricCount.toLocaleString(), color: GREEN },
          { label: 'Revenue impact',    value: `+$${Math.round(metricCount * 4.2).toLocaleString()}`, color: ORANGE },
          { label: 'Hours freed / mo',  value: `${Math.round(metricCount * 0.04)}`, color: INDIGO },
        ].map((m, i) => (
          <div key={i} style={{
            flex: 1, background: 'rgba(255,255,255,0.86)', borderRadius: 16,
            padding: '14px 14px', textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            border: `1.5px solid ${m.color}22`,
          }}>
            <div style={{ fontSize: 11, fontFamily: FONT_MONO, color: 'rgba(0,0,0,0.38)', letterSpacing: '0.8px', marginBottom: 4 }}>
              {m.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, fontFamily: FONT_HEAD, color: m.color, lineHeight: 1 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

    </SceneCanvas>
  );
};
