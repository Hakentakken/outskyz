"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/homepage";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 7 — Testimonials.
 * Premium quote section on dark background with 3 testimonial cards.
 */
export function TestimonialsSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="dark" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Testimonials"
        title="Stories From Our Adventurers"
        align="center"
      />

      <motion.div
        className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        {testimonials.map((testimonial) => (
          <motion.figure
            key={testimonial.id}
            variants={fadeUp}
            className="flex flex-col rounded-md border border-gold/20 bg-void/50 p-8"
          >
            <Quote className="h-8 w-8 text-gold/40" aria-hidden="true" />
            <blockquote className="mt-6 flex-1 text-base leading-relaxed text-ivory/80">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 border-t border-gold/15 pt-6">
              <p className="font-display text-lg text-ivory">
                {testimonial.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                {testimonial.adventureType}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </Section>
  );
}