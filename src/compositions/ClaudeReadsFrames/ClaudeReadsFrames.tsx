import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1_ClaudeSees }        from './Scene1_ClaudeSees';
import { SceneTerminal_Watch }      from './SceneTerminal_Watch';
import { Scene2_ClaudeUnderstands } from './Scene2_ClaudeUnderstands';
import { SceneYouTubeExample }      from './SceneYouTubeExample';
import { SceneResult }              from './SceneResult';
import { SceneDecode }              from './SceneDecode';
import { Scene3_InPhone }           from './Scene3_InPhone';
import { SceneUseCases }            from './SceneUseCases';
import { Scene4_FollowSubscribe }   from './Scene4_FollowSubscribe';

// ─────────────────────────────────────────────────────────────────────────────
//  ClaudeReadsFrames — Main composition  (2604 frames = 86.8 s @ 30 fps)
//
//  Scene 1        (   0– 299): "Claude now watches video."
//  Terminal       ( 288– 587): Terminal demo — /watch command live
//  Scene 2        ( 576– 875): "Claude reads. Claude watches. Same time."
//  YouTube (03)   ( 864–1163): "For example, you have a viral video…"
//  Result  (04)   (1152–1451): 30 min → 2 min.  Broken down. Rewritten. Done.
//  Decode  (05)   (1440–1739): Every top creator. Decoded.
//  Scene 3        (1728–2027): Phone in hand — video plays in iPhone frame
//  UseCases       (2016–2315): "Watch anything. Ask anything." — 5 cards
//  Scene 4        (2304–2603): "Follow & Subscribe." CTA
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

    {/* ── YouTube Example (03) — frames 864–1163 ──────────────────────────── */}
    <Sequence from={864} durationInFrames={300}>
      <SceneYouTubeExample />
    </Sequence>

    {/* ── Result (04) — frames 1152–1451 ──────────────────────────────────── */}
    <Sequence from={1152} durationInFrames={300}>
      <SceneResult />
    </Sequence>

    {/* ── Decode (05) — frames 1440–1739 ──────────────────────────────────── */}
    <Sequence from={1440} durationInFrames={300}>
      <SceneDecode />
    </Sequence>

    {/* ── Scene 3 — frames 1728–2027 ──────────────────────────────────────── */}
    <Sequence from={1728} durationInFrames={300}>
      <Scene3_InPhone />
    </Sequence>

    {/* ── Use Cases — frames 2016–2315 ────────────────────────────────────── */}
    <Sequence from={2016} durationInFrames={300}>
      <SceneUseCases />
    </Sequence>

    {/* ── Scene 4 — frames 2304–2603 ──────────────────────────────────────── */}
    <Sequence from={2304} durationInFrames={300}>
      <Scene4_FollowSubscribe />
    </Sequence>

  </AbsoluteFill>
);
