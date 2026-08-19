import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { GoldLine } from "@/components/ui/GoldLine";
import { resources } from "@/config/resources";
import { getDestinationBySlug } from "@/data/destinations";
import { getPackageBySlug } from "@/data/packages";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination Not Found" };
  }

  return {
    title: destination.name,
    description: destination.shortDescription,
    alternates: { canonical: `/destinations/${slug}` },
  };
}

export async function generateStaticParams() {
  const { destinations } = await import("@/data/destinations");
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const relatedPackages = destination.packageSlugs
    .map((s) => getPackageBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {destination.country}
          </p>
          <h1 className="mt-4 font-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
            {destination.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">
            {destination.shortDescription}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations", href: "/destinations" },
              { label: destination.name },
            ]}
          />
        </Container>
      </Section>

      {/* About */}
      <Section background="default" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">About {destination.name}</h2>
          <GoldLine className="mt-4" />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {destination.about}
          </p>
        </Container>
      </Section>

      {/* Why Visit */}
      <Section background="dark" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Why Visit</h2>
          <GoldLine className="mt-4" />
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {destination.whyVisit.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ivory/80">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Experiences */}
      <Section background="default" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Adventure Experiences</h2>
          <GoldLine className="mt-4" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {destination.experiences.map((experience) => (
              <div
                key={experience}
                className="rounded-md border border-gold/20 bg-coal/50 p-6 text-sm text-muted"
              >
                {experience}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Packages */}
      {relatedPackages.length > 0 ? (
        <Section background="dark" spacing="large">
          <Container>
            <h2 className="font-display text-2xl text-ivory">Available Packages</h2>
            <GoldLine className="mt-4" />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedPackages.map((pkg) => (
                <Link
                  key={pkg.slug}
                  href={`/packages/${pkg.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-gold/20 bg-coal">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl text-ivory">{pkg.name}</h3>
                      <p className="mt-1 text-xs text-gold">{pkg.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Gallery */}
      <Section background="default" spacing="large">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Gallery</h2>
          <GoldLine className="mt-4" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {destination.gallery.map((image) => (
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
        </Container>
      </Section>

      {/* Travel Info */}
      <Section background="dark" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Travel Information</h2>
          <GoldLine className="mt-4" />
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Best Time</p>
              <p className="mt-2 text-sm text-ivory/80">{destination.travelInfo.bestTime}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Language</p>
              <p className="mt-2 text-sm text-ivory/80">{destination.travelInfo.language}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Currency</p>
              <p className="mt-2 text-sm text-ivory/80">{destination.travelInfo.currency}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">Visa</p>
              <p className="mt-2 text-sm text-ivory/80">{destination.travelInfo.visa}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section background="default" spacing="large">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Frequently Asked Questions</h2>
          <GoldLine className="mt-4" />
          <div className="mt-12 space-y-8">
            {destination.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-display text-lg text-ivory">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section background="dark" spacing="large">
        <div className="mx-auto max-w-2xl text-center">
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
