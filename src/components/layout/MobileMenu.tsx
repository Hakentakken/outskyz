"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile navigation overlay.
 * - Dark background with gold accents
 * - Smooth Framer Motion animation
 * - Body scroll lock while open
 * - Escape key closes the menu
 * - ARIA-compliant dialog
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock body scroll while menu is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Close on Escape key.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
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
                      "group font-display text-2xl text-ivory transition-colors duration-300",
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

          <div className="px-8 pb-8">
            <Link
              href={siteConfig.cta.href}
              onClick={handleLinkClick}
              className="flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-black transition-colors duration-300 hover:bg-gold-bright"
            >
              {siteConfig.cta.label}
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}