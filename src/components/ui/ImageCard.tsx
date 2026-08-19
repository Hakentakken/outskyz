import Image from "next/image";
import { Badge } from "./Badge";
import { cn } from "@/utils/cn";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  badge?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

/**
 * Image card with optional overlay title, description, and gold badge.
 */
export function ImageCard({
  src,
  alt,
  title,
  description,
  badge,
  className,
  imageClassName,
  priority = false,
}: ImageCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border border-gold/35 bg-coal",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-500 group-hover:scale-105",
          imageClassName,
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        {badge ? <Badge className="mb-3">{badge}</Badge> : null}
        {title ? (
          <h3 className="font-display text-xl text-ivory sm:text-2xl">
            {title}
          </h3>
        ) : null}
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}