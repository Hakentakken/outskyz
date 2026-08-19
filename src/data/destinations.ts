export interface Destination {
  slug: string;
  name: string;
  country: string;
  shortDescription: string;
  description: string;
  image: string;
  adventureCount: number;
  about: string;
  whyVisit: string[];
  experiences: string[];
  gallery: { src: string; alt: string }[];
  travelInfo: {
    bestTime: string;
    language: string;
    currency: string;
    visa: string;
  };
  faqs: { question: string; answer: string }[];
  packageSlugs: string[];
}

export const destinationsHero = {
  heading: "EXPLORE THE WORLD",
  subtitle: "Discover destinations where adventure knows no bounds.",
  image: images.adventureHero,
} as const;

export const destinations: Destination[] = [
  {
    slug: "russia",
    name: "Russia",
    country: "Eastern Europe",
    shortDescription: "Vast wilderness and dramatic skies await the bold.",
    description:
      "From the dramatic peaks of the Caucasus to the endless Siberian taiga, Russia offers adventure at a scale few places can match.",
    image: images.russia,
    adventureCount: 8,
    about:
      "Russia is the largest country on Earth, spanning eleven time zones and countless landscapes. For adventurers, it offers a unique combination of dramatic terrain, rich history, and world-class aerial experiences.",
    whyVisit: [
      "Dramatic landscapes from mountains to tundra",
      "World-class skydiving facilities",
      "Helicopter tours over UNESCO heritage sites",
      "Rich cultural experiences between adventures",
    ],
    experiences: [
      "Skydiving over Russian countryside",
      "Helicopter tours of Moscow and surroundings",
      "Hot air ballooning over historic landscapes",
      "Winter wilderness expeditions",
    ],
    gallery: [
      { src: images.russia, alt: "Russian landscape" },
      { src: images.travel, alt: "Moscow aerial view" },
      { src: images.russia, alt: "Caucasus mountains" },
    ],
    travelInfo: {
      bestTime: "May - September",
      language: "Russian",
      currency: "Russian Ruble (RUB)",
      visa: "Required for most nationalities",
    },
    faqs: [
      {
        question: "Do I need a visa to visit Russia?",
        answer:
          "Most nationalities require a visa. We provide invitation letters to assist with your application.",
      },
      {
        question: "What is the best time for skydiving in Russia?",
        answer:
          "May through September offers the best weather conditions for aerial adventures.",
      },
      {
        question: "Are the adventures suitable for beginners?",
        answer:
          "Yes, most of our Russia-based adventures are beginner-friendly with tandem options available.",
      },
    ],
    packageSlugs: ["russia-sky-adventure"],
  },
  {
    slug: "thailand",
    name: "Thailand",
    country: "Southeast Asia",
    shortDescription: "Tropical coasts and vibrant culture meet adventure.",
    description:
      "Thailand's crystal-clear waters, limestone cliffs, and vibrant culture create the perfect backdrop for adventure.",
    image: images.thailand,
    adventureCount: 6,
    about:
      "Thailand is Southeast Asia's adventure playground. With its tropical climate, stunning coastlines, and world-class tourism infrastructure, it's the perfect destination for water-based adventures and aerial experiences.",
    whyVisit: [
      "Year-round warm tropical climate",
      "World-class water sports infrastructure",
      "Stunning limestone karst landscapes",
      "Incredible food and hospitality",
    ],
    experiences: [
      "Jet skiing along Phuket coastline",
      "Island hopping adventures",
      "Hot air ballooning over countryside",
      "Water sports and beach activities",
    ],
    gallery: [
      { src: images.thailand, alt: "Thai coastline" },
      { src: images.jetSki, alt: "Phuket beach" },
      { src: images.thailand, alt: "Thai limestone coast" },
    ],
    travelInfo: {
      bestTime: "November - April",
      language: "Thai",
      currency: "Thai Baht (THB)",
      visa: "Visa-free for many nationalities (30-60 days)",
    },
    faqs: [
      {
        question: "Is Thailand safe for adventure activities?",
        answer:
          "Yes. We use only certified operators with international safety standards.",
      },
      {
        question: "What should I pack for Thailand adventures?",
        answer:
          "Swimwear, sunscreen, light clothing, and water shoes are recommended.",
      },
      {
        question: "Can I combine multiple adventures?",
        answer:
          "Absolutely. Our packages allow you to combine water and aerial adventures.",
      },
    ],
    packageSlugs: ["thailand-adventure-escape"],
  },
  {
    slug: "india",
    name: "India",
    country: "South Asia",
    shortDescription: "From the Himalayas to the coast — diverse and magnificent.",
    description:
      "India's incredible diversity offers adventures from hot air ballooning over royal cities to skydiving in the desert state.",
    image: images.india,
    adventureCount: 5,
    about:
      "India is a land of extraordinary diversity — from the snow-capped Himalayas to tropical coastlines. Our India operations focus on Jaipur for hot air ballooning and skydiving.",
    whyVisit: [
      "Incredible geographic diversity",
      "Hot air ballooning over heritage cities",
      "Affordable luxury adventure experiences",
      "Rich cultural and culinary experiences",
    ],
    experiences: [
      "Hot air ballooning over Jaipur",
      "Skydiving in desert landscapes",
      "Heritage tours between adventures",
      "Sunrise and sunset aerial flights",
    ],
    gallery: [
      { src: images.india, alt: "Jaipur cityscape" },
      { src: images.adventureHero, alt: "Himalayan range" },
      { src: images.balloon, alt: "Desert landscape from a balloon" },
    ],
    travelInfo: {
      bestTime: "October - March",
      language: "Hindi, English",
      currency: "Indian Rupee (INR)",
      visa: "E-visa available for most nationalities",
    },
    faqs: [
      {
        question: "Is e-visa available for India?",
        answer:
          "Yes, e-visa is available for most nationalities and can be applied for online.",
      },
      {
        question: "What is the best time for ballooning in Jaipur?",
        answer:
          "October through March offers ideal weather with clear skies and pleasant temperatures.",
      },
      {
        question: "Are cultural tours included?",
        answer:
          "Yes, our India packages include heritage and cultural tours alongside adventure activities.",
      },
    ],
    packageSlugs: ["india-sky-experience"],
  },
  {
    slug: "beyond",
    name: "Beyond",
    country: "Worldwide",
    shortDescription: "Custom expeditions to destinations beyond imagination.",
    description:
      "For those who have done it all, we offer custom expeditions to the world's most remote and extraordinary destinations.",
    image: images.beyond,
    adventureCount: 99,
    about:
      "Our Beyond program is for adventurers who want something truly unique. Whether it's skydiving over the Norwegian fjords or helicopter tours of New Zealand's glaciers — we design custom experiences.",
    whyVisit: [
      "Fully customized itineraries",
      "Access to remote and exclusive locations",
      "Expert planning for complex expeditions",
      "One-of-a-kind experiences",
    ],
    experiences: [
      "Custom skydiving expeditions worldwide",
      "Helicopter tours of remote locations",
      "Bespoke adventure combinations",
      "Private group expeditions",
    ],
    gallery: [
      { src: images.beyond, alt: "Norwegian fjords" },
      { src: images.adventureHero, alt: "New Zealand glaciers" },
      { src: images.balloon, alt: "Cappadocia balloons" },
    ],
    travelInfo: {
      bestTime: "Varies by destination",
      language: "Varies",
      currency: "Varies",
      visa: "Depends on destination — we assist with all requirements",
    },
    faqs: [
      {
        question: "How do I plan a custom expedition?",
        answer:
          "Contact us with your dream adventure and our team will design a bespoke itinerary.",
      },
      {
        question: "What destinations are available?",
        answer:
          "Worldwide. If it's possible and safe, we can make it happen. Contact us to discuss.",
      },
      {
        question: "What is the minimum group size?",
        answer:
          "Custom expeditions are available for solo travelers, couples, and groups of any size.",
      },
    ],
    packageSlugs: [],
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
import { images } from "@/config/images";
