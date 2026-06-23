// ─────────────────────────────────────────────────────────────────────────────
//  Shared font configuration for ClaudeReadsFrames
//
//  Headline font: Outfit (Google Fonts via @remotion/google-fonts)
//  Loaded at module level so Remotion's delayRender/continueRender mechanism
//  ensures the font is fully available before any frame is rendered.
//
//  Usage:
//    import { FONT_HEAD, FONT_MONO } from '../../common/fonts';
// ─────────────────────────────────────────────────────────────────────────────

import { loadFont } from '@remotion/google-fonts/Outfit';

// Load Outfit — weights 700, 800, 900
const { fontFamily } = loadFont('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
});

/** Primary display font — Outfit Black/ExtraBold for all headlines */
export const FONT_HEAD = fontFamily;

/** Body / label font — falls back to system sans */
export const FONT_BODY = `${fontFamily}, -apple-system, BlinkMacSystemFont, sans-serif`;

/** Monospace font for timestamps and code labels */
export const FONT_MONO = "'SF Mono', 'Roboto Mono', 'Courier New', monospace";
