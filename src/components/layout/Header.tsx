"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { resources } from "@/config/resources";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { AccountMenu } from "./AccountMenu";
import { useCart } from "@/contexts/CartContext";

/**
 * Global site header.
 *
 * SCROLL STATES (cinematic glass ladder)
 * --------------------------------------
 *  1. `top`      — fully transparent over the hero.
 *  2. `resting`  — dark translucent glass once the page scrolls past 24px.
 *  3. `solid`    — deeper blur + hairline border + shadow after 96px, with a
 *                  smooth height transition (80px → 68px) so the bar feels
 *                  like it settles as content scrolls under it.
 *
 * A fourth modifier kicks in while a mega-menu panel is open: the blur deepens
 * and the background darkens so the panel reads as one continuous surface
 * with the bar.
 */
export function Header() {
  const [scrollState, setScrollState] = useState<
    "top" | "resting" | "solid"
  >("top");
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      // One rAF per scroll burst: cheap, and keeps state churn off the
      // scroll handler's critical path.
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setScrollState(y > 96 ? "solid" : y > 24 ? "resting" : "top");
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Stable identity so the Navbar's open-state effect never re-fires needlessly.
  const handleMegaChange = useCallback((open: boolean) => {
    setMegaOpen(open);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrollState === "top" && !megaOpen && "bg-transparent",
          scrollState === "resting" &&
            !megaOpen &&
            "border-b border-gold/20 bg-void/70 shadow-[0_4px_30px_rgba(0,0,0,0.35)] backdrop-blur-md",
          scrollState === "solid" &&
            !megaOpen &&
            "border-b border-gold/35 bg-void/90 shadow-[0_6px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl",
          // Menu-open: one continuous glass surface from bar to panel.
          megaOpen &&
            "border-b border-gold/30 bg-void/92 shadow-[0_10px_44px_rgba(0,0,0,0.6)] backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-6 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 lg:px-12",
            scrollState === "solid" ? "h-[68px]" : "h-20",
          )}
        >
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
              className="h-16 w-auto brightness-110 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035] group-hover:brightness-125 group-hover:drop-shadow-[0_0_16px_rgba(70,181,255,0.5)]"
            />
          </Link>

          {/* Desktop nav */}
          <Navbar
            scrolled={scrollState !== "top"}
            onOpenChange={handleMegaChange}
          />

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
              className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-gold/40 text-gold transition-all duration-300 hover:bg-gold/10 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)]"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-xs font-bold text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Account */}
            <AccountMenu />

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