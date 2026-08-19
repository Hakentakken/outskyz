"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { packages, packagesHero, packageFilters } from "@/data/packages";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";


export default function PackagesPage() {
  return (
    <>
      <PageHero
        heading={packagesHero.heading}
        subtitle={packagesHero.subtitle}
        image={packagesHero.image}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Packages" },
            ]}
          />
          <div className="mt-5 grid grid-cols-1 gap-4 rounded-md border border-gold/15 bg-coal/40 p-4 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                Destination
              </label>
              <select className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-2 text-sm text-ivory outline-none focus:border-gold">
                {packageFilters.destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                Duration
              </label>
              <select className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-2 text-sm text-ivory outline-none focus:border-gold">
                {packageFilters.durations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                Price
              </label>
              <select className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-2 text-sm text-ivory outline-none focus:border-gold">
                {packageFilters.priceRanges.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                Adventure Type
              </label>
              <select className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-2 text-sm text-ivory outline-none focus:border-gold">
                {packageFilters.adventureTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Container>
      </Section>

      {/* Package Cards */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Packages"
          title="Featured Adventures"
          align="center"
        />

        <motion.div
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
          variants={staggerContainer}
          {...fadeUpViewport}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.slug}
              variants={fadeUp}
              className="group flex flex-col rounded-md border border-gold/25 bg-void/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_8px_40px_rgba(212,175,55,0.1)]"
            >
              {pkg.popular ? (
                <span className="absolute -top-3 right-6 rounded-sm bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-widest text-black">
                  Popular
                </span>
              ) : null}

              <h3 className="font-display text-2xl text-ivory">{pkg.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pkg.description}</p>

              <div className="mt-5 flex flex-wrap gap-4 text-xs text-ivory/60">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                  {pkg.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                  {pkg.destination}
                </span>
              </div>

              <div className="mt-6 border-t border-gold/15 pt-6">
                <p className="text-xs uppercase tracking-widest text-muted">Starting from</p>
                <p className="mt-1 font-display text-3xl text-gold">{pkg.price}</p>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.highlights.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-ivory/80"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-px w-4 shrink-0 bg-gold/60"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/packages/${pkg.slug}`}
                className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_25px_rgba(212,175,55,0.35)]"
              >
                View Package
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </>
  );
}
