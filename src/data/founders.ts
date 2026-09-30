import { images } from "@/config/images";

export interface Founder {
  id: string;
  name: string;
  designation: string;
  role: string;
  bio: string;
  /**
   * Portrait photograph path under `public/leadership/`.
   * See `public/leadership/README.md` for the file-drop-in checklist.
   */
  image: string;
  /**
   * Set when the bio is still placeholder copy that needs a real, specific
   * write-up before launch.
   */
  needsBio?: boolean;
}

export const foundersHero = {
  heading: "Our Leadership",
  subtitle: "The visionaries behind Outskyz",
  image: images.people,
} as const;

/**
 * Leadership roster.
 *
 * TODO(owner): Steve Jogi's bio is placeholder copy — replace it with a real,
 * specific write-up and drop the `needsBio` flag. See
 * `public/leadership/README.md`.
 */
export const founders: Founder[] = [
  {
    id: "prince",
    name: "Prince K Bhagat",
    designation: "Founder",
    role: "Chief Experience Curator – India",
    bio:
      "Professional Skydiver and Alumni of Drop Zone Krutitsy. Enriched Solo Traveller both in India and Abroad. Adventure Enthusiast. Striving to bring Adventure Tourism easily accessible and comfortable for People in India and Abroad.",
    image: "/leadership/prince-k-bhagat.jpg",
  },
  {
    id: "steve",
    name: "Steve Jogi",
    designation: "Co-Founder",
    role: "Chief Experience Curator – Russia",
    bio:
      "Bringing precision, passion and a global perspective to every experience we create.",
    image: "/leadership/steve-jogi.jpg",
    needsBio: true,
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
