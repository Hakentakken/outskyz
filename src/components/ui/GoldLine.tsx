import { cn } from "@/utils/cn";

interface GoldLineProps {
  className?: string;
}

/**
 * Thin gold accent line used to underline headings.
 *
 * Carries `gold-line` so it can draw itself in (scaleX 0 → 1) when the reveal
 * wrapper around it becomes visible — see globals.css. `gold-line-center`
 * switches the origin so the rule grows outward from the middle under a
 * centred heading.
 */
export function GoldLine({ className }: GoldLineProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("gold-line block h-px w-12 bg-gold/60", className)}
    />
  );
}