import { Inter, Playfair_Display, Montserrat } from "next/font/google";

/**
 * Outskyz typography — luxury editorial pairing.
 * Playfair Display for display/headings, Inter for body copy, Montserrat for accents.
 * Loaded once here and exposed as CSS variables via `variable`.
 */
export const fontDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const fontBody = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const fontAccent = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
