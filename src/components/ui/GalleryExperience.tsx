"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, Play, X } from "lucide-react";
import { LazyVideoTile } from "@/components/ui/LazyVideoTile";
import { Reveal } from "@/components/ui/Reveal";

interface GalleryMedia {
  src: string;
  alt: string;
  type: "image" | "video";
}

interface GalleryExperienceProps {
  images: readonly GalleryMedia[];
  layout?: "collage" | "grid";
}

/** Native dialog supplies focus containment, Escape, and an inert background. */
export function GalleryExperience({
  images,
  layout = "grid",
}: GalleryExperienceProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const active = activeIndex === null ? undefined : images[activeIndex];
  const isOpen = Boolean(active);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    dialog.showModal();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const step = (direction: number) => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current + direction + images.length) % images.length,
    );
  };

  return (
    <>
      <div
        className={layout === "collage" ? "gallery-collage" : "gallery-grid"}
      >
        {images.map((media, index) => (
          <Reveal
            key={media.src}
            delay={(index % 3) * 80}
            className="gallery-frame"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="gallery-open group bg-coal relative block h-full w-full overflow-hidden text-left"
              aria-label={"Open " + media.alt}
            >
              {media.type === "video" ? (
                <LazyVideoTile src={media.src} alt={media.alt} />
              ) : (
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes={
                    layout === "collage"
                      ? "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 60vw"
                      : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  }
                  className="object-cover"
                />
              )}
              <span
                aria-hidden="true"
                className="from-void/80 to-void/15 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent"
              />
              <span className="absolute top-4 left-4 text-[0.6rem] tracking-[0.2em] text-white/90 uppercase">
                {String(index + 1).padStart(2, "0")} /{" "}
                {media.type === "video" ? "Motion" : "Still"}
              </span>
              <span className="gallery-expand bg-void/30 absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white backdrop-blur-sm">
                {media.type === "video" ? (
                  <Play className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Expand className="h-4 w-4" aria-hidden="true" />
                )}
              </span>
              <span className="font-display absolute right-4 bottom-4 left-4 text-lg leading-snug text-white sm:text-xl">
                {media.alt.replace(/^Outskyz /, "")}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-labelledby={titleId}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const controls = event.currentTarget.querySelectorAll<HTMLElement>(
              "button, video[controls]",
            );
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && event.target === first) {
              event.preventDefault();
              last?.focus();
            }
            if (!event.shiftKey && event.target === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          // Native video controls retain their arrow-key volume and seek actions.
          if ((event.target as HTMLElement).closest("video")) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        {active ? (
          <div className="gallery-viewer">
            <div className="flex items-center justify-between gap-4 pb-4">
              <p className="travel-eyebrow">Outskyz / Field notes</p>
              <button
                type="button"
                autoFocus
                onClick={() => setActiveIndex(null)}
                className="gallery-control"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="gallery-viewer-media relative overflow-hidden bg-black">
              {active.type === "video" ? (
                <video
                  key={active.src}
                  src={active.src}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-contain"
                  aria-label={active.alt}
                />
              ) : (
                <Image
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="95vw"
                  className="object-contain"
                />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 pt-5">
              <div className="min-w-0" aria-live="polite" aria-atomic="true">
                <p className="text-gold text-[0.6rem] tracking-[0.2em]">
                  {String((activeIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </p>
                <h2
                  id={titleId}
                  className="font-display text-ivory mt-1 text-base sm:text-xl"
                >
                  {active.alt}
                </h2>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="gallery-control"
                  aria-label="Previous moment"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="gallery-control"
                  aria-label="Next moment"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
