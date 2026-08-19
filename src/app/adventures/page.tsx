"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import {
  adventures,
  adventureCategories,
  adventuresHero,
  type AdventureCategory,
} from "@/data/adventures";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";


export default function AdventuresPage() {
  const [activeCategory, setActiveCategory] = useState<AdventureCategory | "all">("all");

  const filtered =
    activeCategory === "all"
      ? adventures
      : adventures.filter((a) => a.category === activeCategory);

  return (
    <>
      <PageHero
        heading={adventuresHero.heading}
        subtitle={adventuresHero.subtitle}
        image={adventuresHero.image}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Adventures" },
            ]}
          />
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-gold/15 bg-coal/40 p-3">
            {adventureCategories.map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(category.id as AdventureCategory | "all")
                }
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

      {/* Adventure Cards */}
      <Section background="default" spacing="large">
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
          <AnimatePresence>
            {filtered.map((adventure) => {
              const Icon = adventure.icon;
              return (
                <motion.article
                  key={adventure.slug}
                  layout
                  variants={fadeUp}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-md border border-gold/20 bg-coal"
                >
                  <Image
                    src={adventure.image}
                    alt={adventure.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
                  <span className="absolute left-5 top-5 font-display text-3xl text-gold/80">
                    {adventure.number}
                  </span>
                  <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-sm border border-gold/30 bg-void/50 text-gold backdrop-blur-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl text-ivory">
                      {adventure.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                      {adventure.shortDescription}
                    </p>
                    <Link
                      href={`/adventures/${adventure.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
                    >
                      Explore
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Section>
    </>
  );
}
