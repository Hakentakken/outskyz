"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";

interface ItineraryItem {
  day: string;
  title: string;
  description: string;
}

interface Props {
  itinerary: ItineraryItem[];
  includes: string[];
  excludes: string[];
}

export function PackageItinerary({ itinerary, includes, excludes }: Props) {
  return (
    <>
      <motion.div
        className="mt-12 space-y-6"
        variants={staggerContainer}
        {...fadeUpViewport}
      >
        {itinerary.map((item) => (
          <motion.div
            key={item.day}
            variants={fadeUp}
            className="flex gap-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-gold/30 bg-gold/10 text-gold">
              <span className="text-xs font-semibold">{item.day}</span>
            </div>
            <div>
              <h3 className="font-display text-xl text-ivory">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ivory">What&apos;s Included</h2>
          <div className="mt-4 h-px w-full bg-gold/20" />
          <ul className="mt-6 space-y-3">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ivory/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl text-ivory">What&apos;s Excluded</h2>
          <div className="mt-4 h-px w-full bg-gold/20" />
          <ul className="mt-6 space-y-3">
            {excludes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ivory/80">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-ivory/40" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}