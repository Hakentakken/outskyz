import type { ComponentProps } from "react";
import { Button } from "./Button";

export type GoldButtonProps = ComponentProps<typeof Button>;

/**
 * Gold CTA button — used for primary brand actions.
 * Alias for Button with the primary variant pre-applied.
 */
export function GoldButton(props: GoldButtonProps) {
  return <Button variant="primary" {...props} />;
}