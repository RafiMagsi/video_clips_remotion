import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
} from 'remotion';
import { fade, fadeOut, sp, blurFade } from '../../common/utils';
import { PastelBackground } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Scene2_ClaudeUnderstands — "Claude reads. Claude watches. Same time."
//  Local frames 0–299  (10 s @ 30 fps), used inside a <Sequence>
//
//  Layout (PastelBackground — same as Scene 1):
//  ┌─────────────────────────────────────────────────────────────────────────┐
//  │                                                                         │
//  │  Claude reads. Claude     ← 84px bold black, blur-in + slide           │
//  │  watches.                 ← 84px bold ORANGE                           │
//  │  Same time.               ← 84px bold black                            │
//  │                                                                         │
//  │  ┌────────────────────────────────────────────────────────────────────┐ │
//  │  │    [full-width scrolling film frames, dark cinematic card]        │ │
//  │  │  ◀──────────── right to left ─────────────────────────           │ │
//  │  └────────────────────────────────────────────────────────────────────┘ │
//  │                                                                         │
//  │                    ┌───────────────────────┐                            │
//  │                    │      Claude ✳ icon     │  ← centered, slides up   │
//  │                    └───────────────────────┘                            │
//  │                                                                         │
//  │  ┌────────────────────────────────────────────────────────────────────┐ │
//  │  │  ● CLAUDE SEES             [00:58]                                │ │
//  │  │  ─────────────────────────────────────────────                    │ │
//  │  │  | [00:58] Title card: 'How it works'.                           │ │
//  │  └────────────────────────────────────────────────────────────────────┘ │
//  │                                                                         │
//  │  ◄══[00:14]══[00:27]══[00:42]══[00:58]══[01:14]══ scrolling ticker ══► │
//  └─────────────────────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

// ── Design tokens ──────────────────────────────────────────────────────────────
const ORANGE = '#FF6B2B';
const GREEN  = '#22C55E';
const BLACK  = '#0A0A0A';

// ── Font body alias (FONT_HEAD and FONT_MONO imported from common/fonts) ──────
// ── Claude icon size in Scene2 (mini — centered below the film card) ──────────
const MINI_SIZE = 190;

// ── Film card — full width, centered, at top of content ──────────────────────
const VX = 52, VY = 680, VW = 976, VH = 292;

// ── Claude circle — centered, below film card ─────────────────────────────────
const CCX = 540, CCY = 1108, CCR = 112;

// ── Code output card — below Claude circle ────────────────────────────────────
const CX = 52, CY = 1272, CW = 976, CH = 134;
const CLAUDE_SEES_TEXT = "[00:58] Title card: 'How it works'.";

// ── Timestamp ticker ──────────────────────────────────────────────────────────
const TIMESTAMPS = ['00:14', '00:27', '00:42', '00:58', '01:14', '01:28', '01:42'] as const;
const ACTIVE_TS  = 3; // '00:58' is highlighted
const TS_Y = 1450, TS_H = 64;

// ── Film frame colors (vivid, cinematic) ──────────────────────────────────────
const FRAME_COLS = [
  '#7C3AED', '#2563EB', '#059669', '#DC2626',
  '#D97706', '#9333EA', '#DB2777', '#0891B2',
] as const;

// ─────────────────────────────────────────────────────────────────────────────

export const Scene2_ClaudeUnderstands: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;

  const sceneIn  = fade(frame, 0, 18);
  const sceneOut = fadeOut(frame, 282, 299);
  const sceneOp  = sceneIn * sceneOut;

  // ── Headline springs (staggered blur-in + slide) ────────────────────────────
  const l1Sp = sp(frame, fps, 8,  { stiffness: 85, damping: 16 });
  const l2Sp = sp(frame, fps, 17, { stiffness: 85, damping: 16 });
  const l3Sp = sp(frame, fps, 26, { stiffness: 85, damping: 16 });
  const lineY  = (s: number) => interpolate(s, [0, 1], [32, 0]);
  const lineOp = (s: number) => interpolate(s, [0, 0.22], [0, 1]);

  // ── Film card entrance — drops in from above ────────────────────────────────
  const vidSp     = sp(frame, fps, 32, { stiffness: 76, damping: 15 });
  const vidOp     = interpolate(vidSp, [0, 0.2], [0, 1]);
  const vidSlideY = interpolate(vidSp, [0, 1], [-(VH + 30), 0]);

  // ── Claude circle entrance — rises from below ───────────────────────────────
  const clSp     = sp(frame, fps, 56, { stiffness: 80, damping: 16 });
  const clOp     = interpolate(clSp, [0, 0.2], [0, 1]);
  const clSlideY = interpolate(clSp, [0, 1], [70, 0]);

  // ── Claude icon slow rotation (6 deg/s) ─────────────────────────────────────
  const rot = (t * 6) % 360;

  // ── Code card entrance — fades + slides up ──────────────────────────────────
  const codeSp = sp(frame, fps, 74, { stiffness: 70, damping: 16 });
  const codeOp = interpolate(codeSp, [0, 0.22], [0, 1]);
  const codeSlY = interpolate(codeSp, [0, 1], [28, 0]);

  // ── Film frame scroll (right → left, seamless loop) ─────────────────────────
  const frameUnitW  = (VW - 6) / FRAME_COLS.length;       // ~121px each
  const frameTotalW = FRAME_COLS.length * frameUnitW;      // one full set width
  const filmScrollRaw = Math.max(0, (frame - 32) / fps * 72);
  const filmScroll    = filmScrollRaw % frameTotalW;

  // ── Timestamp ticker (right → left, seamless loop) ──────────────────────────
  const CHIP_W   = 164;
  const CHIP_GAP = 14;
  const CHIP_UNIT    = CHIP_W + CHIP_GAP;
  const chipsTotalW  = TIMESTAMPS.length * CHIP_UNIT;
  const tickerScrollRaw = Math.max(0, (frame - 80) / fps * 72);
  const tickerScroll    = tickerScrollRaw % chipsTotalW;
  const tickerOp        = fade(frame, 66, 84);

  return (
    <AbsoluteFill style={{ opacity: sceneOp, overflow: 'hidden' }}>

      {/* ── Same pastel background as Scene 1 ─────────────────────────────── */}
      <PastelBackground />

      {/* ── SVG layer ──────────────────────────────────────────────────────── */}
      <svg
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          {/* Film card: gradient border (purple → pink → indigo) */}
          <linearGradient id="s2-vid-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#C084FC"/>
            <stop offset="45%"  stopColor="#F472B6"/>
            <stop offset="100%" stopColor="#818CF8"/>
          </linearGradient>

          {/* Film card: dark background fill */}
          <linearGradient id="s2-vid-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1E1B4B"/>
            <stop offset="100%" stopColor="#0D0B2A"/>
          </linearGradient>

          {/* Film edge fade — blends scrolling frames into dark background */}
          <linearGradient id="s2-film-fade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#130B2E" stopOpacity="0.97"/>
            <stop offset="11%"  stopColor="#130B2E" stopOpacity="0"/>
            <stop offset="89%"  stopColor="#130B2E" stopOpacity="0"/>
            <stop offset="100%" stopColor="#130B2E" stopOpacity="0.97"/>
          </linearGradient>

          {/* Clip: film frames inside card */}
          <clipPath id="s2-vid-clip">
            <rect x={VX + 3} y={VY + 3} width={VW - 6} height={VH - 6} rx={16}/>
          </clipPath>

          {/* Ticker edge mask */}
          <linearGradient id="s2-ticker-mask-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="white" stopOpacity="0"/>
            <stop offset="7%"  stopColor="white" stopOpacity="1"/>
            <stop offset="93%" stopColor="white" stopOpacity="1"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <mask id="s2-ticker-mask">
            <rect x={52} y={TS_Y - 10} width={976} height={TS_H + 20}
              fill="url(#s2-ticker-mask-grad)"/>
          </mask>
        </defs>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* FILM CARD — full width, drops from above                           */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <g opacity={vidOp} transform={`translate(0, ${vidSlideY})`}>

          {/* Ambient glow behind card */}
          <rect x={VX - 24} y={VY - 18} width={VW + 48} height={VH + 36} rx={34}
            fill="#7C3AED" opacity={0.09}/>

          {/* Gradient border ring */}
          <rect x={VX - 2} y={VY - 2} width={VW + 4} height={VH + 4} rx={22}
            fill="url(#s2-vid-border)" opacity={0.82}/>

          {/* Dark card background */}
          <rect x={VX} y={VY} width={VW} height={VH} rx={20}
            fill="url(#s2-vid-fill)"/>

          {/* Scrolling film frames — clipped inside card */}
          <g clipPath="url(#s2-vid-clip)">
            {[...FRAME_COLS, ...FRAME_COLS].map((col, fi) => {
              const fx  = VX + 3 + fi * frameUnitW - filmScroll;
              const fw  = frameUnitW - 5;
              const mid = VY + VH / 2;
              return (
                <g key={fi}>
                  {/* Main color block */}
                  <rect x={fx} y={VY + 26} width={fw} height={VH - 52} fill={col} rx={6}/>

                  {/* Inner highlight — subtle top edge */}
                  <rect x={fx} y={VY + 26} width={fw} height={16} rx={6}
                    fill="rgba(255,255,255,0.10)"/>

                  {/* Sprocket holes — top strip */}
                  <circle cx={fx + fw * 0.28} cy={VY + 13} r={7.5}
                    fill="rgba(255,255,255,0.10)"/>
                  <circle cx={fx + fw * 0.72} cy={VY + 13} r={7.5}
                    fill="rgba(255,255,255,0.10)"/>

                  {/* Sprocket holes — bottom strip */}
                  <circle cx={fx + fw * 0.28} cy={VY + VH - 13} r={7.5}
                    fill="rgba(255,255,255,0.10)"/>
                  <circle cx={fx + fw * 0.72} cy={VY + VH - 13} r={7.5}
                    fill="rgba(255,255,255,0.10)"/>

                  {/* Play button triangle */}
                  <polygon
                    points={`
                      ${fx + fw / 2 - 11},${mid - 14}
                      ${fx + fw / 2 + 14},${mid}
                      ${fx + fw / 2 - 11},${mid + 14}
                    `}
                    fill="rgba(255,255,255,0.32)"/>
                </g>
              );
            })}

            {/* Edge fade overlay — must be last so it renders on top */}
            <rect x={VX} y={VY} width={VW} height={VH}
              fill="url(#s2-film-fade)"/>
          </g>

          {/* Bottom label bar */}
          <rect x={VX + 14} y={VY + VH - 50} width={VW - 28} height={36} rx={10}
            fill="rgba(0,0,0,0.58)"/>
          <text x={VX + 28} y={VY + VH - 27}
            fill="rgba(255,255,255,0.72)" fontSize={14} fontWeight="700"
            fontFamily={FONT_MONO} letterSpacing="1.6">
            FRAME-BY-FRAME ANALYSIS
          </text>
        </g>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* CLAUDE CIRCLE — centered, rises from below                         */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <g opacity={clOp} transform={`translate(0, ${clSlideY})`}>

          {/* Soft orange halo glow */}
          <circle cx={CCX} cy={CCY} r={CCR + 30} fill={ORANGE} opacity={0.06}/>
          <circle cx={CCX} cy={CCY} r={CCR + 14} fill={ORANGE} opacity={0.05}/>

          {/* Claude icon rendered as HTML below — SVG arms removed */}

          {/* CLAUDE label below circle */}
          <text x={CCX} y={CCY + CCR + 42}
            fill="rgba(0,0,0,0.36)" fontSize={18} fontWeight="700"
            textAnchor="middle" letterSpacing="6"
            fontFamily={FONT_HEAD}>
            CLAUDE
          </text>
        </g>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* CODE OUTPUT CARD — fades + slides up                               */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <g opacity={codeOp} transform={`translate(0, ${codeSlY})`}>

          {/* Card background */}
          <rect x={CX} y={CY} width={CW} height={CH} rx={22}
            fill="rgba(255,255,255,0.92)"
            stroke="rgba(0,0,0,0.07)" strokeWidth={1.5}/>

          {/* ── Header row: green dot + CLAUDE SEES + timestamp chip ── */}
          <circle cx={CX + 28} cy={CY + 34} r={6} fill={GREEN}/>
          <text x={CX + 44} y={CY + 39}
            fill={GREEN} fontSize={14} fontWeight="700" letterSpacing="2"
            fontFamily={FONT_MONO}>
            CLAUDE SEES
          </text>

          {/* Timestamp chip — right side of header */}
          <rect x={CX + CW - 104} y={CY + 17} width={86} height={30} rx={15}
            fill={`${ORANGE}20`} stroke={ORANGE} strokeWidth={1.4}/>
          <text x={CX + CW - 61} y={CY + 37}
            fill={ORANGE} fontSize={14} fontWeight="700"
            textAnchor="middle" fontFamily={FONT_MONO}>
            00:58
          </text>

          {/* Divider */}
          <line x1={CX + 16} y1={CY + 56} x2={CX + CW - 16} y2={CY + 56}
            stroke="rgba(0,0,0,0.07)" strokeWidth={1}/>

          {/* Orange left accent bar */}
          <rect x={CX + 20} y={CY + 68} width={3.5} height={CH - 84} rx={2}
            fill={ORANGE} opacity={0.88}/>

          {/* Main content text */}
          <text x={CX + 36} y={CY + 100}
            fill={BLACK} fontSize={26} fontWeight="500"
            fontFamily={FONT_HEAD}>
            {CLAUDE_SEES_TEXT}
          </text>
        </g>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TIMESTAMP TICKER — scrolls right → left with edge fade             */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <g opacity={tickerOp} mask="url(#s2-ticker-mask)">
          {[...TIMESTAMPS, ...TIMESTAMPS].map((ts, i) => {
            const chipX   = 52 + i * CHIP_UNIT - tickerScroll;
            const isActive = i % TIMESTAMPS.length === ACTIVE_TS;
            return (
              <g key={`chip-${i}`}>
                <rect x={chipX} y={TS_Y} width={CHIP_W} height={TS_H}
                  rx={TS_H / 2}
                  fill={isActive ? `${ORANGE}20` : 'rgba(255,255,255,0.82)'}
                  stroke={isActive ? ORANGE : 'rgba(0,0,0,0.10)'}
                  strokeWidth={isActive ? 2 : 1.2}/>
                <text
                  x={chipX + CHIP_W / 2} y={TS_Y + TS_H / 2 + 9}
                  fill={isActive ? ORANGE : 'rgba(0,0,0,0.46)'}
                  fontSize={23} fontWeight={isActive ? 800 : 600}
                  textAnchor="middle"
                  fontFamily={FONT_MONO}>
                  {ts}
                </text>
              </g>
            );
          })}
        </g>

      </svg>

      {/* ── Claude icon — PNG, centered at CCX/CCY, rotates + slides up ─────── */}
      {/*   mix-blend-mode: multiply removes the white PNG background           */}
      <div style={{
        position: 'absolute',
        left:   CCX - MINI_SIZE / 2,
        top:    CCY - MINI_SIZE / 2,
        width:  MINI_SIZE,
        height: MINI_SIZE,
        opacity:   clOp,
        transform: `translateY(${clSlideY}px) rotate(${rot}deg)`,
        transformOrigin: '50% 50%',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}>
        <Img
          src={staticFile('claude-icon.png')}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* ── HTML headlines (blur-in + slide, left-aligned) ─────────────────── */}

      {/* Line 1: "Claude reads. Claude" */}
      <div style={{
        position: 'absolute', top: 384, left: 52, right: 52,
        opacity: lineOp(l1Sp),
        transform: `translateY(${lineY(l1Sp)}px)`,
        filter: blurFade(l1Sp, 10),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 84, fontWeight: 900, color: BLACK, lineHeight: 1.04,
          fontFamily: FONT_HEAD, letterSpacing: '-2.2px', display: 'block',
        }}>
          Claude reads. Claude
        </span>
      </div>

      {/* Line 2: "watches." in ORANGE */}
      <div style={{
        position: 'absolute', top: 472, left: 52, right: 52,
        opacity: lineOp(l2Sp),
        transform: `translateY(${lineY(l2Sp)}px)`,
        filter: blurFade(l2Sp, 10),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 84, fontWeight: 900, color: ORANGE, lineHeight: 1.04,
          fontFamily: FONT_HEAD, letterSpacing: '-2.2px', display: 'block',
        }}>
          watches.
        </span>
      </div>

      {/* Line 3: "Same time." in black */}
      <div style={{
        position: 'absolute', top: 560, left: 52, right: 52,
        opacity: lineOp(l3Sp),
        transform: `translateY(${lineY(l3Sp)}px)`,
        filter: blurFade(l3Sp, 10),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 84, fontWeight: 900, color: BLACK, lineHeight: 1.04,
          fontFamily: FONT_HEAD, letterSpacing: '-2.2px', display: 'block',
        }}>
          Same time.
        </span>
      </div>

    </AbsoluteFill>
  );
};
