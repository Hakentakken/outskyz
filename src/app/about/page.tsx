import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoldLine } from "@/components/ui/GoldLine";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Portrait } from "@/components/ui/Portrait";
import { about } from "@/data/about";
import { founders } from "@/data/founders";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover the story behind Outskyz — a premium adventure travel company crafting extraordinary experiences worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        heading={about.hero.heading}
        subtitle={about.hero.subtitle}
        image={about.hero.image}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "About" },
            ]}
          />
        </Container>
      </Section>

      {/* Brand Story */}
      <Section background="default" spacing="medium">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {about.brandStory.eyebrow}
          </p>
          <h2 className="font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
            {about.brandStory.title}
          </h2>
          <GoldLine className="mt-6" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            {about.brandStory.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section background="dark" spacing="medium">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {about.mission.eyebrow}
            </p>
            <h2 className="font-display text-3xl text-ivory sm:text-4xl">
              {about.mission.title}
            </h2>
            <GoldLine className="mt-6" />
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {about.mission.description}
            </p>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {about.vision.eyebrow}
            </p>
            <h2 className="font-display text-3xl text-ivory sm:text-4xl">
              {about.vision.title}
            </h2>
            <GoldLine className="mt-6" />
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              {about.vision.description}
            </p>
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Core Values"
          title="What We Stand For"
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.coreValues.map((value) => (
            <div
              key={value.number}
              className="rounded-md border border-gold/20 bg-coal/50 p-8 transition-all duration-300 hover:border-gold/40"
            >
              <span className="font-display text-3xl text-gold/70">
                {value.number}
              </span>
              <h3 className="mt-4 font-display text-xl text-ivory">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Our Leadership */}
      <Section background="dark" spacing="large">
        <SectionHeading
          eyebrow={about.leadership.eyebrow}
          title={about.leadership.title}
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {founders.map((founder, index) => (
            <div
              key={founder.id}
              className="rounded-md border border-gold/20 bg-coal/50 p-8"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-gradient-to-br from-coal to-void">
                <Portrait
                  src={founder.image}
                  name={founder.name}
                  role={founder.role}
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent"
                />
              </div>
              <div className="mt-6">
                <h3 className="font-display text-2xl text-ivory">
                  {founder.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                  {founder.designation}
                </p>
                <p className="mt-1 text-sm text-ivory/60">{founder.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {founder.bio}
                </p>
                {founder.needsBio ? (
                  <p className="mt-3 text-xs italic leading-relaxed text-gold/60">
                    Bio placeholder — awaiting final copy.
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Our Team */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Our Team"
          title="The People Behind Your Journey"
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="rounded-md border border-gold/20 bg-coal/50 p-6 transition-all duration-300 hover:border-gold/40"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gradient-to-br from-coal to-void">
                <Portrait
                  src={member.image}
                  name={member.name}
                  role={member.role}
                  priority={index < 3}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-xl text-ivory">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                    {member.role}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {member.bio}
              </p>
              {member.needsName ? (
                <p className="mt-3 text-xs italic leading-relaxed text-gold/60">
                  Name placeholder — awaiting the real name.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* Founders Preview */}
      <Section background="dark" spacing="large">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {about.foundersPreview.eyebrow}
            </p>
            <h2 className="font-display text-3xl text-ivory sm:text-4xl lg:text-5xl">
              {about.foundersPreview.title}
            </h2>
            <GoldLine className="mt-6" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              {about.foundersPreview.description}
            </p>
            <a
              href={about.foundersPreview.cta.href}
              className="mt-8 inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              {about.foundersPreview.cta.label}
            </a>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-gold/20 bg-coal">
            <Image
              src={about.foundersPreview.image}
              alt="Outskyz founders"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-void/55 via-transparent to-void/35"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
