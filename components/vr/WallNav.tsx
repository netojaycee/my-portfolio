"use client";

import { useVRStore } from "./store";
import { WALLS } from "./content";
import { trackEvent } from "@/lib/track";

/** One-tap navigation: turns the camera to a wall so nobody has to hunt for content. */
export function WallNav() {
  const gotoWall = useVRStore((s) => s.gotoWall);
  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 self-center">
      {WALLS.map((w) => (
        <button
          key={w.key}
          type="button"
          onClick={() => {
            gotoWall(w.angle);
            trackEvent("wall_nav", { wall: w.key });
          }}
          className="rounded-full border border-border bg-surface/85 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-dim backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
        >
          {w.label}
        </button>
      ))}
      <span className="hidden font-mono text-[11px] text-muted sm:inline">drag to look · click any card</span>
    </div>
  );
}
