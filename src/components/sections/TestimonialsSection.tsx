"use client";

import { Quote } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/homepage";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 7 - Testimonials.
 *
 * Three quotes as framed captions: each panel steps in 90ms after the last and
 * warms its border on hover. Mounted on the shared reveal system, so the page
 * no longer ships framer-motion just to fade these in.
 */
export function TestimonialsSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="dark" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Testimonials"
        title="Stories From Our Adventurers"
        align="center"
      />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.id} delay={index * 90}>
            <figure className="flex h-full flex-col rounded-md border border-gold/30 bg-void/60 p-8 transition-colors duration-500 hover:border-gold/50">
              <Quote className="h-8 w-8 text-gold/40" aria-hidden="true" />
              <blockquote className="mt-6 flex-1 text-base leading-relaxed text-ivory/80">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-gold/15 pt-6">
                <p className="font-display text-lg text-ivory leading-tight">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                  {testimonial.adventureType}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}