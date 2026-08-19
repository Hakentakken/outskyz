import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { teamHero, teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the passionate experts behind Outskyz — adventure curators, skydiving specialists, and travel planners.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        heading={teamHero.heading}
        subtitle={teamHero.subtitle}
        image={teamHero.image}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Team" },
            ]}
          />
        </Container>
      </Section>

      {/* Leadership */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Leadership"
          title="Guiding the Vision"
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {teamMembers.slice(0, 2).map((member) => (
            <div
              key={member.id}
              className="rounded-md border border-gold/20 bg-coal/50 p-8"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-gradient-to-br from-coal to-void">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-6xl text-gold/10">
                    {member.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-2xl text-ivory">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Adventure Specialists */}
      <Section background="dark" spacing="large">
        <SectionHeading
          eyebrow="Adventure Specialists"
          title="Expert Instructors"
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.slice(2, 5).map((member) => (
            <div
              key={member.id}
              className="rounded-md border border-gold/20 bg-coal/50 p-6 transition-all duration-300 hover:border-gold/40"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gradient-to-br from-coal to-void">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl text-gold/10">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
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
            </div>
          ))}
        </div>
      </Section>

      {/* Experience Curators */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Experience Curators"
          title="Crafting Your Journey"
          align="center"
        />
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.slice(5).map((member) => (
            <div
              key={member.id}
              className="rounded-md border border-gold/20 bg-coal/50 p-6 transition-all duration-300 hover:border-gold/40"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-gradient-to-br from-coal to-void">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl text-gold/10">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
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
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
