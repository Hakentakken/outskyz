import { cn } from "@/utils/cn";
import { GoldLine } from "./GoldLine";
import { Reveal } from "@/components/ui/Reveal";

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
 *
 * The three parts land in sequence — eyebrow, then the title rising through a
 * mask, then the copy and a gold rule that draws itself in — using the shared
 * reveal primitives instead of a parallel animation system.
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
        <Reveal
          variant="fade"
          className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-gold font-accent"
        >
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal
        as="h2"
        variant="mask"
        className="text-4xl font-bold text-ivory sm:text-5xl lg:text-6xl font-display tracking-tight"
      >
        {title}
      </Reveal>
      {description ? (
        <Reveal
          variant="fade"
          delay={140}
          className={cn(
            "mt-6 text-lg leading-relaxed text-muted sm:text-xl max-w-2xl",
            centered ? "mx-auto" : "",
          )}
        >
          {description}
        </Reveal>
      ) : null}
      <Reveal variant="fade" delay={220} className="mt-8">
        <GoldLine className={cn(centered ? "mx-auto gold-line-center" : "")} />
      </Reveal>
    </div>
  );
}