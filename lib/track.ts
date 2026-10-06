import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** One call, both analytics backends (Vercel Web Analytics + GA4 when configured). */
export function trackEvent(name: string, props?: Props) {
  try {
    vercelTrack(name, props);
    window.gtag?.("event", name, props);
  } catch {
    // analytics must never break the page
  }
}
