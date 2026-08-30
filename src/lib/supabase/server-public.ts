import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Server-side Supabase client that uses the **public anon key**.
 *
 * It is the read-only counterpart to `createServerSupabaseClient()`:
 * where the service-role client bypasses Row Level Security (used for
 * admin/order writes), this one *respects* RLS. It is intended for
 * tables the schema marks "viewable by everyone" (active adventures,
 * destinations, packages, gallery images) so that public-facing pages
 * can serve live, admin-edited content without ever requiring the
 * privileged service-role key to be configured.
 *
 * Usage: call inside `async` server components / route handlers.
 * Not meant to be imported into client components.
 */
export function createPublicSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase public environment variables are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
