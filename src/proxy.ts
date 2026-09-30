import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/client";

/**
 * Routes that require a signed-in user. The middleware bounces anonymous
 * visitors to /login before the page (and its JS bundle) is served, so
 * protected screens are guarded server-side rather than merely hidden in the UI.
 */
const PROTECTED_PREFIXES = ["/cart", "/orders", "/checkout"];

/**
 * Routes that require an administrator. A signed-in non-admin is sent to the
 * home page rather than shown an empty admin shell.
 */
const ADMIN_PREFIXES = ["/admin"];

/**
 * Next.js 16 request proxy: refreshes the Supabase session cookie and enforces
 * route protection.
 *
 * Without this, an expired access token is never renewed server-side and the
 * cookie drifts out of sync with the JWT — which is why "login works but
 * something feels wrong": the browser kept a stale session that the server
 * could not verify, and no protected route was actually guarded.
 */
export async function proxy(request: NextRequest) {
  // If Supabase is not configured, let every request through untouched so the
  // site still renders (read-only) rather than erroring on every navigation.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getUser() —
  // it can cause the session refresh to be dropped and lock the user out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsAuth || needsAdmin) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      // Preserve where the user was heading so login can send them back.
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (needsAdmin) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      const isAdmin = Boolean((profile as { is_admin?: boolean } | null)?.is_admin);
      if (!isAdmin) {
        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = "/";
        homeUrl.search = "";
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on every route except static assets and image files — those never
     * need a refreshed session and skipping them saves work per request.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|woff2)$).*)",
  ],
};
