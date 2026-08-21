"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, User, ShoppingCart, LogOut } from "lucide-react";
import { resources } from "@/config/resources";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

/**
 * Global site header.
 * - Absolute over hero content at top of page
 * - Transitions to fixed dark-glass with gold bottom-border on scroll
 * - Logo from resources registry, nav from siteConfig
 * - Mobile hamburger -> full-screen overlay menu
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          scrolled
            ? "border-b border-gold/35 bg-void/85 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="flex h-20 items-center justify-between px-6 sm:px-8 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="group flex items-center gap-3"
          >
            <Image
              src={resources.logo}
              alt={`${siteConfig.name} logo`}
              width={180}
              height={60}
              priority
              className="h-16 w-auto brightness-110 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:scale-[1.035] group-hover:brightness-125 group-hover:drop-shadow-[0_0_16px_rgba(70,181,255,0.5)]"
            />
          </Link>

          {/* Desktop nav */}
          <Navbar scrolled={scrolled} />

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.cta.href}
              className="hidden items-center justify-center rounded-sm bg-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] md:inline-flex"
            >
              {siteConfig.cta.label}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="View cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/10"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin link (only for admins) */}
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Admin panel"
                className="hidden h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/10 md:flex"
              >
                <User className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}

            {/* Auth button */}
            {user ? (
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Sign out"
                className="hidden h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/10 md:flex"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <Link
                href="/login"
                aria-label="Account"
                className="hidden h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/10 md:flex"
              >
                <User className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/10 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu">
        <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </>
  );
}