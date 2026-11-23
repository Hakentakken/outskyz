import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { Reveal, revealVariantFromAnimation } from "@/components/ui/Reveal";

type SectionBackground = "default" | "dark" | "image";
type SectionSpacing = "small" | "medium" | "large";
type AnimationType = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right" | "none";

interface SectionProps {
  children: React.ReactNode;
  background?: SectionBackground;
  spacing?: SectionSpacing;
  backgroundImage?: string;
  className?: string;
  id?: string;
  animate?: AnimationType;
  animateDelay?: number;
}

const backgroundClasses: Record<SectionBackground, string> = {
  default: "bg-[#030d1a]",
  dark: "bg-[#061526]",
  image: "",
};

const spacingClasses: Record<SectionSpacing, string> = {
  small: "py-8 sm:py-10",
  medium: "py-12 sm:py-16",
  large: "py-20 sm:py-28",
};

/**
 * Reusable page section with background and vertical spacing variants.
 * `background="image"` renders a full-bleed image behind the content.
 *
 * MOTION
 * ------
 * `animate` is kept as the call-site API, but it now feeds the shared reveal
 * primitives (`@/components/ui/Reveal`) instead of a second, parallel
 * `animate-on-scroll` system: the section is revealed by the same
 * IntersectionObserver that drives the cards and headings inside it, so the
 * whole page shares one timing curve and one reduced-motion path.
 *
 * The section itself only rises ~36px â€” a shot settling into frame â€” while the
 * copy inside carries the real staging. Because `Reveal` renders its own
 * markup, this module stays a server component.
 */
export function Section({
  children,
  background = "default",
  spacing = "medium",
  backgroundImage,
  className,
  id,
  animate = "fade-up",
  animateDelay = 0,
}: SectionProps) {
  const isImage = background === "image";

  const backdrop = (
    <>
      {isImage && backgroundImage ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-void/70"
          />
        </>
      ) : null}
      {!isImage && spacing !== "small" ? (
        <>
          {/* Gradient atmosphere only â€” previously an eagerly-fetched photo
              sat behind every section, including below the fold. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#020a14]/80 via-transparent to-[#061c31]/75"
          />
          <div aria-hidden="true" className="sky-section-atmosphere" />
        </>
      ) : null}
    </>
  );

  const content = (
    <>
      {backdrop}
      <div className="relative">
        <Container>{children}</Container>
      </div>
    </>
  );

  const sectionClassName = cn(
    "relative isolate overflow-hidden",
    backgroundClasses[background],
    spacingClasses[spacing],
    className,
  );

  if (animate === "none") {
    return (
      <section id={id} className={sectionClassName}>
        {content}
      </section>
    );
  }

  return (
    <Reveal
      as="section"
      id={id}
      variant={revealVariantFromAnimation[animate]}
      delay={animateDelay}
      className={sectionClassName}
    >
      {content}
    </Reveal>
  );
}
