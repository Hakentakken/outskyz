import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Globe,
  ShieldCheck,
  MapPinned,
  HeartHandshake,
  Wind,
  Waves,
  Cloud,
  Plane,
  Mountain,
  Quote,
  Star,
  ArrowUpRight,
  Camera,
} from "lucide-react";
import { images } from "@/config/images";

// ─── Hero ───────────────────────────────────────────
export const hero = {
  eyebrow: "One Ultimate Take-Off",
  headingLine1: "LIVE THE",
  headingHighlight: "ADVENTURE",
  headingLine2: "NOT THE VACATION",
  description:
    "We curate unforgettable experiences across the world, from skydiving above mountains to exploring destinations beyond imagination.",
  primaryCta: { label: "Explore Experiences", href: "/adventures" },
  secondaryCta: { label: "Book Now", href: "/contact" },
  image: images.adventureHero,
  indicators: [
    { number: "01", label: "Adventure" },
    { number: "02", label: "Explore" },
    { number: "03", label: "Experience" },
  ],
} as const;

// ─── Featured Adventures ────────────────────────────
export interface AdventureItem {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
}

export const adventures: AdventureItem[] = [
  {
    id: "skydiving",
    number: "01",
    title: "Skydiving",
    description: "Feel the freedom of flight above breathtaking landscapes.",
    image: images.skydiving,
    icon: Wind,
  },
  {
    id: "wind-tunnel",
    number: "02",
    title: "Wind Tunnel",
    description: "Experience real free flight in a controlled environment.",
    image: images.windTunnel,
    icon: Cloud,
  },
  {
    id: "jet-skiing",
    number: "03",
    title: "Jet Skiing",
    description: "High-speed ocean adventures.",
    image: images.jetSki,
    icon: Waves,
  },
  {
    id: "hot-air-balloon",
    number: "04",
    title: "Hot Air Balloon",
    description: "See the world from a completely new perspective.",
    image: images.balloon,
    icon: Cloud,
  },
  {
    id: "helicopter-ride",
    number: "05",
    title: "Helicopter Ride",
    description: "Luxury views from above.",
    image: images.helicopter,
    icon: Plane,
  },
  {
    id: "tandem-skydiving",
    number: "06",
    title: "Tandem Skydiving",
    description: "Your first jump, guided by professionals.",
    image: images.skydiving,
    icon: Wind,
  },
];

// ─── Why Outskyz ────────────────────────────────────
export interface FeatureItem {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const whyOutskyz = {
  eyebrow: "Why Outskyz?",
  heading: "WHY OUTSKYZ?",
  description:
    "Because ordinary vacations create memories. Extraordinary adventures create stories.",
  features: [
    {
      number: "01",
      title: "Curated Experiences",
      description:
        "Every adventure is handpicked and tested for the ultimate thrill.",
      icon: Compass,
    },
    {
      number: "02",
      title: "Global Adventure Network",
      description:
        "Partners across continents bringing you the world's best experiences.",
      icon: Globe,
    },
    {
      number: "03",
      title: "Safety First Approach",
      description:
        "Certified guides, premium equipment, and rigorous safety protocols.",
      icon: ShieldCheck,
    },
    {
      number: "04",
      title: "Personalized Travel Planning",
      description:
        "Tailored itineraries crafted around your dreams and comfort level.",
      icon: MapPinned,
    },
    {
      number: "05",
      title: "Memories Beyond Moments",
      description:
        "We don't just plan trips — we engineer stories you'll tell forever.",
      icon: HeartHandshake,
    },
  ] satisfies FeatureItem[],
} as const;

// ─── Destinations ───────────────────────────────────
export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
}

export const destinations: DestinationItem[] = [
  {
    id: "russia",
    name: "Russia",
    country: "Eastern Europe",
    description: "Vast wilderness and dramatic skies await the bold.",
    image: images.russia,
  },
  {
    id: "thailand",
    name: "Thailand",
    country: "Southeast Asia",
    description: "Tropical coasts and vibrant culture meet adventure.",
    image: images.thailand,
  },
  {
    id: "india",
    name: "India",
    country: "South Asia",
    description: "From the Himalayas to the coast — diverse and magnificent.",
    image: images.india,
  },
  {
    id: "beyond",
    name: "Beyond",
    country: "Worldwide",
    description: "Custom expeditions to destinations beyond imagination.",
    image: images.beyond,
  },
];

// ─── Featured Packages ──────────────────────────────
export interface PackageItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  location: string;
  price: string;
  features: string[];
  popular?: boolean;
}

export const packages: PackageItem[] = [
  {
    id: "russia-sky-adventure",
    name: "Russia Sky Adventure",
    description: "A 22-day, 25-jump progression programme in Russia.",
    duration: "22 days",
    location: "Moscow, Russia",
    price: "₹3,88,950",
    features: [
      "Tandem skydiving experience",
      "Luxury accommodation",
      "Professional photography",
      "Ground transport included",
    ],
    popular: true,
  },
  {
    id: "thailand-adventure-escape",
    name: "Thailand Adventure Escape",
    description: "Tropical thrills across Thailand's stunning coastline.",
    duration: "7 days",
    location: "Phuket, Thailand",
    price: "$1,899",
    features: [
      "Jet skiing & water sports",
      "Island hopping tour",
      "Beachfront resort stay",
      "All meals included",
    ],
  },
  {
    id: "india-sky-experience",
    name: "India Sky Experience",
    description: "Hot air ballooning over India's majestic terrain.",
    duration: "4 days",
    location: "Jaipur, India",
    price: "$1,299",
    features: [
      "Hot air balloon ride",
      "Heritage hotel stay",
      "Cultural tour included",
      "Sunrise & sunset flights",
    ],
  },
];

// ─── Founders Preview ───────────────────────────────
export const founders = {
  eyebrow: "Our Story",
  heading: "THE VISION BEHIND OUTSKYZ",
  description:
    "Built by passionate explorers who believe adventure should be accessible, safe and unforgettable.",
  image: images.people,
  cta: { label: "Meet Our Team", href: "/team" },
} as const;

// ─── Testimonials ───────────────────────────────────
export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  adventureType: string;
}

export const testimonials: TestimonialItem[] = [
  {
    id: "1",
    quote:
      "The skydiving experience was beyond anything I could have imagined. Outskyz made the impossible feel effortless.",
    name: "Arjun Mehta",
    adventureType: "Skydiving · Russia",
  },
  {
    id: "2",
    quote:
      "From the first call to the final landing, every detail was flawless. This isn't a travel company — it's a dream factory.",
    name: "Sarah Chen",
    adventureType: "Hot Air Balloon · India",
  },
  {
    id: "3",
    quote:
      "I've traveled the world, but nothing compares to the rush of a tandem jump with Outskyz. Absolutely unforgettable.",
    name: "Marcus Reid",
    adventureType: "Tandem Skydiving · Thailand",
  },
];

// ─── Gallery ────────────────────────────────────────
export const gallery = {
  heading: "CAPTURED MOMENTS",
  eyebrow: "Gallery",
  description:
    "A glimpse into the extraordinary experiences our adventurers have lived.",
  images: [
    { src: "/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg", alt: "Outskyz skydiving field in Russia", type: "image" },
    { src: "/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM (1).jpeg", alt: "Outskyz skydiving day in Russia", type: "image" },
    { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.43 PM.mp4", alt: "Outskyz skydiving experience", type: "video" },
    { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.44 PM.mp4", alt: "Outskyz adventure moment", type: "video" },
    { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.45 PM.mp4", alt: "Outskyz parachuting experience", type: "video" },
    { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.44 PM (1).mp4", alt: "Outskyz flight footage", type: "video" },
  ],
  cta: { label: "View Full Gallery", href: "/gallery" },
} as const;

// ─── Final CTA ──────────────────────────────────────
export const finalCta = {
  heading: "YOUR NEXT STORY STARTS HERE",
  description: "Choose your adventure. We'll handle the journey.",
  primaryCta: { label: "Book Your Adventure", href: "/contact" },
  secondaryCta: { label: "Contact Us", href: "/contact" },
} as const;

// ─── Icons re-exported for section components ───────
export const icons = {
  Quote,
  Star,
  ArrowUpRight,
  Camera,
  Mountain,
} as const;
