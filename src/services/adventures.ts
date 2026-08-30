import type { SupabaseClient } from "@supabase/supabase-js";
import {
  adventures,
  type Adventure,
  type DbAdventure,
  mergeDbAdventure,
} from "@/data/adventures";

/**
 * Live adventures: active rows from the DB, merged with the static seed
 * (experience / safety / requirements / gallery / related / icon live in
 * code, not in the table). Falls back to the static seed list when the DB
 * is unavailable or returns nothing, so the site never breaks.
 */
export async function fetchAdventures(
  client: SupabaseClient,
): Promise<Adventure[]> {
  try {
    const { data, error } = await client
      .from("adventures")
      .select("*")
      .eq("is_active", true)
      .order("number", { ascending: true });

    if (error || !data || data.length === 0) {
      return adventures;
    }
    return (data as DbAdventure[]).map((row) => mergeDbAdventure(row));
  } catch {
    return adventures;
  }
}

/**
 * Live single adventure by slug. Prefers the DB row so admin edits to the
 * description, rate, image, etc. take effect immediately; falls back to the
 * static seed when the row is missing or the DB is unreachable.
 */
export async function fetchAdventureBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<Adventure | null> {
  try {
    const { data, error } = await client
      .from("adventures")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error || !data) return null;
    return mergeDbAdventure(data as DbAdventure);
  } catch {
    return null;
  }
}
