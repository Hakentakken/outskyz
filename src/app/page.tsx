import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { AdventuresSection } from "@/components/sections/AdventuresSection";
import { WhyOutskyzSection } from "@/components/sections/WhyOutskyzSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { FoundersSection } from "@/components/sections/FoundersSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Outskyz | Premium Adventure Experiences",
  description:
    "Discover unforgettable adventures, destinations and experiences with Outskyz.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Outskyz | Premium Adventure Experiences",
    description:
      "Discover unforgettable adventures, destinations and experiences with Outskyz.",
    url: siteConfig.url,
    type: "website",
  },
};

/**
 * Organization structured data placeholder for SEO.
 */
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.contact.address,
  },
  sameAs: [siteConfig.socials.instagram, siteConfig.socials.youtube],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <HeroSection />
      <AdventuresSection />
      <WhyOutskyzSection />
      <DestinationsSection animate="fade-up" animateDelay={100} />
      <PackagesSection animate="fade-up" animateDelay={200} />
      <FoundersSection animate="fade-up" animateDelay={100} />
      <TestimonialsSection animate="scale-in" animateDelay={100} />
      <GallerySection animate="fade-up" animateDelay={200} />
      <FinalCtaSection />
    </>
  );
}
