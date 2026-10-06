"use client";

import { useMemo } from "react";
import { ExternalLink, X } from "lucide-react";
import { buildItems } from "./details";
import { useCompact } from "./useCompact";
import { useVRStore } from "./store";
import { trackEvent } from "@/lib/track";
import type { VRData } from "./types";

/**
 * Bottom sheet with the full story of the selected card on small screens, where a
 * 3D panel would have ~8px text. Real DOM: crisp, scrollable, selectable. Hidden in VR.
 */
export function DetailSheet({ data }: { data: VRData }) {
  const compact = useCompact();
  const selectedId = useVRStore((s) => s.selectedId);
  const inVR = useVRStore((s) => s.inVR);
  const select = useVRStore((s) => s.select);
  const items = useMemo(() => buildItems(data), [data]);
  const item = selectedId ? items.get(selectedId) : undefined;
  if (!compact || inVR || !item) return null;

  const paragraphs = item.body.split(/\n{2,}/);
  return (
    <div
      role="dialog"
      aria-label={item.title}
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 max-h-[66dvh] overflow-y-auto rounded-t-2xl border-t border-accent/40 bg-surface/95 p-4 pb-6 shadow-2xl backdrop-blur-xl [@media(max-height:520px)]:max-h-[85dvh]"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-syne text-xl font-extrabold leading-tight text-text">{item.title}</h2>
          <p className="mt-0.5 font-mono text-xs text-accent">{item.subtitle}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => select(null)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-text active:border-accent"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-2 text-sm leading-relaxed text-dim">
          {p}
        </p>
      ))}
      {item.bullets.length > 0 && (
        <ul className="mt-3 space-y-2">
          {item.bullets.slice(0, 8).map((b, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-text">
              <span className="mt-0.5 text-accent">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {item.footer && <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted">{item.footer}</p>}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("live_site_click", { card: item.title, where: "sheet" })}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black"
        >
          Open live site
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
