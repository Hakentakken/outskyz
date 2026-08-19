export interface Founder {
  id: string;
  name: string;
  designation: string;
  role: string;
  bio: string;
  image: string;
}

export const foundersHero = {
  heading: "Our Leadership",
  subtitle: "The visionaries behind Outskyz",
  image: images.people,
} as const;

export const founders: Founder[] = [
  {
    id: "prince",
    name: "Prince K Bhagat",
    designation: "Founder",
    role: "Chief Experience Curator – India",
    bio:
      "Professional Skydiver and Alumni of Drop Zone Krutitsy. Enriched Solo Traveller both in India and Abroad. Adventure Enthusiast. Striving to bring Adventure Tourism easily accessible and comfortable for People in India and Abroad.",
    image: images.people,
  },
  {
    id: "steve",
    name: "Steve Jogi",
    designation: "Co-Founder",
    role: "Chief Experience Curator – Russia",
    bio:
      "Bringing precision, passion and a global perspective to every experience we create.",
    image: images.people,
  },
];

export const foundersPreview = {
  eyebrow: "Our Story",
  heading: "THE VISION BEHIND OUTSKYZ",
  description:
    "Built by passionate explorers who believe adventure should be accessible, safe and unforgettable.",
  image: images.people,
  cta: { label: "Meet Our Team", href: "/team" },
} as const;
import { images } from "@/config/images";
