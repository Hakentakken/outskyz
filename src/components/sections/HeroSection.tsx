import Link from "next/link";
import { hero } from "@/data/homepage";
import { resources } from "@/config/resources";
import { AmbientVideo } from "@/components/ui/AmbientVideo";

/**
 * Section 1 — full-viewport cinematic hero.
 *
 * PERF NOTE (why this is a server component with CSS motion)
 * ---------------------------------------------------------
 * The <h1> here is the Largest Contentful Paint element on the home page.
 * It previously sat inside a framer-motion tree using `initial="hidden"`, so
 * the server-rendered markup carried `style="opacity:0"` and the heading
 * stayed invisible until React hydrated. Lighthouse attributed a 2.2 s
 * "element render delay" to it and measured a 5.9 s LCP with only 800 KB of
 * page weight.
 *
 * The entrance is now CSS keyframes (`.enter-rise`), which run at first paint
 * without any JavaScript, and this component needs no client bundle at all —
 * only the decorative <AmbientVideo /> child is a client component.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden">
      {/* Decorative backdrop: the poster paints immediately and is the LCP
          surface; video is attached only when it is worth its bytes. */}
      <AmbientVideo
        src={resources.sky.altitudeVideo}
        poster={resources.sky.heroPoster}
      />

      {/* Layered scrims keep the headline legible against any frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-[#061b35]/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-[#061b35]/30"
      />
      <div aria-hidden="true" className="sky-hero-glow absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="enter-rise inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-gold">
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            {hero.eyebrow}
          </p>

          {/* The <h1> is the Largest Contentful Paint element on this page, so
              it deliberately carries NO opacity animation: an element that
              starts at `opacity: 0` is not accepted as an LCP candidate, which
              pushed Lighthouse onto the header logo and reported a 5.8 s LCP.
              It paints with the document, and the surrounding elements stagger
              in around it. */}
          <h1 className="mt-7 font-display text-[2.75rem] leading-[1.02] text-ivory sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            {hero.headingLine1}
            <br />
            <span className="text-gold tracking-[0.04em]">
              {hero.headingHighlight}
            </span>
            <br />
            {hero.headingLine2}
          </h1>

          <p className="enter-rise enter-delay-3 mt-8 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
            {hero.description}
          </p>

          <div className="enter-rise enter-delay-4 mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href={hero.primaryCta.href}
              className="button-sheen group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_36px_rgba(212,175,55,0.45)]"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className="enter-rise enter-delay-5 mt-20 flex flex-wrap gap-x-12 gap-y-6 border-t border-gold/20 pt-8">
          {hero.indicators.map((indicator) => (
            <div key={indicator.number} className="flex items-center gap-3">
              <span className="font-display text-2xl text-gold">
                {indicator.number}
              </span>
              <span className="text-xs uppercase tracking-widest text-ivory/50">
                {indicator.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
