"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { hero } from "@/data/homepage";
import { DocumentaryReel } from "@/components/sections/DocumentaryReel";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/animations";

/**
 * Section 1 — Full viewport hero.
 * Dark gradient placeholder when image is missing.
 * Left-aligned content with gold-highlighted "ADVENTURE".
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      {/* User-supplied skydiving footage gives the opening a living sky. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <DocumentaryReel />
      </motion.div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/75 to-[#061b35]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-[#061b35]/35" />
      <div aria-hidden="true" className="sky-hero-glow absolute inset-0" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 sm:px-8 lg:px-12"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-gold"
          >
            {hero.eyebrow}
          </motion.p>

          {/* Main heading */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            {hero.headingLine1}
            <br />
            <span className="text-gold tracking-[0.05em]">
              {hero.headingHighlight}
            </span>
            <br />
            {hero.headingLine2}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg"
          >
            {hero.description}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href={hero.primaryCta.href}
              className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {hero.secondaryCta.label}
            </Link>
          </motion.div>
        </div>

        {/* Floating indicators */}
        <motion.div
          variants={fadeIn}
          className="mt-20 flex gap-12 border-t border-gold/20 pt-8"
        >
          {hero.indicators.map((indicator) => (
            <div key={indicator.number} className="flex items-center gap-3">
              <span className="font-display text-2xl text-gold">
                {indicator.number}
              </span>
              <span className="text-xs uppercase tracking-widest text-ivory/50">
                {indicator.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
