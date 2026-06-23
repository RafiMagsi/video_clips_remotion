// ─────────────────────────────────────────────────────────────────────────────
//  Easing Functions
//  All accept/return values in [0, 1].
//  Use with interpolate() or directly on a spring value.
//  Import:  import { easeOut, easeInOut } from '../../common/easings';
// ─────────────────────────────────────────────────────────────────────────────

/** Ease out cubic — fast start, slow deceleration. Great for entrances. */
export const easeOut = (x: number): number =>
  1 - Math.pow(1 - x, 3);

/** Ease in cubic — slow start, fast acceleration. Good for exits. */
export const easeIn = (x: number): number =>
  x * x * x;

/** Ease in-out cubic — smooth at both ends. Good for slides. */
export const easeInOut = (x: number): number =>
  x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** Ease out quintic — very smooth deceleration, slightly snappier than cubic. */
export const easeOutQuint = (x: number): number =>
  1 - Math.pow(1 - x, 5);

/**
 * Ease out with slight overshoot — object overshoots target and settles.
 * c1 controls overshoot amount (default 1.70158 ≈ 10% overshoot).
 */
export const easeOutBack = (x: number, c1 = 1.70158): number => {
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/** Ease out elastic — bouncy spring feel, good for pop-in effects. */
export const easeOutElastic = (x: number): number => {
  if (x === 0 || x === 1) return x;
  const c4 = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

/** Ease out bounce — hits target, bounces a few times. */
export const easeOutBounce = (x: number): number => {
  const n1 = 7.5625, d1 = 2.75;
  if      (x < 1 / d1)           return n1 * x * x;
  else if (x < 2 / d1)           return n1 * (x -= 1.5  / d1) * x + 0.75;
  else if (x < 2.5 / d1)         return n1 * (x -= 2.25 / d1) * x + 0.9375;
  else                            return n1 * (x -= 2.625 / d1) * x + 0.984375;
};
