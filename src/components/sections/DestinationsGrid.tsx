"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

interface Destination {
  slug: string;
  image: string;
  name: string;
  country: string;
  shortDescription: string;
  adventureCount: number;
}

interface Props {
  destinations: Destination[];
}

export function DestinationsGrid({ destinations }: Props) {
  return (
    <motion.div
      className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2"
      variants={staggerContainer}
      {...fadeUpViewport}
    >
      {destinations.map((destination) => (
        <motion.article
          key={destination.slug}
          variants={fadeUp}
          className="group relative aspect-[16/9] overflow-hidden rounded-md border border-gold/20 bg-coal"
        >
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {destination.country}
            </p>
            <h3 className="font-display text-3xl text-ivory sm:text-4xl">
              {destination.name}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/60">
              {destination.shortDescription}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs text-ivory/50">
                {destination.adventureCount} Adventures
              </span>
              <Link
                href={`/destinations/${destination.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
              >
                Explore
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}