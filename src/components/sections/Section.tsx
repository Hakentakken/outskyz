"use client";

import { useId } from "react";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { resources } from "@/config/resources";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
  small: "py-5 sm:py-6",
  medium: "py-10 sm:py-12",
  large: "py-12 sm:py-16",
};

/**
 * Reusable page section with background and vertical spacing variants.
 * `background="image"` renders a full-bleed image behind the content.
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
  const sectionId = useId();
  const { ref, isVisible } = useScrollAnimation();
  const mediaOptions = [
    resources.sky.cloudscape,
    resources.sky.goldenFreefall,
    resources.sky.sunsetFlight,
    resources.sky.mountainFreefall,
    resources.sky.formationFlight,
    resources.sky.horizonFlight,
  ];
  const mediaIndex = Array.from(sectionId).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % mediaOptions.length;

  const getAnimationClass = () => {
    if (animate === "none") return "";
    const baseClass = "animate-on-scroll";
    const animationClass = animate === "fade-up" ? "" : `animate-${animate}`;
    const delayClass = animateDelay > 0 ? `animate-delay-${animateDelay}` : "";
    return cn(baseClass, animationClass, delayClass, isVisible && "is-visible");
  };

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative isolate overflow-hidden",
        backgroundClasses[background],
        spacingClasses[spacing],
        getAnimationClass(),
        className,
      )}
    >
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
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
            style={{ backgroundImage: `url(${mediaOptions[mediaIndex]})` }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#020a14]/80 via-transparent to-[#061c31]/75" />
          <div aria-hidden="true" className="sky-section-atmosphere" />
        </>
      ) : null}
      <div className="relative">
        <Container>{children}</Container>
      </div>
    </section>
  );
}
