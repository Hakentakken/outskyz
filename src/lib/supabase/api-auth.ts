import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/client";

/**
 * Single shared authentication helper for all API routes.
 *
 * Previously each of the three checkout/cart routes carried its own
 * copy-pasted `authenticate()` function. They now share this one.
 *
 * The caller's access token is taken from the `Authorization: Bearer` header
 * (which the browser Supabase client sends) and validated with `getUser()`.
 * `getUser()` revalidates the JWT against the auth server; `getSession()`
 * would merely trust the token it was handed.
 */
export async function authenticateRequest(
  request: NextRequest,
): Promise<User | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const client: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await client.auth.getUser(token);
    if (error) return null;
    return data.user ?? null;
  } catch {
    return null;
  }
}
