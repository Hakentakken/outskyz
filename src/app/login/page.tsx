"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Container } from "@/components/ui/Container";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <PageHero heading="WELCOME BACK" subtitle="Sign in to continue your adventure." image="/resources/gallery/1.jpg" />
      <Section background="default" spacing="large">
        <Container>
          <div className="mx-auto max-w-md">
            <div className="rounded-md border border-gold/25 bg-void/60 p-8">
              <h2 className="font-display text-2xl text-ivory">Sign In</h2>
              <p className="mt-2 text-sm text-muted">
                Access your cart, bookings, and admin panel.
              </p>
              {error && (
                <div className="mt-4 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gold">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gold">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-muted">
                {"Don't have an account?"}{" "}
                <Link href="/signup" className="text-gold hover:text-gold-bright">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}