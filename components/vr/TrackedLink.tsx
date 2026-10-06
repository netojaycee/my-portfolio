"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/track";

/** Anchor that reports a CTA click. Used by the server-rendered hero bar. */
export function TrackedLink({
  event,
  cta,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { event: string; cta: string }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(event, { cta, where: "hero" });
        props.onClick?.(e);
      }}
    />
  );
}
