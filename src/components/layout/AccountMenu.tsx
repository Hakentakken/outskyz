"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Package, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/utils/cn";

/**
 * Account control in the header.
 *
 * Signed out: a clear "Login" button.
 * Signed in: an avatar that opens a menu with Orders / Admin / Sign out.
 *
 * Previously this was a bare icon that signed you straight out on click, with
 * no way to reach your orders.
 */
export function AccountMenu() {
  const { user, profile, isLoading, isConfigured, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Avoid a flash of the wrong control while the session resolves.
  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className="h-10 w-10 animate-pulse rounded-sm border border-gold/25 bg-gold/5"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in to your account"
        className="hidden h-10 items-center justify-center rounded-sm border border-gold/40 px-5 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 md:inline-flex"
      >
        {isConfigured ? "Login" : "Account"}
      </Link>
    );
  }

  const displayName =
    profile?.full_name?.trim() || user.email?.split("@")[0] || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
        className="flex h-10 items-center gap-2 rounded-sm border border-gold/40 pl-1.5 pr-3 text-gold transition-colors hover:bg-gold/10"
      >
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 font-display text-xs font-semibold text-gold"
        >
          {initial}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-sm border border-gold/25 bg-void/95 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          <div className="border-b border-gold/15 px-4 py-3">
            <p className="truncate text-sm font-medium text-ivory">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>

          <div className="py-1.5">
            <Link
              href="/orders"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ivory/80 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <Package className="h-4 w-4" aria-hidden="true" />
              My Orders
            </Link>

            <Link
              href="/cart"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ivory/80 transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              My Cart
            </Link>

            {profile?.is_admin ? (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-ivory/80 transition-colors hover:bg-gold/10 hover:text-gold"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                Admin Panel
              </Link>
            ) : null}
          </div>

          <div className="border-t border-gold/15 py-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ivory/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
