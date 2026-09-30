"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPanelShell />}>
      <LoginForm />
    </Suspense>
  );
}

function AuthPanelShell() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Container>
        <div className="mx-auto h-64 max-w-md animate-pulse rounded-md border border-gold/15 bg-coal/30" />
      </Container>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, requestPasswordReset, isSubmitting, user, isConfigured } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);

  // Where to go after signing in. The proxy sets this when it bounces an
  // anonymous visitor away from /cart or /orders.
  const next = searchParams.get("next") ?? "/";

  // Already signed in — send them straight to their destination.
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Container>
          <div className="mx-auto max-w-md rounded-md border border-gold/25 bg-void/60 p-8 text-center">
            <h1 className="font-display text-2xl text-ivory">
              You&apos;re signed in
            </h1>
            <button
              type="button"
              onClick={() => router.replace(next)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-gold-bright"
            >
              Continue
            </button>
          </div>
        </Container>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Double-submit guard: the button is disabled, but this also covers
    // Enter-key submissions racing that state.
    if (isSubmitting) return;

    setError(null);
    setNotice(null);

    if (resetMode) {
      const { error: resetError } = await requestPasswordReset(email);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setNotice(
        "If that email is registered, a password reset link is on its way. Please check your inbox.",
      );
      return;
    }

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace(next);
    router.refresh();
  };

  const fieldClass =
    "w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none disabled:opacity-60";
  const labelClass =
    "mb-1 block text-xs font-semibold uppercase tracking-widest text-gold";


  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="rounded-md border border-gold/25 bg-void/60 p-8">
            <h1 className="font-display text-2xl text-ivory">
              {resetMode ? "Reset your password" : "Sign In"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {resetMode
                ? "Enter your email and we'll send you a reset link."
                : "Access your cart, bookings, and account."}
            </p>

            {!isConfigured ? (
              <div
                role="status"
                className="mt-4 rounded-sm border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-300"
              >
                Sign-in is temporarily unavailable. Please try again shortly.
              </div>
            ) : null}

            {error ? (
              <div
                role="alert"
                aria-live="assertive"
                className="mt-4 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400"
              >
                {error}
              </div>
            ) : null}

            {notice ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-4 rounded-sm border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400"
              >
                {notice}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </div>

              {!resetMode ? (
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={fieldClass}
                    placeholder="••••••••"
                  />
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright disabled:opacity-50"
              >
                {isSubmitting
                  ? "Please wait…"
                  : resetMode
                    ? "Send reset link"
                    : "Sign In"}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-muted">
              <button
                type="button"
                onClick={() => {
                  setResetMode((v) => !v);
                  setError(null);
                  setNotice(null);
                }}
                className="text-gold transition-colors hover:text-gold-bright"
              >
                {resetMode ? "Back to sign in" : "Forgot your password?"}
              </button>

              {resetMode ? null : (
                <p>
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-gold hover:text-gold-bright">
                    Sign Up
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
