"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Container } from "@/components/ui/Container";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess("Account created! Please check your email to confirm your account.");
    }
  };

  return (
    <>
      <PageHero heading="JOIN OUTSKYZ" subtitle="Create your account and start your adventure." image="/resources/gallery/1.jpg" />
      <Section background="default" spacing="large">
        <Container>
          <div className="mx-auto max-w-md">
            <div className="rounded-md border border-gold/25 bg-void/60 p-8">
              <h2 className="font-display text-2xl text-ivory">Create Account</h2>
              <p className="mt-2 text-sm text-muted">
                Sign up to book adventures, manage your cart, and more.
              </p>
              {error && (
                <div className="mt-4 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 rounded-sm border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400">
                  {success}
                </div>
              )}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="fullName" className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gold">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
                    placeholder="Your full name"
                  />
                </div>
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-sm border border-gold/25 bg-coal/50 px-4 py-3 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-muted">
                {"Already have an account?"}{" "}
                <Link href="/login" className="text-gold hover:text-gold-bright">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}