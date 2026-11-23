"use client";

import Link from "next/link";
import { finalCta } from "@/data/homepage";
import { resources } from "@/config/resources";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Section 9 - Final CTA.
 *
 * The closing title card: heading rises through a mask, then the copy and the
 * two actions follow. The backdrop media is untouched (poster first, clip only
 * on a wide, non-metered connection).
 */
export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden bg-void/60 py-28 sm:py-40">
      <AmbientVideo
        src={resources.sky.altitudeVideo}
        poster={resources.sky.sunsetFlight}
        className="opacity-30"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-void/90 via-coal/85 to-[#071c34]/80" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal
          as="h2"
          variant="mask"
          className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl leading-tight"
        >
          {finalCta.heading}
        </Reveal>

        <Reveal
          variant="fade"
          delay={140}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/65"
        >
          {finalCta.description}
        </Reveal>

        <Reveal
          variant="fade"
          delay={260}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={finalCta.primaryCta.href}
            className="inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)] sm:w-auto"
          >
            {finalCta.primaryCta.label}
          </Link>
          <Link
            href={finalCta.secondaryCta.href}
            className="inline-flex w-full items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold sm:w-auto"
          >
            {finalCta.secondaryCta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}