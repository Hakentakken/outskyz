import type { NavItem, SocialLinks } from "@/types";

export const siteConfig = {
  name: "Outskyz",
  shortName: "Outskyz",
  description:
    "Outskyz is a premium adventure travel company crafting cinematic journeys to the world's wildest horizons. From the high Himalayas to remote coasts, we design bespoke expeditions for those who seek more than a trip — an odyssey.",
  tagline: "One Ultimate Take-Off.",
  url: "https://outskyz.com",
  locale: "en_IN",
  brand: {
    colors: {
      background: "#050505",
      secondary: "#0D0D0D",
      gold: "#D4AF37",
      brightGold: "#F5C542",
      white: "#F5F5F5",
      muted: "#A1A1AA",
      border: "rgba(212, 175, 55, 0.35)",
    },
  },
  cta: {
    label: "Book Adventure",
    href: "/contact",
  },
  navigation: {
    main: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Adventures", href: "/adventures" },
      { label: "Destinations", href: "/destinations" },
      { label: "Packages", href: "/packages" },
      { label: "Safety", href: "/safety" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ] satisfies NavItem[],
    explore: [
      { label: "Home", href: "/" },
      { label: "Adventures", href: "/adventures" },
      { label: "Destinations", href: "/destinations" },
      { label: "Packages", href: "/packages" },
      { label: "Gallery", href: "/gallery" },
    ] satisfies NavItem[],
    destinations: [
      { label: "Russia", href: "/destinations/russia" },
      { label: "Thailand", href: "/destinations/thailand" },
      { label: "India", href: "/destinations/india" },
      { label: "Beyond", href: "/destinations/beyond" },
    ] satisfies NavItem[],
    packages: [
      { label: "Russia Sky Adventure", href: "/packages/russia-sky-adventure" },
      { label: "Thailand Adventure Escape", href: "/packages/thailand-adventure-escape" },
      { label: "India Sky Experience", href: "/packages/india-sky-experience" },
    ] satisfies NavItem[],
    company: [
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Safety", href: "/safety" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ] satisfies NavItem[],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Cancellation Policy", href: "/cancellation-policy" },
    ] satisfies NavItem[],
  },
  contact: {
    email: "hello@outskyz.com",
    phone: "+91 00000 00000",
    address: "Mumbai, India",
    bookingsEmail: "bookings@outskyz.com",
  },
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  } satisfies SocialLinks,
} as const;

export type SiteConfig = typeof siteConfig;
