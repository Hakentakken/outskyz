import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "text";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-black hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]",
  secondary:
    "border border-gold/40 text-ivory hover:border-gold hover:bg-gold/10 hover:text-gold",
  text: "text-ivory relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100 hover:text-gold",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-sm px-8 py-3 text-sm font-medium uppercase tracking-widest transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Reusable button supporting primary, secondary, and text variants.
 * Renders a Next.js Link when `href` is provided, otherwise a button.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = "primary", className, children, ariaLabel, href } = props;
    const classes = cn(baseClasses, variantClasses[variant], className);

    if (href) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          aria-label={ariaLabel}
          className={classes}
        >
          {children}
        </Link>
      );
    }

    const { type, onClick, disabled } = props as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </button>
    );
  },
);