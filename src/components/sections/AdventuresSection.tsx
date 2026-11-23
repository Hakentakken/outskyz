"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { adventures } from "@/data/homepage";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 2 - Featured Adventures.
 *
 * Each card is one shot: the frame pushes in from 1.06 and settles as the card
 * reveals, the card lifts on hover, and a gold rule sweeps under the caption.
 *
 * STRUCTURE NOTE
 * --------------
 * The reveal wrapper and the interactive card are separate elements on
 * purpose. `.reveal` owns opacity/transform through unlayered CSS, which in a
 * cascade-layer setup outranks Tailwind's utilities - so a hover transform or
 * transition utility placed on the *same* element would be dead. The wrapper
 * animates; the inner card keeps the hover choreography.
 */
export function AdventuresSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Adventures"
        title="Experiences That Push Your Limits"
        align="center"
      />

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adventures.map((adventure, index) => {
          const Icon = adventure.icon;
          return (
            <Reveal
              key={adventure.id}
              as="article"
              delay={Math.min(index, 5) * 80}
              className="group"
            >
              <div className="img-cinematic relative aspect-[4/5] overflow-hidden rounded-md border border-gold/30 bg-void/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)]">
                <Image
                  src={adventure.image}
                  alt={adventure.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />

                <span className="absolute left-5 top-5 font-display text-3xl text-gold/80">
                  {adventure.number}
                </span>

                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 bg-void/50 text-gold backdrop-blur-sm">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span aria-hidden="true" className="cine-line block h-px w-full bg-ivory/10" />
                  <h3 className="mt-4 font-display text-2xl text-ivory leading-tight">
                    {adventure.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                    {adventure.description}
                  </p>
                  <Link
                    href="/adventures"
                    className="mt-4 inline-flex min-h-[44px] items-center gap-2 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
                  >
                    Discover
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
          );
        })}
      </div>
    </Section>
  );
}