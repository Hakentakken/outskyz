"use client";

import { useState } from "react";
import { resources } from "@/config/resources";

/**
 * A single autoplaying player that advances through the supplied documentary
 * clips in order. Keeping one <video> in the hero avoids changing its layout.
 */
export function DocumentaryReel() {
  const [activeClip, setActiveClip] = useState(0);
  const clips = resources.documentary;

  return (
    <video
      key={clips[activeClip]}
      autoPlay
      muted
      loop={clips.length === 1}
      playsInline
      preload="auto"
      poster={resources.sky.heroPoster}
      onEnded={() => setActiveClip((clip) => (clip + 1) % clips.length)}
      onError={() => setActiveClip((clip) => (clip + 1) % clips.length)}
      className="h-full w-full object-cover"
      aria-label="Outskyz documentary reel"
    >
      <source src={clips[activeClip]} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
