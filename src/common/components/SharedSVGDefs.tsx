import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────
//  SharedSVGDefs — Common SVG filter definitions
//
//  Include once per SVG element in your composition:
//    <svg ...>
//      <SharedSVGDefs />
//      ...your elements...
//    </svg>
//
//  Reference filters by ID:
//    filter="url(#glow-sm)"   — tight halo (particles, highlights)
//    filter="url(#glow-md)"   — medium glow (cards, panels, icons)
//    filter="url(#glow-lg)"   — wide glow (backgrounds, beams)
//    filter="url(#glow-xl)"   — huge blur (aurora background blobs)
//    filter="url(#ray-glow)"  — narrow horizontal glow (scan beams, rays)
// ─────────────────────────────────────────────────────────────────────────────

export const SharedSVGDefs: React.FC = () => (
  <defs>
    {/* Small glow — tight halo, used on particles, dots, highlights */}
    <filter id="glow-sm" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    {/* Medium glow — cards, panels, mid-range elements */}
    <filter id="glow-md" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="12" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    {/* Large glow — background halos, big panels, brain core */}
    <filter id="glow-lg" x="-130%" y="-130%" width="360%" height="360%">
      <feGaussianBlur stdDeviation="28" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    {/* Extra-large glow — aurora background blobs */}
    <filter id="glow-xl" x="-150%" y="-150%" width="400%" height="400%">
      <feGaussianBlur stdDeviation="80" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    {/* Ray glow — narrow shape, good for scan beams and light rays */}
    <filter id="ray-glow" x="-5%" y="-600%" width="110%" height="1300%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);
