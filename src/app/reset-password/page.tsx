"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";

/**
 * Set a new password after clicking a Supabase recovery link.
 *
 * The user arrives here from `/auth/callback?next=/reset-password`, by which
 * point the recovery token has been exchanged for a cookie-backed session.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, isSubmitting } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Please choose a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    const { error: updateError } = await updatePassword(password);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <Container>
        <div className="mx-auto max-w-md rounded-md border border-gold/25 bg-void/60 p-8">
          <h1 className="font-display text-2xl text-ivory">Set a new password</h1>
          <p className="mt-2 text-sm text-muted">
            Choose a secure password for your Outskyz account.
          </p>

          {done ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 rounded-sm border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-400"
            >
              Your password has been updated. Taking you to your account…
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              aria-live="assertive"
              className="mt-6 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400"
            >
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gold"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gold"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
                placeholder="Re-enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || done}
              aria-busy={isSubmitting}
              className="w-full rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright disabled:opacity-50"
            >
              {isSubmitting ? "Updating…" : "Update password"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            <Link href="/login" className="text-gold hover:text-gold-bright">
              Back to sign in
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
