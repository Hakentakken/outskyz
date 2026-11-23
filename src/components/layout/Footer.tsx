import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcon";
import { resources } from "@/config/resources";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { adventures } from "@/data/adventures";
import { destinations } from "@/data/destinations";

const FOOTER_DESCRIPTION =
  "Curating unforgettable adventure experiences across the world.";

const columnHeadingClass =
  "text-xs font-semibold uppercase tracking-[0.3em] text-gold";

const linkClass =
  "inline-block py-1 text-sm text-ivory/70 transition-colors duration-300 hover:text-gold";

const socialClass =
  "flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 text-gold transition-all duration-300 hover:bg-gold hover:text-black hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

/**
 * Global footer — three bands.
 *
 * 1. Brand statement + newsletter capture (the old layout had no signup at
 *    all, despite it being tracked as a known TODO).
 * 2. Four link columns: Experiences, Destinations, Company, Contact.
 * 3. Legal bar: copyright, policy links.
 *
 * Social URLs are placeholders — see "Known TODOs" in the README.
 */
export function Footer() {
  return (
    <footer className="border-t border-gold/25 bg-coal">
      {/* Band 1 — brand + newsletter */}
      <Container className="pt-16 pb-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              className="group inline-flex items-center gap-3"
            >
              <Image
                src={resources.logo}
                alt={`${siteConfig.name} logo`}
                width={180}
                height={60}
                className="h-14 w-auto brightness-110 transition-all duration-300 group-hover:scale-[1.035] group-hover:brightness-125 group-hover:drop-shadow-[0_0_16px_rgba(70,181,255,0.45)]"
              />
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {FOOTER_DESCRIPTION}
            </p>
          </div>

          <div className="lg:border-l lg:border-gold/15 lg:pl-10">
            <NewsletterForm />
          </div>
        </div>

        <Divider className="mt-12" />
      </Container>

      {/* Band 2 — link columns */}
      <Container className="pb-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Experiences */}
          <nav aria-label="Footer — Experiences">
            <h2 className={columnHeadingClass}>Experiences</h2>
            <ul className="mt-5 space-y-2.5">
              {adventures.map((adventure) => (
                <li key={adventure.slug}>
                  <Link
                    href={`/adventures/${adventure.slug}`}
                    className={linkClass}
                  >
                    {adventure.title}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/adventures"
                  className="inline-block py-2 text-sm font-semibold text-gold transition-colors duration-300 hover:text-gold-bright"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Destinations */}
          <nav aria-label="Footer — Destinations">
            <h2 className={columnHeadingClass}>Destinations</h2>
            <ul className="mt-5 space-y-2.5">
              {destinations.map((destination) => (
                <li key={destination.slug}>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className={linkClass}
                  >
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Footer — Company">
            <h2 className={columnHeadingClass}>Company</h2>
            <ul className="mt-5 space-y-2.5">
              {siteConfig.navigation.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + socials */}
          <div>
            <h2 className={columnHeadingClass}>Contact</h2>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-block py-1 text-sm transition-colors duration-300 hover:text-gold"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="text-muted">{siteConfig.contact.address}</li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${siteConfig.name} on Instagram`}
                className={socialClass}
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${siteConfig.name} on YouTube`}
                className={socialClass}
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Band 3 — legal bar */}
      <div className="border-t border-gold/15 bg-void/40">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {siteConfig.navigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1.5 transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>
    </footer>
  );
}

