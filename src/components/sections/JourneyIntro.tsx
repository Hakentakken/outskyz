import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";

const stops = [
  {
    name: "Russia",
    detail: "Chase the open sky",
    href: "/destinations/russia",
  },
  {
    name: "Thailand",
    detail: "Follow the coastline",
    href: "/destinations/thailand",
  },
  {
    name: "India",
    detail: "Find a new perspective",
    href: "/destinations/india",
  },
];

export function JourneyIntro() {
  return (
    <section
      id="journey-start"
      className="journey-intro border-gold/15 bg-coal scroll-mt-20 border-b py-10 sm:py-14"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <p className="travel-eyebrow">Your next chapter</p>
            <h2 className="font-display text-ivory mt-3 text-3xl">
              Where will you go?
            </h2>
            <p className="text-muted mt-3 flex items-center gap-3 text-xs">
              Leave the everyday behind{" "}
              <MoveRight className="text-gold h-4 w-4" aria-hidden="true" />
            </p>
          </Reveal>
          <nav
            aria-label="Explore destinations"
            className="journey-stops grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
          >
            {stops.map((stop, index) => (
              <Reveal key={stop.name} delay={index * 90}>
                <Link
                  href={stop.href}
                  className="group border-gold/30 block border-t pt-4"
                >
                  <span className="text-gold flex items-center justify-between text-[0.6rem] tracking-[0.2em]">
                    0{index + 1}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                  <span className="font-display text-ivory group-hover:text-gold mt-2 block text-2xl transition-colors">
                    {stop.name}
                  </span>
                  <span className="text-muted mt-1 block text-xs">
                    {stop.detail}
                  </span>
                </Link>
              </Reveal>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
