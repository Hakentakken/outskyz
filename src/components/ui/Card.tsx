import { cn } from "@/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

/**
 * Dark glass card with thin gold border and optional hover elevation.
 */
export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-gold/35 bg-coal/80 backdrop-blur-sm",
        hoverable &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_8px_40px_rgba(212,175,55,0.12)]",
        className,
      )}
    >
      {children}
    </div>
  );
}