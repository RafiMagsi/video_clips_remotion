import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1_ClaudeSees }        from './Scene1_ClaudeSees';
import { SceneTerminal_Watch }      from './SceneTerminal_Watch';
import { Scene2_ClaudeUnderstands } from './Scene2_ClaudeUnderstands';
import { SceneYouTubeExample }      from './SceneYouTubeExample';
import { Scene3_InPhone }           from './Scene3_InPhone';
import { SceneUseCases }            from './SceneUseCases';
import { Scene4_FollowSubscribe }   from './Scene4_FollowSubscribe';

// ─────────────────────────────────────────────────────────────────────────────
//  ClaudeReadsFrames — Main composition  (2028 frames = 67.6 s @ 30 fps)
//
//  Scene 1           (   0– 299, 10 s): "Claude now watches video."
//  SceneTerminal     ( 288– 587, 10 s): Terminal demo — /watch command live
//  Scene 2           ( 576– 875, 10 s): "Claude reads. Claude watches. Same time."
//  SceneYouTube      ( 864–1163, 10 s): "For example, you have a viral video…"
//  Scene 3           (1152–1451, 10 s): Phone in hand — video plays in iPhone frame
//  SceneUseCases     (1440–1739, 10 s): "Watch anything. Ask anything." — 5 use-case cards
//  Scene 4           (1728–2027, 10 s): "Follow & Subscribe." CTA
//
//  Each scene overlaps the previous by 12 frames (crossfade).
// ─────────────────────────────────────────────────────────────────────────────

export const ClaudeReadsFrames: React.FC = () => (
  <AbsoluteFill style={{ background: '#F5F0FF', overflow: 'hidden' }}>

    {/* ── Scene 1 — frames 0–299 ──────────────────────────────────────────── */}
    <Sequence from={0} durationInFrames={300}>
      <Scene1_ClaudeSees />
    </Sequence>

    {/* ── Terminal — frames 288–587 ───────────────────────────────────────── */}
    <Sequence from={288} durationInFrames={300}>
      <SceneTerminal_Watch />
    </Sequence>

    {/* ── Scene 2 — frames 576–875 ────────────────────────────────────────── */}
    <Sequence from={576} durationInFrames={300}>
      <Scene2_ClaudeUnderstands />
    </Sequence>

    {/* ── YouTube Example — frames 864–1163 ───────────────────────────────── */}
    <Sequence from={864} durationInFrames={300}>
      <SceneYouTubeExample />
    </Sequence>

    {/* ── Scene 3 — frames 1152–1451 ──────────────────────────────────────── */}
    <Sequence from={1152} durationInFrames={300}>
      <Scene3_InPhone />
    </Sequence>

    {/* ── Use Cases — frames 1440–1739 ────────────────────────────────────── */}
    <Sequence from={1440} durationInFrames={300}>
      <SceneUseCases />
    </Sequence>

    {/* ── Scene 4 — frames 1728–2027 ──────────────────────────────────────── */}
    <Sequence from={1728} durationInFrames={300}>
      <Scene4_FollowSubscribe />
    </Sequence>

  </AbsoluteFill>
);
