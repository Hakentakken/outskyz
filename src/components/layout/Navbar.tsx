"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import { adventures } from "@/data/adventures";
import { destinations } from "@/data/destinations";

interface NavbarProps {
  scrolled?: boolean;
}

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export function Navbar({ scrolled = false }: NavbarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns when route changes (adjust state during render — no effect needed)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenMenu(null);
  }

  const handleOpen = (label: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenMenu(label);
  };

  const handleClose = () => {
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "Experiences",
      href: "/adventures",
      children: [
        ...adventures.map((a) => ({ label: a.title, href: `/adventures/${a.slug}` })),
        { label: "View All Adventures", href: "/adventures" },
      ],
    },
    {
      label: "Destinations",
      href: "/destinations",
      children: [
        ...destinations.map((d) => ({
          label: `${d.name} — ${d.country}`,
          href: `/destinations/${d.slug}`,
        })),
        { label: "Explore All Destinations", href: "/destinations" },
      ],
    },
    { label: "Packages", href: "/packages" },
    { label: "About", href: "/about" },
    { label: "Safety", href: "/safety" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {navItems.map((item) => (
          <li
            key={item.label}
            className="relative"
            onMouseEnter={() => handleOpen(item.label)}
            onMouseLeave={handleClose}
          >
            <Link
              href={item.href}
              className={cn(
                "relative flex items-center gap-1 rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors duration-300 after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:text-gold hover:after:scale-x-100",
                scrolled ? "text-ivory/80" : "text-ivory/90",
              )}
            >
              {item.label}
              {item.children && item.children.length > 0 && (
                <ChevronDown
                  className={cn(
                    "ml-1 h-3.5 w-3.5 transition-transform duration-300",
                    openMenu === item.label && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              )}
            </Link>

            {/* Dropdown */}
            {item.children && item.children.length > 0 && (
              <div
                className={cn(
                  "absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3",
                  openMenu === item.label ? "visible opacity-100" : "invisible opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-sm border border-gold/25 bg-void/95 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  <ul className="py-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block border-b border-gold/10 px-4 py-2.5 text-sm text-ivory/70 transition-colors duration-300 last:border-0 hover:bg-gold/10 hover:text-gold"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}