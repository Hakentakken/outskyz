import { cn } from "@/utils/cn";

interface DividerProps {
  className?: string;
}

/**
 * Horizontal gold divider used to separate content sections.
 */
export function Divider({ className }: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent", className)}
    />
  );
}