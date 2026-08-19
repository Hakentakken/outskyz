import { cn } from "@/utils/cn";

interface IconBoxProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Gold-bordered square container for icons.
 */
export function IconBox({ children, className }: IconBoxProps) {
  return (
    <div
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-sm border border-gold/40 bg-gold/10 text-gold",
        className,
      )}
    >
      {children}
    </div>
  );
}