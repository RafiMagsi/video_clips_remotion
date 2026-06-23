import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  OffthreadVideo,
  staticFile,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import {
  IPhone16Frame,
  PHONE_W,
  PHONE_H,
  SCR_X,
  SCR_Y,
  SCR_W,
  SCR_H,
  SCR_R,
} from "./IPhone16Frame";
import { Title } from "./Title";
import { WaveBackground } from "./WaveBackground";
import { PhoneScreen } from "./PhoneScreen";

// ═════════════════════════════════════════════════════════════════
//  CUSTOMIZE — edit these constants, nothing else needs changing
// ═════════════════════════════════════════════════════════════════

const FPS = 30;

// ── Video ─────────────────────────────────────────────────────────
// Drop your file at /public/video.mp4 then set SHOW_VIDEO = true.
// Duration is detected automatically from the video file.
const SHOW_VIDEO  = true;
const VIDEO_FILE  = "video.mp4";

// ── Overlay mode ──────────────────────────────────────────────────
// Set true to export a transparent overlay (no background, no title).
// Use this to layer the iPhone frame over footage in CapCut / DaVinci.
// Render command:
//   npx remotion render IPhone16Frame out/overlay.webm --transparent
const OVERLAY_MODE = false;

// ── Title text ────────────────────────────────────────────────────
const SUBTITLE = "AI Tools & Automation for Businesses";

// ═════════════════════════════════════════════════════════════════

// ── Auto-duration: reads actual video length so Remotion matches it ─
export const calculateMetadata = async () => {
  if (!SHOW_VIDEO) return {};
  try {
    // Build absolute URL so getVideoMetadata works in both Studio and render
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const { durationInSeconds } = await getVideoMetadata(`${base}/${VIDEO_FILE}`);
    return { durationInFrames: Math.ceil(durationInSeconds * FPS) };
  } catch (e) {
    console.warn("[calculateMetadata] Could not read video duration:", e);
    return {}; // Root.tsx durationInFrames={1320} is used as fallback
  }
};

export const IPhoneComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();

  // Phone entrance spring
  const phoneSpring = spring({ frame, fps, config: { damping: 14, stiffness: 78, mass: 1.4 }, delay: 3 });
  const enterY  = interpolate(phoneSpring, [0, 1], [280, 0]);
  const enterSc = interpolate(phoneSpring, [0, 1], [0.82, 1]);

  // Gentle float (1 full cycle per 10 s — loop-safe)
  const t   = frame / fps;
  const bob = frame > 20 ? Math.sin((t - 20 / fps) * Math.PI * 0.2) * 10 : 0;


  const titleOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // ── Layout ─────────────────────────────────────────────────────
  // Smaller title zone → more space for phone
  const SAFE_TOP  = 120;  // safe zone start
  const TITLE_H   = 240;  // compact title height
  const PHONE_TOP = SAFE_TOP + TITLE_H + 14;

  // Scale phone to fill available height — maximize size
  const availH     = H - PHONE_TOP - 110; // leave room for CTA
  const scaleToFit = Math.min(1, availH / PHONE_H, (W - 40) / PHONE_W);

  const phoneDisplayW = PHONE_W * scaleToFit;
  const phoneDisplayH = PHONE_H * scaleToFit;
  const phoneLeft     = (W - phoneDisplayW) / 2;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>

      {/* ── WAVE BACKGROUND (hidden in overlay mode) ── */}
      {!OVERLAY_MODE && <WaveBackground />}

      {/* ── TITLE (hidden in overlay mode) ── */}
      {!OVERLAY_MODE && (
        <div style={{
          position: "absolute",
          top: SAFE_TOP, left: 0, right: 0,
          height: TITLE_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 50,
          paddingRight: 50,
          opacity: titleOp,
        }}>
          <Title subtitle={SUBTITLE} />
        </div>
      )}

      {/* ── IPHONE FRAME (maximised) ── */}
      <div style={{
        position: "absolute",
        top: PHONE_TOP,
        left: phoneLeft,
        width: phoneDisplayW,
        height: phoneDisplayH,
        transform: `translateY(${enterY + bob}px) scale(${enterSc})`,
        transformOrigin: "top center",
      }}>
        <div style={{
          transform: `scale(${scaleToFit})`,
          transformOrigin: "top left",
          width: PHONE_W,
          height: PHONE_H,
        }}>
          <IPhone16Frame>

            {/* ── ANIMATED SCREEN (aurora + particles + grid) ── */}
            {!SHOW_VIDEO && <PhoneScreen />}

            {/* ── REAL VIDEO (set SHOW_VIDEO = true) ── */}
            {SHOW_VIDEO && (
              <foreignObject x={SCR_X} y={SCR_Y} width={SCR_W} height={SCR_H}>
                <OffthreadVideo
                  src={staticFile(VIDEO_FILE)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </foreignObject>
            )}

            {/* ── STATUS BAR BACKGROUND ────────────────────────────
                Solid dark rect covers the video's own status bar
                and any red recording indicator from the footage.
                Height 100px = ~66pt in iPhone coords — clears the
                full iOS status bar + Dynamic Island area.
            ──────────────────────────────────────────────────── */}
            <rect
              x={SCR_X} y={SCR_Y}
              width={SCR_W} height={70}
              fill="rgba(0,2,8,0.92)"
            />

            {/* ── STATUS BAR (drawn above screen content) ── */}
            {/* DI pill: x 285–415, y 27–65, centre-y = 46. All items centred on y=46. */}

            {/* Time */}
            <text x={44} y={55}
              fill="white" fontSize={24} fontWeight="800"
              fontFamily="-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              letterSpacing={0.4} opacity={0.96}>
              9:41
            </text>

            {/* Cellular bars — bottom-aligned y=57 */}
            {[0,1,2,3].map(i => {
              const barH = 7 + i * 5;
              const barX = 530 + i * 11;
              const barY = 57 - barH;
              return (
                <rect key={i} x={barX} y={barY} width={8} height={barH} rx={2}
                  fill={`rgba(255,255,255,${i < 1 ? 0.35 : 0.92})`} />
              );
            })}

            {/* Battery — 44×20px, centred y=46 */}
            <rect x={619} y={36} width={44} height={20} rx={5} ry={5}
              fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth={1.6} />
            <rect x={621} y={38} width={38} height={16} rx={3.5} ry={3.5}
              fill="rgba(255,255,255,0.90)" />

          </IPhone16Frame>
        </div>
      </div>

      {/* CTA removed */}

    </AbsoluteFill>
  );
};
