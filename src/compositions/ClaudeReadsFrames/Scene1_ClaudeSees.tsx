import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Img,
  staticFile,
} from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { PastelBackground } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  Scene1_ClaudeSees — "Claude now watches video. Frame by frame."
//  Frames 0–299  (10 s @ 30 fps)
// ─────────────────────────────────────────────────────────────────────────────

const ORANGE = '#FF6B2B';
const BLACK  = '#0A0A0A';

// ── Claude icon size (px) ─────────────────────────────────────────────────────
// claude-icon.png is 640×640. Rendered at LOGO_SIZE on a 1080-wide canvas.
const LOGO_SIZE = 210;

// ── Logo Y position — starts at LOGO_CY_START, floats up to LOGO_CY_END ─────
const LOGO_CY_START = 530;
const LOGO_CY_END   = 450;

// ─────────────────────────────────────────────────────────────────────────────

export const Scene1_ClaudeSees: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W } = useVideoConfig();

  // ── Scene fade out ─────────────────────────────────────────────────────────
  const sceneOp = fadeOut(frame, 285, 299);

  // ── Logo spring ────────────────────────────────────────────────────────────
  const logoSp    = sp(frame, fps, 10, { stiffness: 88, damping: 16 });
  const logoScale = interpolate(logoSp, [0, 1], [0, 1]);

  // Continuous rotation: 6 deg/s
  const logoRot = (frame / fps) * 6;

  // Float upward as text fills in
  const logoCyOffset = interpolate(frame, [55, 180], [0, -(LOGO_CY_START - LOGO_CY_END)], {
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  });
  const logoCY = LOGO_CY_START + logoCyOffset;

  // ── Headline lines (staggered spring + blur fade) ──────────────────────────
  const l1Sp  = sp(frame, fps, 20, { stiffness: 82, damping: 16 });
  const l2Sp  = sp(frame, fps, 30, { stiffness: 82, damping: 16 });
  const l3aSp = sp(frame, fps, 40, { stiffness: 82, damping: 16 }); // "Frame"
  const l3bSp = sp(frame, fps, 46, { stiffness: 82, damping: 16 }); // "by"
  const l3cSp = sp(frame, fps, 52, { stiffness: 82, damping: 16 }); // "frame."

  const lineY  = (s: number) => interpolate(s, [0, 1], [32, 0]);
  const lineOp = (s: number) => interpolate(s, [0, 0.22], [0, 1]);

  // ── Subtitle ───────────────────────────────────────────────────────────────
  const sub1Sp = sp(frame, fps, 108, { stiffness: 60, damping: 14 });
  const sub2Sp = sp(frame, fps, 118, { stiffness: 60, damping: 14 });

  // ── Bottom pills ───────────────────────────────────────────────────────────
  const pillSp = sp(frame, fps, 248, { stiffness: 68, damping: 14 });
  const pillOp = interpolate(pillSp, [0, 0.25], [0, 1]);
  const pill1X = interpolate(pillSp, [0, 1], [-260, 0]);
  const pill2X = interpolate(pillSp, [0, 1], [260, 0]);

  // ── Shared headline style ──────────────────────────────────────────────────
  const headlineStyle: React.CSSProperties = {
    fontSize: 82,
    fontWeight: 900,
    lineHeight: 1.05,
    fontFamily: FONT_HEAD,
    letterSpacing: '-2px',
  };

  // ── Logo position (top-left corner of the image div) ──────────────────────
  const logoLeft = W / 2 - LOGO_SIZE / 2;
  const logoTop  = logoCY - LOGO_SIZE / 2;

  return (
    <AbsoluteFill style={{ opacity: sceneOp, overflow: 'hidden' }}>

      {/* ── Pastel background ─────────────────────────────────────────────── */}
      <PastelBackground />

      {/* ── Dynamic orange glow (SVG layer — stays below the icon) ───────── */}
      <svg
        width={W} height={1920}
        viewBox={`0 0 ${W} 1920`}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="s1-glow-blur" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="40"/>
          </filter>
        </defs>

        {/* Soft blurred orange cloud behind the rotating icon */}
        <g filter="url(#s1-glow-blur)" opacity={logoScale}>
          <circle cx={W / 2} cy={logoCY} r={240} fill="#FF9060" opacity={0.44}/>
          <circle cx={W / 2} cy={logoCY} r={170} fill="#FF7040" opacity={0.30}/>
        </g>
      </svg>

      {/* ── Claude icon — PNG with rotation + scale spring ───────────────── */}
      {/*   mix-blend-mode: multiply removes the white background of the PNG  */}
      <div style={{
        position: 'absolute',
        top:    logoTop,
        left:   logoLeft,
        width:  LOGO_SIZE,
        height: LOGO_SIZE,
        transform: `scale(${logoScale}) rotate(${logoRot}deg)`,
        transformOrigin: '50% 50%',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}>
        <Img
          src={staticFile('claude-icon.png')}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* ── Line 1: "Claude now" ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 632, left: 0, right: 0,
        textAlign: 'center',
        opacity: lineOp(l1Sp),
        transform:  `translateY(${lineY(l1Sp)}px)`,
        filter:     blurFade(l1Sp, 12),
        pointerEvents: 'none',
      }}>
        <span style={{ ...headlineStyle, color: BLACK }}>Claude now</span>
      </div>

      {/* ── Line 2: "watches video." ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 720, left: 0, right: 0,
        textAlign: 'center',
        opacity: lineOp(l2Sp),
        transform:  `translateY(${lineY(l2Sp)}px)`,
        filter:     blurFade(l2Sp, 12),
        pointerEvents: 'none',
      }}>
        <span style={{ ...headlineStyle, color: BLACK }}>watches video.</span>
      </div>

      {/* ── Line 3: "Frame by frame." word-by-word ────────────────────────── */}
      <div style={{
        position: 'absolute', top: 808, left: 0, right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{ ...headlineStyle, color: ORANGE,
          opacity: lineOp(l3aSp), display: 'inline-block',
          transform: `translateY(${lineY(l3aSp)}px)`,
          filter: blurFade(l3aSp, 12) }}>
          Frame{' '}
        </span>
        <span style={{ ...headlineStyle, color: BLACK,
          opacity: lineOp(l3bSp), display: 'inline-block',
          transform: `translateY(${lineY(l3bSp)}px)`,
          filter: blurFade(l3bSp, 12) }}>
          by{' '}
        </span>
        <span style={{ ...headlineStyle, color: ORANGE,
          opacity: lineOp(l3cSp), display: 'inline-block',
          transform: `translateY(${lineY(l3cSp)}px)`,
          filter: blurFade(l3cSp, 12) }}>
          frame.
        </span>
      </div>

      {/* ── Subtitle 1: "Not just the ~~transcript~~ —" ──────────────────── */}
      <div style={{
        position: 'absolute', top: 930, left: 0, right: 0,
        textAlign: 'center',
        opacity: lineOp(sub1Sp),
        transform:  `translateY(${lineY(sub1Sp)}px)`,
        filter:     blurFade(sub1Sp, 8),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 38, fontWeight: 500, lineHeight: 1.4,
          color: 'rgba(0,0,0,0.52)',
          fontFamily: FONT_HEAD,
        }}>
          Not just the{' '}
          <span style={{
            color: ORANGE,
            textDecoration: 'line-through',
            textDecorationColor: ORANGE,
            textDecorationThickness: '2px',
          }}>
            transcript
          </span>
          {' '}—
        </span>
      </div>

      {/* ── Subtitle 2: "the actual visuals." ────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 984, left: 0, right: 0,
        textAlign: 'center',
        opacity: lineOp(sub2Sp),
        transform:  `translateY(${lineY(sub2Sp)}px)`,
        filter:     blurFade(sub2Sp, 8),
        pointerEvents: 'none',
      }}>
        <span style={{
          fontSize: 38, fontWeight: 500, lineHeight: 1.4,
          color: 'rgba(0,0,0,0.52)',
          fontFamily: FONT_HEAD,
        }}>
          the{' '}
          <span style={{ color: ORANGE, fontWeight: 700 }}>actual visuals.</span>
        </span>
      </div>

      {/* ── Bottom pills: TRANSCRIPT + VISUALS ────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 1462,
        left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        opacity: pillOp,
        pointerEvents: 'none',
      }}>
        <div style={{
          transform: `translateX(${pill1X}px)`,
          background: 'rgba(255,255,255,0.94)',
          border: `2px solid ${ORANGE}`,
          borderRadius: 36,
          padding: '15px 34px',
          boxShadow: `0 4px 20px rgba(255,107,43,0.18)`,
        }}>
          <span style={{
            fontSize: 24, fontWeight: 800, color: ORANGE,
            letterSpacing: '2.5px',
            fontFamily: FONT_HEAD,
          }}>TRANSCRIPT</span>
        </div>

        <span style={{ fontSize: 32, fontWeight: 700, color: BLACK, fontFamily: FONT_HEAD }}>+</span>

        <div style={{
          transform: `translateX(${pill2X}px)`,
          background: 'rgba(255,255,255,0.94)',
          border: `2px solid ${ORANGE}`,
          borderRadius: 36,
          padding: '15px 38px',
          boxShadow: `0 4px 20px rgba(255,107,43,0.18)`,
        }}>
          <span style={{
            fontSize: 24, fontWeight: 800, color: ORANGE,
            letterSpacing: '2.5px',
            fontFamily: FONT_HEAD,
          }}>VISUALS</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
