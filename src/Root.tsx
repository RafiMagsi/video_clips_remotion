import React from "react";
import { Composition } from "remotion";
import { IPhoneComposition } from "./IPhoneComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/*
        ┌─────────────────────────────────────────────┐
        │  iPhone 16 Frame — 9:16 Social Media Video  │
        │  1080 × 1920 @ 30fps                        │
        │  Duration: 10 seconds (300 frames)          │
        └─────────────────────────────────────────────┘
      */}
      <Composition
        id="IPhone16Frame"
        component={IPhoneComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
