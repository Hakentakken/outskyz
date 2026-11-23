"use client";

import { useState } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { GalleryExperience } from "@/components/ui/GalleryExperience";
import { galleryImages, galleryHero, galleryCategories } from "@/data/gallery";

type CategoryId = (typeof galleryCategories)[number]["id"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const filtered =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((image) => image.category === activeCategory);

  return (
    <>
      <PageHero
        heading={galleryHero.heading}
        subtitle={galleryHero.subtitle}
        image={galleryHero.image}
      />
      <Section background="default" spacing="small" animate="none">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        />
        <div className="border-gold/20 mt-8 flex flex-col justify-between gap-5 border-b pb-5 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter gallery"
          >
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={
                  "min-h-11 rounded-full border px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors " +
                  (activeCategory === category.id
                    ? "border-gold bg-gold text-void"
                    : "border-gold/25 text-ivory/70 hover:border-gold hover:text-gold")
                }
              >
                {category.label}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs" role="status">
            {filtered.length} moments to explore
          </p>
        </div>
      </Section>
      <Section background="default" spacing="medium" animate="none">
        <GalleryExperience images={filtered} />
      </Section>
    </>
  );
}
