"use client";

import { useEffect, useRef, useState } from "react";
import { resources } from "@/config/resources";

/**
 * Hero background video.
 *
 * PERFORMANCE (measured with Lighthouse, mobile, simulated throttling):
 * the previous implementation streamed Google Drive clips through the
 * `/api/drive/:id` serverless proxy. That cost ~9.9 MB of transfer on the home
 * page and pushed LCP to 7.2 s, because every hero view was a round-trip to
 * Drive before a frame could paint.
 *
 * The reel is now decorative. The poster image paints immediately and IS the
 * LCP element; video is attached only when it is likely to help — no reduced
 * motion, no data saver, not on 3G, and not on small screens. If anything goes
 * wrong we simply keep the poster, so the hero can never be blank.
 */
export function DocumentaryReel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Start false: the poster shows until we decide the video is worth loading.
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced-motion: never autoplay video for these users.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Don't spend a visitor's data on mobile or a slow connection.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$|^3g$/.test(conn.effectiveType)) return;
    if (window.innerWidth < 768) return;

    // Defer the state update out of the effect body (see LazyVideoTile).
    const id = window.setTimeout(() => setShouldLoad(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      {/* Poster always renders first, so the hero has a painted image before
          any video byte is requested. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${resources.sky.heroPoster})` }}
      />
      {shouldLoad ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          // metadata first: never block first paint on the video body
          preload="metadata"
          poster={resources.sky.heroPoster}
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={resources.sky.altitudeVideo} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
