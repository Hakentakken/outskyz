import type { Metadata } from "next";
import { ShieldCheck, Award, Users, ClipboardCheck, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { GoldLine } from "@/components/ui/GoldLine";
import { adventures } from "@/data/adventures";

export const metadata: Metadata = {
  title: "Safety | Outskyz",
  description:
    "Our commitment to safety — certified guides, premium equipment, and rigorous protocols on every Outskyz adventure.",
  alternates: { canonical: "/safety" },
};

const corePillars = [
  {
    icon: Award,
    title: "Certified Instructors",
    description:
      "Every Outskyz experience is led by certified professionals — from USPA-certified skydiving instructors to commercially licensed pilots and experienced balloon pilots.",
  },
  {
    icon: ShieldCheck,
    title: "Rigorous Equipment Standards",
    description:
      "Equipment is inspected before every flight. Redundant systems, automatic activation devices, and life jackets are standard on the experiences that require them.",
  },
  {
    icon: ClipboardCheck,
    title: "Strict Weather Monitoring",
    description:
      "Weather and conditions are assessed before every adventure. If conditions are ever unsafe, experiences are rescheduled — never rushed.",
  },
  {
    icon: Users,
    title: "Guided & Supported",
    description:
      "Professional guides and ground crews accompany every experience, from high-speed water adventures to serene hot air balloon flights.",
  },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        heading="SAFETY FIRST"
        subtitle="Certified guides, premium equipment, and rigorous protocols on every adventure."
        image="/resources/gallery/1.jpg"
      />
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Safety" },
            ]}
          />
        </Container>
      </Section>
      <Section background="default" spacing="large">
        <Container>
          <SectionHeading
            eyebrow="Our Standard"
            title="Adventure You Can Trust"
            description="We believe thrill and safety are not opposites. They are the two pillars of every Outskyz experience."
            align="center"
          />
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col rounded-md border border-gold/20 bg-void/50 p-8 transition-all duration-300 hover:border-gold/40 hover:bg-void/80"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-gold/40 bg-gold/5 text-gold">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 font-display text-xl text-ivory">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Per-experience safety protocols — from existing adventure data */}
      <Section background="dark" spacing="large">
        <Container>
          <SectionHeading
            eyebrow="By Experience"
            title="Safety Protocols Per Adventure"
            description="Every experience carries its own precision safety procedures."
            align="center"
          />
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {adventures.map((adventure) => (
              <div
                key={adventure.slug}
                className="flex flex-col rounded-md border border-gold/20 bg-void/50 p-8"
              >
                <Badge className="mb-4 self-start">{adventure.categoryLabel}</Badge>
                <h3 className="font-display text-xl text-ivory">{adventure.title}</h3>
                <GoldLine className="mt-4" />
                <ul className="mt-6 flex-1 space-y-3">
                  {adventure.safety.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-ivory/70">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section background="default" spacing="large">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-ivory sm:text-4xl">
            Ready to fly with confidence?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Book your adventure knowing {"you"} are in the safest hands.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
          >
            Book Now
          </a>
        </div>
      </Section>
    </>
  );
}
