"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { destinations } from "@/data/homepage";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 4 - Destinations.
 *
 * Large cinematic destination frames: the photograph is the shot, the copy is
 * the caption. Each frame settles from 1.06 as it enters, and hovering pushes
 * back in while the card border warms towards gold.
 */
export function DestinationsSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Destinations"
        title="Explore the World"
        align="center"
      />

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {destinations.map((destination, index) => (
          <Reveal
            key={destination.id}
            as="article"
            delay={Math.min(index, 3) * 90}
            className="group"
          >
            <div className="img-cinematic relative aspect-[16/10] overflow-hidden rounded-md border border-gold/30 bg-void/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)] sm:aspect-[16/9]">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                  {destination.country}
                </p>
                <h3 className="font-display text-3xl text-ivory sm:text-4xl leading-tight">
                  {destination.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/65">
                  {destination.description}
                </p>
                <Link
                  href="/destinations"
                  className="mt-3 inline-flex min-h-[44px] items-center gap-2 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
                >
                  Explore
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 bottom-2 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}