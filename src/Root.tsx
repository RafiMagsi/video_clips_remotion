import React from 'react';
import { Composition } from 'remotion';
import { IPhoneComposition, calculateMetadata } from './compositions/IPhone16Frame';
import { ClaudeReadsFrames }                    from './compositions/ClaudeReadsFrames';
import { CarouselBlueprint }                    from './compositions/CarouselBlueprint';

// ─────────────────────────────────────────────────────────────────────────────
//  Root — registers all Remotion compositions
//
//  Add new compositions here by:
//  1. Creating a folder under src/compositions/<YourName>/
//  2. Exporting the component from src/compositions/<YourName>/index.ts
//  3. Adding a <Composition /> block below
//
//  Project structure:
//    src/
//    ├── common/          — shared colors, utils, easings, components
//    ├── compositions/    — one folder per composition
//    └── Root.tsx         — this file
// ─────────────────────────────────────────────────────────────────────────────

export const RemotionRoot: React.FC = () => (
  <>
    {/*
      ┌──────────────────────────────────────────────────────────────┐
      │  iPhone 16 Frame — 9:16 Social Media Video                   │
      │  1080 × 1920 @ 30 fps                                        │
      │  Duration: auto-detected from /public/video.mp4              │
      │  Fallback: 1320 frames (44 s)                                │
      │  Edit:  src/compositions/IPhone16Frame/IPhoneComposition.tsx │
      └──────────────────────────────────────────────────────────────┘
    */}
    <Composition
      id="IPhone16Frame"
      component={IPhoneComposition}
      calculateMetadata={calculateMetadata}
      durationInFrames={1320}
      fps={30}
      width={1080}
      height={1920}
    />

    {/*
      ┌──────────────────────────────────────────────────────────────┐
      │  Claude Reads Frames — 9:16 AI Showcase                      │
      │  1080 × 1920 @ 30 fps — 40 s (1200 frames)                  │
      │                                                              │
      │  Scene 1 (0–10 s,    frames   0–299): Claude Sees Everything │
      │  Scene 2 (9.6–20 s,  frames 288–587): Claude Understands     │
      │  Scene 3 (19.2–30 s, frames 576–875): Phone + Video          │
      │  Scene 4 (28.8–39 s, frames 864–1163): Follow & Subscribe    │
      │  Edit:  src/compositions/ClaudeReadsFrames/                  │
      └──────────────────────────────────────────────────────────────┘
    */}
    <Composition
      id="ClaudeReadsFrames"
      component={ClaudeReadsFrames}
      durationInFrames={2604}
      fps={30}
      width={1080}
      height={1920}
    />

    {/*
      ┌──────────────────────────────────────────────────────────────┐
      │  Carousel Blueprint — 5-Slide AI Coding Carousel             │
      │  1080 × 1920 @ 30 fps — 50 s (1500 frames)                  │
      │                                                              │
      │  Slide 1 (  0–299)  The Hook — AI didn't kill coding.        │
      │  Slide 2 (288–587)  The Problem — AI-Generated Bloat         │
      │  Slide 3 (576–875)  Architect First, Delegate Second         │
      │  Slide 4 (864–1163) If You Can't Explain It, Don't Commit It │
      │  Slide 5 (1152–1451) Coding is a Craft, Not a Prompt.        │
      │  Edit:  src/compositions/CarouselBlueprint/                  │
      └──────────────────────────────────────────────────────────────┘
    */}
    <Composition
      id="CarouselBlueprint"
      component={CarouselBlueprint}
      durationInFrames={1500}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
