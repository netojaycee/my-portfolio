"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVRStore } from "./store";
import { WALLS } from "./content";
import { GROUP_LABEL, buildStops, stopPose, type Stop } from "./layout";
import { trackEvent } from "@/lib/track";
import type { VRData } from "./types";

const CENTER: [number, number, number] = [0, 1.6, 0];
const GROUP_OF_WALL: Record<(typeof WALLS)[number]["key"], Stop["group"]> = {
  proof: "proof",
  projects: "projects",
  skills: "skills",
  career: "career",
};

/** Small screens get the guided tour (text is unreadable from the room centre). */
const isCompact = () => window.matchMedia("(max-width: 1023px), (max-height: 520px)").matches;

/**
 * One-tap navigation. Desktop: pills turn the camera to a wall. Small screens: pills
 * and ‹ › step through every card, flying the camera up close to each one.
 */
export function WallNav({ data }: { data: VRData }) {
  const stops = buildStops(data);
  const focusOn = useVRStore((s) => s.focusOn);
  const tourIndex = useVRStore((s) => s.tourIndex);
  const setTourIndex = useVRStore((s) => s.setTourIndex);

  const goTo = (i: number) => {
    const idx = (i + stops.length) % stops.length;
    const pose = stopPose(stops[idx]);
    useVRStore.getState().select(null);
    setTourIndex(idx);
    focusOn(pose.pos, pose.azimuth);
    trackEvent("tour_step", { stop: stops[idx].label, group: stops[idx].group });
  };

  const onPill = (w: (typeof WALLS)[number]) => {
    trackEvent("wall_nav", { wall: w.key });
    if (isCompact()) {
      const first = stops.findIndex((s) => s.group === GROUP_OF_WALL[w.key]);
      if (first >= 0) goTo(first);
    } else {
      focusOn(CENTER, w.angle);
    }
  };

  const current = tourIndex >= 0 ? stops[tourIndex] : null;
  const inGroup = current ? stops.filter((s) => s.group === current.group) : [];
  const pos = current ? inGroup.indexOf(current) + 1 : 0;

  return (
    <div className="pointer-events-auto flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface/85 p-1.5 backdrop-blur-md lg:hidden [@media(max-height:520px)]:flex">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => goTo(tourIndex < 0 ? stops.length - 1 : tourIndex - 1)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-text active:border-accent active:text-accent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate font-mono text-[10px] uppercase tracking-wider text-muted">
            {current ? `${GROUP_LABEL[current.group]} · ${pos}/${inGroup.length}` : "Guided tour"}
          </div>
          <div className="truncate font-syne text-sm font-bold text-text">
            {current ? current.label : "Tap › to walk through the proof"}
          </div>
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => goTo(tourIndex + 1)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-black active:bg-accent-hover"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex w-full items-center justify-center gap-1.5 self-center sm:gap-2 [@media(max-height:520px)]:hidden">
        {WALLS.map((w) => (
          <button
            key={w.key}
            type="button"
            onClick={() => onPill(w)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors hover:border-accent hover:text-accent sm:text-[11px] ${
              current && current.group === GROUP_OF_WALL[w.key]
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface/85 text-dim"
            }`}
          >
            <span className="sm:hidden">{w.short}</span>
            <span className="hidden sm:inline">{w.label}</span>
          </button>
        ))}
        <span className="hidden font-mono text-[11px] text-muted lg:inline">drag to look · click any card</span>
      </div>
    </div>
  );
}
