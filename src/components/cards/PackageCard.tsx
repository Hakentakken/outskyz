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
 * Package card — pricing, features, and CTA.
 * Structure only; no data.
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
        "relative flex flex-col p-8",
        popular && "border-gold/60 shadow-[0_8px_40px_rgba(212,175,55,0.1)]",
        className,
      )}
    >
      {popular ? (
        <Badge className="absolute -top-3 right-6">Popular</Badge>
      ) : null}

      <h3 className="font-display text-2xl text-ivory">{name}</h3>

      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
      ) : null}

      {price ? (
        <p className="mt-6 flex items-baseline gap-2">
          <span className="font-display text-3xl text-gold">{price}</span>
          {duration ? (
            <span className="text-sm text-muted">/ {duration}</span>
          ) : null}
        </p>
      ) : null}

      {features && features.length > 0 ? (
        <ul className="mt-6 flex-1 space-y-3">
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

      <GoldButton className="mt-8 w-full" href="/contact">
        Book Now
      </GoldButton>
    </Card>
  );
}