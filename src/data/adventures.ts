import type { LucideIcon } from "lucide-react";
import { Wind, Cloud, Waves, Plane } from "lucide-react";
import { images } from "@/config/images";

export type AdventureCategory = "sky" | "water" | "land" | "luxury";

export interface Adventure {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  description: string;
  category: AdventureCategory;
  categoryLabel: string;
  image: string;
  icon: LucideIcon;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: string;
  ageLimit: string;
  location: string;
  overview: string;
  experience: { time: string; title: string; description: string }[];
  safety: string[];
  requirements: string[];
    gallery: { src: string; alt: string }[];
  relatedSlugs: string[];
  /** DB-managed fields (optional — present when sourced from Supabase). */
  price?: number;
  currency?: string;
  is_active?: boolean;
}

export const adventuresHero = {
  heading: "ADVENTURES OFFERED",
  subtitle: "Push your limits. Create unforgettable stories.",
  image: images.adventureHero,
} as const;

export const adventureCategories = [
  { id: "all", label: "All" },
  { id: "sky", label: "Sky" },
  { id: "water", label: "Water" },
  { id: "land", label: "Land" },
  { id: "luxury", label: "Luxury" },
] as const;

export const adventures: Adventure[] = [
  {
    slug: "skydiving",
    number: "01",
    title: "Skydiving",
    shortDescription: "Feel the freedom of flight above breathtaking landscapes.",
    description:
      "Experience the ultimate adrenaline rush as you freefall from 15,000 feet above some of the world's most stunning landscapes. Our certified instructors guide every step of your journey.",
    category: "sky",
    categoryLabel: "Sky",
    image: images.skydiving,
    icon: Wind,
    difficulty: "Beginner",
    duration: "Half day",
    ageLimit: "16+ years",
    location: "Multiple locations",
    overview:
      "Skydiving is the purest form of human flight. After a comprehensive ground briefing, you'll board the aircraft and ascend to altitude. Attached to your tandem instructor, you'll experience 60 seconds of freefall at 200 km/h, followed by a peaceful parachute descent with panoramic views.",
    experience: [
      {
        time: "08:00",
        title: "Arrival & Registration",
        description: "Welcome briefing, paperwork, and equipment fitting.",
      },
      {
        time: "09:00",
        title: "Ground Training",
        description: "Learn body positions, safety procedures, and what to expect.",
      },
      {
        time: "10:00",
        title: "Boarding",
        description: "Gear up and board the aircraft for ascent to 15,000 feet.",
      },
      {
        time: "10:30",
        title: "The Jump",
        description: "60 seconds of freefall followed by a 5-minute parachute glide.",
      },
      {
        time: "11:00",
        title: "Debrief",
        description: "Review your experience and receive your certificate.",
      },
    ],
    safety: [
      "All instructors are USPA certified with 5,000+ jumps",
      "Equipment inspected before every flight",
      "Redundant parachute systems",
      "Weather monitoring — jumps rescheduled if conditions are unsafe",
    ],
    requirements: [
      "Minimum age: 16 years (parental consent required under 18)",
      "Maximum weight: 100 kg",
      "Closed-toe shoes required",
      "No alcohol 12 hours before jump",
    ],
    gallery: [
      { src: images.skydiving, alt: "Skydiving freefall" },
      { src: images.russia, alt: "Parachute descent over a landscape" },
      { src: images.travel, alt: "Skydiving landing field" },
    ],
    relatedSlugs: ["tandem-skydiving", "wind-tunnel", "helicopter-ride"],
  },
  {
    slug: "wind-tunnel",
    number: "02",
    title: "Wind Tunnel",
    shortDescription: "Experience real free flight in a controlled environment.",
    description:
      "Master the art of bodyflight in our state-of-the-art wind tunnel. Perfect for beginners and experienced flyers alike, this controlled environment lets you experience the sensation of skydiving without the altitude.",
    category: "sky",
    categoryLabel: "Sky",
    image: images.windTunnel,
    icon: Cloud,
    difficulty: "Beginner",
    duration: "1 hour",
    ageLimit: "8+ years",
    location: "Indoor facilities",
    overview:
      "Wind tunnel flying simulates the freefall portion of skydiving in a safe, controlled vertical wind tunnel. After a briefing from your instructor, you'll enter the flight chamber and experience the thrill of bodyflight with hands-on guidance.",
    experience: [
      {
        time: "Step 1",
        title: "Briefing",
        description: "Learn flight positions and hand signals from your instructor.",
      },
      {
        time: "Step 2",
        title: "Gear Up",
        description: "Flight suit, helmet, and earplugs fitted.",
      },
      {
        time: "Step 3",
        title: "First Flight",
        description: "Two 1-minute flights with instructor guidance.",
      },
      {
        time: "Step 4",
        title: "Review",
        description: "Watch your flight video and receive tips.",
      },
    ],
    safety: [
      "Certified flight instructors at all times",
      "Controlled environment — no weather dependency",
      "All safety gear provided",
      "Suitable for ages 8 and up",
    ],
    requirements: [
      "Minimum age: 8 years",
      "Maximum weight: 120 kg",
      "No prior experience needed",
      "Comfortable clothing recommended",
    ],
    gallery: [
      { src: images.windTunnel, alt: "Wind tunnel flight" },
      { src: images.people, alt: "Instructor guidance" },
    ],
    relatedSlugs: ["skydiving", "tandem-skydiving"],
  },
  {
    slug: "jet-skiing",
    number: "03",
    title: "Jet Skiing",
    shortDescription: "High-speed ocean adventures.",
    description:
      "Carve through crystal-clear waters at thrilling speeds. Our jet skiing experiences take you along stunning coastlines with professional guides and top-of-the-line equipment.",
    category: "water",
    categoryLabel: "Water",
    image: images.jetSki,
    icon: Waves,
    difficulty: "Beginner",
    duration: "2 hours",
    ageLimit: "18+ years (16+ with guardian)",
    location: "Coastal locations",
    overview:
      "Jet skiing combines the thrill of speed with the beauty of the ocean. After a safety briefing and orientation, you'll ride along guided routes that showcase the best of each coastline — from hidden coves to open-water stretches.",
    experience: [
      {
        time: "09:00",
        title: "Safety Briefing",
        description: "Learn operation, signals, and water safety rules.",
      },
      {
        time: "09:30",
        title: "Orientation Ride",
        description: "Practice in a controlled area before heading out.",
      },
      {
        time: "10:00",
        title: "Guided Tour",
        description: "Explore coastline routes with your guide.",
      },
      {
        time: "11:30",
        title: "Free Ride",
        description: "Enjoy open-water time at your own pace.",
      },
    ],
    safety: [
      "Life jackets mandatory",
      "Professional guide accompanies all rides",
      "Speed limits in designated zones",
      "Weather and sea condition monitoring",
    ],
    requirements: [
      "Minimum age: 18 years (16 with guardian consent)",
      "Basic swimming ability required",
      "Photo ID required",
      "Sunscreen and swimwear recommended",
    ],
    gallery: [
      { src: images.jetSki, alt: "Jet skiing on the ocean" },
      { src: images.thailand, alt: "Tropical coastline view" },
    ],
    relatedSlugs: ["hot-air-balloon", "helicopter-ride"],
  },
  {
    slug: "hot-air-balloon",
    number: "04",
    title: "Hot Air Balloon",
    shortDescription: "See the world from a completely new perspective.",
    description:
      "Drift silently above breathtaking landscapes as the sun rises. Hot air ballooning is the most serene adventure — a gentle ascent that reveals the world in ways you've never seen.",
    category: "luxury",
    categoryLabel: "Luxury",
    image: images.balloon,
    icon: Cloud,
    difficulty: "Beginner",
    duration: "3 hours",
    ageLimit: "All ages",
    location: "Scenic locations",
    overview:
      "Your hot air balloon experience begins before dawn. Watch as the balloon is inflated, then step into the basket and ascend gently into the sky. Float at varying altitudes for approximately one hour, taking in panoramic views as the sun rises over the landscape.",
    experience: [
      {
        time: "05:00",
        title: "Pre-Dawn Arrival",
        description: "Arrive at the launch site for balloon inflation.",
      },
      {
        time: "05:30",
        title: "Lift Off",
        description: "Gentle ascent as the sun begins to rise.",
      },
      {
        time: "06:00",
        title: "In Flight",
        description: "One hour of peaceful floating with panoramic views.",
      },
      {
        time: "07:00",
        title: "Landing & Celebration",
        description: "Traditional post-flight celebration with refreshments.",
      },
    ],
    safety: [
      "Experienced certified pilots",
      "Weather checked before every flight",
      "Basket safety rails and secure design",
      "Ground crew follows throughout",
    ],
    requirements: [
      "All ages welcome (children under 12 must be accompanied)",
      "No heart conditions or severe fear of heights",
      "Wear layers — cooler at altitude",
      "Closed-toe shoes recommended",
    ],
    gallery: [
      { src: images.balloon, alt: "Balloon at sunrise" },
      { src: images.india, alt: "Aerial view over India" },
    ],
    relatedSlugs: ["helicopter-ride", "skydiving"],
  },
  {
    slug: "helicopter-ride",
    number: "05",
    title: "Helicopter Ride",
    shortDescription: "Luxury views from above.",
    description:
      "Soar above cities, mountains, and coastlines in a luxury helicopter tour. With panoramic windows and expert pilots, every flight is a first-class aerial experience.",
    category: "luxury",
    categoryLabel: "Luxury",
    image: images.helicopter,
    icon: Plane,
    difficulty: "Beginner",
    duration: "30-60 minutes",
    ageLimit: "All ages",
    location: "Premium locations",
    overview:
      "Experience the world from a perspective few ever see. Our helicopter tours offer panoramic views, luxury comfort, and expert commentary from your pilot. Choose from scenic routes over mountains, coastlines, or city skylines.",
    experience: [
      {
        time: "Pre-Flight",
        title: "Briefing",
        description: "Safety briefing and route overview with your pilot.",
      },
      {
        time: "Boarding",
        title: "Lift Off",
        description: "Smooth vertical ascent with noise-cancelling headsets.",
      },
      {
        time: "In Flight",
        title: "Scenic Tour",
        description: "Panoramic views with live commentary.",
      },
      {
        time: "Post-Flight",
        title: "Photos",
        description: "Photo opportunity with the helicopter after landing.",
      },
    ],
    safety: [
      "Commercially licensed pilots",
      "Regular maintenance and safety inspections",
      "Noise-cancelling headsets provided",
      "Weather-dependent — rescheduled if unsafe",
    ],
    requirements: [
      "All ages welcome",
      "Maximum weight per seat: 130 kg",
      "Photo ID required",
      "Loose items must be secured",
    ],
    gallery: [
      { src: images.helicopter, alt: "Helicopter in flight" },
      { src: images.russia, alt: "Aerial mountain view" },
    ],
    relatedSlugs: ["hot-air-balloon", "skydiving"],
  },
  {
    slug: "tandem-skydiving",
    number: "06",
    title: "Tandem Skydiving",
    shortDescription: "Your first jump, guided by professionals.",
    description:
      "The perfect introduction to skydiving. Attached to a certified tandem instructor, you'll experience the full thrill of freefall with zero experience required — just show up and fly.",
    category: "sky",
    categoryLabel: "Sky",
    image: images.skydiving,
    icon: Wind,
    difficulty: "Beginner",
    duration: "Half day",
    ageLimit: "16+ years",
    location: "Multiple locations",
    overview:
      "Tandem skydiving is the easiest way to experience the thrill of skydiving. You'll be harnessed to a certified instructor who handles all the technical aspects — you simply enjoy the experience. After a 20-minute briefing, you'll ascend to altitude and jump together.",
    experience: [
      {
        time: "08:00",
        title: "Welcome",
        description: "Registration and meet your tandem instructor.",
      },
      {
        time: "08:30",
        title: "Briefing",
        description: "Learn the basics — body position, exit, and landing.",
      },
      {
        time: "09:30",
        title: "Ascent",
        description: "Scenic climb to 12,000-15,000 feet.",
      },
      {
        time: "10:00",
        title: "Freefall & Canopy",
        description: "45-60 seconds of freefall, then 5-minute canopy ride.",
      },
      {
        time: "10:30",
        title: "Celebration",
        description: "Photos, video review, and certificate.",
      },
    ],
    safety: [
      "USPA certified tandem instructors",
      "Minimum 3,000 jumps per instructor",
      "Automatic activation devices on all rigs",
      "Full weather assessment before every jump",
    ],
    requirements: [
      "Minimum age: 16 years (parental consent under 18)",
      "Maximum weight: 100 kg",
      "Wear closed-toe shoes",
      "No scuba diving 24 hours before",
    ],
    gallery: [
      { src: images.skydiving, alt: "Tandem freefall" },
      { src: images.russia, alt: "Canopy descent" },
    ],
    relatedSlugs: ["skydiving", "wind-tunnel"],
  },
];

export function getAdventureBySlug(slug: string): Adventure | undefined {
  return adventures.find((a) => a.slug === slug);
}

export function getRelatedAdventures(slugs: string[]): Adventure[] {
  return slugs
    .map((slug) => getAdventureBySlug(slug))
    .filter((a): a is Adventure => a !== undefined);
}

/**
 * Flat representation of a row from the `adventures` table.
 * Column names are snake_case to match Postgres / Supabase.
 */
export interface DbAdventure {
  id: string;
  slug: string;
  number: string | null;
  title: string;
  short_description: string | null;
  description: string | null;
  category: string | null;
  category_label: string | null;
  image: string | null;
  difficulty: string | null;
  duration: string | null;
  age_limit: string | null;
  location: string | null;
  overview: string | null;
  price: number | string | null;
  currency: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Map each category to its representative Lucide icon. */
const categoryIcons: Record<AdventureCategory, LucideIcon> = {
  sky: Wind,
  water: Waves,
  land: Cloud,
  luxury: Plane,
};

export const difficultyOptions = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "INR", label: "INR (₹)" },
] as const;

export function iconForCategory(category: AdventureCategory): LucideIcon {
  return categoryIcons[category] ?? Wind;
}

/**
 * Merge a database adventure row with its static seed entry.
 *
 * Scalar fields are taken from the DB row — so admin edits to the title,
 * short description, full description, rate (price), image, etc. take
 * effect on the live site — while rich array content that has no DB
 * columns (`experience`, `safety`, `requirements`, `gallery`,
 * `relatedSlugs` and the `icon`) is preserved from the static seed when
 * the slug matches. Brand-new, admin-created adventures get a
 * category-derived icon and empty arrays.
 */
export function mergeDbAdventure(db: DbAdventure, seed?: Adventure): Adventure {
  const seedAdventure = seed ?? getAdventureBySlug(db.slug);
  const category = (db.category as AdventureCategory) ?? seedAdventure?.category ?? "sky";
  const numericPrice =
    typeof db.price === "string"
      ? Number.parseFloat(db.price)
      : db.price ?? 0;

  return {
    slug: db.slug,
    number: db.number ?? seedAdventure?.number ?? "",
    title: db.title ?? seedAdventure?.title ?? "",
    shortDescription: db.short_description ?? seedAdventure?.shortDescription ?? "",
    description: db.description ?? seedAdventure?.description ?? "",
    category,
    categoryLabel: db.category_label ?? seedAdventure?.categoryLabel ?? category,
    image: db.image ?? seedAdventure?.image ?? "",
    icon: seedAdventure?.icon ?? iconForCategory(category),
    difficulty:
      (db.difficulty as Adventure["difficulty"]) ??
      seedAdventure?.difficulty ??
      "Beginner",
    duration: db.duration ?? seedAdventure?.duration ?? "",
    ageLimit: db.age_limit ?? seedAdventure?.ageLimit ?? "",
    location: db.location ?? seedAdventure?.location ?? "",
    overview: db.overview ?? seedAdventure?.overview ?? "",
    experience: seedAdventure?.experience ?? [],
    safety: seedAdventure?.safety ?? [],
    requirements: seedAdventure?.requirements ?? [],
    gallery: seedAdventure?.gallery ?? [],
    relatedSlugs: seedAdventure?.relatedSlugs ?? [],
    price: numericPrice,
    currency: db.currency ?? seedAdventure?.currency ?? "INR",
    is_active: db.is_active ?? seedAdventure?.is_active ?? true,
  };
}
