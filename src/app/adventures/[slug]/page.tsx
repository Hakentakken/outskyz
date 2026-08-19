import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Users } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { GoldLine } from "@/components/ui/GoldLine";
import { resources } from "@/config/resources";
import { AdventureExperience } from "@/components/sections/AdventureExperience";
import { getAdventureBySlug, getRelatedAdventures } from "@/data/adventures";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const adventure = getAdventureBySlug(slug);

  if (!adventure) {
    return { title: "Adventure Not Found" };
  }

  return {
    title: adventure.title,
    description: adventure.shortDescription,
    alternates: { canonical: `/adventures/${slug}` },
  };
}

export async function generateStaticParams() {
  const { adventures } = await import("@/data/adventures");
  return adventures.map((a) => ({ slug: a.slug }));
}

export default async function AdventurePage({ params }: Props) {
  const { slug } = await params;
  const adventure = getAdventureBySlug(slug);

  if (!adventure) {
    notFound();
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center pt-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={resources.sky.heroPoster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={resources.sky.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <Badge className="mb-4">{adventure.categoryLabel}</Badge>
          <h1 className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
            {adventure.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">
            {adventure.description}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Breadcrumb */}
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Adventures", href: "/adventures" },
              { label: adventure.title },
            ]}
          />
        </Container>
      </Section>

      {/* Details */}
      <Section background="default" spacing="medium">
        <Container>
          <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-widest text-ivory/50 sm:grid-cols-4 sm:gap-6 sm:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>{adventure.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="text-xs">{adventure.difficulty}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>{adventure.ageLimit}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>{adventure.location}</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Overview */}
      <Section background="default" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Overview</h2>
          <GoldLine className="mt-4" />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {adventure.overview}
          </p>
        </Container>
      </Section>

      {/* Experience Timeline */}
      <Section background="dark" spacing="large">
        <h2 className="font-display text-2xl text-ivory">Your Experience</h2>
        <GoldLine className="mt-4" />
        <AdventureExperience steps={adventure.experience} />
      </Section>

      {/* Safety & Requirements */}
      <Section background="default" spacing="large">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ivory">Safety</h2>
            <GoldLine className="mt-4" />
            <ul className="mt-6 space-y-3">
              {adventure.safety.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-4 shrink-0 bg-gold/60"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ivory">Requirements</h2>
            <GoldLine className="mt-4" />
            <ul className="mt-6 space-y-3">
              {adventure.requirements.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-4 shrink-0 bg-gold/60"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section background="dark" spacing="large">
        <h2 className="font-display text-2xl text-ivory">Gallery</h2>
        <GoldLine className="mt-4" />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {adventure.gallery.map((image) => (
            <div
              key={image.src}
              className="relative aspect-square overflow-hidden rounded-md border border-gold/20 bg-coal"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Related Adventures */}
      {adventure.relatedSlugs.length > 0 ? (
        <Section background="default" spacing="large">
          <h2 className="font-display text-2xl text-ivory">Related Adventures</h2>
          <GoldLine className="mt-4" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {getRelatedAdventures(adventure.relatedSlugs).map((related) => (
              <Link
                key={related.slug}
                href={`/adventures/${related.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-gold/20 bg-coal">
                  <Image
                    src={related.image}
                    alt={related.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-display text-2xl text-gold/70">
                      {related.number}
                    </span>
                    <h3 className="mt-1 font-display text-xl text-ivory">
                      {related.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Final CTA */}
      <Section background="dark" spacing="large">
        <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl text-ivory sm:text-4xl">
            Ready for your adventure?
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
          >
            Contact Us
          </Link>
        </div>
      </Section>
    </>
  );
}
