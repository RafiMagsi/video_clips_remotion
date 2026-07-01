import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Slide1_Cover }        from './Slide1_Cover';
import { Slide2_Features }     from './Slide2_Features';
import { Slide3_Feedback }     from './Slide3_Feedback';
import { Slide4_Architecture } from './Slide4_Architecture';
import { Slide5_Analytics }    from './Slide5_Analytics';
import { Slide6_SoftwareCost } from './Slide6_SoftwareCost';
import { Slide7_Solution }     from './Slide7_Solution';
import { Slide8_CTA }          from './Slide8_CTA';

// ─────────────────────────────────────────────────────────────────────────────
//  5StartupMistakes — 8-Slide Carousel
//  1080 × 1920 @ 30 fps — 80 s (2400 frames)
//
//  Slide 1 (   0– 299)  Cover              — 5 Software Mistakes Startups Make
//  Slide 2 ( 288– 587)  Mistake #1         — Building Features Nobody Asked For
//  Slide 3 ( 576– 875)  Mistake #2         — Ignoring User Feedback
//  Slide 4 ( 864–1163)  Mistake #3         — Choosing Speed Over Architecture
//  Slide 5 (1152–1451)  Mistake #4         — No Analytics, No Visibility
//  Slide 6 (1440–1739)  Mistake #5         — Treating Software As A Cost
//  Slide 7 (1728–2027)  Solution           — Build Systems. Not Features.
//  Slide 8 (2016–2315)  CTA                — What Should You Automate First?
//
//  Each slide overlaps the previous by 12 frames (crossfade).
//  Uses PastelBackground + ClaudeReadsFrames visual language.
// ─────────────────────────────────────────────────────────────────────────────

export const StartupMistakes: React.FC = () => (
  <AbsoluteFill style={{ background: '#F5F0FF', overflow: 'hidden' }}>

    <Sequence from={0}    durationInFrames={300}><Slide1_Cover /></Sequence>
    <Sequence from={288}  durationInFrames={300}><Slide2_Features /></Sequence>
    <Sequence from={576}  durationInFrames={300}><Slide3_Feedback /></Sequence>
    <Sequence from={864}  durationInFrames={300}><Slide4_Architecture /></Sequence>
    <Sequence from={1152} durationInFrames={300}><Slide5_Analytics /></Sequence>
    <Sequence from={1440} durationInFrames={300}><Slide6_SoftwareCost /></Sequence>
    <Sequence from={1728} durationInFrames={300}><Slide7_Solution /></Sequence>
    <Sequence from={2016} durationInFrames={300}><Slide8_CTA /></Sequence>

  </AbsoluteFill>
);
