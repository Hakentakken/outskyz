import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Public Supabase configuration.
 *
 * Safe to expose to the browser: project URL + anon/publishable key only.
 * The service-role key is NEVER read in this module.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** True when the project has Supabase credentials configured. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Thrown when Supabase credentials are absent. Safe to catch at the UI edge. */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local",
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

let browserClient: SupabaseClient | null = null;

/**
 * Singleton browser Supabase client.
 *
 * Uses `@supabase/ssr` so the auth session is stored in **cookies the server can
 * read**. This is what makes server-side route protection possible — with the
 * previous localStorage-only client, the server never saw a session and could
 * not guard anything.
 *
 * Created lazily so importing this module never throws: a missing env var must
 * degrade a page, not white-screen the entire site.
 */
export function getBrowserSupabaseClient(): SupabaseClient {
  if (browserClient) return browserClient;
  if (!isSupabaseConfigured) throw new SupabaseNotConfiguredError();

  browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}

/**
 * Non-throwing variant for render paths. Returns `null` when Supabase is not
 * configured so callers can show a graceful fallback instead of crashing.
 */
export function tryGetBrowserSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  try {
    return getBrowserSupabaseClient();
  } catch {
    return null;
  }
}
