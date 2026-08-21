import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cancellation Policy | Outskyz",
  description:
    "Outskyz cancellation and refund policy for adventure bookings.",
  alternates: { canonical: "/cancellation-policy" },
};

const sections = [
  {
    title: "1. General",
    body: [
      "We understand that plans change. This policy explains how cancellations and reschedules are handled for Outskyz adventure bookings.",
    ],
  },
  {
    title: "2. Cancellation by You",
    body: [
      "More than 7 days before your experience: full refund of the amount paid, minus any non-refundable booking fees charged by our partners.",
      "Between 3 and 7 days before your experience: 50% refund, or a full credit to reschedule for another date.",
      "Less than 3 days before your experience: no refund, but you may reschedule to an available date subject to partner availability.",
    ],
  },
  {
    title: "3. Rescheduling",
    body: [
      "You may reschedule your experience to another available date, subject to availability and any price difference. Rescheduling is free when requested more than 7 days in advance.",
      "Weather-related reschedules are always free, regardless of timing.",
    ],
  },
  {
    title: "4. Cancellation by Outskyz",
    body: [
      "If Outskyz or its partners cancel an experience for safety reasons, weather, or other circumstances beyond our control, you will receive a full refund or a free reschedule to another available date.",
    ],
  },
  {
    title: "5. No-Shows",
    body: [
      "If you do not arrive at the scheduled time and location, the booking is treated as a no-show and is non-refundable.",
    ],
  },
  {
    title: "6. How to Request a Cancellation",
    body: [
      `To cancel or reschedule, email us at ${siteConfig.contact.email} with your booking reference. Our team will confirm the outcome within 24 hours.`,
    ],
  },
];

export default function CancellationPolicyPage() {
  return (
    <>
      <PageHero
        heading="CANCELLATION POLICY"
        subtitle="Clear and fair — how cancellations and reschedules work."
        image="/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg"
      />
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cancellation Policy" },
            ]}
          />
        </Container>
      </Section>

      <Section background="default" spacing="large">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            <p className="text-sm text-muted">
              Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
            </p>
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-xl text-ivory">
                  {section.title}
                </h2>
                {section.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mt-3 text-sm leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
