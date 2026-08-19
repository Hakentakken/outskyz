import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/SocialIcon";
import { resources } from "@/config/resources";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { adventures } from "@/data/adventures";
import { destinations } from "@/data/destinations";

const FOOTER_DESCRIPTION =
  "Curating unforgettable adventure experiences across the world.";

/**
 * Global footer.
 * Column 1 — brand + description
 * Column 2 — Explore links (adventures + destinations)
 * Column 3 — Company links
 * Column 4 — Contact details + social icons
 * Bottom — copyright + legal links
 */
export function Footer() {
  return (
    <footer className="border-t border-gold/25 bg-coal">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              className="group flex items-center gap-3"
            >
              <Image
                src={resources.logo}
                alt={`${siteConfig.name} logo`}
                width={180}
                height={60}
                className="h-16 w-auto brightness-110 transition-all duration-300 group-hover:scale-[1.035] group-hover:brightness-125 group-hover:drop-shadow-[0_0_16px_rgba(70,181,255,0.45)]"
              />
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {FOOTER_DESCRIPTION}
            </p>
          </div>

          {/* Experiences */}
          <nav aria-label="Footer — Experiences">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Experiences
            </h3>
            <ul className="space-y-3">
              {adventures.map((adventure) => (
                <li key={adventure.slug}>
                  <Link
                    href={`/adventures/${adventure.slug}`}
                    className="text-sm text-ivory/70 transition-colors duration-300 hover:text-gold"
                  >
                    {adventure.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/adventures"
                  className="text-sm font-semibold text-gold transition-colors duration-300 hover:text-gold-bright"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </nav>

          {/* Destinations + Safety */}
          <nav aria-label="Footer — Destinations">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Destinations
            </h3>
            <ul className="space-y-3">
              {destinations.map((destination) => (
                <li key={destination.slug}>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="text-sm text-ivory/70 transition-colors duration-300 hover:text-gold"
                  >
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Company
            </h3>
            <ul className="space-y-3">
              {siteConfig.navigation.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ivory/70 transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors duration-300 hover:text-gold"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors duration-300 hover:text-gold"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="text-muted">{siteConfig.contact.address}</li>
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Outskyz on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors duration-300 hover:bg-gold/10"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Outskyz on YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors duration-300 hover:bg-gold/10"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <Divider className="my-10" />

        {/* Legal bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {siteConfig.navigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}