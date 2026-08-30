import type { SupabaseClient } from "@supabase/supabase-js";
import {
  galleryImages,
  type GalleryImage,
  type DbGalleryImage,
  mapDbGalleryImage,
} from "@/data/gallery";

/**
 * Live gallery images: active rows from the DB, mapped to the static
 * `GalleryImage` shape (media type inferred from the src extension).
 * Falls back to the static seed list when the DB is unavailable.
 */
export async function fetchGalleryImages(
  client: SupabaseClient,
): Promise<GalleryImage[]> {
  try {
    const { data, error } = await client
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return galleryImages;
    }
    return (data as DbGalleryImage[]).map(mapDbGalleryImage);
  } catch {
    return galleryImages;
  }
}
