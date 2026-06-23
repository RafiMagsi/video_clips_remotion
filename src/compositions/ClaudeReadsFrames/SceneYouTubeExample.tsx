import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { fadeOut, sp, blurFade } from '../../common/utils';
import { SceneCanvas, PastelBackground, SAFE_H } from '../../common/components';
import { FONT_HEAD, FONT_MONO } from '../../common/fonts';

// ─────────────────────────────────────────────────────────────────────────────
//  SceneYouTubeExample — "For example, you have a viral video on YouTube."
//
//  Layout (1080 × 1920, SAFE_H=162, safe vertical: 160–1640):
//    y=190   Badge pill  "03 / VIRAL"  (right-aligned)
//    y=265   "For example,"
//    y=346   "you have a  viral video"  (viral = YouTube red)
//    y=427   "on YouTube."
//    y=508   subtitle "You want to break it down."
//    y=580   [YT logo 220×155]  [video thumbnail 240×155]  (side-by-side)
//    y=762   "1,247,169"  (view count, 104px bold mono)
//    y=876   "VIEWS · TRENDING #1"
//    y=968   Three VIRAL stamps
//    y=1134  CTA card  "Ask Claude to break it down"
//    y=1378  /watch command pill
// ─────────────────────────────────────────────────────────────────────────────

const YT_RED = '#FF0000';
const BLACK  = '#0A0A0A';

// ── YouTube logo SVG ──────────────────────────────────────────────────────────
const YTLogo: React.FC<{ width: number }> = ({ width }) => {
  const h = Math.round(width * 0.703);
  return (
    <svg width={width} height={h} viewBox="0 0 576 404" fill="none" style={{ display: 'block' }}>
      <rect width="576" height="404" rx="80" fill="#FF0000"/>
      <polygon points="232,102 232,302 398,202" fill="white"/>
    </svg>
  );
};

// ── Fake YouTube video thumbnail ──────────────────────────────────────────────
const VideoThumb: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const playR  = Math.round(width * 0.105);
  const arrW   = Math.round(width * 0.062);
  const arrH   = Math.round(arrW * 0.9);
  return (
    <div style={{
      width, height, borderRadius: 14, overflow: 'hidden', position: 'relative',
      boxShadow: '0 8px 32px rgba(0,0,0,0.28), 0 0 0 1.5px rgba(255,255,255,0.14)',
      flexShrink: 0,
    }}>
      {/* Deep cinematic background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #1A0A2E 0%, #2D1654 38%, #1A3060 68%, #0A2040 100%)',
      }}/>
      {/* Red spotlight */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 36% 40%, rgba(255,40,40,0.42) 0%, transparent 62%)',
      }}/>
      {/* White rim light */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 72% 22%, rgba(255,255,255,0.16) 0%, transparent 50%)',
      }}/>
      {/* Thumbnail text */}
      <div style={{
        position: 'absolute', top: 10, left: 10, right: 10,
        fontSize: Math.round(width * 0.076), fontWeight: 900, fontFamily: FONT_HEAD,
        color: 'white', lineHeight: 1.18,
        textShadow: '0 2px 8px rgba(0,0,0,0.75)',
      }}>
        HOW I GOT{'\n'}1M VIEWS
      </div>
      {/* Play button */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: playR * 2, height: playR * 2, borderRadius: '50%',
          background: 'rgba(255,255,255,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 16px rgba(0,0,0,0.38)',
        }}>
          <div style={{
            width: 0, height: 0,
            borderTop: `${arrH}px solid transparent`,
            borderBottom: `${arrH}px solid transparent`,
            borderLeft: `${arrW * 1.8}px solid ${YT_RED}`,
            marginLeft: Math.round(playR * 0.15),
          }}/>
        </div>
      </div>
      {/* Duration badge */}
      <div style={{
        position: 'absolute', bottom: 8, right: 8,
        background: 'rgba(0,0,0,0.84)', borderRadius: 4,
        padding: '3px 7px',
        fontSize: Math.round(width * 0.066), fontFamily: FONT_MONO, fontWeight: 700, color: 'white',
      }}>
        4:32
      </div>
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.52))',
      }}/>
    </div>
  );
};

// ── VIRAL rubber stamp ────────────────────────────────────────────────────────
interface ViralProps { left: number; top: number; rotate: number; springVal: number; }
const ViralStamp: React.FC<ViralProps> = ({ left, top, rotate, springVal }) => {
  const op = interpolate(springVal, [0, 0.30], [0, 1]);
  const sc = 0.40 + springVal * 0.60;
  return (
    <div style={{
      position: 'absolute', left, top,
      opacity: op,
      transform: `rotate(${rotate}deg) scale(${sc.toFixed(3)})`,
      transformOrigin: 'center center',
    }}>
      <div style={{
        border: `3.5px solid ${YT_RED}`,
        borderRadius: 9, padding: '7px 22px',
        color: YT_RED,
        fontSize: 28, fontWeight: 900, fontFamily: FONT_HEAD, letterSpacing: '5px',
        background: 'rgba(255,255,255,0.62)',
        boxShadow: `0 0 0 1px rgba(255,0,0,0.15)`,
      }}>
        VIRAL
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

export const SceneYouTubeExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOp = fadeOut(frame, 285, 299);

  // Badge
  const badgeSp = sp(frame, fps,  4, { stiffness: 70, damping: 16 });
  const badgeOp = interpolate(badgeSp, [0, 0.30], [0, 1]);
  const badgeTY = interpolate(badgeSp, [0, 1], [16, 0]);

  // Headlines — staggered every 10 frames
  const h1Sp  = sp(frame, fps, 10, { stiffness: 78, damping: 16 });
  const h2Sp  = sp(frame, fps, 20, { stiffness: 78, damping: 16 });
  const h3Sp  = sp(frame, fps, 30, { stiffness: 72, damping: 15 });
  const subSp = sp(frame, fps, 42, { stiffness: 65, damping: 14 });
  const lineOp = (s: number) => interpolate(s, [0, 0.22], [0, 1]);
  const lineY  = (s: number) => interpolate(s, [0, 1], [28, 0]);

  // YT logo + thumbnail
  const ytSp    = sp(frame, fps, 55, { stiffness: 60, damping: 14 });
  const thumbSp = sp(frame, fps, 66, { stiffness: 58, damping: 14 });

  // View count
  const countSp    = sp(frame, fps,  88, { stiffness: 65, damping: 15 });
  const subLabelSp = sp(frame, fps, 108, { stiffness: 60, damping: 14 });

  // VIRAL stamps — staggered every 14 frames
  const v1Sp = sp(frame, fps, 122, { stiffness: 64, damping: 13 });
  const v2Sp = sp(frame, fps, 136, { stiffness: 62, damping: 13 });
  const v3Sp = sp(frame, fps, 150, { stiffness: 60, damping: 13 });

  // CTA + command
  const ctaSp = sp(frame, fps, 175, { stiffness: 55, damping: 14 });
  const ctaOp = interpolate(ctaSp, [0, 0.30], [0, 1]);
  const ctaTY = interpolate(ctaSp, [0, 1], [22, 0]);
  const cmdSp = sp(frame, fps, 200, { stiffness: 52, damping: 14 });

  // YT icon + thumbnail geometry
  const YT_W  = 220;
  const YT_H  = Math.round(YT_W * 0.703);  // 155
  const TH_W  = 240;
  const TH_H  = YT_H;
  const GAP   = 32;
  const ROW_W = YT_W + GAP + TH_W;         // 492
  const ROW_L = Math.round((1080 - ROW_W) / 2);  // 294
  const ROW_T = 580;

  return (
    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>

      {/* ── Badge pill ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 190, right: SAFE_H,
        opacity: badgeOp, transform: `translateY(${badgeTY}px)`,
        filter: blurFade(badgeSp, 8),
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.82)',
        border: `1.5px solid rgba(255,0,0,0.22)`,
        borderRadius: 26, padding: '8px 18px',
        boxShadow: '0 2px 12px rgba(255,0,0,0.09)',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: YT_RED }}/>
        <span style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_HEAD, color: YT_RED, letterSpacing: '0.8px' }}>
          03 / VIRAL
        </span>
      </div>

      {/* ── Headline — "For example," ────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 265, left: 0, right: 0, textAlign: 'center',
        opacity: lineOp(h1Sp), transform: `translateY(${lineY(h1Sp)}px)`,
        filter: blurFade(h1Sp, 10),
      }}>
        <span style={{ fontSize: 68, fontWeight: 800, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-1.5px', lineHeight: 1 }}>
          For example,
        </span>
      </div>

      {/* ── Headline — "you have a viral video" ─────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 346, left: 0, right: 0, textAlign: 'center',
        opacity: lineOp(h2Sp), transform: `translateY(${lineY(h2Sp)}px)`,
        filter: blurFade(h2Sp, 10),
      }}>
        <span style={{ fontSize: 68, fontWeight: 800, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-1.5px', lineHeight: 1 }}>
          you have a{' '}
        </span>
        <span style={{ fontSize: 68, fontWeight: 900, fontFamily: FONT_HEAD, color: YT_RED, letterSpacing: '-1.5px', lineHeight: 1 }}>
          viral video
        </span>
      </div>

      {/* ── Headline — "on YouTube." ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 427, left: 0, right: 0, textAlign: 'center',
        opacity: lineOp(h3Sp), transform: `translateY(${lineY(h3Sp)}px)`,
        filter: blurFade(h3Sp, 10),
      }}>
        <span style={{ fontSize: 68, fontWeight: 800, fontFamily: FONT_HEAD, color: BLACK, letterSpacing: '-1.5px', lineHeight: 1 }}>
          on YouTube.
        </span>
      </div>

      {/* ── Subtitle ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 508, left: 0, right: 0, textAlign: 'center',
        opacity: lineOp(subSp), transform: `translateY(${lineY(subSp)}px)`,
        filter: blurFade(subSp, 8),
      }}>
        <span style={{ fontSize: 40, fontWeight: 500, fontFamily: FONT_HEAD, color: 'rgba(0,0,0,0.40)', letterSpacing: '-0.4px' }}>
          You want to break it down.
        </span>
      </div>

      {/* ── YouTube logo ─────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: ROW_T, left: ROW_L,
        opacity: interpolate(ytSp, [0, 0.35], [0, 1]),
        transform: `scale(${(0.36 + ytSp * 0.64).toFixed(3)})`,
        transformOrigin: 'center center',
      }}>
        <YTLogo width={YT_W}/>
      </div>

      {/* ── Video thumbnail ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: ROW_T, left: ROW_L + YT_W + GAP,
        opacity: interpolate(thumbSp, [0, 0.35], [0, 1]),
        transform: `scale(${(0.36 + thumbSp * 0.64).toFixed(3)})`,
        transformOrigin: 'center center',
      }}>
        <VideoThumb width={TH_W} height={TH_H}/>
      </div>

      {/* ── View count ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 762, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(countSp, [0, 0.30], [0, 1]),
        transform: `scale(${(0.60 + countSp * 0.40).toFixed(3)})`,
        filter: blurFade(countSp, 14),
      }}>
        <span style={{ fontSize: 104, fontWeight: 900, fontFamily: FONT_MONO, color: BLACK, letterSpacing: '-3px', lineHeight: 1 }}>
          1,247,169
        </span>
      </div>

      {/* ── "VIEWS · TRENDING #1" ────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 876, left: 0, right: 0, textAlign: 'center',
        opacity: interpolate(subLabelSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(subLabelSp, [0, 1], [14, 0])}px)`,
      }}>
        <span style={{ fontSize: 24, fontWeight: 600, fontFamily: FONT_HEAD, color: 'rgba(0,0,0,0.38)', letterSpacing: '4px' }}>
          VIEWS  ·  TRENDING #1
        </span>
      </div>

      {/* ── VIRAL stamps ─────────────────────────────────────────────────────── */}
      <ViralStamp left={192} top={972}  rotate={-8} springVal={v1Sp}/>
      <ViralStamp left={435} top={990}  rotate={ 2} springVal={v2Sp}/>
      <ViralStamp left={700} top={968}  rotate={-5} springVal={v3Sp}/>

      {/* ── CTA card ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1134, left: SAFE_H, right: SAFE_H,
        opacity: ctaOp, transform: `translateY(${ctaTY}px)`,
        filter: blurFade(ctaSp, 8),
        background: 'rgba(255,255,255,0.90)',
        borderRadius: 26, padding: '26px 28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 0 0 1.5px rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: FONT_HEAD, color: BLACK, marginBottom: 10, letterSpacing: '-0.5px' }}>
          Ask Claude to break it down
        </div>
        <div style={{ fontSize: 23, fontWeight: 400, fontFamily: FONT_HEAD, color: 'rgba(0,0,0,0.48)', lineHeight: 1.55 }}>
          What made this go viral? Best timestamps? Key hooks?
          Claude reads every frame and tells you exactly why it worked.
        </div>
      </div>

      {/* ── /watch command pill ──────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 1380, left: SAFE_H, right: SAFE_H,
        opacity: interpolate(cmdSp, [0, 0.30], [0, 1]),
        transform: `translateY(${interpolate(cmdSp, [0, 1], [18, 0])}px)`,
        background: 'rgba(15,12,26,0.90)',
        borderRadius: 16, padding: '16px 22px',
        boxShadow: '0 4px 22px rgba(0,0,0,0.20)',
      }}>
        <span style={{ fontSize: 26, fontFamily: FONT_MONO, fontWeight: 600, color: '#FF9060' }}>
          /watch{' '}
        </span>
        <span style={{ fontSize: 24, fontFamily: FONT_MONO, color: 'rgba(255,255,255,0.58)' }}>
          youtube.com/...  why did this go viral?
        </span>
      </div>

    </SceneCanvas>
  );
};
