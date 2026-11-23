import Image from "next/image";
import { resources } from "@/config/resources";

interface PageHeroProps {
  heading: string;
  subtitle?: string;
  image?: string;
}

/**
 * Reusable internal page hero.
 * Cinematic background image with a dark overlay and centred text.
 *
 * This is a SERVER component: the heading is the Largest Contentful Paint
 * element on most interior routes, so it must be present and visible in the
 * first paint. The entrance animation is expressed in CSS (`.enter-rise`)
 * rather than framer-motion, because motion variants are serialised as
 * `style="opacity:0"` and would hide the LCP element until hydration —
 * Lighthouse measured a ~1.1 s render delay from exactly that.
 */
export function PageHero({ heading, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[42svh] items-center justify-center overflow-hidden pt-20 sm:min-h-[48vh]">
      <Image
        src={image ?? resources.sky.heroPoster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-image-settle object-cover"
      />

      {/* Overlays */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#020a14]/70" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#020a14] via-[#06182a]/55 to-[#020a14]/20"
      />
      {/* Vignette — pulls the eye to the centre of the frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_45%,transparent_50%,rgba(2,10,20,0.6)_100%)]"
      />

      {/* Film frame: letterbox hairlines drawn in from the centre. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <span className="cine-hair-in absolute inset-x-0 bottom-0 h-px origin-center bg-gradient-to-r from-transparent via-gold/45 to-transparent" />
        <span className="cine-hair-in-late absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="enter-rise font-display text-4xl text-ivory drop-shadow-[0_16px_50px_rgba(2,10,20,0.6)] sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
        {subtitle ? (
          <p className="enter-rise enter-delay-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/70">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
