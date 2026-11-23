"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/site";
import { adventures } from "@/data/adventures";
import { destinations } from "@/data/destinations";
import { images } from "@/config/images";

interface NavbarProps {
  scrolled?: boolean;
  /** Bubbles the open state up so the header can deepen its glass while a panel shows. */
  onOpenChange?: (open: boolean) => void;
}

interface NavLink {
  label: string;
  href: string;
}

interface MegaColumn {
  heading: string;
  links: readonly NavLink[];
}

interface PreviewImage {
  src: string;
  alt: string;
}

interface NavItem {
  label: string;
  href: string;
  /** Only items that declare columns render a mega-menu panel. */
  columns?: readonly MegaColumn[];
  /** Trailing "see everything" row inside the panel. */
  footnote?: NavLink;
  /** Editorial preview image shown beside the links (downloads after first open). */
  preview?: PreviewImage;
}

/** Stable, human-readable id for the aria-controls wiring. */
const panelId = (label: string) =>
  `nav-panel-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/**
 * Grace period that lets the pointer travel from a trigger into the panel below
 * it (and back) without the panel dropping on the way.
 */
const CLOSE_GRACE_MS = 200;

/**
 * Top-level navigation with a cinematic mega-menu.
 *
 * INTERACTION MODEL (why the old one flickered)
 * --------------------------------------------
 * Open state is ONE value: `hoveredMenu ?? pinnedMenu`.
 *
 *  - Hovering an item previews its panel. Because the enter handler lives on
 *    each `<li>` and the leave handler lives on the whole `<nav>`, moving
 *    *between* items - or from a trigger down into the panel, which is also
 *    inside the `<nav>` - never schedules a close at all.
 *  - Leaving the nav schedules a single 200ms grace that any re-entry cancels.
 *    When the leave handler sat on each `<li>`, a pointer crossing from one
 *    item to the next could fire `pointerenter` (open) *before* the previous
 *    item's `pointerleave` (schedule close), so the panel closed itself a
 *    moment after it opened. Sweeping the bar produced exactly the half-faded,
 *    overlapping panels this component used to ship.
 *  - Click / Enter / Space is a pure toggle of the *pin*. Hover never writes to
 *    it, so mouse, touch and keyboard behave identically and a tap can always
 *    dismiss a panel again.
 *  - Escape, an outside pointerdown, focus leaving the item subtree and route
 *    changes all close everything.
 *
 * PRESENTATION
 * ------------
 * The panel layer is anchored to the header (`.mega-panel` is a full-width
 * strip hanging under the bar) rather than to the trigger that opened it, so a
 * wide surface can never hang off the edge of the viewport. Every panel stays
 * mounted and is driven by `data-open` in CSS - no mount churn, no flicker -
 * with the surface carrying the open/close motion and link rows staggering in
 * through `--i`. A preview image mounts only after its panel's first open, so
 * nothing extra downloads on page load.
 */

export function Navbar({ scrolled = false, onOpenChange }: NavbarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null);
  const openMenu = hoveredMenu ?? pinnedMenu;
  /** Panels whose preview image has been allowed to download (once). */
  const [revealedPreviews, setRevealedPreviews] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close on navigation (adjust state during render - no effect needed).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setHoveredMenu(null);
    setPinnedMenu(null);
  }

  useEffect(() => {
    // Tell the header when to deepen its glass. Runs only on open/closed
    // transitions (false → false is a no-op setState in the parent).
    onOpenChange?.(openMenu !== null);
  }, [openMenu, onOpenChange]);

  useEffect(() => {
    if (!openMenu) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoveredMenu(null);
        setPinnedMenu(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openMenu]);

  // A panel opened by tap or keyboard has no pointer to leave it, so dismiss
  // it as soon as the user interacts anywhere else on the page.
  useEffect(() => {
    if (!pinnedMenu) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setHoveredMenu(null);
        setPinnedMenu(null);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [pinnedMenu]);

  useEffect(
    () => () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    },
    [],
  );

  const cancelPendingClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }, []);

  /** One timer for the whole nav — see the interaction notes above. */
  const scheduleClose = useCallback(() => {
    cancelPendingClose();
    closeTimeout.current = setTimeout(
      () => setHoveredMenu(null),
      CLOSE_GRACE_MS,
    );
  }, [cancelPendingClose]);

  const closeAll = useCallback(() => {
    cancelPendingClose();
    setHoveredMenu(null);
    setPinnedMenu(null);
  }, [cancelPendingClose]);

  const focusMenu = useCallback(
    (label: string) => {
      cancelPendingClose();
      setHoveredMenu(label);
      // Hovering a *different* item replaces whatever was pinned, so a panel
      // the visitor pinned earlier cannot resurrect once they move on.
      setPinnedMenu((current) => (current === label ? current : null));
      // Reveal the panel's preview image the first time it opens, so nothing
      // extra downloads on page load. No-op update when already revealed.
      setRevealedPreviews((prev) =>
        prev.has(label) ? prev : new Set(prev).add(label),
      );
    },
    [cancelPendingClose],
  );

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "Experiences",
      href: "/adventures",
      columns: [
        {
          heading: "Adventures",
          links: adventures.map((adventure) => ({
            label: adventure.title,
            href: `/adventures/${adventure.slug}`,
          })),
        },
        {
          heading: "Packages",
          links: siteConfig.navigation.packages,
        },
      ],
      footnote: { label: "View all experiences", href: "/adventures" },
      preview: {
        src: adventures[0]?.image ?? images.skydiving,
        alt: adventures[0]?.title ?? "Skydiving",
      },
    },
    {
      label: "Destinations",
      href: "/destinations",
      columns: [
        {
          heading: "Where we fly",
          links: destinations.map((destination) => ({
            label: `${destination.name} — ${destination.country}`,
            href: `/destinations/${destination.slug}`,
          })),
        },
        {
          heading: "Start here",
          links: [
            { label: "All Destinations", href: "/destinations" },
            { label: "Gallery", href: "/gallery" },
            { label: "Safety Standards", href: "/safety" },
          ],
        },
      ],
      footnote: { label: "Explore every destination", href: "/destinations" },
      preview: {
        src: destinations[0]?.image ?? images.russia,
        alt: destinations[0]?.name ?? "Russia",
      },
    },
    { label: "Packages", href: "/packages" },
    {
      label: "Company",
      href: "/about",
      columns: [
        { heading: "Outskyz", links: siteConfig.navigation.company },
        {
          heading: "Reach us",
          links: [
            { label: "Contact", href: "/contact" },
            { label: "Team", href: "/team" },
            { label: "FAQ", href: "/faq" },
          ],
        },
      ],
      footnote: { label: "More about Outskyz", href: "/about" },
      preview: { src: images.people, alt: "The Outskyz founders" },
    },
  ];


  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="hidden lg:block"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") cancelPendingClose();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") scheduleClose();
      }}
    >
      <ul className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const isOpen = openMenu === item.label;
          const isCurrent =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const trigger = cn(
            "relative flex items-center gap-1.5 rounded-sm px-3.5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors duration-300",
            "after:absolute after:left-3.5 after:right-3.5 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "text-ivory/80" : "text-ivory/85",
            "hover:text-gold hover:after:scale-x-100",
            // The current route keeps the rule and the accent, so the bar
            // always answers "where am I?" without a second state machine.
            (isCurrent || isOpen) && "text-gold after:scale-x-100",
            isOpen && "drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]",
          );

          return (
            <li
              key={item.label}
              onPointerEnter={(event) => {
                // Touch has no hover: its taps must be able to toggle the
                // panel, so only genuinely-hovering pointers open it.
                if (event.pointerType !== "touch") focusMenu(item.label);
              }}
              onFocus={() => focusMenu(item.label)}
              onBlur={(event) => {
                // Only close once focus has actually left this item's subtree
                // (which includes the panel that hangs off it).
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  closeAll();
                }
              }}
            >
              {item.columns ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-controls={panelId(item.label)}
                  onClick={() => {
                    // Pure toggle of the PIN: hover never writes to it, so
                    // mouse, touch and Enter/Space all behave identically.
                    // Closing clears BOTH states — otherwise a tap that
                    // focused the button (focus → `focusMenu`) would leave the
                    // hover state holding the panel open and the menu could
                    // never be dismissed again on touch.
                    if (pinnedMenu === item.label) {
                      closeAll();
                    } else {
                      setPinnedMenu(item.label);
                    }
                  }}
                  className={trigger}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              ) : (
                <Link href={item.href} className={trigger}>
                  {item.label}
                </Link>
              )}


              {item.columns ? (
                <div
                  id={panelId(item.label)}
                  data-open={isOpen ? "true" : "false"}
                  className="mega-panel absolute inset-x-6 top-full z-50 pt-2.5 sm:inset-x-8 lg:inset-x-12"
                >
                  {/* Opaque on purpose: at 96% the hero photograph read
                      straight through the panel, so the menu looked broken
                      wherever it overlapped bright footage. */}
                  <div className="mega-surface mx-auto w-full max-w-[68rem] overflow-hidden rounded-md border border-gold/20 bg-gradient-to-b from-[#0a1c30] to-[#04101f] shadow-[0_36px_90px_rgba(0,0,0,0.7)]">
                    <div className="flex">
                      <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-6 p-8">
                        {item.columns.map((column) => (
                          <div key={column.heading}>
                            <p className="mega-label mb-4 flex items-center gap-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-gold/90">
                              <span
                                aria-hidden="true"
                                className="h-px w-5 bg-gold/50"
                              />
                              {column.heading}
                            </p>
                            <ul>
                              {column.links.map((link, linkIndex) => (
                                <li
                                  key={link.href}
                                  className="mega-item"
                                  style={
                                    {
                                      "--i": linkIndex,
                                    } as React.CSSProperties
                                  }
                                >
                                  <Link
                                    href={link.href}
                                    onClick={closeAll}
                                    className="group/link flex items-center justify-between gap-3 py-2 text-sm text-ivory/70 transition-colors duration-200 hover:text-gold"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span
                                        aria-hidden="true"
                                        className="h-px w-0 bg-gold transition-all duration-300 group-hover/link:w-3"
                                      />
                                      {link.label}
                                    </span>
                                    <ArrowUpRight
                                      aria-hidden="true"
                                      className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                                    />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {item.preview && revealedPreviews.has(item.label) ? (
                        <div className="mega-item w-52 shrink-0 border-l border-gold/15 p-6">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-coal">
                            <Image
                              src={item.preview.src}
                              alt={item.preview.alt}
                              fill
                              sizes="208px"
                              className="object-cover"
                            />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent"
                            />
                          </div>
                          <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-ivory/50">
                            {item.preview.alt}
                          </p>
                        </div>
                      ) : null}
                    </div>

                    {item.footnote ? (
                      <Link
                        href={item.footnote.href}
                        onClick={closeAll}
                        className="flex items-center justify-between border-t border-gold/15 bg-gold/[0.05] px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold transition-colors duration-300 hover:bg-gold/10"
                      >
                        {item.footnote.label}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
