"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/site";
import { adventures } from "@/data/adventures";
import { destinations } from "@/data/destinations";

interface NavbarProps {
  scrolled?: boolean;
}

interface NavLink {
  label: string;
  href: string;
}

interface MegaColumn {
  heading: string;
  links: readonly NavLink[];
}

interface NavItem {
  label: string;
  href: string;
  /** Only items that declare columns render a mega-menu panel. */
  columns?: readonly MegaColumn[];
  /** Trailing "see everything" row inside the panel. */
  footnote?: NavLink;
}

/** Stable, human-readable id for the aria-controls wiring. */
const panelId = (label: string) =>
  `nav-panel-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

/**
 * Top-level navigation.
 *
 * Two things were wrong with the previous version. It listed all eight top-level
 * destinations flat, which crowded the bar and buried the sub-pages; and its
 * dropdowns opened on `onMouseEnter` only, so nothing inside them could be
 * reached with a keyboard at all.
 *
 * Items with children now open a mega-menu driven by a real <button>: it toggles
 * on click/Enter/Space, opens on focus, closes on Escape or when focus leaves
 * the panel, and still opens on hover for mouse users. The panel is a fixed
 * two-column grid so long link lists stay scannable.
 */
export function Navbar({ scrolled = false }: NavbarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  // Hover/focus opens a panel transiently; a tap or an explicit click
  // "pins" it. Keeping the two apart is what stops a click from fighting the
  // `pointerenter` browsers fire just before it — on touch devices a single
  // tap would otherwise open-then-close the panel every time.
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null);
  const openMenu = hoveredMenu ?? pinnedMenu;
  const [prevPathname, setPrevPathname] = useState(pathname);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerDownAt = useRef(0);

  // Close on navigation (adjust state during render - no effect needed).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setHoveredMenu(null);
    setPinnedMenu(null);
  }

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

  const open = (label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setHoveredMenu(label);
    // Hovering a *different* item replaces whatever was pinned, so a panel
    // the visitor pinned earlier cannot resurrect once they move on.
    setPinnedMenu((current) => (current === label ? current : null));
  };

  // A short grace period keeps the panel open while the pointer crosses the gap
  // between the trigger and the menu itself. It only releases the hover state —
  // a panel the visitor pinned stays open.
  const scheduleClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setHoveredMenu(null), 140);
  };

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
    },
  ];

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const isOpen = openMenu === item.label;
          const trigger = cn(
            "relative flex items-center gap-1 rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors duration-300",
            "after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300",
            "hover:text-gold hover:after:scale-x-100",
            isOpen && "text-gold after:scale-x-100",
            !isOpen && (scrolled ? "text-ivory/80" : "text-ivory/90"),
          );

          return (
            <li
              key={item.label}
              className="relative"
              onPointerEnter={(event) => {
                // Touch has no hover: its taps must be able to toggle the
                // panel, so only genuinely-hovering pointers open it.
                if (event.pointerType !== "touch") open(item.label);
              }}
              onMouseLeave={scheduleClose}
              onFocus={() => open(item.label)}
              onBlur={(event) => {
                // Only close once focus has actually left this item's subtree.
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setHoveredMenu(null);
                  setPinnedMenu(null);
                }
              }}
            >
              {item.columns ? (
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-controls={panelId(item.label)}
                  onPointerDown={() => {
                    pointerDownAt.current = Date.now();
                  }}
                  onClick={() => {
                    // Enter/Space produce a click with no preceding pointer
                    // event, so there the button can behave as a true toggle.
                    if (Date.now() - pointerDownAt.current > 600) {
                      if (isOpen) {
                        setHoveredMenu(null);
                        setPinnedMenu(null);
                      } else {
                        setPinnedMenu(item.label);
                      }
                      return;
                    }

                    if (pinnedMenu === item.label) {
                      setHoveredMenu(null);
                      setPinnedMenu(null);
                    } else {
                      // Pin instead of fighting whatever already opened it —
                      // on touch, focusing the button opens the panel before
                      // the click lands, so `!isOpen` would never be true and
                      // the menu could never be dismissed again. Pinning also
                      // keeps it up while the pointer crosses the gap.
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
                  className={cn(
                    "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4",
                    isOpen ? "visible" : "pointer-events-none invisible",
                  )}
                >
                  <div
                    className={cn(
                      "w-[min(38rem,calc(100vw-4rem))] overflow-hidden rounded-md border border-gold/25 bg-void/95 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300",
                      isOpen
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-1 opacity-0",
                    )}
                  >
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-7">
                      {item.columns.map((column) => (
                        <div key={column.heading}>
                          <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-gold">
                            {column.heading}
                          </p>
                          <ul className="space-y-2.5">
                            {column.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={() => {
                                    setHoveredMenu(null);
                                    setPinnedMenu(null);
                                  }}
                                  className="group/link flex items-center gap-2 text-sm text-ivory/70 transition-colors duration-200 hover:text-gold"
                                >
                                  <span
                                    aria-hidden="true"
                                    className="h-px w-0 bg-gold transition-all duration-300 group-hover/link:w-3"
                                  />
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {item.footnote ? (
                      <Link
                        href={item.footnote.href}
                        onClick={() => {
                          setHoveredMenu(null);
                          setPinnedMenu(null);
                        }}
                        className="flex items-center justify-between border-t border-gold/15 bg-gold/[0.04] px-7 py-4 text-xs font-semibold uppercase tracking-widest text-gold transition-colors duration-300 hover:bg-gold/10"
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

