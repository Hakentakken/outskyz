"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Module-level flag: false on a full page load, true after the first mount.
 * It survives client-side navigations within one JS session, which is exactly
 * the distinction we need — see below.
 */
let hasMounted = false;

/** How long the veil takes to fade in (fast — the route swaps underneath it). */
const VEIL_IN_MS = 180;
/** Total veil life; the fade-out overlaps the new page's entrance. */
const VEIL_TOTAL_MS = 560;

/**
 * Wraps page content in a cinematic route transition.
 *
 * SEQUENCE (in-session navigations only)
 * --------------------------------------
 *   click an internal link
 *     → a full-screen dark veil fades IN (180ms) while the route swaps
 *       underneath — navigation is never delayed or blocked
 *     → the veil fades OUT (380ms) over the new page, which plays its own
 *       `enter-page` rise underneath
 *   Total ≈ 560ms — fast enough to never feel like a loading screen.
 *
 * Programmatic / back-forward navigations (no click captured) skip the fade-in
 * and just play the fade-out, so the transition never looks wrong either way.
 *
 * IMPORTANT — why the first render skips everything:
 * An element that starts at `opacity: 0` is not eligible to be an LCP
 * candidate, and framer-motion serialised `initial={{ opacity: 0 }}` into the
 * server-rendered HTML. That shipped the *entire page* as `style="opacity:0"`,
 * so First Contentful Paint equalled hydration time and Lighthouse fell back to
 * the header logo as the largest element.
 *
 * The veil is created only AFTER a click in a running session (`hasMounted`),
 * so a cold load never sees it and the LCP surface paints with the document.
 * The page entrance itself remains pure CSS (`enter-page` in globals.css) —
 * nothing depends on hydration, framer-motion stays out of the shared layout
 * bundle, and `prefers-reduced-motion` is honoured by the global rule that
 * collapses animation durations.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Captured once per mount, from a module-level flag rather than a ref, so
  // nothing is read from a ref during render. It is false for the first render
  // of a full page load and true for in-session route changes.
  const [isInitialLoad] = useState(() => !hasMounted);
  // Which phase the veil is in: "in" covers while the route swaps, "out"
  // reveals the new page. null = no veil at all (cold load / idle).
  const [veil, setVeil] = useState<"in" | "out" | null>(null);
  // Tracked during render (the React-endorsed adjust-state-while-rendering
  // pattern, same as Navbar) so no effect has to setState synchronously.
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Route changed: play the fade-out over the new page. Programmatic /
  // back-forward navigations (no click veil) get the same fade-out started
  // from full cover. A cold load never reaches this — prevPathname matches.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (!isInitialLoad) setVeil("out");
  }

  useEffect(() => {
    hasMounted = true;
  }, []);

  // Capture internal navigations so the veil can fade IN before the swap.
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("/") || anchor.target === "_blank") return;
      setVeil("in");
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Safety: if no route change follows the click (hash link, same-page link,
  // prevented navigation), release the veil so it can never strand the screen.
  useEffect(() => {
    if (veil !== "in") return;
    const timeout = window.setTimeout(() => setVeil("out"), VEIL_IN_MS + 80);
    return () => window.clearTimeout(timeout);
  }, [veil]);

  // Retire the veil after its animation.
  useEffect(() => {
    if (veil !== "out") return;
    const timeout = window.setTimeout(() => setVeil(null), VEIL_TOTAL_MS);
    return () => window.clearTimeout(timeout);
  }, [veil]);

  return (
    <>
      {veil ? (
        <div
          aria-hidden="true"
          className={
            veil === "in" ? "route-veil route-veil-in" : "route-veil route-veil-out"
          }
        />
      ) : null}
      <main
        // Remounting on pathname change is what restarts the CSS animation.
        key={pathname}
        className={
          isInitialLoad
            ? "page-transition flex flex-1 flex-col"
            : "page-transition enter-page flex flex-1 flex-col"
        }
      >
        {children}
      </main>
    </>
  );
}
