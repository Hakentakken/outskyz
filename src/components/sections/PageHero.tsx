"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { resources } from "@/config/resources";

interface PageHeroProps {
  heading: string;
  subtitle?: string;
  image?: string;
}

/**
 * Reusable internal page hero.
 * Cinematic background image with dark overlay and centered text.
 */
export function PageHero({ heading, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[42svh] items-center justify-center overflow-hidden pt-20 sm:min-h-[48vh]">
      {/* Background */}
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster={resources.sky.heroPoster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={resources.sky.heroVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 bg-[#020a14]/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#06182a]/55 to-[#020a14]/20" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeUp}
          className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl"
        >
          {heading}
        </motion.h1>
        {subtitle ? (
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/70"
          >
            {subtitle}
          </motion.p>
        ) : null}
      </motion.div>
    </section>
  );
}
