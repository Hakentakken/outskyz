export interface Package {
  slug: string;
  name: string;
  description: string;
  destination: string;
  duration: string;
  durationDays: number;
  price: string;
  image: string;
  highlights: string[];
  groupSize: string;
  overview: string;
  itinerary: { day: string; title: string; description: string }[];
  includes: string[];
  excludes: string[];
  requirements: string[];
  cancellationPolicy: string;
  gallery: { src: string; alt: string }[];
  popular?: boolean;
  adventureType: string;
  expenses?: {
    category: string;
    rub: number;
    inr: number;
    note: string;
  }[];
}

export const packagesHero = {
  heading: "CHOOSE YOUR ADVENTURE",
  subtitle: "Premium packages designed for the ultimate experience.",
  image: images.adventureHero,
} as const;

export const packageFilters = {
  destinations: ["All", "Russia", "Thailand", "India"],
  durations: ["All", "1-3 days", "4-7 days", "8+ days"],
  priceRanges: ["All", "Under ₹1,50,000", "₹1,50,000-₹3,00,000", "₹3,00,000+"],
  adventureTypes: ["All", "Sky", "Water", "Luxury"],
} as const;

export const packages: Package[] = [
  {
    slug: "russia-sky-adventure",
    name: "Russia Sky Adventure",
    description: "A 22-day solo skydiving progression programme with 25 jumps in Russia.",
    destination: "Russia",
    duration: "22 days",
    durationDays: 22,
    price: "₹3,88,950",
    image: images.russia,
    highlights: [
      "25-jump licence progression",
      "21 nights in shared accommodation",
      "Structured coaching and ground training",
      "Airport transfers and programme support",
    ],
    groupSize: "1 person",
    overview:
      "This is a 22-day, one-person skydiving progression programme in Russia, built around a 25-jump licence package. It combines ground school, coached jumps, canopy practice, weather reserve days and shared hostel accommodation. It is not a five-day luxury tour; the displayed estimate reflects the complete 22-day programme.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival, transfer & check-in",
        description:
          "Arrive in Russia, take the included airport transfer and settle into the shared hostel accommodation.",
      },
      {
        day: "Days 2–3",
        title: "Registration, gear & ground school",
        description:
          "Complete drop-zone registration, medical and safety checks, equipment fitting, canopy briefing and the first licence-training modules.",
      },
      {
        day: "Days 4–8",
        title: "Foundation jump block",
        description:
          "Begin the coached jump progression with debriefs after every jump. Training adapts to weather, instructor availability and individual progress.",
      },
      {
        day: "Days 9–14",
        title: "Skills progression & canopy control",
        description:
          "Continue the 25-jump programme with freefall skills, stable exits, navigation and supervised canopy-control exercises.",
      },
      {
        day: "Days 15–18",
        title: "Consolidation jump block",
        description:
          "Use consecutive training days to consolidate required skills and complete remaining jumps, with personalised instructor debriefs.",
      },
      {
        day: "Days 19–20",
        title: "Weather reserve & local exploration",
        description:
          "Built-in reserve days protect the schedule against unsuitable weather or allow additional practice and time to explore locally.",
      },
      {
        day: "Day 21",
        title: "Final jumps & progression review",
        description:
          "Complete the planned 25 jumps where conditions and progression allow, review logbook requirements and receive next-step guidance.",
      },
      {
        day: "Day 22",
        title: "Check-out & airport transfer",
        description:
          "Check out of accommodation and take the airport transfer for your return journey.",
      },
    ],
    includes: [
      "25-jump licence-training package",
      "21 nights shared hostel accommodation",
      "Ground school, coached progression and debriefs",
      "Airport transfers",
      "Food allowance included in the programme estimate",
      "Experience curation and on-ground support",
    ],
    excludes: [
      "Any flight or visa cost above the estimate",
      "Additional jumps beyond the planned 25",
      "Personal travel insurance upgrades",
      "Personal expenses",
      "Personal expenses and optional activities",
    ],
    requirements: [
      "Valid passport (6+ months)",
      "Russian visa or applicable entry permission",
      "Minimum age: 16 years",
      "Medically fit for skydiving; final approval rests with the drop zone",
    ],
    cancellationPolicy:
      "Free cancellation up to 30 days before departure. 50% refund 15-30 days before. No refund within 14 days of departure.",
    gallery: [
      { src: images.skydiving, alt: "Skydiving progression in Russia" },
      { src: images.russia, alt: "Russian landscape" },
    ],
    popular: true,
    adventureType: "Sky",
    expenses: [
      { category: "License package (2024 prices)", rub: 190206, inr: 228000, note: "Core training and 25 jumps." },
      { category: "Visa (30-day tourist sticker visa)", rub: 12514, inr: 15000, note: "May be visa-free depending on eligibility." },
      { category: "Flights", rub: 50054, inr: 60000, note: "Indicative fare; actual cost varies." },
      { category: "Accommodation — 22 days", rub: 24778, inr: 29700, note: "Based on 8 people sharing a hostel room." },
      { category: "Food — 22 days", rub: 22024, inr: 26400, note: "Approximate daily allowance." },
      { category: "Airport transfers", rub: 5005, inr: 6000, note: "Local airport transfers." },
      { category: "Insurance", rub: 1543, inr: 1850, note: "Mandatory; ensure adequate coverage." },
      { category: "USPA membership & fees", rub: 10011, inr: 12000, note: "Converted from USD fees." },
      { category: "Experience curation fee", rub: 8342, inr: 10000, note: "Programme planning and support." },
    ],
  },
  {
    slug: "thailand-adventure-escape",
    name: "Thailand Adventure Escape",
    description: "Tropical thrills across Thailand's stunning coastline.",
    destination: "Thailand",
    duration: "7 days",
    durationDays: 7,
    price: "$1,899",
    image: images.thailand,
    highlights: [
      "Jet skiing & water sports",
      "Island hopping tour",
      "Beachfront resort stay",
      "All meals included",
    ],
    groupSize: "2-12 people",
    overview:
      "Seven days of tropical adventure in Phuket. Combine jet skiing, island hopping, and water sports with luxury beachfront accommodation and authentic Thai experiences.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Phuket",
        description:
          "Airport transfer to beachfront resort, welcome dinner with ocean views.",
      },
      {
        day: "Day 2",
        title: "Jet Skiing Adventure",
        description:
          "Guided jet ski tour along Phuket's coastline. Evening at leisure.",
      },
      {
        day: "Day 3",
        title: "Island Hopping",
        description:
          "Full-day boat tour to Phi Phi Islands with snorkeling and beach time.",
      },
      {
        day: "Day 4",
        title: "Water Sports Day",
        description:
          "Choose from parasailing, banana boat, or paddleboarding. Afternoon spa.",
      },
      {
        day: "Day 5",
        title: "Cultural Experience",
        description:
          "Visit to Big Buddha, Old Phuket Town, and Thai cooking class.",
      },
      {
        day: "Day 6",
        title: "Free Day",
        description:
          "Enjoy the resort, beach, or optional excursions. Farewell dinner.",
      },
      {
        day: "Day 7",
        title: "Departure",
        description: "Breakfast and transfer to airport.",
      },
    ],
    includes: [
      "6 nights beachfront resort",
      "All meals (breakfast, lunch, dinner)",
      "Jet ski tour",
      "Island hopping boat tour",
      "Water sports activities",
      "Cultural tour and cooking class",
      "All transfers",
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Optional excursions on Day 6",
      "Alcoholic beverages",
    ],
    requirements: [
      "Valid passport (6+ months)",
      "Basic swimming ability",
      "Sunscreen and swimwear",
      "Minimum age: 16 for jet skiing",
    ],
    cancellationPolicy:
      "Free cancellation up to 30 days before departure. 50% refund 15-30 days before. No refund within 14 days of departure.",
    gallery: [
      { src: images.thailand, alt: "Thailand beach" },
      { src: images.jetSki, alt: "Jet skiing in Thailand" },
    ],
    adventureType: "Water",
  },
  {
    slug: "india-sky-experience",
    name: "India Sky Experience",
    description: "Hot air ballooning over India's majestic terrain.",
    destination: "India",
    duration: "4 days",
    durationDays: 4,
    price: "$1,299",
    image: images.india,
    highlights: [
      "Hot air balloon ride",
      "Heritage hotel stay",
      "Cultural tour included",
      "Sunrise & sunset flights",
    ],
    groupSize: "2-10 people",
    overview:
      "Four days in the Pink City of Jaipur, combining hot air ballooning with heritage tours and luxury accommodation. Experience India from above and explore its rich culture on the ground.",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Jaipur",
        description:
          "Transfer to heritage hotel, evening tour of Jaipur's old city.",
      },
      {
        day: "Day 2",
        title: "Sunrise Balloon Flight",
        description:
          "Pre-dawn balloon flight over Jaipur. Afternoon visit to Amber Fort.",
      },
      {
        day: "Day 3",
        title: "Cultural Immersion",
        description:
          "Visit to City Palace, Jantar Mantar, and local markets. Evening sunset flight.",
      },
      {
        day: "Day 4",
        title: "Departure",
        description: "Farewell breakfast and transfer to airport.",
      },
    ],
    includes: [
      "3 nights heritage hotel",
      "Daily breakfast and 2 dinners",
      "Two hot air balloon flights",
      "Heritage and cultural tours",
      "All transfers",
      "English-speaking guide",
    ],
    excludes: [
      "International flights",
      "Visa fees",
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
    ],
    requirements: [
      "Valid passport (6+ months)",
      "E-visa for India",
      "No fear of heights",
      "Wear layers for early morning flights",
    ],
    cancellationPolicy:
      "Free cancellation up to 21 days before departure. 50% refund 10-21 days before. No refund within 10 days of departure.",
    gallery: [
      { src: images.balloon, alt: "Hot-air balloon at sunrise" },
      { src: images.india, alt: "Jaipur heritage" },
    ],
    adventureType: "Luxury",
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}
import { images } from "@/config/images";
