"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { X, ShoppingCart, User, LogOut, Package } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Must be at least the longest exit animation in globals.css (0.25s). */
const EXIT_MS = 260;

/**
 * Full-screen mobile navigation overlay.
 *
 * This was the last framer-motion import reachable from the root layout (the
 * menu lives in the header), so every route in the app downloaded the whole
 * framer-motion runtime to render an overlay most visitors never open. The
 * motion is CSS now - `menu-overlay-in/out` and `menu-item-in/out` in
 * globals.css - which also keeps `prefers-reduced-motion` working through the
 * global rule that collapses animation durations.
 *
 * AnimatePresence gave us the fade-out on close. To keep it, the panel stays
 * mounted for `EXIT_MS` and the exit phase is *derived* (`isRendered &&
 * !isOpen`) rather than stored, so a re-render landing mid-close can never
 * leave the overlay stuck on screen.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();

  const [isRendered, setIsRendered] = useState(isOpen);
  const isClosing = isRendered && !isOpen;

  useEffect(() => {
    // State is updated from callbacks, never synchronously in the effect body.
    if (isOpen) {
      const frame = window.requestAnimationFrame(() => setIsRendered(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const timeout = window.setTimeout(() => setIsRendered(false), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-void/98 backdrop-blur-sm lg:hidden",
        isClosing ? "menu-overlay-out" : "menu-overlay-in",
      )}
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-8">
        <span className="font-display text-lg text-ivory">
          {siteConfig.name}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 text-gold transition-colors hover:bg-gold/10"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile navigation" className="flex flex-1 flex-col justify-center px-8">
        <ul className="space-y-6">
          {siteConfig.navigation.main.map((item, index) => (
            <li
              key={item.href}
              className={isClosing ? "menu-item-out" : "menu-item-in"}
              // Stagger only on the way in; the exit should feel immediate.
              style={isClosing ? undefined : { animationDelay: `${0.05 * index}s` }}
            >
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group flex items-center gap-3 font-display text-2xl text-ivory transition-colors duration-300",
                  "after:mt-2 after:block after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300",
                  "hover:text-gold hover:after:w-12",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gold/20 px-8 pb-8">
        <div className="flex flex-col gap-3">
          <Link
            href="/cart"
            onClick={handleLinkClick}
            className="flex items-center justify-between rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-lg text-ivory transition-colors hover:bg-gold/10 hover:text-gold"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              Cart
            </span>
            {totalItems > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-gold px-2 text-xs font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-lg text-ivory transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/orders"
                onClick={handleLinkClick}
                className="flex items-center gap-3 rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-lg text-ivory transition-colors hover:bg-gold/10 hover:text-gold"
              >
                <Package className="h-5 w-5" aria-hidden="true" />
                My Orders
              </Link>
              <button
                type="button"
                onClick={() => {
                  void signOut();
                  handleLinkClick();
                }}
                className="flex items-center gap-3 rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-lg text-ivory transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-lg text-ivory transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
