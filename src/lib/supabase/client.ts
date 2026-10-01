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
let clientPromise: Promise<SupabaseClient> | null = null;

/**
 * Resolve the singleton browser Supabase client, fetching supabase-js on demand.
 *
 * Uses `@supabase/ssr` so the auth session is stored in **cookies the server can
 * read**. This is what makes server-side route protection possible - with the
 * previous localStorage-only client, the server never saw a session and could
 * not guard anything.
 *
 * The library itself is imported dynamically rather than at the top of this
 * module. `@supabase/ssr` + `@supabase/supabase-js` (auth + PostgREST +
 * realtime) are ~250 KB raw and the root layout's AuthProvider imports this
 * module on *every* page, so a static import shipped the whole thing to
 * anonymous visitors who never sign in - first paint waited on it. Importing it
 * dynamically produces a separate chunk that is fetched once, on demand, from
 * the first idle slot after paint.
 *
 * Callers must therefore `await` the client. The previous synchronous
 * `getBrowserSupabaseClient()` could only have worked before paint, which is
 * exactly the behaviour that was costing us the LCP.
 */
export function loadBrowserSupabaseClient(): Promise<SupabaseClient> {
  if (browserClient) return Promise.resolve(browserClient);
  if (!isSupabaseConfigured) {
    return Promise.reject(new SupabaseNotConfiguredError());
  }

  clientPromise ??= import("@supabase/ssr")
    .then(({ createBrowserClient }) => {
      browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return browserClient;
    })
    .catch((error: unknown) => {
      // Don't cache a rejection: a flaky network should be retryable.
      clientPromise = null;
      throw error;
    });

  return clientPromise;
}

/**
 * The client if it has already been loaded, otherwise `null`.
 *
 * Synchronous and side-effect free, for render paths that only want to use the
 * client when it happens to be ready.
 */
export function peekBrowserSupabaseClient(): SupabaseClient | null {
  return browserClient;
}
