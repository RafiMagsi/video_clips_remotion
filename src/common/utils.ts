// ─────────────────────────────────────────────────────────────────────────────
//  Animation & Math Utilities
//  All helper functions shared across compositions.
//  Import:  import { rng, fade, sp, bezierPoint } from '../../common/utils';
// ─────────────────────────────────────────────────────────────────────────────
import { interpolate, spring } from 'remotion';

// ── Pseudo-random (deterministic — same value for same seed every frame) ───────
/**
 * Returns a stable pseudo-random float in [0, 1) for a given seed.
 * Identical seeds always return the same number, so RNG outputs are
 * frame-stable: use it for particle positions, sizes, colors, delays.
 */
export const rng = (seed: number): number => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ── Basic Math ────────────────────────────────────────────────────────────────
export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/** Create an array of sequential integers [0, 1, …, n-1]. */
export const range = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i);

// ── Remotion Interpolation Helpers ────────────────────────────────────────────
/**
 * Fade opacity from 0 → 1 between two frame positions.
 * Always clamped: returns 0 before `fromFrame`, 1 after `toFrame`.
 */
export const fade = (
  frame: number,
  fromFrame: number,
  toFrame: number,
): number =>
  interpolate(frame, [fromFrame, toFrame], [0, 1], {
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * Fade opacity from 1 → 0 between two frame positions.
 * Always clamped: returns 1 before `fromFrame`, 0 after `toFrame`.
 */
export const fadeOut = (
  frame: number,
  fromFrame: number,
  toFrame: number,
): number =>
  interpolate(frame, [fromFrame, toFrame], [1, 0], {
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  });

// ── Spring Animation ──────────────────────────────────────────────────────────
/**
 * Spring value (0 → 1) with sensible defaults for UI element entrances.
 * - delayInFrames: how many frames to wait before spring starts
 * - config overrides: stiffness (80), damping (14), mass (1.1)
 */
export const sp = (
  frame:         number,
  fps:           number,
  delayInFrames: number,
  config?: { stiffness?: number; damping?: number; mass?: number },
): number =>
  spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 1.1, ...config },
    delay: delayInFrames,
  });

/**
 * Spring from `startVal` to `endVal`.  Same signature as `sp`.
 */
export const springVal = (
  frame:         number,
  fps:           number,
  delayInFrames: number,
  startVal:      number,
  endVal:        number,
  config?: { stiffness?: number; damping?: number; mass?: number },
): number =>
  interpolate(
    sp(frame, fps, delayInFrames, config),
    [0, 1],
    [startVal, endVal],
  );

// ── Bezier Geometry ───────────────────────────────────────────────────────────
/**
 * Point on a cubic bezier curve at parameter t ∈ [0, 1].
 * Used for particle travel along neural-network lines.
 */
export const bezierPoint = (
  t:  number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
): [number, number] => {
  const mt = 1 - t;
  return [
    mt*mt*mt*p0[0] + 3*mt*mt*t*p1[0] + 3*mt*t*t*p2[0] + t*t*t*p3[0],
    mt*mt*mt*p0[1] + 3*mt*mt*t*p1[1] + 3*mt*t*t*p2[1] + t*t*t*p3[1],
  ];
};

/**
 * SVG path string for a cubic bezier curve.
 */
export const bezierPath = (
  from: [number, number],
  cp1:  [number, number],
  cp2:  [number, number],
  to:   [number, number],
): string =>
  `M ${from[0]} ${from[1]} C ${cp1[0]} ${cp1[1]}, ${cp2[0]} ${cp2[1]}, ${to[0]} ${to[1]}`;

/**
 * Compute symmetric S-curve control points for a bezier between two points.
 * Both control points share the x midpoint, creating a smooth S or C curve.
 */
export const sBezierCPs = (
  from: [number, number],
  to:   [number, number],
): [[number, number], [number, number]] => {
  const mx = (from[0] + to[0]) / 2;
  return [[mx, from[1]], [mx, to[1]]];
};

// ── Blur Fade Animation ───────────────────────────────────────────────────────
/**
 * Returns a CSS `filter` string that blurs from `maxBlur` px → 0 px as
 * the spring value moves 0 → 1.
 *
 * Use it on text container divs alongside a spring-driven `translateY` to
 * reproduce the editorial blur-in entrance from the reference video.
 *
 * @example
 *   const l1Sp = sp(frame, fps, 20);
 *   <div style={{ filter: blurFade(l1Sp), transform: `translateY(${interpolate(l1Sp,[0,1],[30,0])}px)` }}>
 *
 * @param springVal  0→1 spring value (e.g. from the `sp()` helper)
 * @param maxBlur    blur in px when spring=0 (default 12)
 */
export const blurFade = (springVal: number, maxBlur = 12): string => {
  const px = maxBlur * Math.max(0, 1 - springVal);
  return `blur(${px.toFixed(2)}px)`;
};

// ── Oscillation ───────────────────────────────────────────────────────────────
/** Loop-safe oscillation helper: k complete cycles in `periodSeconds` seconds. */
export const osc = (
  t:             number,
  k:             number,
  periodSeconds: number = 10,
  phase:         number = 0,
): number =>
  Math.sin((Math.PI * 2 * k * t) / periodSeconds + phase);
