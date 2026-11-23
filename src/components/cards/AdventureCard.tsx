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
 * Adventure card - cinematic image, restrained metadata, clear CTA layer.
 *
 * A shared token shape used across the adventure-flow components. The image
 * carries the shot; the caption layers the label, title, description, and a
 * thin gold rule. The icon badge sits top-right so it never competes with the
 * title; the badge (if present) is aligned to the same axis. The card keeps
 * its own hover lift and border warmth while the image settles on hover.
 *
 * The overlay stack is deliberately shallow: a top-shadow block for the
 * icon, a mid-gold rule, and a bottom gradient that reaches no deeper than
 * via-black/30 so photographs are never crushed.
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
        "group relative flex flex-col overflow-hidden rounded-md border border-gold/30 bg-void/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_6px_32px_rgba(212,175,55,0.08)]",
        className,
      )}
    >
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
        {Icon ? (
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-sm bg-void/60 text-gold backdrop-blur-sm">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 bottom-px bg-gradient-to-b from-black/30 via-transparent to-transparent"
        />
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        {badge ? (
          <Badge className="mb-2.5">{badge}</Badge>
        ) : null}
        <h3 className="font-display text-xl text-ivory leading-tight sm:text-2xl">
          {title}
        </h3>
        {description ? (
          <p className="mt-2.5 text-sm leading-relaxed text-ivory/65">
            {description}
          </p>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bottom-3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
    </article>
  );
}
