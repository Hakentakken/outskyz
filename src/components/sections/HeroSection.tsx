import Link from "next/link";
import { hero } from "@/data/homepage";
import { DocumentaryReel } from "@/components/sections/DocumentaryReel";

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
 * only the decorative <DocumentaryReel /> child is a client component.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* The original six-clip OUTSKYZ documentary, played back-to-back as one
          continuous reel. The poster layer paints immediately and is the LCP
          surface; clips stream in their original order on top of it. */}
      <DocumentaryReel />

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
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/70 to-transparent"
      />

      {/* Film frame: the two letterbox hairlines draw themselves in from the
          centre, and the vertical brackets mark the projection area. Pure CSS,
          above the scrims but below the copy, and never interactive. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        <span className="cine-hair-in absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <span className="cine-hair-in-late absolute inset-x-0 bottom-0 h-px origin-center bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <span className="cine-bracket-in absolute left-6 top-28 h-16 w-px bg-gradient-to-b from-gold/50 to-transparent sm:left-8 lg:left-12" />
        <span className="cine-bracket-in absolute right-6 top-28 h-16 w-px bg-gradient-to-b from-gold/50 to-transparent sm:right-8 lg:right-12" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-40 pt-36 sm:px-8 lg:px-12 lg:pb-36 lg:pt-32">
        <div className="max-w-4xl">
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
          <h1 className="mt-7 font-display text-[3rem] leading-[0.98] text-ivory drop-shadow-[0_20px_60px_rgba(2,10,20,0.6)] sm:text-6xl lg:text-7xl xl:text-[5.75rem]">
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)]"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm border border-gold/40 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* Film-strip rail: the three promise markers, presented as credits
            under a hairline rather than as a stats bar. */}
        <div className="enter-rise enter-delay-5 mt-16 sm:mt-20">
          <span
            aria-hidden="true"
            className="cine-hair-in-late block h-px w-full max-w-2xl origin-left bg-gradient-to-r from-gold/45 via-gold/15 to-transparent"
          />
          <div className="mt-6 flex flex-wrap gap-x-12 gap-y-6">
            {hero.indicators.map((indicator) => (
              <div key={indicator.number} className="group flex items-baseline gap-3">
                <span className="font-display text-2xl text-gold transition-transform duration-500 group-hover:-translate-y-0.5">
                  {indicator.number}
                </span>
                <span className="text-xs uppercase tracking-[0.28em] text-ivory/55">
                  {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue — a single gold thread, no label to translate. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center lg:flex"
      >
        <span className="relative block h-14 w-px overflow-hidden bg-ivory/15">
          <span className="scroll-cue-line absolute inset-x-0 top-0 block h-full bg-gradient-to-b from-gold to-gold/10" />
        </span>
      </div>
    </section>
  );
}

