import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/client";

/**
 * Server-side Supabase client bound to the request's cookies.
 *
 * This is the **request-scoped, RLS-respecting** client. Use it for any
 * server component or route handler that needs to know who the caller is.
 * Always call `getUser()` (never `getSession()`) for an authoritative answer —
 * `getSession()` reads the cookie without revalidating the JWT.
 *
 * A fresh client is created per request because the cookie store is
 * request-scoped; never cache this across requests.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component: cookie writes are not permitted
          // here. The proxy/middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Resolve the authenticated user for the current request.
 *
 * Returns `null` when Supabase is unconfigured, nobody is signed in, or the
 * token fails validation. Never throws.
 */
export async function getServerUser(): Promise<
  import("@supabase/supabase-js").User | null
> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) return null;
    return user ?? null;
  } catch {
    return null;
  }
}

/**
 * True when the signed-in user is flagged as an administrator.
 *
 * RLS on `profiles` only lets a user read their own row, so this correctly
 * resolves to false for signed-out and non-admin callers.
 */
export async function getServerIsAdmin(): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (error) return false;
    return Boolean((data as { is_admin?: boolean } | null)?.is_admin);
  } catch {
    return false;
  }
}
