"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { WallNav } from "./WallNav";
import type { VRData } from "./types";

// WebGL/WebXR only exist in the browser, so the scene is client-only.
const VRScene = dynamic(() => import("./VRScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-muted">
      <span className="text-accent">$</span>&nbsp;booting scene…
    </div>
  ),
});

/**
 * `overlay` is a server-rendered node (the hero bar). Because it is rendered
 * here, outside the dynamic import, it paints immediately with the HTML.
 */
export function VRExperience({ data, overlay }: { data: VRData; overlay: ReactNode }) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      <VRScene data={data} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-3 sm:p-5">
        <WallNav />
        {overlay}
      </div>
    </div>
  );
}
