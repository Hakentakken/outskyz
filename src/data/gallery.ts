export interface GalleryImage {
  src: string;
  alt: string;
  category: "skydiving" | "russia" | "experiences";
  categoryLabel: string;
  type: "image" | "video";
}

export const galleryHero = {
  heading: "CAPTURED MOMENTS",
  subtitle: "A visual journey through extraordinary adventures.",
  image: "/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg",
} as const;

export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "skydiving", label: "Skydiving" },
  { id: "russia", label: "Russia" },
  { id: "experiences", label: "Experiences" },
] as const;

export const galleryImages: GalleryImage[] = [
  { src: "/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM.jpeg", alt: "Skydiving field in Russia", category: "russia", categoryLabel: "Russia", type: "image" },
  { src: "/resources/gallery/WhatsApp Image 2026-08-19 at 12.14.42 PM (1).jpeg", alt: "Outskyz adventure day", category: "skydiving", categoryLabel: "Skydiving", type: "image" },
  { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.43 PM.mp4", alt: "Outskyz skydiving experience", category: "skydiving", categoryLabel: "Skydiving", type: "video" },
  { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.44 PM.mp4", alt: "Outskyz flight footage", category: "experiences", categoryLabel: "Experiences", type: "video" },
  { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.44 PM (1).mp4", alt: "Parachuting experience", category: "skydiving", categoryLabel: "Skydiving", type: "video" },
  { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.44 PM (2).mp4", alt: "Outskyz adventure footage", category: "experiences", categoryLabel: "Experiences", type: "video" },
  { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.45 PM.mp4", alt: "Russian drop zone moment", category: "russia", categoryLabel: "Russia", type: "video" },
  { src: "/resources/gallery/WhatsApp Video 2026-08-19 at 12.14.45 PM (1).mp4", alt: "Outskyz airborne adventure", category: "experiences", categoryLabel: "Experiences", type: "video" },
];
