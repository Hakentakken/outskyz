"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  isSupabaseConfigured,
  loadBrowserSupabaseClient,
} from "@/lib/supabase/client";

type Status = "working" | "success" | "error";

/**
 * Landing route for Supabase email-confirmation and password-reset links.
 *
 * Supabase redirects here with the auth tokens in the URL fragment. The
 * browser client (configured with `detectSessionInUrl`) exchanges them for a
 * cookie-backed session; we then forward the visitor to their destination.
 *
 * Without this route, every confirmation link in a real user's inbox landed on
 * a 404 — which is why sign-up appeared to "work" but nobody could ever
 * actually finish confirming.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-void px-6 text-center">
          <div
            aria-hidden="true"
            className="h-8 w-8 animate-pulse rounded-full border border-gold/40"
          />
          <span className="sr-only">Completing sign-in…</span>
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("working");
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setStatus("error");
          setMessage("Sign-in is temporarily unavailable. Please try again later.");
        }
        return;
      }

      const supabase = await loadBrowserSupabaseClient();
      const next = searchParams.get("next") ?? "/";

      // Give the client a moment to parse the URL fragment on its own.
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        if (!cancelled) {
          setStatus("success");
          setMessage("You're signed in. Taking you along…");
        }
        router.replace(next);
        router.refresh();
        return;
      }

      if (!cancelled) {
        setStatus("error");
        setMessage(
          "This link is invalid or has expired. Please request a new one.",
        );
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-void px-6 text-center">
      <h1 className="font-display text-4xl text-ivory sm:text-5xl">
        {status === "working" ? "One moment" : status === "success" ? "Welcome back" : "Link expired"}
      </h1>
      <p
        role="status"
        aria-live="polite"
        className="max-w-md text-sm leading-relaxed text-muted"
      >
        {message}
      </p>

      {status === "working" ? (
        <div
          aria-hidden="true"
          className="h-8 w-8 animate-pulse rounded-full border border-gold/40"
        />
      ) : null}

      {status === "error" ? (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-gold-bright"
          >
            Back to sign in
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-gold/40 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-ivory transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            Go home
          </Link>
        </div>
      ) : null}
    </div>
  );
}
