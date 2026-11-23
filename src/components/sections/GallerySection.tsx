"use client";

import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyVideoTile } from "@/components/ui/LazyVideoTile";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";
import { gallery } from "@/data/homepage";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 8 - Gallery Preview.
 *
 * A contact sheet: tiles step in 60ms apart and each frame settles from 1.06,
 * so the grid assembles like shots being laid down rather than popping in.
 * The span classes live on the reveal wrapper (the grid item) and the aspect
 * box lives on the tile inside it, which keeps the masonry shape identical to
 * the pre-reveal layout.
 */
export function GallerySection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow={gallery.eyebrow}
        title={gallery.heading}
        description={gallery.description}
        align="center"
      />

      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.images.map((image, index) => (
          <Reveal
            key={image.src}
            delay={Math.min(index, 7) * 60}
            className={cn(
              "group",
              index === 0 ? "col-span-2 row-span-2" : null,
              index === 3 ? "col-span-2" : null,
            )}
          >
            <div
              className={cn(
                "img-cinematic relative overflow-hidden rounded-md border border-gold/30 bg-void/60 transition-[border-color] duration-500 hover:border-gold/50",
                index === 3 ? "aspect-[2/1]" : "aspect-square",
              )}
            >
              {image.type === "video" ? (
                <LazyVideoTile src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal variant="fade" delay={120} className="mt-12 flex justify-center">
        <Link
          href={gallery.cta.href}
          className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
        >
          {gallery.cta.label}
        </Link>
      </Reveal>
    </Section>
  );
}