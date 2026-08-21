import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { GoldLine } from "@/components/ui/GoldLine";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "FAQ | Outskyz",
  description:
    "Frequently asked questions about Outskyz adventures, bookings, safety, and destinations.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    question: "Where is Outskyz based?",
    answer:
      `Outskyz is based in ${siteConfig.contact.address}. Our adventures are curated and operated with trusted local partners across the destinations we feature.`,
  },
  {
    question: "How do I book an adventure?",
    answer:
      "Head to the Adventures or Packages pages, choose your experience, and add it to your cart. You can also reach out via the Contact page — the form opens your mail client pre-addressed to our team.",
  },
  {
    question: "Do I need prior experience for skydiving?",
    answer:
      "No. Tandem skydiving is designed for first-timers — you're attached to a certified instructor for the entire jump. Solo progression courses are also available if you want to earn your own license.",
  },
  {
    question: "What should I wear for my adventure?",
    answer:
      "Comfortable, fitted clothing and closed-toe shoes are best. We provide any specialised gear (jumpsuits, harnesses, life jackets) at the experience location.",
  },
  {
    question: "What happens if the weather is bad?",
    answer:
      "Safety always comes first. If conditions are unsafe, we reschedule your experience for the next available slot at no extra cost — never rush a flight.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "You can find full details on our Cancellation Policy page. In short, cancellations made more than 7 days before your experience are fully refundable; later cancellations may be rescheduled.",
  },
  {
    question: "How do I contact the Outskyz team?",
    answer:
      `Email us at ${siteConfig.contact.email} — we typically reply within 24 hours.`,
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        heading="FREQUENTLY ASKED QUESTIONS"
        subtitle="Everything you need to know before you take off."
        image="/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg"
      />
      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "FAQ" },
            ]}
          />
        </Container>
      </Section>

      <Section background="default" spacing="large">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-6">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-md border border-gold/20 bg-coal/50 transition-colors open:border-gold/40"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-display text-lg text-ivory [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="border-t border-gold/15 px-6 py-5 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            <GoldLine className="mx-auto mt-16" />
            <div className="mt-8 text-center">
              <p className="text-muted">
                Still have questions?{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-gold transition-colors hover:text-gold-bright"
                >
                  Email {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
