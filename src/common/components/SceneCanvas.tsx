import React from 'react';
import { AbsoluteFill } from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
//  SceneCanvas — universal scene wrapper for every composition
//
//  ┌──────────────────────────────────────────────────────────────────────────┐
//  │  Single source of truth for:                                             │
//  │    • Horizontal safe margins  (SAFE_H)                                   │
//  │    • Vertical safe zone top   (SAFE_TOP)                                 │
//  │    • Vertical safe zone btm   (SAFE_BOTTOM)                              │
//  │    • Base canvas overflow clipping                                       │
//  │    • Background layer slot (full-bleed, rendered behind children)        │
//  │    • Scene-level opacity  (fade in / fade out transitions)               │
//  │                                                                          │
//  │  To change any of these globally, edit this file only.                   │
//  └──────────────────────────────────────────────────────────────────────────┘
//
//  Usage:
//    import { SceneCanvas, SAFE_H, SAFE_TOP, SAFE_BOTTOM }
//      from '../../common/components';
//
//    <SceneCanvas opacity={sceneOp} background={<PastelBackground />}>
//      ... scene content ...
//    </SceneCanvas>
//
//  Absolute-positioned children that respect horizontal safe margins should
//  use  left: SAFE_H, right: SAFE_H  (imported constant).
// ─────────────────────────────────────────────────────────────────────────────

// ── Safe-zone constants ────────────────────────────────────────────────────
// Canvas: 1080 × 1920 px  (9:16 vertical social video)

/** Horizontal margin — 15 % of canvas width (162 px).
 *  Use as  left: SAFE_H, right: SAFE_H  on content containers. */
export const SAFE_H = 162;

/** Top safe zone in px — clears device status bar & social-app header UI. */
export const SAFE_TOP = 160;

/** Bottom safe zone in px — clears home indicator & social-app action bar. */
export const SAFE_BOTTOM = 1640;

// ── Component ─────────────────────────────────────────────────────────────

export interface SceneCanvasProps {
  /** Scene content — absolutely-positioned children as usual. */
  children: React.ReactNode;

  /** Scene-level opacity for smooth fade-in / fade-out transitions (0–1).
   *  Default: 1 (fully opaque). */
  opacity?: number;

  /** Full-bleed background element rendered below all content.
   *  e.g.  background={<PastelBackground />}  or  background={<WaveBackground />}
   *  Omit for a transparent background (useful when the parent provides one). */
  background?: React.ReactNode;
}

/**
 * SceneCanvas
 *
 * Wrap every scene in this component instead of using AbsoluteFill directly.
 * Any global layout change (margins, overlays, background, safe zones) is made
 * here once and takes effect across all scenes automatically.
 */
export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  children,
  opacity = 1,
  background,
}) => (
  <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>

    {/* ── Full-bleed background (renders behind all content) ─────────────── */}
    {background}

    {/* ── Scene content ──────────────────────────────────────────────────── */}
    {children}

  </AbsoluteFill>
);
