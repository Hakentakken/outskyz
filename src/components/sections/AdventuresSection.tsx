"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { adventures } from "@/data/homepage";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 2 — Featured Adventures.
 * Six cards with large image, dark overlay, gold number, hover zoom, CTA arrow.
 */
export function AdventuresSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow="Adventures"
        title="Experiences That Push Your Limits"
        align="center"
      />

      <motion.div
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        {adventures.map((adventure) => {
          const Icon = adventure.icon;
          return (
            <motion.article
              key={adventure.id}
              variants={fadeUp}
              className="group group-sheen relative aspect-[4/5] overflow-hidden rounded-md border border-gold/20 bg-coal transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
            >
              {/* Image */}
              <Image
                src={adventure.image}
                alt={adventure.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />

              {/* Gold number */}
              <span className="absolute left-5 top-5 font-display text-3xl text-gold/80">
                {adventure.number}
              </span>

              {/* Icon */}
              <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 bg-void/50 text-gold backdrop-blur-sm">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-ivory">
                  {adventure.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                  {adventure.description}
                </p>
                <Link
                  href="/adventures"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
                >
                  Discover
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </Section>
  );
}
