"use client";

import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/sections/Section";
import { GoldLine } from "@/components/ui/GoldLine";
import { Reveal } from "@/components/ui/Reveal";
import { foundersPreview } from "@/data/founders";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 6 - Founders Preview.
 *
 * Two shots cutting against each other: the copy slides in from the left, the
 * frame from the right, and the portrait inside settles from 1.06 so the pair
 * lands as one beat. Hovering the frame pushes the photograph back in.
 */
export function FoundersSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left - content */}
        <Reveal variant="left">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {foundersPreview.eyebrow}
          </p>
          <h2 className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
            {foundersPreview.heading}
          </h2>
          <GoldLine className="mt-6" />
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {foundersPreview.description}
          </p>
          <Link
            href={foundersPreview.cta.href}
            className="mt-8 inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            {foundersPreview.cta.label}
          </Link>
        </Reveal>

        {/* Right - image. The frame itself carries `img-cinematic`, so the
            settle-and-push treatment applies to the photograph inside it. */}
        <Reveal
          variant="right"
          delay={120}
          className="img-cinematic relative aspect-[4/3] overflow-hidden rounded-md border border-gold/20 bg-coal"
        >
          <Image
            src={foundersPreview.image}
            alt="Outskyz founders"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent" />
        </Reveal>
      </div>
    </Section>
  );
}