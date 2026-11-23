import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GoldButton } from "@/components/ui/GoldButton";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface PackageCardProps {
  name: string;
  description?: string;
  price?: string;
  duration?: string;
  features?: string[];
  popular?: boolean;
  className?: string;
}

/**
 * Package card - pricing, features, and CTA.
 * Structure only; no data.
 *
 * The title anchors the card, followed by description, price/duration, and
 * a restrained feature list. A gold "Popular" badge marks featured packages
 * in the top-right corner. The Book Now button stays pinned at the bottom
 * for consistent alignment across the grid.
 */
export function PackageCard({
  name,
  description,
  price,
  duration,
  features,
  popular = false,
  className,
}: PackageCardProps) {
  return (
    <Card
      hoverable
      className={cn(
        "relative flex flex-col overflow-hidden rounded-md border border-gold/30 bg-void/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)] p-5 sm:p-6",
        popular && "border-gold/50",
        className,
      )}
    >
      {popular ? (
        <Badge className="absolute right-3 top-3">Popular</Badge>
      ) : null}

      <h3 className="font-display text-xl text-ivory leading-tight sm:text-2xl">
        {name}
      </h3>

      {description ? (
        <p className="mt-2.5 text-sm leading-relaxed text-ivory/65">
          {description}
        </p>
      ) : null}

      {price ? (
        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-display text-2xl text-gold sm:text-3xl">
            {price}
          </span>
          {duration ? (
            <span className="text-sm text-muted">
              / {duration}
            </span>
          ) : null}
        </div>
      ) : null}

      {features && features.length > 0 ? (
        <ul className="mt-5 flex-1 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-ivory/80">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                aria-hidden="true"
              />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      <GoldButton className="mt-6 w-full" href="/contact">
        Book Now
      </GoldButton>
    </Card>
  );
}
