import { cn } from "@/utils/cn";

interface GoldLineProps {
  className?: string;
}

/**
 * Thin gold accent line used to underline headings.
 */
export function GoldLine({ className }: GoldLineProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px w-12 bg-gold/60", className)}
    />
  );
}