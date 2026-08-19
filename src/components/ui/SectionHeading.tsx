import { cn } from "@/utils/cn";
import { GoldLine } from "./GoldLine";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

/**
 * Editorial section heading with gold eyebrow, Playfair display title,
 * and optional description.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "max-w-3xl",
        centered ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-gold font-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-bold text-ivory sm:text-5xl lg:text-6xl font-display tracking-tight">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 text-lg leading-relaxed text-muted sm:text-xl max-w-2xl",
            centered ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      ) : null}
      <GoldLine className={cn("mt-8", centered ? "mx-auto" : "")} />
    </div>
  );
}