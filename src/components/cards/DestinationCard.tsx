import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface DestinationCardProps {
  image: string;
  alt: string;
  name: string;
  country?: string;
  highlights?: string[];
  className?: string;
  priority?: boolean;
}

/**
 * Destination card — image, location info, and optional highlights.
 * Structure only; no data.
 */
export function DestinationCard({
  image,
  alt,
  name,
  country,
  highlights,
  className,
  priority = false,
}: DestinationCardProps) {
  return (
    <Card hoverable className={cn("overflow-hidden", className)}>
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {country ? (
          <Badge className="absolute left-4 top-4 bg-void/70 backdrop-blur-sm">
            {country}
          </Badge>
        ) : null}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl text-ivory">{name}</h3>
        {highlights && highlights.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-sm text-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-4 shrink-0 bg-gold/60"
                />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Card>
  );
}