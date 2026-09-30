"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";

const fieldClass =
  "w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none disabled:opacity-60";
const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-widest text-gold";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6">
          <Container>
            <div className="mx-auto h-72 max-w-md animate-pulse rounded-md border border-gold/15 bg-coal/30" />
          </Container>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, isSubmitting, user, isConfigured } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const next = searchParams.get("next") ?? "/";

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <Container>
          <div className="mx-auto max-w-md rounded-md border border-gold/25 bg-void/60 p-8 text-center">
            <h1 className="font-display text-2xl text-ivory">
              You already have an account
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
    if (isSubmitting) return;

    setError(null);
    setNotice(null);

    if (password.length < 8) {
      setError("Please choose a password of at least 8 characters.");
      return;
    }

    const { error: signUpError, needsEmailConfirmation } = await signUp(
      email,
      password,
      fullName,
    );

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (needsEmailConfirmation) {
      // Do not send them to a logged-in app: their session does not exist yet.
      setNotice(
        "Almost there! Check your inbox for a verification link to activate your account.",
      );
      return;
    }

    // Email confirmation is disabled in Supabase — a session already exists.
    router.replace(next);
    router.refresh();
  };


  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <Container>
        <div className="mx-auto max-w-md">
          <div className="rounded-md border border-gold/25 bg-void/60 p-8">
            <h1 className="font-display text-2xl text-ivory">Create Account</h1>
            <p className="mt-2 text-sm text-muted">
              Sign up to book adventures, manage your cart, and more.
            </p>

            {!isConfigured ? (
              <div
                role="status"
                className="mt-4 rounded-sm border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm text-yellow-300"
              >
                Sign-up is temporarily unavailable. Please try again shortly.
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
                <label htmlFor="fullName" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  disabled={isSubmitting}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={fieldClass}
                  placeholder="Your full name"
                />
              </div>

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

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright disabled:opacity-50"
              >
                {isSubmitting ? "Creating account…" : "Sign Up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-gold hover:text-gold-bright">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
