# IPhone16Frame Composition

## What It Does

A premium iPhone 16 device mockup for 9:16 social media video (TikTok, Reels, Stories).
Places your video inside a pixel-accurate iPhone 16 frame with:
- **DropTicks AI animated title** — spring-animated wordmark + shimmer underline
- **Animated aurora background** — 5 vivid color clouds, perspective grid, scan beam
- **iPhone 16 frame** — full aluminum chassis, Dynamic Island, buttons, speaker grilles
- **Floating entrance** — phone springs in from bottom, gentle continuous float
- **Status bar** — accurate 9:41 time, cellular bars, battery indicator

## Duration

Auto-detected from the video file via `calculateMetadata()`.
Fallback: **1320 frames (44 s)** at 30 fps (set in Root.tsx).

---

## Files

| File | Purpose |
|------|---------|
| `IPhone16Frame.tsx` | Phone frame SVG — chassis, DI, buttons, screen clip |
| `PhoneScreen.tsx` | Animated placeholder shown when `SHOW_VIDEO = false` |
| `Title.tsx` | DropTicks AI wordmark + subtitle with spring entrance |
| `IPhoneComposition.tsx` | **Main composition** — wires everything together |
| `index.ts` | Barrel re-exports |
| `README.md` | This file |

---

## Key Customization

Edit the CUSTOMIZE block at the top of `IPhoneComposition.tsx`:

| Constant | Default | What it does |
|----------|---------|-------------|
| `SHOW_VIDEO` | `true` | `false` = show animated PhoneScreen placeholder instead |
| `VIDEO_FILE` | `"video.mp4"` | Filename in `/public/` — any format Remotion supports |
| `OVERLAY_MODE` | `false` | `true` = transparent export (no background, no title) |
| `SUBTITLE` | `"AI Tools & Automation..."` | Small text below "DropTicks AI" |

### To use a different video
1. Drop file at `video_clips_remotion/public/your-video.mp4`
2. Set `VIDEO_FILE = "your-video.mp4"` in `IPhoneComposition.tsx`
3. Duration auto-adjusts via `calculateMetadata()`

### To export a transparent overlay
```bash
npx remotion render IPhone16Frame out/overlay.webm --transparent
```
Then layer the `.webm` over your footage in CapCut / DaVinci Resolve.

---

## Colors Used

All from `../../common/colors`:

| Color | Hex | Used for |
|-------|-----|---------|
| `CYAN` | `#00EEFF` | Primary accent, glow, "AI" wordmark gradient |
| `BLUE` | `#2060FF` | Secondary, play button fill, battery |
| `VIOLET` | `#8B2AFF` | Tertiary, underline, logo shadow |
| `TEAL` | `#00FFB8` | Underline end, particles |
| `PINK` | `#FF00BB` | Background aurora blob |

iPhone chassis uses custom aluminum gradient colors (`#1040D0` → `#2060F0` → `#00B8F0`), not in the brand palette.

---

## Components Used

| Component | Source | Purpose |
|-----------|--------|---------|
| `WaveBackground` | `../../common/components` | Aurora + grid background |
| `IPhone16Frame` | `./IPhone16Frame` | Phone SVG frame |
| `Title` | `./Title` | Animated wordmark |
| `PhoneScreen` | `./PhoneScreen` | Animated screen (SHOW_VIDEO=false) |

---

## Phone Frame Dimensions

```
PHONE_W = 700    PHONE_H = 1430    PHONE_R = 62  (outer radius)
SCR_X   = 13     SCR_Y   = 13      SCR_R   = 54  (screen radius)
SCR_W   = 674    SCR_H   = 1404
```

The phone is scaled to fill the canvas using `scaleToFit = Math.min(1, availH/PHONE_H, (W-40)/PHONE_W)`.
Adjust `SAFE_TOP` (120) and `TITLE_H` (240) to change how much space the title takes.

---

## Render Commands

```bash
# Open Remotion Studio (preview in browser)
npm start

# Render to file
npm run render

# Render transparent overlay
npx remotion render IPhone16Frame out/overlay.webm --transparent
```
