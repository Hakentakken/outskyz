"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Module-level flag: false on a full page load, true after the first mount.
 * It survives client-side navigations within one JS session, which is exactly
 * the distinction we need — see below.
 */
let hasMounted = false;

/**
 * Wraps page content in a short entrance transition.
 *
 * IMPORTANT — why the first render skips the animation:
 * An element that starts at `opacity: 0` is not eligible to be an LCP
 * candidate, and framer-motion serialised `initial={{ opacity: 0 }}` into the
 * server-rendered HTML. That shipped the *entire page* as `style="opacity:0"`,
 * so First Contentful Paint equalled hydration time and Lighthouse fell back to
 * the header logo as the largest element.
 *
 * The motion is pure CSS now (`enter-page` in globals.css), so nothing depends
 * on hydration, framer-motion drops out of the shared layout bundle entirely,
 * and `prefers-reduced-motion` is honoured by the global rule that collapses
 * animation durations.
 *
 * Skipping it on a cold load costs nothing visually — there is no "from" state
 * to animate out of, the page simply appears — and it keeps the transition for
 * the case it was written for: navigating between routes in a running session.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Captured once per mount, from a module-level flag rather than a ref, so
  // nothing is read from a ref during render. It is false for the first render
  // of a full page load and true for in-session route changes.
  const [isInitialLoad] = useState(() => !hasMounted);

  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
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
  );
}
