// ─────────────────────────────────────────────────────────────────────────────
//  DropTicks AI — Design Token Palette
//  Single source of truth for every color used across all compositions.
//  Import what you need:  import { CYAN, BLUE } from '../../common/colors';
// ─────────────────────────────────────────────────────────────────────────────

// ── Core Brand Colors ─────────────────────────────────────────────────────────
export const CYAN   = '#00EEFF'; // electric cyan   — primary hero accent
export const BLUE   = '#2060FF'; // vivid cobalt     — secondary accent
export const VIOLET = '#8B2AFF'; // saturated violet — tertiary accent
export const TEAL   = '#00FFB8'; // teal spark       — complementary
export const PINK   = '#FF00BB'; // hot magenta-pink — energy accent
export const WHITE  = '#FFFFFF';
export const BLACK  = '#000000';

// ── Background Colors ─────────────────────────────────────────────────────────
export const BG_BASE   = '#000814'; // richest black  — default comp background
export const BG_DEEP   = '#000508'; // near-black with slight blue
export const BG_DARK   = '#000A1A'; // very dark navy
export const BG_PANEL  = '#000C20'; // glass panel fill base
export const BG_SCREEN = '#000810'; // phone/monitor screen fill

// ── Glass Panel Defaults ──────────────────────────────────────────────────────
export const GLASS_FILL        = BG_PANEL;
export const GLASS_FILL_OP     = 0.90;  // fillOpacity for glass body
export const GLASS_BORDER_OP   = 0.55;  // strokeOpacity for glass border
export const GLASS_BORDER_W    = 1.5;   // strokeWidth

// ── Semantic Aliases ──────────────────────────────────────────────────────────
export const COLOR_PRIMARY   = CYAN;
export const COLOR_SECONDARY = VIOLET;
export const COLOR_TERTIARY  = BLUE;
export const COLOR_ACCENT    = TEAL;
export const COLOR_ENERGY    = PINK;

// ── Sequential Palette — for iterating colors in order ───────────────────────
export const BRAND_COLORS = [CYAN, VIOLET, BLUE, TEAL, PINK] as const;
export type  BrandColor   = typeof BRAND_COLORS[number];

/** Pick a brand color by index (wraps around). */
export const brandColor = (i: number): BrandColor =>
  BRAND_COLORS[i % BRAND_COLORS.length];

// ── Gradient Presets ──────────────────────────────────────────────────────────
/** CSS gradient string spanning the full brand palette. */
export const BRAND_GRADIENT =
  `linear-gradient(135deg, ${CYAN} 0%, ${BLUE} 35%, ${VIOLET} 70%, ${PINK} 100%)`;

export const CYAN_BLUE_GRADIENT =
  `linear-gradient(135deg, ${CYAN} 0%, ${BLUE} 100%)`;

export const VIOLET_BLUE_GRADIENT =
  `linear-gradient(135deg, ${VIOLET} 0%, ${BLUE} 100%)`;
