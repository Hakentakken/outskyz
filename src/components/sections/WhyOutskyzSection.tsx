"use client";

import { Section } from "@/components/sections/Section";
import { GoldLine } from "@/components/ui/GoldLine";
import { Reveal } from "@/components/ui/Reveal";
import { whyOutskyz } from "@/data/homepage";
import { resources } from "@/config/resources";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 3 - Why Outskyz.
 *
 * Split layout: the heading holds its position and reads as a title card while
 * the five reasons stack in beside it, each one stepping in 70ms after the
 * last. The heading column stays sticky on large screens so the reasons scroll
 * past a fixed anchor - the pacing trick a documentary uses for its captions.
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
        {/* Left - heading */}
        <Reveal variant="left" className="lg:sticky lg:top-32 lg:self-start">
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
        </Reveal>

        {/* Right - reasons */}
        <div className="space-y-4">
          {whyOutskyz.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.number} delay={index * 70}>
                <div className="group flex gap-5 rounded-md border border-gold/30 bg-void/60 p-6 transition-all duration-300 hover:border-gold/50 hover:bg-void/80">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-gold/30 bg-gold/5 text-gold transition-colors duration-300 group-hover:bg-gold/10">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-lg text-gold/70">
                        {feature.number}
                      </span>
                      <h3 className="font-display text-xl text-ivory leading-tight">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}