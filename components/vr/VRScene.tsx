"use client";

import { useEffect, useRef, useState, type ElementRef } from "react";
import Link from "next/link";
import { Monitor } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { OrbitControls } from "@react-three/drei";
import { XR, XROrigin, createXRStore, useXR } from "@react-three/xr";
import { World } from "./World";
import { useVRStore } from "./store";
import { trackEvent } from "@/lib/track";
import type { VRData } from "./types";

// Teleport pointer lets controller users aim at the floor and jump there.
const xrStore = createXRStore({
  controller: { teleportPointer: true },
  hand: { teleportPointer: true },
});

/** Mouse/touch look-around on flat screens; also animates "turn to wall" requests. */
function DesktopControls() {
  const session = useXR((s) => s.session);
  const goto = useVRStore((s) => s.goto);
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const target = useRef<number | null>(null);

  useEffect(() => {
    if (goto) target.current = goto.angle;
  }, [goto]);

  useFrame((_, dt) => {
    const c = controls.current;
    const to = target.current;
    if (!c || to === null) return;
    const cur = c.getAzimuthalAngle();
    const diff = Math.atan2(Math.sin(to - cur), Math.cos(to - cur));
    if (Math.abs(diff) < 0.004) {
      c.setAzimuthalAngle(to);
      target.current = null;
    } else {
      c.setAzimuthalAngle(cur + diff * Math.min(1, dt * 5));
    }
    c.update();
  });

  if (session) return null;
  return (
    <OrbitControls
      ref={controls}
      target={[0, 1.6, 0]}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={-0.35}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
      onStart={() => {
        target.current = null;
      }}
    />
  );
}

/** Portrait phones get a wider vertical FOV so more of the wall fits across the narrow screen. */
function ResponsiveFov() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.fov = size.width / size.height < 1 ? 92 : 70;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Origin() {
  const origin = useVRStore((s) => s.origin);
  return <XROrigin position={origin} />;
}

export default function VRScene({ data }: { data: VRData }) {
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const probe = document.createElement("canvas");
    setWebgl(Boolean(probe.getContext("webgl2") || probe.getContext("webgl")));

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
    <div className="absolute inset-0 bg-bg">
      {webgl ? (
        <Canvas camera={{ position: [0, 1.6, 0.01], fov: 70 }} dpr={[1, 1.75]}>
          <ResponsiveFov />
          <XR store={xrStore}>
            <Origin />
            <DesktopControls />
            <World data={data} />
          </XR>
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center font-mono text-sm text-muted">
          3D isn&apos;t available in this browser — the info below is the full story, or open the classic view.
        </div>
      )}

      <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 sm:right-5 sm:top-5">
        {vrSupported && (
          <button
            type="button"
            onClick={() => {
              trackEvent("enter_vr");
              xrStore.enterVR();
            }}
            className="pointer-events-auto rounded-lg bg-accent px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-accent-hover"
          >
            Enter VR
          </button>
        )}
        <Link
          href="/classic"
          onClick={() => trackEvent("view_switch", { to: "classic" })}
          className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-surface/85 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-text backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
        >
          <Monitor className="h-4 w-4" />
          Classic 2D
        </Link>
      </div>
    </div>
  );
}
