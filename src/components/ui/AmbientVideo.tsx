"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface AmbientVideoProps {
  /** Video source. Only attached to the DOM once it is worth the bytes. */
  src: string;
  /**
   * Poster image. Always rendered as a CSS background layer, so it paints with
   * the rest of the page and doubles as the permanent fallback.
   */
  poster: string;
  /** Extra classes for the video/poster layer (opacity, object position, ...). */
  className?: string;
  /**
   * Smallest viewport that justifies a full-bleed video. Mobile is excluded by
   * default: a 2 MB clip costs a phone visitor far more than the ambience is
   * worth, and the poster already carries the look.
   */
  minWidth?: number;
}

/**
 * Decorative full-bleed background video with a poster-first strategy.
 *
 * WHY THIS EXISTS
 * ---------------
 * Two sections previously hard-coded `<video autoPlay>` in the markup. Because
 * those tags were server-rendered they began downloading immediately on every
 * device — including phones on metered connections — and Lighthouse measured
 * 2.1 MB of media on the mobile home page from a single clip, plus the
 * main-thread cost of decoding it.
 *
 * Rules, in order:
 *   1. The poster layer renders unconditionally. It is the LCP surface and the
 *      accessible fallback, and it can never leave a blank hero.
 *   2. Video is skipped entirely for `prefers-reduced-motion` users.
 *   3. Video is skipped on data-saver and on 2G/3G connections.
 *   4. Video is skipped below `minWidth`.
 *   5. Even when eligible, the element is only mounted once it is near the
 *      viewport, and `preload="none"` keeps the initial paint clear of it.
 * Autoplay can still be refused (low power mode); the poster then simply
 * remains visible, which is the intended fallback rather than an error.
 */
export function AmbientVideo({
  src,
  poster,
  className,
  minWidth = 768,
}: AmbientVideoProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$|^3g$/.test(conn.effectiveType)) return;
    if (window.innerWidth < minWidth) return;

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  setShouldLoad(true);
                  observer?.disconnect();
                  return;
                }
              }
            },
            { rootMargin: "200px" },
          );

    if (!observer) {
      // No IntersectionObserver: load, but never synchronously inside the
      // effect body (that triggers a cascading re-render during commit).
      const id = window.setTimeout(() => setShouldLoad(true), 0);
      return () => window.clearTimeout(id);
    }

    const host = hostRef.current;
    if (!host) return;
    observer.observe(host);
    return () => observer.disconnect();
  }, [minWidth]);

  return (
    <div ref={hostRef} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div
        className={cn("absolute inset-0 bg-cover bg-center", className)}
        style={{ backgroundImage: `url(${poster})` }}
      />
      {shouldLoad ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          tabIndex={-1}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
