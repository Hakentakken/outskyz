"use client";

import { MapPin, Clock } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { packages } from "@/data/homepage";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 5 - Featured Packages.
 *
 * Three price cards that land one after another (90ms apart), so the eye reads
 * them as a set rather than a wall. The reveal wrapper is separate from the
 * card itself because `.reveal` owns transform/opacity through unlayered CSS,
 * which outranks Tailwind utilities - the card keeps its own hover lift.
 */
export function PackagesSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="dark" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Popular Packages"
        title="Featured Adventures"
        align="center"
      />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <Reveal key={pkg.id} delay={index * 90}>
            <div className="group relative flex h-full flex-col rounded-md border border-gold/30 bg-void/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)]">
              {pkg.popular ? (
                <Badge className="absolute -top-3 right-6">Popular</Badge>
              ) : null}

              <h3 className="font-display text-2xl text-ivory leading-tight">{pkg.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                {pkg.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-xs text-ivory/60">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                  {pkg.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                  {pkg.location}
                </span>
              </div>

              <div className="mt-6 border-t border-gold/15 pt-6">
                <p className="text-xs uppercase tracking-widest text-muted">
                  Starting from
                </p>
                <p className="mt-1 font-display text-2xl text-gold sm:text-3xl">
                  {pkg.price}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-ivory/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-px w-4 shrink-0 bg-gold/60"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 bottom-3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
              />
              <a
                href="/contact"
                className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"
              >
                Book Now
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}