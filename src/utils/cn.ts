/**
 * Merge Tailwind class names, filtering out falsy values.
 * Lightweight zero-dependency alternative to clsx + tailwind-merge.
 * Usage: cn("text-lg", isActive && "text-gold")
 */
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}