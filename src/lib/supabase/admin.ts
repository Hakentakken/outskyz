import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/client";

/**
 * Server-only, PRIVILEGED Supabase client (service role).
 *
 * ⚠️ This bypasses Row Level Security entirely. Every write it performs is
 * trusted by this module alone — callers MUST have already authenticated the
 * request. Never import this from a client component, and never return this
 * client to the browser.
 *
 * Kept separate from `server.ts` (which is RLS-respecting and request-scoped)
 * so the blast radius of a privilege mistake is obvious at the import site.
 */
export function createAdminSupabaseClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !serviceRoleKey) {
    throw new Error(
      "Supabase service role key is missing. Add SUPABASE_SERVICE_ROLE_KEY to .env.local",
    );
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
