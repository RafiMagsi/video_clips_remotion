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
import { getVideoMetadata } from '@remotion/media-utils';
import { IPhone16Frame, PHONE_W, PHONE_H, SCR_X, SCR_Y, SCR_W, SCR_H } from './IPhone16Frame';
import { Title }         from './Title';
import { PhoneScreen }   from './PhoneScreen';
import { WaveBackground } from '../../common/components';

// ─────────────────────────────────────────────────────────────────────────────
//  IPhoneComposition — iPhone 16 device mockup playing a video
//
//  9:16 — 1080 × 1920 @ 30 fps
//  Duration: auto-detected from /public/video.mp4 (falls back to 1320 frames)
//
//  ── Quick customization ──────────────────────────────────────────────────────
//  All settings are in the CUSTOMIZE block below.
// ─────────────────────────────────────────────────────────────────────────────

// ═════════════════════════════════════════════════════════════════════════════
//  CUSTOMIZE
// ═════════════════════════════════════════════════════════════════════════════

const FPS = 30;

// Drop your video at /public/video.mp4 and set SHOW_VIDEO = true.
const SHOW_VIDEO  = true;
const VIDEO_FILE  = 'video.mp4';

// Set true to export a transparent overlay (no background, no title).
const OVERLAY_MODE = false;

// Subtitle text below the DropTicks AI wordmark
const SUBTITLE = 'AI Tools & Automation for Businesses';

// ═════════════════════════════════════════════════════════════════════════════

/** Auto-detect video duration so Remotion renders as long as the video. */
export const calculateMetadata = async () => {
  if (!SHOW_VIDEO) return {};
  try {
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';
    const { durationInSeconds } = await getVideoMetadata(`${base}/${VIDEO_FILE}`);
    return { durationInFrames: Math.ceil(durationInSeconds * FPS) };
  } catch (e) {
    console.warn('[calculateMetadata] Could not read video duration:', e);
    return {};
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const IPhoneComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  // ── Phone entrance spring ──────────────────────────────────────────────────
  const phoneSpring = spring({ frame, fps, config: { damping: 14, stiffness: 78, mass: 1.4 }, delay: 3 });
  const enterY  = interpolate(phoneSpring, [0, 1], [280, 0]);
  const enterSc = interpolate(phoneSpring, [0, 1], [0.82, 1]);

  // Gentle bob (1 cycle / 10s)
  const t   = frame / fps;
  const bob = frame > 20 ? Math.sin((t - 20 / fps) * Math.PI * 0.2) * 10 : 0;

  const titleOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  // ── Layout ────────────────────────────────────────────────────────────────
  const SAFE_TOP  = 120;
  const TITLE_H   = 240;
  const PHONE_TOP = SAFE_TOP + TITLE_H + 14;

  const availH     = H - PHONE_TOP - 110;
  const scaleToFit = Math.min(1, availH / PHONE_H, (W - 40) / PHONE_W);
  const phoneDisplayW = PHONE_W * scaleToFit;
  const phoneDisplayH = PHONE_H * scaleToFit;
  const phoneLeft     = (W - phoneDisplayW) / 2;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {/* Aurora background */}
      {!OVERLAY_MODE && <WaveBackground/>}

      {/* Title */}
      {!OVERLAY_MODE && (
        <div style={{
          position: 'absolute',
          top: SAFE_TOP, left: 0, right: 0,
          height: TITLE_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: 50, paddingRight: 50,
          opacity: titleOp,
        }}>
          <Title subtitle={SUBTITLE}/>
        </div>
      )}

      {/* ── iPhone frame ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: PHONE_TOP, left: phoneLeft,
        width: phoneDisplayW, height: phoneDisplayH,
        transform: `translateY(${enterY + bob}px) scale(${enterSc})`,
        transformOrigin: 'top center',
      }}>
        <div style={{
          transform: `scale(${scaleToFit})`,
          transformOrigin: 'top left',
          width: PHONE_W, height: PHONE_H,
        }}>
          <IPhone16Frame>

            {/* ── SCREEN CONTENT ────────────────────────────────────────── */}

            {/* Animated placeholder (SHOW_VIDEO = false) */}
            {!SHOW_VIDEO && <PhoneScreen/>}

            {/* Video layer */}
            {SHOW_VIDEO && (
              <foreignObject x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}>
                <OffthreadVideo
                  src={staticFile(VIDEO_FILE)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </foreignObject>
            )}

            {/* ── STATUS BAR (always on top) ────────────────────────────── */}
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
