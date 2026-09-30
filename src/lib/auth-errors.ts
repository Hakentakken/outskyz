/**
 * Human-readable mapping for Supabase auth failures.
 *
 * Kept in its own module (no "use client", no React) so both the auth context
 * and any server-side caller can use it without pulling in client-only code.
 */
export type AuthErrorKind =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "user_already_exists"
  | "rate_limited"
  | "network"
  | "not_configured"
  | "unknown";

export class AuthError extends Error {
  constructor(
    message: string,
    readonly kind: AuthErrorKind,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Translate an unknown Supabase error into copy a visitor can act on.
 *
 * Raw Supabase messages are terse and occasionally leak internals — "Invalid
 * login credentials" tells a user nothing actionable.
 */
export function authErrorMessage(error: unknown): AuthError {
  if (error instanceof AuthError) return error;

  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  const lower = raw.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return new AuthError(
      "That email and password combination didn't match. Please check and try again.",
      "invalid_credentials",
    );
  }
  if (lower.includes("email not confirmed")) {
    return new AuthError(
      "Please confirm your email address first — check your inbox for the verification link.",
      "email_not_confirmed",
    );
  }
  if (
    lower.includes("already registered") ||
    lower.includes("already exists") ||
    lower.includes("user already")
  ) {
    return new AuthError(
      "An account with that email already exists. Try signing in instead.",
      "user_already_exists",
    );
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return new AuthError(
      "Too many attempts. Please wait a minute and try again.",
      "rate_limited",
    );
  }
  if (lower.includes("password should be")) {
    return new AuthError(
      "Please choose a stronger password — at least 8 characters.",
      "unknown",
    );
  }
  if (
    lower.includes("fetch") ||
    lower.includes("network") ||
    lower.includes("failed to fetch")
  ) {
    return new AuthError(
      "We couldn't reach our servers. Check your connection and try again.",
      "network",
    );
  }

  return new AuthError("Something went wrong. Please try again.", "unknown");
}
