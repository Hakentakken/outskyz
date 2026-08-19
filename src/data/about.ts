export const about = {
  hero: {
    heading: "OUR STORY",
    subtitle: "Adventure begins with a vision.",
    image: images.adventureHero,
  },
  brandStory: {
    eyebrow: "Who We Are",
    title: "Crafting Extraordinary Adventures",
    paragraphs: [
      "Outskyz was born from a simple belief: that adventure should be more than a trip — it should be a transformation. We create premium adventure experiences around the world, from skydiving above mountain ranges to exploring destinations beyond imagination.",
      "Every journey we design is curated by experts who have lived the adventures themselves. We don't sell packages — we engineer stories you'll tell for the rest of your life.",
    ],
  },
  mission: {
    eyebrow: "Our Mission",
    title: "To Make Extraordinary Accessible",
    description:
      "We exist to bridge the gap between dream and reality — making world-class adventure experiences safe, personalized, and unforgettable for every traveler who dares to go beyond.",
  },
  vision: {
    eyebrow: "Our Vision",
    title: "A World Where Adventure Has No Limits",
    description:
      "We envision a future where every person, regardless of experience level, can access the thrill of flight, the rush of the ocean, and the awe of seeing the world from above — guided by the best, powered by passion.",
  },
  coreValues: [
    {
      number: "01",
      title: "Safety",
      description:
        "Every adventure is backed by certified guides, premium equipment, and rigorous safety protocols.",
    },
    {
      number: "02",
      title: "Experience",
      description:
        "We don't just plan trips — we craft immersive experiences that engage every sense.",
    },
    {
      number: "03",
      title: "Personalization",
      description:
        "No two adventurers are the same. Every journey is tailored to your dreams and comfort.",
    },
    {
      number: "04",
      title: "Global Network",
      description:
        "Partners across continents bringing you the world's most extraordinary experiences.",
    },
    {
      number: "05",
      title: "Memories",
      description:
        "We engineer moments that become stories — stories that become legends.",
    },
  ],
  foundersPreview: {
    eyebrow: "Our Founders",
    title: "Built by Passionate Explorers",
    description:
      "Outskyz was founded by adventurers who lived these experiences first-hand. They built this company to share that feeling with the world.",
    image: images.people,
    cta: { label: "Meet Our Team", href: "/team" },
  },
} as const;
import { images } from "@/config/images";
