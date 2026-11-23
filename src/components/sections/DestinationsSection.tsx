import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { destinations } from "@/data/homepage";

type AnimationType =
  "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

export function DestinationsSection({
  animateDelay = 0,
}: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <section
      id="destinations"
      className="destination-journal relative overflow-hidden py-20 sm:py-28"
    >
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal delay={animateDelay}>
            <p className="travel-eyebrow">The world, your way</p>
            <h2 className="font-display text-ivory mt-5 max-w-2xl text-4xl leading-[1.08] sm:text-6xl">
              Find your kind
              <br />
              of <em className="text-gold">far away.</em>
            </h2>
          </Reveal>
          <Reveal variant="fade" className="max-w-xs">
            <p className="text-ivory/65 text-sm leading-relaxed">
              Wide-open skies. Salt on your skin. Somewhere you have never been.
              Follow the feeling.
            </p>
            <Link href="/destinations" className="travel-text-link mt-4">
              All destinations{" "}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="destination-postcards mt-12 sm:mt-16">
          {destinations.map((destination, index) => (
            <Reveal key={destination.id} as="article" delay={(index % 2) * 130}>
              <Link
                href={"/destinations/" + destination.id}
                className="destination-postcard group block"
              >
                <div className="destination-image bg-coal relative overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 640px"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="from-void/40 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                  />
                  <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-[0.6rem] font-medium tracking-[0.22em] text-white uppercase">
                    <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                    {destination.country}
                  </span>
                  <span
                    className="font-display absolute right-5 bottom-5 text-4xl text-white/70 italic"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <h3 className="font-display text-ivory group-hover:text-gold text-3xl transition-colors sm:text-4xl">
                      {destination.name}
                    </h3>
                    <p className="text-ivory/60 mt-2 max-w-sm text-sm leading-relaxed">
                      {destination.description}
                    </p>
                  </div>
                  <span className="border-gold/35 text-gold group-hover:bg-gold group-hover:text-void mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal
          variant="fade"
          className="border-ivory/15 mt-14 flex items-center gap-4 border-t pt-6"
        >
          <span
            className="bg-gold h-2 w-2 shrink-0 rounded-full"
            aria-hidden="true"
          />
          <p className="text-ivory/60 text-xs tracking-wide">
            One world. So many ways to feel alive.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
