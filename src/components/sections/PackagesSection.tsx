"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { packages } from "@/data/homepage";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 5 — Featured Packages.
 * Three premium package cards with duration, location, price, and Book Now CTA.
 */
export function PackagesSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="dark" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Popular Packages"
        title="Featured Adventures"
        align="center"
      />

      <motion.div
        className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        {packages.map((pkg) => (
          <motion.div
            key={pkg.id}
            variants={fadeUp}
            className="group relative flex flex-col rounded-md border border-gold/25 bg-void/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_8px_40px_rgba(212,175,55,0.1)]"
          >
            {pkg.popular ? (
              <Badge className="absolute -top-3 right-6">Popular</Badge>
            ) : null}

            {/* Title */}
            <h3 className="font-display text-2xl text-ivory">{pkg.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {pkg.description}
            </p>

            {/* Meta */}
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

            {/* Price */}
            <div className="mt-6 border-t border-gold/15 pt-6">
              <p className="text-xs uppercase tracking-widest text-muted">
                Starting from
              </p>
              <p className="mt-1 font-display text-3xl text-gold">
                {pkg.price}
              </p>
            </div>

            {/* Features */}
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

            {/* CTA */}
            <a
              href="/contact"
              className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"
            >
              Book Now
            </a>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}