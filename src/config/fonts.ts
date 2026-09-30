import { Inter, Playfair_Display } from "next/font/google";

/**
 * Outskyz typography — two families, not three.
 *
 * Montserrat (`--font-montserrat`) was previously loaded alongside Playfair and
 * Inter. It was only applied in one place (the SectionHeading eyebrow), so it
 * cost a third font download on every page for almost no visual payoff. The
 * eyebrow now inherits the body sans; Playfair (display) and Inter (body)
 * remain and are already self-hosted by next/font, so there are zero external
 * network requests for typography.
 *
 * Weights are trimmed to those actually used:
 *  - Playfair: 500 (headings), 600 (strong headings) — was 7 weights
 *  - Inter:    400/500/600 (body, labels) — was 5 weights
 */
export const fontDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  // Latin only; drops the Cyrillic/Vietnamese subsets.
  preload: true,
});

export const fontBody = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

/**
 * Kept as an alias so existing `font-accent` utilities keep working without
 * triggering a third download.
 */
export const fontAccent = fontBody;
