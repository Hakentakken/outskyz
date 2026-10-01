import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoldLine } from "@/components/ui/GoldLine";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Portrait } from "@/components/ui/Portrait";
import { Button } from "@/components/ui/Button";
import { about } from "@/data/about";
import { founders } from "@/data/founders";
import { teamMembers } from "@/data/team";
import { images } from "@/config/images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover the story behind Outskyz — a premium adventure travel company crafting extraordinary experiences worldwide.",
  alternates: { canonical: "/about" },
};

/** One eyebrow treatment for the whole page. */
const eyebrowClass =
  "text-xs font-semibold uppercase tracking-[0.3em] text-gold";

/**
 * About page.
 *
 * Layout is deliberately editorial: a story split, then purpose, values,
 * leadership and team, closing on a call to action. The previous version ran
 * the brand story as a single narrow column and repeated the founders block
 * twice (once as "Leadership", again as a "Founders Preview" underneath the
 * team), which read as duplication rather than build-up.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        heading={about.hero.heading}
        subtitle={about.hero.subtitle}
        image={about.hero.image}
      />

      <Section background="default" spacing="small">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
      </Section>

      {/* Story split */}
      <Section background="default" spacing="large">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className={eyebrowClass}>{about.brandStory.eyebrow}</p>
            <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
              {about.brandStory.title}
            </h2>
            <GoldLine className="mt-6" />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              {about.brandStory.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-9 border-l-2 border-gold/40 pl-5 font-display text-xl text-ivory/90 sm:text-2xl">
              {siteConfig.tagline}
            </p>
          </div>

          <div className="relative">
            {/* Offset frame first so the photograph paints over it; a negative
                z-index would drop it behind the section's own atmosphere. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-md border border-gold/25"
            />
            <div className="relative aspect-4/5 overflow-hidden rounded-md border border-gold/20 bg-coal">
              <Image
                src={images.skydiving}
                alt="An Outskyz adventurer in freefall"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className={eyebrowClass}>{siteConfig.contact.address}</p>
                <p className="mt-2 text-sm text-ivory/80">
                  Where every journey begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Purpose: mission + vision as paired panels */}
      <Section background="dark" spacing="large">
        <SectionHeading
          eyebrow="Our Purpose"
          title="Why We Fly"
          align="center"
          description="Two commitments shape every itinerary we design."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {[about.mission, about.vision].map((panel, index) => (
            <div
              key={panel.eyebrow}
              className="group relative overflow-hidden rounded-md border border-gold/20 bg-void/40 p-8 transition-all duration-500 hover:border-gold/45 hover:bg-void/60 sm:p-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 -right-2 font-display text-8xl text-gold/10 transition-colors duration-500 group-hover:text-gold/20"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className={eyebrowClass}>{panel.eyebrow}</p>
              <h3 className="mt-4 font-display text-2xl text-ivory sm:text-3xl">
                {panel.title}
              </h3>
              <GoldLine className="mt-5" />
              <p className="mt-5 max-w-prose text-base leading-relaxed text-muted">
                {panel.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Core values, 01-05 */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Core Values"
          title="What We Stand For"
          align="center"
          description="Five principles, applied to every departure."
        />
        <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.coreValues.map((value) => (
            <li
              key={value.number}
              className="group relative overflow-hidden rounded-md border border-gold/20 bg-coal/50 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-gold to-transparent transition-transform duration-500 group-hover:scale-x-100"
              />
              <span className="font-display text-4xl text-gold/70">
                {value.number}
              </span>
              <h3 className="mt-5 font-display text-xl text-ivory">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {value.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>



      {/* Leadership */}
      <Section background="dark" spacing="large">
        <SectionHeading
          eyebrow={about.leadership.eyebrow}
          title={about.leadership.title}
          align="center"
          description="Curators who have lived the experiences they design."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {founders.map((founder, index) => (
            <article
              key={founder.id}
              className="group overflow-hidden rounded-md border border-gold/20 bg-void/40 transition-all duration-500 hover:border-gold/45"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-gradient-to-br from-coal to-void">
                <Portrait
                  src={founder.image}
                  name={founder.name}
                  role={founder.role}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="font-display text-2xl text-ivory">
                    {founder.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gold">
                    {founder.designation}
                  </p>
                  <p className="mt-1 text-sm text-ivory/70">{founder.role}</p>
                </div>
              </div>
              <div className="p-7 pt-0">
                <p className="text-sm leading-relaxed text-muted">
                  {founder.bio}
                </p>
                {founder.needsBio ? (
                  <p className="mt-3 text-xs leading-relaxed text-gold/60 italic">
                    Bio placeholder — awaiting final copy.
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Our Team"
          title="The People Behind Your Journey"
          align="center"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <article
              key={member.id}
              className="group flex flex-col overflow-hidden rounded-md border border-gold/20 bg-coal/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/45"
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-md bg-gradient-to-br from-coal to-void">
                <Portrait
                  src={member.image}
                  name={member.name}
                  role={member.role}
                  priority={index < 3}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-xl text-ivory">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-muted">
                {member.bio}
              </p>
              {member.needsName ? (
                <p className="mt-3 text-xs leading-relaxed text-gold/60 italic">
                  Name placeholder — awaiting the real name.
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      {/* Closing CTA — replaces the old duplicated "founders preview" block */}
      <Section background="dark" spacing="large">
        <div className="relative overflow-hidden rounded-lg border border-gold/25 bg-void/50 px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.16),transparent_60%)]"
          />
          <div className="relative mx-auto max-w-2xl">
            <p className={eyebrowClass}>Start Your Journey</p>
            <h2 className="mt-4 font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
              Your turn to take off.
            </h2>
            <GoldLine className="mx-auto mt-6" />
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {about.foundersPreview.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href={siteConfig.cta.href}>{siteConfig.cta.label}</Button>
              <Button href={about.foundersPreview.cta.href} variant="secondary">
                {about.foundersPreview.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

