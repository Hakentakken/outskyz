"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { resources } from "@/config/resources";

/**
 * Home hero documentary reel — the ORIGINAL six OUTSKYZ clips played as one
 * continuous documentary.
 *
 * HISTORY / WHY THIS EXISTS
 * --------------------------
 * The documentary was deliberately split into six files (they total ~279 MB,
 * which GitHub cannot host), so the originals live on Google Drive and are
 * streamed same-origin through `/api/drive/:id` — see `src/config/gdrive.ts`
 * for the file IDs and their original order. This component plays them
 * back-to-back through a single <video> element (one clip in the DOM at a
 * time), so the visitor experiences ONE reel with no visible gaps.
 *
 * The original `DocumentaryReel` was removed during the Phase 3 performance
 * pass; this restores the complete sequence with the poster-first safeguards
 * that pass introduced:
 *
 *  1. The poster layer renders unconditionally — the hero can never be blank
 *     and the poster is still the LCP surface.
 *  2. Autoplay is skipped only for visitors for whom the video is not worth
 *     its bytes (reduced motion, data saver, 2G/3G, viewport < 768px).
 *     Everyone else gets a play button, so the documentary stays one tap
 *     away on mobile.
 *  3. Clips advance on `ended` (the original behaviour) and are ALSO skipped
 *     if the Drive proxy never delivers data (watchdog) or the clip errors —
 *     one stalled clip can never freeze the reel.
 *  4. If every Drive clip has failed once, we fall back to the locally
 *     hosted clip so the hero always shows motion.
 *  5. Only the NEXT clip is preloaded, never the whole 279 MB reel.
 *
 * PHASE B (cinematic overhaul) — PRESENTATION ONLY
 * ------------------------------------------------
 * Everything below marked PRESENTATION is chrome around the untouched
 * playback engine above it: the crossfade, chapter rail, film grain and the
 * play-button relief are pure CSS driven by the same `activeClip` /
 * `running` state. The clip order, the single-<video> contract, the
 * watchdog, the fallback chain and the prefetch of exactly one next clip
 * are unchanged.
 */
export function DocumentaryReel() {
  const clips = resources.documentary;
  const localFallback = resources.sky.altitudeVideo;

  const [activeClip, setActiveClip] = useState(0);
  /** True once the visitor (or an eligible auto-start) begins the reel. */
  const [running, setRunning] = useState(false);
  /** True after every Drive clip has errored at least once. */
  const [usingFallback, setUsingFallback] = useState(false);
  /** True when even the local fallback clip failed to play. */
  const [fallbackFailed, setFallbackFailed] = useState(false);
  /**
   * True when the browser refused to autoplay the reel (headless/low-power
   * environments). Surfaces the play button so one tap can still start it —
   * the click supplies the user gesture autoplay needs.
   */
  const [playbackRefused, setPlaybackRefused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Clips that already errored, so we know when to switch to the fallback. */
  const failedClipsRef = useRef<Set<number>>(new Set());
  /** Watchdog for a clip whose bytes never arrive through the Drive proxy. */
  const watchdogRef = useRef<number | null>(null);

  const source = usingFallback ? localFallback : clips[activeClip];

  const clearWatchdog = () => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  const advance = () => {
    if (usingFallback) return;
    setActiveClip((clip) => (clip + 1) % clips.length);
  };

  // Auto-start only for visitors for whom the video is worth its bytes.
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
    if (window.innerWidth < 768) return;

    // Defer out of the effect body (same pattern as LazyVideoTile) so the
    // first commit is never cascaded by a synchronous state update.
    const id = window.setTimeout(() => setRunning(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Watchdog: a Drive round-trip can stall (browsers abort media requests
  // after ~15 s of no data). If the active clip has not delivered any bytes
  // within 25 s, skip to the next one instead of holding a frozen frame.
  useEffect(() => {
    if (!running || usingFallback || fallbackFailed) return;
    clearWatchdog();
    watchdogRef.current = window.setTimeout(() => {
      watchdogRef.current = null;
      advance();
    }, 25_000);
    return clearWatchdog;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, activeClip, usingFallback, fallbackFailed]);

  // Clear any pending watchdog when the reel unmounts.
  useEffect(() => clearWatchdog, []);

  const handleEnded = () => {
    // Original behaviour: run the reel as one looping documentary.
    advance();
  };

  const handlePlaying = () => {
    // Playback started — the clip arrived, so the stall watchdog can retire
    // and any earlier autoplay refusal no longer applies.
    clearWatchdog();
    setPlaybackRefused(false);
  };

  const handleCanPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (!video.paused) return;
    // The autoplay attribute can be refused (see `playbackRefused`). Retry
    // once; if this element is still mounted and still paused, surface the
    // play button rather than leaving a silently frozen reel.
    video.play().catch(() => {
      if (video.isConnected && video.paused) setPlaybackRefused(true);
    });
  };

  const handleError = () => {
    if (usingFallback) {
      // Even the local clip failed — keep the poster, stop the reel.
      clearWatchdog();
      setFallbackFailed(true);
      return;
    }
    failedClipsRef.current.add(activeClip);
    if (failedClipsRef.current.size >= clips.length) {
      // Every Drive clip failed at once (proxy outage) — never cycle the
      // poster through six timeouts; switch to the local clip for motion.
      clearWatchdog();
      setUsingFallback(true);
      return;
    }
    advance();
  };

  const nextClipIndex = (activeClip + 1) % clips.length;
  // PRESENTATION: which chapter dot is lit — derived, never stored.
  const currentChapter = usingFallback ? -1 : activeClip;

  return (
    <>
      {/* Decorative backdrop: poster-first, same contract as AmbientVideo. */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {/* Poster always renders: the LCP surface and permanent fallback. */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${resources.sky.heroPoster})` }}
        />

        {running && !fallbackFailed ? (
          <video
            // PRESENTATION: crossfade between chapters. The key changes per
            // clip, so the incoming <video> mounts on top and fades in via
            // `.reel-clip-in` while the old one unmounts beneath it — the
            // playback engine itself still owns exactly one live clip.
            key={source}
            ref={videoRef}
            autoPlay
            muted
            playsInline
            // One clip at a time; the reel never mounts more than one player.
            preload="auto"
            poster={resources.sky.heroPoster}
            tabIndex={-1}
            onEnded={handleEnded}
            onPlaying={handlePlaying}
            onCanPlay={handleCanPlay}
            onError={handleError}
            className="reel-clip-in absolute inset-0 h-full w-full object-cover"
          >
            <source src={source} type="video/mp4" />
          </video>
        ) : null}

        {/* PRESENTATION: scrims + grain. Static gradients keep the headline
            legible against any frame; the grain is a tiny tiled SVG at very
            low opacity — no canvas, no per-frame cost. */}
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/72 to-[#061b35]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-[#061b35]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,transparent_55%,rgba(2,10,20,0.55)_100%)]" />
        <div className="reel-grain absolute inset-0 opacity-[0.07]" />

        {/* Preload ONLY the next Drive clip while the current one plays, so
            the hand-off between clips has no buffering gap. Kept offscreen so
            the browser still fetches its byte ranges. */}
        {running && !usingFallback && !fallbackFailed ? (
          <video
            key={`prefetch-${clips[nextClipIndex]}`}
            src={clips[nextClipIndex]}
            preload="auto"
            muted
            playsInline
            tabIndex={-1}
            className="pointer-events-none absolute -left-[9999px] h-px w-px opacity-0"
          />
        ) : null}
      </div>

      {/* PRESENTATION: chapter rail — "THE OUTSKYZ FILM · 01 / 06" with a
          hairline progress track. Driven by `activeClip`; seeking reuses the
          same single-<video> hand-off as natural `ended` advancement. */}
      {running && !fallbackFailed && !usingFallback ? (
        <div className="absolute bottom-5 left-6 z-20 sm:left-8 lg:bottom-8 lg:left-12">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-gold/90">
            The Outskyz film
          </p>
          <p
            aria-live="polite"
            className="mt-2 font-display text-sm tracking-[0.2em] text-ivory/85"
          >
            {String(currentChapter + 1).padStart(2, "0")}
            <span className="mx-2 text-ivory/35">/</span>
            <span className="text-ivory/50">
              {String(clips.length).padStart(2, "0")}
            </span>
          </p>
          <div
            role="tablist"
            aria-label="Documentary chapters"
            className="mt-3 flex items-center gap-2"
          >
            {clips.map((clip, index) => (
              <button
                key={clip}
                type="button"
                role="tab"
                aria-selected={index === currentChapter}
                aria-label={`Play chapter ${index + 1} of ${clips.length}`}
                onClick={() => setActiveClip(index)}
                className="group flex min-h-[44px] min-w-[44px] items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className={
                    index === currentChapter
                      ? "h-[2px] w-8 bg-gold shadow-[0_0_12px_rgba(212,175,55,0.7)]"
                      : "h-px w-5 bg-ivory/30 transition-all duration-300 group-hover:w-7 group-hover:bg-gold/70"
                  }
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* One-tap start for visitors the autoplay gate skipped (mobile,
          reduced motion, data saver) and for any environment that refused
          the autoplay attribute — the click supplies the user gesture.
          Lives OUTSIDE the aria-hidden backdrop so it stays focusable. */}
      {!running || fallbackFailed || playbackRefused ? (
        <button
          type="button"
          aria-label="Play the Outskyz documentary"
          onClick={() => {
            setFallbackFailed(false);
            setPlaybackRefused(false);
            setRunning(true);
            // If the player is already mounted (autoplay-refusal path), the
            // click's transient activation lets play() start right away.
            window.setTimeout(() => videoRef.current?.play().catch(() => {}), 0);
          }}
          className="group absolute bottom-5 right-6 z-20 flex items-center gap-3 rounded-full border border-gold/50 bg-void/70 px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/15 sm:right-8 lg:bottom-8 lg:right-12"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/70 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-black">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-ivory/85">
            Play documentary
          </span>
        </button>
      ) : null}
    </>
  );
}
