import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { fadeOut } from '../../common/utils';
import { PastelBackground } from '../../common/components';
import {
  IPhone16Frame,
  PHONE_W, PHONE_H,
  SCR_X, SCR_Y, SCR_W, SCR_H, SCR_R,
} from '../IPhone16Frame/IPhone16Frame';
import { Title } from '../IPhone16Frame/Title';
import { Scene1_ClaudeSees }        from './Scene1_ClaudeSees';
import { Scene2_ClaudeUnderstands } from './Scene2_ClaudeUnderstands';

// ─────────────────────────────────────────────────────────────────────────────
//  Scene3_InPhone  —  "The AI watching inside the phone"
//  Local frames 0–299  (10 s @ 30 fps), used inside a <Sequence>
//
//  Layout:
//  ┌─────────────────────────────────────────────────────────────────────────┐
//  │  [PastelBackground — same as Scene 1 & 2]                              │
//  │                                                                         │
//  │         ●  DropTicks  AI    ← orange drop logo + wordmark              │
//  │         ───────────────     ← shimmer accent line                      │
//  │    AI Tools & Automation    ← subtitle                                 │
//  │                                                                         │
//  │          ┌─────────────┐                                               │
//  │          │  iPhone 16  │  ← phone entrance spring + gentle bob        │
//  │          │  (video or  │                                               │
//  │          │  animation) │                                               │
//  │          └─────────────┘                                               │
//  └─────────────────────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
//  CONFIGURE — flip one boolean to switch between modes
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * true  → video.mp4 plays inside the phone (OffthreadVideo)
 * false → a Remotion scene plays scaled inside the phone screen
 *
 * Exactly one mode is active. There is no transition between them.
 */
const SHOW_VIDEO = true;

/**
 * Which scene to display when SHOW_VIDEO = false.
 * Swap the commented line to choose a different scene.
 */
const AnimScene: React.FC = () => <Scene1_ClaudeSees />;
// const AnimScene: React.FC = () => <Scene2_ClaudeUnderstands />;

// ═══════════════════════════════════════════════════════════════════════════════

// ── Video file (video mode only) ─────────────────────────────────────────────
const VIDEO_FILE = 'video.mp4';

// ── Animation scaling (animation mode only) ──────────────────────────────────
// Phone screen: SCR_W=674, SCR_H=1404.  Source animation: 1080×1920.
// CSS `zoom` scales the layout box so overflow:hidden clips correctly.
const ANIM_SCALE    = SCR_W / 1080;                           // ≈ 0.624
const ANIM_H_PX     = Math.round(1920 * ANIM_SCALE);          // ≈ 1198 px visual height
const ANIM_V_OFFSET = Math.round((SCR_H - ANIM_H_PX) / 2);   // ≈ 103 px (vertical center)

// ── Phone layout ─────────────────────────────────────────────────────────────
// Scale phone to 88% so pastel background is visible around the edges.
const SCALE           = 0.88;
const PHONE_DISPLAY_W = PHONE_W * SCALE;                       // 616 px
const PHONE_DISPLAY_H = PHONE_H * SCALE;                       // 1258 px
const PHONE_LEFT      = (1080 - PHONE_DISPLAY_W) / 2;          // 232 px
const PHONE_TOP       = (1920 - PHONE_DISPLAY_H) / 2;          // 331 px

// ── Branding block ────────────────────────────────────────────────────────────
// Space above phone: PHONE_TOP (331) - safe zone top (160) = 171 px
const BRAND_TOP  = 162;
const SUBTITLE   = 'AI Tools & Automation for Businesses';

// ─────────────────────────────────────────────────────────────────────────────

export const Scene3_InPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene fade out ────────────────────────────────────────────────────────
  const sceneOp = fadeOut(frame, 285, 299);

  // ── Branding entrance spring (leads the phone by a few frames) ────────────
  const brandSp = spring({ frame, fps, config: { damping: 16, stiffness: 100, mass: 0.9 }, delay: 0 });
  const brandY  = interpolate(brandSp, [0, 1], [-40, 0]);
  const brandOp = interpolate(brandSp, [0, 0.3], [0, 1]);

  // ── Phone entrance spring ─────────────────────────────────────────────────
  const phoneSp = spring({ frame, fps, config: { damping: 14, stiffness: 78, mass: 1.4 }, delay: 3 });
  const enterY  = interpolate(phoneSp, [0, 1], [260, 0]);
  const enterSc = interpolate(phoneSp, [0, 1], [0.84, 1]);
  const t       = frame / fps;
  const bob     = frame > 22 ? Math.sin((t - 22 / fps) * Math.PI * 0.22) * 10 : 0;

  return (
    <AbsoluteFill style={{ opacity: sceneOp, overflow: 'hidden' }}>

      {/* ── Shared pastel background (same as Scene 1 & 2) ───────────────── */}
      <PastelBackground />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/*  DROPTICKS BRANDING — exact same Title as IPhone16Frame            */}
      {/*  Wrapped in a dark frosted-glass card so it reads on light bg      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: BRAND_TOP,
        left: 0, right: 0,
        opacity: brandOp,
        transform: `translateY(${brandY}px)`,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        {/* Dark frosted glass backdrop */}
        <div style={{
          background: 'rgba(0, 6, 18, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 28,
          padding: '22px 44px 18px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.08)',
        }}>
          <Title subtitle={SUBTITLE}/>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/*  IPHONE + SCREEN                                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top:  PHONE_TOP,
        left: PHONE_LEFT,
        width:  PHONE_DISPLAY_W,
        height: PHONE_DISPLAY_H,
        transform: `translateY(${enterY + bob}px) scale(${enterSc})`,
        transformOrigin: 'top center',
      }}>
        {/* Scale wrapper: IPhone16Frame SVG is drawn at PHONE_W×PHONE_H */}
        <div style={{
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          width:  PHONE_W,
          height: PHONE_H,
        }}>
          <IPhone16Frame>

            {/* ════════════════════════════════════════════════════════════ */}
            {/*  VIDEO MODE  (SHOW_VIDEO = true)                             */}
            {/*  OffthreadVideo renders video.mp4 — nothing else.           */}
            {/* ════════════════════════════════════════════════════════════ */}
            {SHOW_VIDEO && (
              <foreignObject x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}>
                <OffthreadVideo
                  src={staticFile(VIDEO_FILE)}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                    borderRadius: SCR_R,
                  }}
                />
              </foreignObject>
            )}

            {/* ════════════════════════════════════════════════════════════ */}
            {/*  ANIMATION MODE  (SHOW_VIDEO = false)                        */}
            {/*  AnimScene renders scaled inside the phone screen.           */}
            {/*  CSS zoom shrinks the layout box so overflow:hidden clips    */}
            {/*  correctly (unlike transform:scale which only scales paint). */}
            {/* ════════════════════════════════════════════════════════════ */}
            {!SHOW_VIDEO && (
              <foreignObject x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}>
                <div style={{
                  width:    SCR_W,
                  height:   SCR_H,
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: SCR_R,
                }}>
                  <div style={{
                    position: 'absolute',
                    top:  ANIM_V_OFFSET,
                    left: 0,
                    width:  1080,
                    height: 1920,
                    zoom: ANIM_SCALE,
                  }}>
                    <AnimScene />
                  </div>
                </div>
              </foreignObject>
            )}

            {/* ── Status bar (always on top of screen content) ─────────── */}
            <rect x={SCR_X} y={SCR_Y} width={SCR_W} height={70}
              fill="rgba(0,2,8,0.92)"/>

            {/* Time */}
            <text x={44} y={55} fill="white" fontSize={24} fontWeight="800"
              fontFamily="-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              letterSpacing={0.4} opacity={0.96}>
              9:41
            </text>

            {/* Cellular bars */}
            {[0, 1, 2, 3].map(i => {
              const barH = 7 + i * 5;
              return (
                <rect key={i} x={530 + i * 11} y={57 - barH} width={8} height={barH} rx={2}
                  fill={`rgba(255,255,255,${i < 1 ? 0.35 : 0.92})`}/>
              );
            })}

            {/* Battery */}
            <rect x={619} y={36} width={44} height={20} rx={5} ry={5}
              fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth={1.6}/>
            <rect x={621} y={38} width={38} height={16} rx={3.5} ry={3.5}
              fill="rgba(255,255,255,0.90)"/>

          </IPhone16Frame>
        </div>
      </div>

    </AbsoluteFill>
  );
};
