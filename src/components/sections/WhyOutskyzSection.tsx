"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/sections/Section";
import { GoldLine } from "@/components/ui/GoldLine";
import { whyOutskyz } from "@/data/homepage";
import { fadeUp, slideLeft, staggerContainer, fadeUpViewport } from "@/lib/animations";
import { resources } from "@/config/resources";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 3 — Why Outskyz.
 * Split layout: left heading + text, right 5 feature cards with gold outlined icons.
 */
export function WhyOutskyzSection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section
      background="image"
      backgroundImage={resources.sky.goldenFreefall}
      spacing="large"
      animate={animate}
      animateDelay={animateDelay}
    >
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Left — heading */}
        <motion.div
          variants={slideLeft}
          {...fadeUpViewport}
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {whyOutskyz.eyebrow}
          </p>
          <h2 className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
            {whyOutskyz.heading}
          </h2>
          <GoldLine className="mt-6" />
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {whyOutskyz.description}
          </p>
        </motion.div>

        {/* Right — feature cards */}
        <motion.div
          variants={staggerContainer}
          {...fadeUpViewport}
          className="space-y-4"
        >
          {whyOutskyz.features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.number}
                variants={fadeUp}
                className="group flex gap-5 rounded-md border border-gold/20 bg-void/50 p-6 transition-all duration-300 hover:border-gold/40 hover:bg-void/80"
              >
                {/* Gold outlined icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-gold/5 text-gold transition-colors duration-300 group-hover:bg-gold/10">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-gold/70">
                      {feature.number}
                    </span>
                    <h3 className="font-display text-xl text-ivory">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
