# iPhone 16 Frame — Remotion Project

## Quick Start

```bash
npm install
npm start        # opens Remotion Studio at localhost:3000
```

## Customizing

### Change the title
Open `src/IPhoneComposition.tsx` and edit the top constants:

```ts
const TITLE_TEXT  = "Watch\nThis";      // use \n for line breaks
const SUBTITLE_TEXT = "Swipe to explore ↓";
const ACCENT_COLOR  = "#FF6B35";        // any hex color
```

### Add your video inside the phone
1. Drop your video file into `/public/video.mp4`
2. In `src/IPhoneComposition.tsx` set:
   ```ts
   const SHOW_VIDEO = true;
   const VIDEO_FILE = "video.mp4";
   ```
3. Inside the `{SHOW_VIDEO && ...}` block, swap the placeholder `<div>` with:
   ```tsx
   import { OffthreadVideo, staticFile } from "remotion";
   // ...
   <OffthreadVideo
     src={staticFile(VIDEO_FILE)}
     style={{ width: "100%", height: "100%", objectFit: "cover" }}
   />
   ```

### Change duration
In `src/Root.tsx`, edit `durationInFrames` (30 fps → 300 frames = 10 seconds).

## Render

```bash
npx remotion render IPhone16Frame out/video.mp4
```

## Social Media Safe Zones (already respected)
- Top safe zone: 150px → title starts at y=120
- Bottom safe zone: 100px → CTA sits at bottom=140
- Side safe zones: 60px → phone centered with padding
