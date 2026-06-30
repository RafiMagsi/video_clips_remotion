import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Slide1_Hook }     from './Slide1_Hook';
import { Slide2_Problem }  from './Slide2_Problem';
import { Slide3_Standard } from './Slide3_Standard';
import { Slide4_Ownership }from './Slide4_Ownership';
import { Slide5_CTA }      from './Slide5_CTA';

// ─────────────────────────────────────────────────────────────────────────────
//  CarouselBlueprint — "The 5-Slide Carousel Blueprint"
//  1080 × 1920 @ 30 fps — 50 s (1500 frames)
//
//  Slide 1 (  0– 299)  The Hook        — AI didn't kill coding.
//  Slide 2 (288– 587)  The Problem     — The Rise of AI-Generated Bloat
//  Slide 3 (576– 875)  The Standard    — Architect First, Delegate Second
//  Slide 4 (864–1163)  The Ownership   — If You Can't Explain It, Don't Commit It.
//  Slide 5 (1152–1451) The CTA         — Coding is a Craft, Not a Prompt.
//
//  Each slide overlaps the previous by 12 frames (crossfade).
//  Uses PastelBackground + ClaudeReadsFrames visual language.
// ─────────────────────────────────────────────────────────────────────────────

export const CarouselBlueprint: React.FC = () => (
  <AbsoluteFill style={{ background: '#F5F0FF', overflow: 'hidden' }}>

    {/* ── Slide 1 — frames 0–299 ─────────────────────────────────────────── */}
    <Sequence from={0} durationInFrames={300}>
      <Slide1_Hook />
    </Sequence>

    {/* ── Slide 2 — frames 288–587 ───────────────────────────────────────── */}
    <Sequence from={288} durationInFrames={300}>
      <Slide2_Problem />
    </Sequence>

    {/* ── Slide 3 — frames 576–875 ───────────────────────────────────────── */}
    <Sequence from={576} durationInFrames={300}>
      <Slide3_Standard />
    </Sequence>

    {/* ── Slide 4 — frames 864–1163 ──────────────────────────────────────── */}
    <Sequence from={864} durationInFrames={300}>
      <Slide4_Ownership />
    </Sequence>

    {/* ── Slide 5 — frames 1152–1451 ─────────────────────────────────────── */}
    <Sequence from={1152} durationInFrames={300}>
      <Slide5_CTA />
    </Sequence>

  </AbsoluteFill>
);
