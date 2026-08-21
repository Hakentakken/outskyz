"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, User, LogOut } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 flex flex-col bg-void/98 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
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
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
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
                </motion.li>
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
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    handleLinkClick();
                  }}
                  className="flex items-center gap-3 rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-lg text-ivory transition-colors hover:bg-gold/10 hover:text-gold"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                  Sign Out
                </button>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
