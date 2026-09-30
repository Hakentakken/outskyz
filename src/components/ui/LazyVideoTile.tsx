"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface LazyVideoTileProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Gallery video tile that only starts loading once it is scrolled into view.
 *
 * Previously every gallery video on a page autoplayed immediately with no
 * poster, no preload control and no reduced-motion check — six clips on the
 * home page alone, and a large share of the ~9.9 MB of video Lighthouse
 * measured on mobile.
 *
 * Now:
 *  - nothing is fetched until the tile approaches the viewport;
 *  - `prefers-reduced-motion` users never autoplay;
 *  - the element is muted, inline and removed from the tab order.
 */
export function LazyVideoTile({ src, alt, className }: LazyVideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Without IntersectionObserver, load eagerly rather than never showing it.
    if (typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // State is set from the observer callback (an external system), not
        // synchronously from the effect body.
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
            return;
          }
        }
      },
      // Begin loading slightly before the tile scrolls into view.
      { rootMargin: "200px" },
    );

    const element = videoRef.current;
    if (!element) return;
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Autoplay can still be refused (data saver, low power). The tile then
    // stays on its first frame, which is the correct fallback.
    void video.play().catch(() => {});
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
      tabIndex={-1}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
