import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, MapPin, ChevronRight } from "lucide-react";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { GoldLine } from "@/components/ui/GoldLine";
import { Badge } from "@/components/ui/Badge";
import { PackageItinerary } from "@/components/sections/PackageItinerary";
import { AddToCartButton } from "@/components/cards/AddToCartButton";
import { getPackageBySlug } from "@/data/packages";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    return { title: "Package Not Found" };
  }

  return {
    title: pkg.name,
    description: pkg.description,
    alternates: { canonical: `/packages/${slug}` },
  };
}

export async function generateStaticParams() {
  const { packages } = await import("@/data/packages");
  return packages.map((p) => ({ slug: p.slug }));
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  const packagePrice = Number(pkg.price.replace(/[^0-9.]/g, ""));
  const packageCurrency = pkg.slug === "russia-sky-adventure" ? "INR" : "USD";

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center pt-20">
        <Image src={pkg.image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          {pkg.popular ? <Badge className="mb-4">Popular</Badge> : null}
          <h1 className="font-display text-4xl text-ivory sm:text-5xl lg:text-6xl">
            {pkg.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ivory/70">
            {pkg.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-ivory/60">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              {pkg.destination}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
              {pkg.duration}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" aria-hidden="true" />
              {pkg.groupSize}
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Packages", href: "/packages" },
              { label: pkg.name },
            ]}
          />
        </Container>
      </Section>

      {pkg.expenses ? (
        <Section background="dark" spacing="large">
          <Container>
            <h2 className="font-display text-2xl text-ivory">Explore Russia programme costs</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              INR figures are retained from the programme estimate; RUB values use an indicative market rate of ₹1.1987 per RUB. Figures may change with exchange rates and availability.
            </p>
            <div className="mt-8 overflow-x-auto rounded-md border border-gold/20">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-gold/10 text-xs uppercase tracking-widest text-gold">
                  <tr><th className="px-5 py-4">Expense category</th><th className="px-5 py-4">RUB</th><th className="px-5 py-4">INR</th><th className="px-5 py-4">Notes</th></tr>
                </thead>
                <tbody className="divide-y divide-gold/15 text-ivory/80">
                  {pkg.expenses.map((expense) => (
                    <tr key={expense.category}><td className="px-5 py-4 font-medium text-ivory">{expense.category}</td><td className="px-5 py-4">₽{expense.rub.toLocaleString("en-IN")}</td><td className="px-5 py-4 text-gold">₹{expense.inr.toLocaleString("en-IN")}</td><td className="px-5 py-4 text-muted">{expense.note}</td></tr>
                  ))}
                </tbody>
                <tfoot className="bg-gold/10 font-display text-lg text-ivory"><tr><td className="px-5 py-4">Total estimated cost</td><td className="px-5 py-4">₽324,477</td><td className="px-5 py-4 text-gold">₹3,88,950</td><td className="px-5 py-4 text-sm font-sans text-muted">Potential repeat-jump costs excluded.</td></tr></tfoot>
              </table>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Booking Card + Overview */}
      <Section background="default" spacing="medium">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Overview */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl text-ivory">Overview</h2>
              <GoldLine className="mt-4" />
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
                {pkg.overview}
              </p>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <div className="rounded-md border border-gold/25 bg-void/60 p-8">
                <p className="text-xs uppercase tracking-widest text-muted">Starting from</p>
                <p className="mt-2 font-display text-4xl text-gold">{pkg.price}</p>
                <div className="mt-6 space-y-3 text-sm text-ivory/80">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gold" aria-hidden="true" />
                    {pkg.groupSize}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                    {pkg.destination}
                  </div>
                </div>
                <div className="mt-8">
                  <AddToCartButton
                    itemType="package"
                    itemId={pkg.slug}
                    itemSlug={pkg.slug}
                    itemName={pkg.name}
                    itemImage={pkg.image}
                    unitPrice={packagePrice}
                    currency={packageCurrency}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Itinerary + Includes / Excludes */}
      <Section background="dark" spacing="large">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Complete Itinerary</h2>
          <GoldLine className="mt-4" />
          <PackageItinerary
            itinerary={pkg.itinerary}
            includes={pkg.includes}
            excludes={pkg.excludes}
          />
        </Container>
      </Section>

      {/* Requirements */}
      <Section background="dark" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Requirements</h2>
          <GoldLine className="mt-4" />
          <ul className="mt-6 space-y-3">
            {pkg.requirements.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ivory/80">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Cancellation Policy */}
      <Section background="default" spacing="medium">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Cancellation Policy</h2>
          <GoldLine className="mt-4" />
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {pkg.cancellationPolicy}
          </p>
        </Container>
      </Section>

      {/* Gallery */}
      <Section background="dark" spacing="large">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Gallery</h2>
          <GoldLine className="mt-4" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {pkg.gallery.map((image) => (
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

      {/* Programme planning */}
      <Section background="default" spacing="large">
        <Container>
          <h2 className="font-display text-2xl text-ivory">Before You Book</h2>
          <GoldLine className="mt-4" />
          <p className="mt-6 max-w-3xl text-muted">
            This programme is designed for one participant over 22 days. Your final jump schedule is confirmed with the drop zone after weather, medical fitness and training progression are assessed. Contact us before booking to confirm available dates, visa support and any equipment requirements.
          </p>
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
