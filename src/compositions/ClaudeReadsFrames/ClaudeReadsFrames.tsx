import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1_ClaudeSees }        from './Scene1_ClaudeSees';
import { Scene2_ClaudeUnderstands } from './Scene2_ClaudeUnderstands';
import { Scene3_InPhone }           from './Scene3_InPhone';
import { Scene4_FollowSubscribe }   from './Scene4_FollowSubscribe';

// ─────────────────────────────────────────────────────────────────────────────
//  ClaudeReadsFrames — Main composition  (1200 frames = 40 s @ 30 fps)
//
//  Design language: light editorial  (matches reference video from DeviniLabs)
//  Background: soft pastel gradient — cream/lavender base, warm orange glow
//              behind logo, cool lavender upper-right, 28 floating particles,
//              frosted-glass squares at edges
//
//  Scene 1  (frames   0–299, 10 s):
//    "Claude now watches video. Frame by frame."
//    → claude-icon.png (rotates, floats up) + blur-in headline + pills
//
//  Scene 2  (frames 288–587, ~10 s, 12-frame crossfade overlap):
//    "Claude reads. Claude watches. Same time."
//    → Film card + Claude icon + timestamp chips ticker
//
//  Scene 3  (frames 576–875, ~10 s, 12-frame crossfade overlap):
//    Phone in hand — video.mp4 plays inside iPhone 16 frame on pastel bg
//    → DropTicks branding card above phone
//
//  Scene 4  (frames 864–1163, ~10 s, 12-frame crossfade overlap):
//    "Follow & Subscribe." CTA scene
//    → DropTicks AI logo card + headlines + comment card + platform pills
//
//  Each scene overlaps the previous by 12 frames for a natural crossfade:
//    Scene N fades out over its last 15 frames.
//    Scene N+1 fades in over its first 15 frames.
// ─────────────────────────────────────────────────────────────────────────────

export const ClaudeReadsFrames: React.FC = () => (
  <AbsoluteFill style={{ background: '#F5F0FF', overflow: 'hidden' }}>

    {/* ── Scene 1 — frames 0–299 (10 s) ────────────────────────────────── */}
    <Sequence from={0} durationInFrames={300}>
      <Scene1_ClaudeSees />
    </Sequence>

    {/* ── Scene 2 — frames 288–587 (~10 s, 12-frame crossfade) ─────────── */}
    <Sequence from={288} durationInFrames={300}>
      <Scene2_ClaudeUnderstands />
    </Sequence>

    {/* ── Scene 3 — frames 576–875 (~10 s, 12-frame crossfade) ─────────── */}
    <Sequence from={576} durationInFrames={300}>
      <Scene3_InPhone />
    </Sequence>

    {/* ── Scene 4 — frames 864–1163 (~10 s, 12-frame crossfade) ────────── */}
    {/* "Follow & Subscribe." — DropTicks CTA with platform pills          */}
    <Sequence from={864} durationInFrames={300}>
      <Scene4_FollowSubscribe />
    </Sequence>

  </AbsoluteFill>
);
