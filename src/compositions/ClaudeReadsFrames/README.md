# ClaudeReadsFrames Composition

## What It Does

A 16-second AI showcase animation demonstrating Claude's video analysis capabilities.
Two scenes with an 8-second runtime each and a 12-frame crossfade transition between them.

Designed for 9:16 social media (TikTok, Reels, Stories) at 1080 × 1920 @ 30 fps.

---

## Scene Breakdown

### Scene 1 — "Claude Sees Everything" (frames 0–239, 8 s)

| Element | Description |
|---------|-------------|
| Central video player | Glass panel with AI scan bands, 3 bounding boxes, progress bar |
| 6 frame thumbnails | Spring in from 0 scale, each with animated border + label |
| Neural network lines | Bezier curves from thumbnails → player center, particles travel along them |
| Bottom pills | 4 label tags: Objects · Actions · Emotions · Story Structure |
| Title | "Claude Reads / Every Frame" + subtitle |
| Scan beam | Full-canvas horizontal sweep |

### Scene 2 — "Claude Understands The Story" (frames 228–479, 8.4 s)

| Element | Description |
|---------|-------------|
| Storyboard grid | 8 frames in 2×4 layout, each springs in with glass panels + tags |
| Dashed lines | Storyboard → brain connections |
| AI brain | Pulsing core with 3 orbital rings, 10 rotating nodes, 18 neural spokes |
| Bezier connections | Brain → 7 insight cards, animated draw-in |
| 7 Insight cards | Slide in from sides, progress bars fill, sparklines reveal |
| Titles | "From Frames To Insights" → "Claude Understands The Story" two-stage reveal |
| Camera pull-back | Scale 1.06 → 1.0 over first 5 seconds of scene |

**Crossfade:** Scene 1 fades out frames 210–239; Scene 2 fades in frames 0–22 (12-frame overlap).

---

## Files

| File | Purpose |
|------|---------|
| `ClaudeReadsFrames.tsx` | **Main composition** — wires WaveBackground + Sequences |
| `Scene1_ClaudeSees.tsx` | Scene 1 — video player + thumbnails + neural lines |
| `Scene2_ClaudeUnderstands.tsx` | Scene 2 — storyboard + brain + insight cards |
| `index.ts` | Barrel re-exports |
| `README.md` | This file |

---

## Key Customization

### Change Scene 1 thumbnails

In `Scene1_ClaudeSees.tsx`, edit the `FRAMES` array:

```ts
const FRAMES = [
  { id: 0, x: 28,  y: 200,  w: 285, h: 178, delay: 5,
    color: CYAN, label: 'Your Label', gradA: '#001830', gradB: '#002850' },
  // ...
];
```

| Property | What it does |
|----------|-------------|
| `x, y` | Position on the 1080×1920 canvas |
| `delay` | Spring entrance delay in frames (5 = ~167ms after start) |
| `color` | Accent color from `common/colors.ts` |
| `label` | Text shown in the analysis overlay |
| `gradA, gradB` | Background gradient colors for the thumbnail |

### Change Scene 1 bottom pills

```ts
const labelItems  = ['Objects', 'Actions', 'Emotions', 'Story Structure'];
const labelColors = [CYAN, VIOLET, BLUE, TEAL];
```

### Change Scene 2 insight cards

In `Scene2_ClaudeUnderstands.tsx`, edit the `CARDS` array:

```ts
const CARDS = [
  { id: 0, x: 28,  y: 528, label: 'Hook Analysis',  icon: '⚡',
    color: CYAN, delay: 10, val: 94 },
  // ...
];
```

| Property | What it does |
|----------|-------------|
| `x, y` | Position (x < 540 = left column; x >= 540 = right column) |
| `delay` | Spring entrance delay in frames |
| `val` | Target percentage shown + bar fill target (0–100) |
| `icon` | Emoji shown in the icon circle |

### Adjust timing

In `ClaudeReadsFrames.tsx`:
```tsx
<Sequence from={0}   durationInFrames={240}>  {/* Scene 1: 8s */}
<Sequence from={228} durationInFrames={252}>  {/* Scene 2: 8.4s, 12-frame overlap */}
```

---

## Colors Used

All from `../../common/colors`:

| Color | Hex | Used for |
|-------|-----|---------|
| `CYAN` | `#00EEFF` | Primary accent, player border, particles, pills |
| `VIOLET` | `#8B2AFF` | Secondary accent, alternating cards/thumbnails |
| `BLUE` | `#2060FF` | Tertiary, banding, insight cards |
| `TEAL` | `#00FFB8` | Complementary accent |
| `WHITE` | `#FFFFFF` | Text, titles, brain core |

---

## Components Used

| Component | Source | Used in |
|-----------|--------|---------|
| `WaveBackground` | `../../common/components` | Both scenes (aurora background) |
| `SharedSVGDefs` | `../../common/components` | Both scenes (SVG glow filters) |
| `GlassPanel` | `../../common/components` | Scene 1 player, Scene 2 storyboard frames |
| `NeuralLine` | `../../common/components` | Scene 1 neural connections |
| `ProgressBar` | `../../common/components` | Scene 1 video player |
| `LabelPill` | `../../common/components` | Scene 1 bottom pills |
| `InsightCard` | `../../common/components` | Scene 2 (7 cards) |

---

## Render Commands

```bash
# Open Remotion Studio (live preview)
npm start

# Render to file (outputs to /out/)
npm run render
```
