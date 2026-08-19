"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { destinations } from "@/data/homepage";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 4 — Destinations.
 * Large cinematic destination cards with image background, country name, description, explore button.
 */
export function DestinationsSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Destinations"
        title="Explore the World"
        align="center"
      />

      <motion.div
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        {destinations.map((destination) => (
          <motion.article
            key={destination.id}
            variants={fadeUp}
            className="group relative aspect-[16/10] overflow-hidden rounded-md border border-gold/20 bg-coal sm:aspect-[16/9]"
          >
            {/* Image */}
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {destination.country}
              </p>
              <h3 className="font-display text-3xl text-ivory sm:text-4xl">
                {destination.name}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/60">
                {destination.description}
              </p>
              <Link
                href="/destinations"
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
              >
                Explore
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}