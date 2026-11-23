"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { JourneyMark } from "@/components/ui/JourneyMark";

/** A short travel interlude during navigation; never delays or intercepts it. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState(pathname);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [veil, setVeil] = useState<"in" | "out" | null>(null);

  // The shared layout persists between routes. Cold loads stay fully visible.
  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setHasNavigated(true);
    setVeil("out");
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname === window.location.pathname
      )
        return;
      setVeil("in");
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Navigation is never held behind a timer, even if a link is cancelled.
  useEffect(() => {
    if (!veil) return;
    const timeout = window.setTimeout(
      () => setVeil(veil === "in" ? "out" : null),
      veil === "in" ? 220 : 540,
    );
    return () => window.clearTimeout(timeout);
  }, [veil]);

  return (
    <>
      {veil ? (
        <div aria-hidden="true" className={"route-veil route-veil-" + veil}>
          <JourneyMark />
        </div>
      ) : null}
      <main
        key={pathname}
        className={
          "page-transition flex flex-1 flex-col" +
          (hasNavigated ? " enter-page" : "")
        }
      >
        {children}
      </main>
    </>
  );
}
