import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

interface AdventureCardProps {
  image: string;
  alt: string;
  title: string;
  description?: string;
  badge?: string;
  icon?: LucideIcon;
  className?: string;
  priority?: boolean;
}

/**
 * Adventure card — image, gold-bordered overlay, optional badge and icon.
 * Structure only; no data.
 */
export function AdventureCard({
  image,
  alt,
  title,
  description,
  badge,
  icon: Icon,
  className,
  priority = false,
}: AdventureCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-md border border-gold/35 bg-coal transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_8px_40px_rgba(212,175,55,0.12)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {Icon ? (
          <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-sm bg-void/60 text-gold backdrop-blur-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        {badge ? <Badge className="mb-3">{badge}</Badge> : null}
        <h3 className="font-display text-xl text-ivory sm:text-2xl">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}