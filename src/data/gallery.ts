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

export type GalleryMediaType = "image" | "video";

/** Infer media type from a src string's extension. */
export function deriveMediaType(src: string): GalleryMediaType {
  const ext = src.split(".").pop()?.toLowerCase();
  return ext === "mp4" ||
    ext === "webm" ||
    ext === "mov" ||
    ext === "m4v" ||
    ext === "ogv" ||
    ext === "ogg"
    ? "video"
    : "image";
}

/**
 * Flat representation of a row from the `gallery_images` table.
 * Column names are snake_case to match Postgres / Supabase.
 */
export interface DbGalleryImage {
  id: string;
  src: string;
  alt: string | null;
  category: string | null;
  category_label: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

/** Map a DB gallery row to the static `GalleryImage` shape. */
export function mapDbGalleryImage(row: DbGalleryImage): GalleryImage {
  return {
    src: row.src,
    alt: row.alt ?? "",
    category: (row.category as GalleryImage["category"]) ?? "experiences",
    categoryLabel: row.category_label ?? "Experiences",
    type: deriveMediaType(row.src),
  };
}

