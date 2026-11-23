import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryExperience } from "@/components/ui/GalleryExperience";
import { gallery } from "@/data/homepage";

type AnimationType =
  "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

export function GallerySection({
  animateDelay = 0,
}: { animate?: AnimationType; animateDelay?: number } = {}) {
  return (
    <section
      id="travel-gallery"
      className="travel-gallery relative overflow-hidden bg-[#030d1a] py-20 sm:py-28"
    >
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal delay={animateDelay}>
            <p className="travel-eyebrow">The Outskyz field notes</p>
            <h2 className="font-display text-ivory mt-5 text-4xl leading-[1.08] sm:text-6xl">
              You had to
              <br />
              <em className="text-gold">be there.</em>
            </h2>
          </Reveal>
          <Reveal variant="fade" className="max-w-xs">
            <p className="text-ivory/65 text-sm leading-relaxed">
              {gallery.description}
            </p>
            <p className="text-gold/85 mt-3 text-xs">
              Open a frame. Step into the moment.
            </p>
          </Reveal>
        </div>
        <div className="mt-12 sm:mt-16">
          <GalleryExperience images={gallery.images} layout="collage" />
        </div>
        <Reveal
          variant="fade"
          className="border-gold/20 mt-10 flex flex-col justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center"
        >
          <p className="text-muted text-[0.6rem] tracking-[0.2em] uppercase">
            Real places. Real people. Unforgettable stories.
          </p>
          <Link href={gallery.cta.href} className="travel-text-link">
            {gallery.cta.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
