"use client";

import dynamic from "next/dynamic";
import type { VRData } from "./types";

// WebGL/WebXR only exist in the browser, so the scene is client-only.
const VRScene = dynamic(() => import("./VRScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh items-center justify-center bg-bg font-mono text-sm text-muted">
      <span className="text-accent">$</span>&nbsp;loading scene…
    </div>
  ),
});

export function VRExperience({ data }: { data: VRData }) {
  return <VRScene data={data} />;
}
