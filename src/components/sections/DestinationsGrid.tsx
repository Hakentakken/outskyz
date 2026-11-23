"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

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

/**
 * Destination index grid.
 *
 * Each card is one shot: it steps in 90ms after the previous one and its
 * photograph settles from 1.06 inside the frame. The reveal wrapper is a
 * plain grid item; the card keeps its own hover choreography.
 */
export function DestinationsGrid({ destinations }: Props) {
  return (
    <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {destinations.map((destination, index) => (
        <Reveal
          key={destination.slug}
          as="article"
          delay={Math.min(index, 4) * 90}
          className="group"
        >
          <div className="img-cinematic relative aspect-[16/9] overflow-hidden rounded-md border border-gold/30 bg-void/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)]">
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                {destination.country}
              </p>
              <h3 className="font-display text-3xl text-ivory sm:text-4xl leading-tight">
                {destination.name}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/65">
                {destination.shortDescription}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs text-ivory/50">
                  {destination.adventureCount} Adventures
                </span>
                <Link
                  href={`/destinations/${destination.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-1 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
                >
                  Explore
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 bottom-2 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
              />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}