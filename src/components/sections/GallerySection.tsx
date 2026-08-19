"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gallery } from "@/data/homepage";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

/**
 * Section 8 — Gallery Preview.
 * Masonry-style grid with elegant placeholders and View Full Gallery button.
 */
export function GallerySection({ animate, animateDelay }: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <Section background="default" spacing="large" animate={animate} animateDelay={animateDelay}>
      <SectionHeading
        eyebrow={gallery.eyebrow}
        title={gallery.heading}
        description={gallery.description}
        align="center"
      />

      <motion.div
        className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        {gallery.images.map((image, index) => (
          <motion.div
            key={image.src}
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-md border border-gold/20 bg-coal ${
              index === 0
                ? "col-span-2 row-span-2 aspect-square"
                : index === 3
                  ? "col-span-2 aspect-[2/1]"
                  : "aspect-square"
            }`}
          >
            {image.type === "video" ? (
              <video
                src={image.src}
                muted
                loop
                playsInline
                autoPlay
                aria-label={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        {...fadeUpViewport}
        className="mt-12 flex justify-center"
      >
        <Link
          href={gallery.cta.href}
          className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
        >
          {gallery.cta.label}
        </Link>
      </motion.div>
    </Section>
  );
}
