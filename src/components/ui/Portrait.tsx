"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface PortraitProps {
  /** Image URL for the person's photograph. */
  src: string;
  /** Full name — used for alt text and to derive the initials fallback. */
  name: string;
  /** Short role label, used for the initials placeholder sub-label. */
  role?: string;
  /** `fill` (default) fills the positioned parent; `cover` sets its own aspect box. */
  mode?: "fill" | "cover";
  /** Aspect ratio applied when `mode="cover"`. */
  aspect?: string;
  /** Always eager-load (the first portrait in a grid). */
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** `object-position` for the photograph. */
  position?: string;
}

/** Derive up to two uppercase initials from a person's name. */
function initialsOf(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Portrait image with a graceful initials fallback.
 *
 * The photograph is the primary content. If it fails to load (missing file,
 * 404, decode error) we swap to a branded initials avatar rather than
 * showing a broken image — the initials are a *fallback*, never the default.
 */
export function Portrait({
  src,
  name,
  role,
  mode = "fill",
  aspect = "aspect-[3/4]",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
  position,
}: PortraitProps) {
  const [failed, setFailed] = useState(false);
  const initials = initialsOf(name);

  const frameClass =
    mode === "fill"
      ? "absolute inset-0 h-full w-full"
      : cn("relative overflow-hidden", aspect);

  if (failed || !src) {
    return (
      <div
        className={cn(
          frameClass,
          "flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-coal to-void",
          className,
        )}
        role="img"
        aria-label={`${name}${role ? `, ${role}` : ""}`}
      >
        <span className="font-display text-5xl text-gold/40 sm:text-6xl">
          {initials}
        </span>
        {role ? (
          <span className="px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/45">
            {role}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name}${role ? `, ${role}` : ""}`}
      fill={mode === "fill"}
      {...(mode === "cover" ? { sizes } : {})}
      width={mode === "cover" ? 900 : undefined}
      height={mode === "cover" ? 1200 : undefined}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      sizes={mode === "fill" ? sizes : undefined}
      onError={() => setFailed(true)}
      className={cn(
        mode === "fill" ? "object-cover" : "h-full w-full object-cover",
        className,
      )}
      style={position ? { objectPosition: position } : undefined}
    />
  );
}