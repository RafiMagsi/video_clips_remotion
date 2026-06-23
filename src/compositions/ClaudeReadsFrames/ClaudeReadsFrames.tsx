import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1_ClaudeSees }        from './Scene1_ClaudeSees';
import { SceneTerminal_Watch }      from './SceneTerminal_Watch';
import { Scene2_ClaudeUnderstands } from './Scene2_ClaudeUnderstands';
import { Scene3_InPhone }           from './Scene3_InPhone';
import { Scene4_FollowSubscribe }   from './Scene4_FollowSubscribe';

// ─────────────────────────────────────────────────────────────────────────────
//  ClaudeReadsFrames — Main composition  (1500 frames = 50 s @ 30 fps)
//
//  Scene 1  (frames   0–299, 10 s):
//    "Claude now watches video. Frame by frame."
//    rotating claude icon → blur-in headlines → pills → "Now Claude sees both."
//
//  SceneTerminal  (frames 288–587, ~10 s, 12-frame crossfade overlap):
//    "Give Claude the ability to watch."
//    animated macOS terminal — /watch command types out, output streams in
//    camera: 3D tilt → settles flat, then micro-drifts
//
//  Scene 2  (frames 576–875, ~10 s, 12-frame crossfade overlap):
//    "Claude reads. Claude watches. Same time."
//    film card + ticker chips + claude icon
//
//  Scene 3  (frames 864–1163, ~10 s, 12-frame crossfade overlap):
//    Phone in hand — video.mp4 plays inside iPhone 16 frame
//
//  Scene 4  (frames 1152–1451, ~10 s, 12-frame crossfade overlap):
//    "Follow & Subscribe." CTA — platform cards
//
//  All scenes share PastelBackground (animated glows, glitter, shooting stars)
// ─────────────────────────────────────────────────────────────────────────────

export const ClaudeReadsFrames: React.FC = () => (
  <AbsoluteFill style={{ background: '#F5F0FF', overflow: 'hidden' }}>

    {/* ── Scene 1 — frames 0–299 (10 s) ─────────────────────────────────── */}
    <Sequence from={0} durationInFrames={300}>
      <Scene1_ClaudeSees />
    </Sequence>

    {/* ── Terminal scene — frames 288–587 (12-frame crossfade) ───────────── */}
    <Sequence from={288} durationInFrames={300}>
      <SceneTerminal_Watch />
    </Sequence>

    {/* ── Scene 2 — frames 576–875 (12-frame crossfade) ──────────────────── */}
    <Sequence from={576} durationInFrames={300}>
      <Scene2_ClaudeUnderstands />
    </Sequence>

    {/* ── Scene 3 — frames 864–1163 (12-frame crossfade) ─────────────────── */}
    <Sequence from={864} durationInFrames={300}>
      <Scene3_InPhone />
    </Sequence>

    {/* ── Scene 4 — frames 1152–1451 (12-frame crossfade) ────────────────── */}
    <Sequence from={1152} durationInFrames={300}>
      <Scene4_FollowSubscribe />
    </Sequence>

  </AbsoluteFill>
);
