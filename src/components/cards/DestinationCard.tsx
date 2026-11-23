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
 * Destination card - cinematic destination shot with restrained location
 * metadata and optional highlights. Structure only; no data.
 *
 * The image is the hero of the card. A country badge sits top-left for
 * immediate geographic context; the title anchors below the image with a
 * thin gold rule at the bottom for visual closure. Highlights render as a
 * restrained list with small gold accent dots.
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
      <div className="relative overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent"
        />
        {country ? (
          <Badge className="absolute left-3 top-3 bg-void/60 backdrop-blur-sm">
            {country}
          </Badge>
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 bottom-3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        />
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-display text-xl text-ivory leading-tight sm:text-2xl">
          {name}
        </h3>
        {highlights && highlights.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-sm leading-relaxed text-ivory/65"
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
