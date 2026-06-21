import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
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

// ─────────────────────────────────────────────────────────────────
// CUSTOMIZE
// ─────────────────────────────────────────────────────────────────
const SUBTITLE = "AI Tools & Automation for Businesses";

/**
 * Add your video:
 * 1. Drop file at /public/video.mp4
 * 2. Set SHOW_VIDEO = true
 * 3. Replace <rect placeholder> with:
 *    import { OffthreadVideo, staticFile } from "remotion"
 *    <OffthreadVideo src={staticFile("video.mp4")}
 *      style={{width:"100%",height:"100%",objectFit:"cover"}} />
 */
const SHOW_VIDEO = false;
// ─────────────────────────────────────────────────────────────────

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

      {/* ── WAVE BACKGROUND ── */}
      <WaveBackground />

      {/* ── TITLE (compact, safe zone top) ── */}
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
                {/* Replace with:
                    import { OffthreadVideo, staticFile } from "remotion"
                    <OffthreadVideo src={staticFile("video.mp4")}
                      style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                */}
                <div style={{ width: "100%", height: "100%", background: "#040C22" }} />
              </foreignObject>
            )}

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
