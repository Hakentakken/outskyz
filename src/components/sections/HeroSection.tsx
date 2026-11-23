import Link from "next/link";
import { ArrowDown, ArrowUpRight, Compass } from "lucide-react";
import { hero } from "@/data/homepage";
import { DocumentaryReel } from "@/components/sections/DocumentaryReel";

/** The original documentary keeps ownership of playback and chapter order. */
export function HeroSection() {
  return (
    <section
      id="home-hero"
      className="travel-hero relative isolate flex items-center overflow-hidden"
    >
      <DocumentaryReel />
      <div
        aria-hidden="true"
        className="from-void/85 to-void/20 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent"
      />

      <div className="travel-hero-copy relative z-10 mx-auto w-full max-w-7xl px-6 pt-36 pb-48 sm:px-8 lg:px-12 lg:pt-40 lg:pb-44">
        <p className="enter-rise text-gold flex items-center gap-3 text-[0.65rem] font-semibold tracking-[0.3em] uppercase sm:text-xs">
          <span aria-hidden="true" className="bg-gold h-px w-9" />
          {hero.eyebrow}
        </p>

        {/* Visible in server HTML: the headline never waits for hydration. */}
        <h1 className="travel-hero-title text-ivory mt-8 max-w-4xl">
          <span className="block">Live the</span>
          <span className="travel-hero-word text-gold block">adventure.</span>
          <span className="font-body text-ivory/80 mt-5 block text-base font-normal tracking-[0.08em] sm:text-xl">
            Not the vacation.
          </span>
        </h1>

        <p className="enter-rise enter-delay-3 text-ivory/80 mt-7 max-w-md text-sm leading-relaxed sm:text-base">
          {hero.description}
        </p>
        <div className="enter-rise enter-delay-4 mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link href={hero.primaryCta.href} className="travel-primary group">
            {hero.primaryCta.label}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="travel-text-link group"
          >
            Plan your journey
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <div
        className="hero-field-note pointer-events-none absolute top-[47%] right-[8%] z-10 hidden max-w-40 text-center lg:block"
        aria-hidden="true"
      >
        <div className="travel-compass border-ivory/35 relative mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border">
          <span className="text-gold absolute -top-2 px-2 text-[0.6rem] tracking-widest">
            N
          </span>
          <Compass className="text-ivory/90 h-10 w-10 stroke-[1]" />
        </div>
        <p className="text-ivory/75 text-[0.6rem] leading-loose tracking-[0.3em] uppercase">
          A little further.
          <br />A little more alive.
        </p>
      </div>

      <a
        href="#journey-start"
        className="hero-scroll-link text-ivory/70 hover:text-gold absolute right-24 bottom-10 z-20 hidden items-center gap-4 text-[0.6rem] tracking-[0.25em] uppercase transition-colors md:inline-flex"
      >
        Scroll to explore
        <span className="border-ivory/25 flex h-12 w-12 items-center justify-center rounded-full border">
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
