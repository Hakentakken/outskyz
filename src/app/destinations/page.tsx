import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { DestinationsGrid } from "@/components/sections/DestinationsGrid";
import { destinations, destinationsHero } from "@/data/destinations";

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        heading={destinationsHero.heading}
        subtitle={destinationsHero.subtitle}
        image={destinationsHero.image}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Destinations" },
            ]}
          />
        </Container>
      </Section>

      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Destinations"
          title="Explore the World"
          align="center"
        />

        <DestinationsGrid destinations={destinations} />
      </Section>
    </>
  );
}
