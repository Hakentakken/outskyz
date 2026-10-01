"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  loadBrowserSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import { authErrorMessage, type AuthError } from "@/lib/auth-errors";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  /** True until the initial session has been resolved. */
  isLoading: boolean;
  /** True while a sign-in/sign-up request is in flight (blocks double-submit). */
  isSubmitting: boolean;
  isAdmin: boolean;
  /** False when Supabase env vars are missing; UI can show a friendly notice. */
  isConfigured: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: AuthError | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const configured = isSupabaseConfigured;

  /**
   * When Supabase is unconfigured there is no session to resolve, so start in a
   * settled state. Deriving the initial value during render avoids a cascading
   * re-render from a synchronous setState inside the effect.
   */
  const [isLoading, setIsLoading] = useState(configured);

  /**
   * Load a profile by id, returning it instead of setting state so callers can
   * invoke this outside the auth-state callback (see the deadlock note below).
   */
  const loadProfile = useCallback(async (userId: string) => {
    const supabase = await loadBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) return null;
    return data as Profile;
  }, []);

  useEffect(() => {
    if (!configured) return;

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    /**
     * Resolve the initial session from the SSR cookie so the first paint
     * already knows whether the visitor is signed in - no logged-out flash.
     *
     * supabase-js is ~66 KB gzipped and is now fetched lazily (see
     * loadBrowserSupabaseClient), so this awaits that dynamic import. It runs
     * from the first idle slot after paint, which is why the header shows its
     * loading placeholder for a beat on a cold visit.
     */
    const start = async (): Promise<void> => {
      const supabase = await loadBrowserSupabaseClient().catch(() => null);
      if (!supabase) {
        // Unconfigured, or the chunk never arrived: settle, never crash.
        if (!cancelled) setIsLoading(false);
        return;
      }
      if (cancelled) return;

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (cancelled) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);

        if (!newSession?.user) {
          setProfile(null);
          return;
        }

        /*
         * CRITICAL: never await a Supabase call directly inside this callback.
         * The auth client holds an internal lock while notifying listeners, so
         * awaiting another call here can deadlock - which previously left
         * `profile` (and therefore `isAdmin`) permanently null, silently hiding
         * the admin UI. Defer with queueMicrotask so the callback returns first.
         */
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          queueMicrotask(() => {
            void loadProfile(newSession.user.id).then((loaded) => {
              if (!cancelled && loaded) setProfile(loaded);
            });
          });
        }
      });

      unsubscribe = () => subscription.unsubscribe();

      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        if (cancelled) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          const loaded = await loadProfile(initialSession.user.id);
          if (!cancelled && loaded) setProfile(loaded);
        }
      } catch {
        // A failed session read must never break rendering.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    /*
     * Keep the auth chunk off the critical path: fetch it in the first idle
     * slot after paint instead of as part of the initial page bundle. The
     * timeout guarantees it still runs promptly on a busy main thread.
     */
    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: () => void,
        options?: { timeout: number },
      ) => number;
    };
    if (typeof idleWindow.requestIdleCallback === "function") {
      idleWindow.requestIdleCallback(() => void start(), { timeout: 1500 });
    } else {
      window.setTimeout(() => void start(), 1);
    }

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [configured, loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const supabase = await loadBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: authErrorMessage(error) };
      return { error: null };
    } catch (error) {
      return { error: authErrorMessage(error) };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsSubmitting(true);
      try {
        const supabase = await loadBrowserSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            // Send the confirmation link back into a handled flow rather than
            // a bare 404 page.
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          return { error: authErrorMessage(error), needsEmailConfirmation: false };
        }

        // With email confirmation enabled there is no session yet.
        const needsEmailConfirmation = !data.session;
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
        return { error: null, needsEmailConfirmation };
      } catch (error) {
        return { error: authErrorMessage(error), needsEmailConfirmation: false };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      const supabase = await loadBrowserSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // Clear local state regardless so the UI never gets stuck signed in.
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const supabase = await loadBrowserSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) return { error: authErrorMessage(error) };
      return { error: null };
    } catch (error) {
      return { error: authErrorMessage(error) };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const supabase = await loadBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: authErrorMessage(error) };
      return { error: null };
    } catch (error) {
      return { error: authErrorMessage(error) };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const loaded = await loadProfile(user.id);
    if (loaded) setProfile(loaded);
  }, [user, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      isLoading,
      isSubmitting,
      isAdmin: profile?.is_admin ?? false,
      isConfigured: configured,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      refreshProfile,
    }),
    [
      user,
      session,
      profile,
      isLoading,
      isSubmitting,
      configured,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      updatePassword,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
