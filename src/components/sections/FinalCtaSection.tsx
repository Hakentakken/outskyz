"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { finalCta } from "@/data/homepage";
import { resources } from "@/config/resources";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

/**
 * Section 9 — Final CTA.
 * Full-width cinematic section with heading, description, and two buttons.
 */
export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-coal py-28 sm:py-40">
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        poster={resources.sky.sunsetFlight}
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      >
        <source src={resources.sky.altitudeVideo} type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-void/90 via-coal/85 to-[#071c34]/80" />
      {/* Decorative gold glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]"
      />

      <motion.div
        className="relative mx-auto max-w-3xl px-6 text-center"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        <motion.h2
          variants={fadeUp}
          className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl"
        >
          {finalCta.heading}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted"
        >
          {finalCta.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={finalCta.primaryCta.href}
            className="inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] sm:w-auto"
          >
            {finalCta.primaryCta.label}
          </Link>
          <Link
            href={finalCta.secondaryCta.href}
            className="inline-flex w-full items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold sm:w-auto"
          >
            {finalCta.secondaryCta.label}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
