"use client";

import { useState } from "react";
import { resources } from "@/config/resources";

/**
 * A single autoplaying player that advances through the supplied documentary
 * clips in order. Keeping one <video> in the hero avoids changing its layout.
 *
 * The documentary clips are hosted on Google Drive and streamed through our
 * `/api/drive/:id` proxy. Each proxy request round-trips to Drive, adding
 * significant latency (16–33 s on localhost). Browsers abort a media
 * element's network request after ~15 s of no data and fire `onError`.
 *
 * The original `onError` handler advanced to the next clip, which meant the
 * poster image flashed repeatedly as *every* Drive source timed out in turn.
 * We now switch to a locally-hosted fallback clip on the first error, so the
 * hero always shows motion. On successful playback, clips still advance as
 * intended.
 */
export function DocumentaryReel() {
  const clips = resources.documentary;
  const [activeClip, setActiveClip] = useState(0);
  const [fallback, setFallback] = useState(false);

  // Advance to the next clip only when Drive-hosted clips are still working.
  const handleEnded = () => {
    if (!fallback) {
      setActiveClip((clip) => (clip + 1) % clips.length);
    }
  };

  // On the first media error, switch to the local fallback. Do NOT keep
  // cycling through Drive clips — each would also time out and the same
  // poster image would flash repeatedly (the "image repeated many times"
  // bug the user reported).
  const handleError = () => {
    if (!fallback) setFallback(true);
  };

  const source = fallback ? resources.sky.altitudeVideo : clips[activeClip];

  return (
    <video
      key={source}
      autoPlay
      muted
      loop={fallback}
      playsInline
      preload={fallback ? "auto" : "metadata"}
      poster={resources.sky.heroPoster}
      onEnded={handleEnded}
      onError={handleError}
      className="h-full w-full object-cover"
      aria-label="Outskyz documentary reel"
    >
      <source src={source} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
