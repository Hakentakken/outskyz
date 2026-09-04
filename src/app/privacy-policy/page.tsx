import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Outskyz",
  description:
    "How Outskyz collects, uses, and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "When you use the Outskyz website, we may collect information you provide directly — such as your name, email address, and message content when you contact us or book an adventure.",
      "We also collect basic usage data (pages visited, device type, browser) to understand how visitors use the site and to improve the experience.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "The information you provide is used to respond to your enquiries, process bookings, arrange your adventure with our trusted partners, and keep you informed about your experience.",
      "We do not sell, rent, or trade your personal information to third parties.",
    ],
  },
  {
    title: "3. Data Sharing",
    body: [
      "We only share the information needed to deliver your experience — for example, with local operators who run the specific adventure you booked.",
      "Payment information is processed by our payment provider and is never stored on our servers.",
    ],
  },
  {
    title: "4. Cookies",
    body: [
      "This website may use cookies and similar technologies to remember preferences and understand usage. You can disable cookies in your browser settings at any time.",
    ],
  },
  {
    title: "5. Data Security",
    body: [
      "We take reasonable measures to protect your personal information from unauthorised access, alteration, or disclosure.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "You may request access to, correction of, or deletion of the personal information we hold about you by contacting us at the address below.",
    ],
  },
  {
    title: "7. Contact Us",
    body: [
      `If you have any questions about this Privacy Policy, please email us at ${siteConfig.contact.email}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        heading="PRIVACY POLICY"
        subtitle="How we collect, use, and protect your information."
        image="/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg"
      />
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
            ]}
          />
        </Container>
      </Section>

      <Section background="default" spacing="large">
        <Container>
          <div className="mx-auto max-w-3xl space-y-10">
            <p className="text-sm text-muted">
              Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. This policy applies to the Outskyz website ({siteConfig.url}).
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
