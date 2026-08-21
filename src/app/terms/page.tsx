import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | Outskyz",
  description:
    "The terms and conditions that govern your use of the Outskyz website and services.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using the Outskyz website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the site or our services.",
    ],
  },
  {
    title: "2. Bookings & Payments",
    body: [
      "Adventure and package bookings are confirmed once payment is successfully processed. Prices are displayed in the relevant currency and may change without prior notice.",
      "You are responsible for providing accurate information at the time of booking, including passenger details and contact information.",
    ],
  },
  {
    title: "3. Adventure Activities & Risk",
    body: [
      "Adventure experiences such as skydiving, jet skiing, and hot air ballooning involve inherent risks. You participate at your own risk and are required to sign an acknowledgement of risk / waiver before the activity.",
      "Health requirements, age limits, and weight restrictions apply to specific experiences and must be disclosed before booking.",
    ],
  },
  {
    title: "4. Weather & Force Majeure",
    body: [
      "Adventure activities depend heavily on weather conditions. Outskyz and its partners may reschedule or cancel experiences due to unsafe conditions, weather, or other events beyond our control.",
      "If an experience is cancelled for safety reasons, you will be offered a full refund or a reschedule at no extra cost.",
    ],
  },
  {
    title: "5. Cancellations & Refunds",
    body: [
      "Cancellation policies vary by experience and are detailed on our Cancellation Policy page and at the time of booking.",
    ],
  },
  {
    title: "6. Intellectual Property",
    body: [
      "All content on this website — including text, graphics, logos, images, and videos — is the property of Outskyz or its licensors and may not be reproduced without permission.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, Outskyz shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website or participation in experiences.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      `For any questions about these Terms of Service, please email us at ${siteConfig.contact.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        heading="TERMS OF SERVICE"
        subtitle="The terms and conditions that govern your use of Outskyz."
        image="/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg"
      />
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Terms" },
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
