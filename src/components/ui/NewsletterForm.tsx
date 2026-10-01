"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "error" | "success";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Footer newsletter capture.
 *
 * Deliberately persistence-free for now: it validates the address
 * client-side, reports the outcome through an `aria-live` region and clears
 * the field on success. Point `handleSubmit` at the mailing-list provider
 * (or a Supabase table) once one is chosen — see the README "Known TODOs".
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setStatus("error");
      return;
    }

    setEmail("");
    setStatus("success");
  };

  const message =
    status === "error"
      ? "Please enter a valid email address."
      : status === "success"
        ? "Thank you. You are on the list."
        : "Occasional dispatches only. No noise, unsubscribe anytime.";

  const isError = status === "error";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label
        htmlFor="footer-newsletter-email"
        className="mb-3 block text-xs font-semibold uppercase tracking-[0.3em] text-gold"
      >
        Newsletter
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          aria-invalid={isError}
          aria-describedby="footer-newsletter-status"
          className="min-h-12 flex-1 rounded-sm border border-gold/30 bg-void/60 px-4 py-3 text-sm text-ivory transition-colors duration-300 outline-none placeholder:text-ivory/35 focus:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        />
        <button
          type="submit"
          className="min-h-12 shrink-0 rounded-sm bg-gold px-7 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Subscribe
        </button>
      </div>

      <p
        id="footer-newsletter-status"
        aria-live="polite"
        className={`mt-3 text-xs leading-relaxed ${
          isError ? "text-red-300" : "text-muted"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
