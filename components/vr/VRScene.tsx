"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { XR, XROrigin, createXRStore, useXR } from "@react-three/xr";
import { World } from "./World";
import { useVRStore } from "./store";
import type { VRData } from "./types";

// Teleport pointer lets controller users aim at the floor and jump there.
const xrStore = createXRStore({
  controller: { teleportPointer: true },
  hand: { teleportPointer: true },
});

/** Mouse/touch look-around on flat screens; disabled once a headset session starts. */
function DesktopControls() {
  const session = useXR((s) => s.session);
  if (session) return null;
  return (
    <OrbitControls
      target={[0, 1.6, 0]}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={-0.35}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
    />
  );
}

function Origin() {
  const origin = useVRStore((s) => s.origin);
  return <XROrigin position={origin} />;
}

export default function VRScene({ data }: { data: VRData }) {
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const xr = navigator.xr;
    if (!xr) {
      setVrSupported(false);
      return;
    }
    xr.isSessionSupported("immersive-vr")
      .then(setVrSupported)
      .catch(() => setVrSupported(false));
  }, []);

  return (
    <div className="relative h-dvh w-full bg-bg">
      <Canvas camera={{ position: [0, 1.6, 0.01], fov: 70 }} dpr={[1, 2]}>
        <XR store={xrStore}>
          <Origin />
          <DesktopControls />
          <World data={data} />
        </XR>
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
        <Link
          href="/"
          className="pointer-events-auto rounded-md border border-border bg-surface/80 px-3 py-2 font-mono text-xs text-dim backdrop-blur-md transition-colors hover:text-accent"
        >
          ← back to 2D site
        </Link>
        <div className="font-mono text-xs text-muted">/vr</div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-4 pb-8 sm:p-6">
        <p className="rounded-md bg-surface/70 px-3 py-1.5 text-center font-mono text-[11px] text-dim backdrop-blur-md">
          drag to look around · click a project card · turn left for skills, right for experience
        </p>
        {vrSupported ? (
          <button
            type="button"
            onClick={() => xrStore.enterVR()}
            className="pointer-events-auto rounded-md bg-accent px-6 py-3 font-mono text-sm font-bold text-black transition-colors hover:bg-accent-hover"
          >
            Enter VR
          </button>
        ) : (
          <p className="font-mono text-[11px] text-muted">
            {vrSupported === null ? "checking for VR headset…" : "no VR headset detected — desktop mode"}
          </p>
        )}
      </div>
    </div>
  );
}
