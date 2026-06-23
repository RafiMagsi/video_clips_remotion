// ─────────────────────────────────────────────────────────────────────────────
//  Social Media Safe Zone — 1080 × 1920 (9:16)
//
//  Keeps ALL foreground content (text, cards, pills, progress bars) within
//  the area not covered by platform UI chrome on TikTok, Instagram Reels,
//  and YouTube Shorts.
//
//  Platform UI that sits OVER your video:
//    TikTok     — username/caption bottom ~320px; top status bar ~80px
//    IG Reels   — username/like bar bottom ~260px; top bar ~90px
//    YT Shorts  — bottom shelf ~240px; top bar ~70px
//
//  We use the most conservative (strictest) values so one export works for all.
//
//  Usage:
//    import { SAFE, safeRect } from '../../common/layout';
//    // Position content within: x=[SAFE.left … SAFE.right], y=[SAFE.top … SAFE.bottom]
// ─────────────────────────────────────────────────────────────────────────────

/** Canvas dimensions for all 9:16 compositions. */
export const CANVAS = {
  width:  1080,
  height: 1920,
} as const;

/**
 * Social-media safe zone boundaries (absolute canvas pixels).
 * No visible content should appear outside these limits.
 */
export const SAFE = {
  top:    160,  // clear of top status bar / profile info
  bottom: 1640, // = 1920 - 280  — clear of nav/like/comment buttons
  left:   52,   // horizontal breathing room
  right:  1028, // = 1080 - 52

  // Convenience computed values:
  /** Usable content width:  1080 - 52 - 52  = 976 */
  width:  976,
  /** Usable content height: 1640 - 160       = 1480 */
  height: 1480,
  /** Horizontal center of safe area */
  cx:     540,
} as const;

/**
 * Returns SVG rect attributes for the safe zone rectangle.
 * Useful for debug overlays during development:
 *   <rect {...safeRect()} fill="none" stroke="red" strokeWidth={2}/>
 */
export const safeRect = () => ({
  x:      SAFE.left,
  y:      SAFE.top,
  width:  SAFE.width,
  height: SAFE.height,
});
