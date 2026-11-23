/**
 * Reusable cinematic motion primitives — server-safe, CSS-driven.
 *
 * WHY THIS SHAPE
 * --------------
 * framer-motion serialises `initial={{ opacity: 0 }}` into server HTML as
 * `style="opacity:0"`, which hid LCP content until hydration (+2.2 s render
 * delay measured). These primitives render fully visible markup; motion arms
 * only after hydration:
 *
 *   1. <RevealProvider /> (mounted once in the root layout) adds
 *      `js-reveal-armed` to <html> in a rAF callback, so `.reveal` elements
 *      only start hidden when JS can actually observe them.
 *   2. Each <Reveal> observes itself and flips to `.is-visible` on entry.
 *   3. No-JS / reduced-motion visitors always see final-state content.
 *
 * USAGE
 * -----
 *   <Reveal>block that rises in on scroll</Reveal>
 *   <Reveal variant="left" delay={150}>…</Reveal>
 *   <Reveal as="li" variant="scale">…</Reveal>
 *   <Reveal as="h2" variant="mask">headline that rises into frame</Reveal>
 *
 * `<Section animate="…">` renders through this component, so a whole section
 * can be given one reveal while its children carry their own staggered steps —
 * a single motion language for the site rather than one per section.
 */
"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/utils/cn";

/** Mount once in the root layout: arms `.reveal` motion after hydration. */
export function RevealProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      document.documentElement.classList.add("js-reveal-armed");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return null;
}

export type RevealVariant =
  | "fade-up"
  | "fade"
  | "scale"
  | "left"
  | "right"
  | "mask";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Visual variant: default rise, fade (no shift), scale, sides, or mask. */
  variant?: RevealVariant;
  /** Stagger step in ms. Only ever applied to this element's own transition. */
  delay?: number;
  as?:
    | "div"
    | "span"
    | "li"
    | "figure"
    | "article"
    | "section"
    | "h2"
    | "h3";
  style?: CSSProperties;
  id?: string;
}

const variantClass: Record<RevealVariant, string | null> = {
  "fade-up": null,
  fade: "reveal-fade",
  scale: "reveal-scale",
  left: "reveal-left",
  right: "reveal-right",
  mask: "reveal-mask",
};

/** Maps the legacy `animate` prop names onto the reveal variants. */
export const revealVariantFromAnimation = {
  "fade-up": "fade-up",
  "fade-in": "fade",
  "scale-in": "scale",
  "slide-left": "left",
  "slide-right": "right",
} as const satisfies Record<string, RevealVariant>;


export function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  as: Tag = "div",
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The mask variant clips an inner span, so the measured element stays put
  // while the text rises through it.
  const isMask = variant === "mask";

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
      className={cn("reveal", variantClass[variant], className)}
    >
      {isMask ? <span>{children}</span> : children}
    </Tag>
  );
}
