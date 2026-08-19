"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { galleryImages, galleryHero, galleryCategories } from "@/data/gallery";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";


type CategoryId = (typeof galleryCategories)[number]["id"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filtered =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <>
      <PageHero
        heading={galleryHero.heading}
        subtitle={galleryHero.subtitle}
        image={galleryHero.image}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Gallery" },
            ]}
          />
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-gold/15 bg-coal/40 p-3">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-sm border px-5 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category.id
                    ? "border-gold bg-gold text-black"
                    : "border-gold/30 text-ivory/60 hover:border-gold/60 hover:text-ivory"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Gallery Grid */}
      <Section background="default" spacing="medium">
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          variants={staggerContainer}
          {...fadeUpViewport}
        >
          <AnimatePresence>
            {filtered.map((image) => (
              <motion.div
                key={image.src}
                layout
                variants={fadeUp}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-square overflow-hidden rounded-md border border-gold/20 bg-coal"
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
          </AnimatePresence>
        </motion.div>
      </Section>
    </>
  );
}
