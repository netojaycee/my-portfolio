"use client";

import { useEffect, useRef, useState, type ElementRef } from "react";
import Link from "next/link";
import { Monitor } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
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

// Stable identity so R3F applies the target once at creation and never resets it mid-flight.
const ROOM_CENTER: [number, number, number] = [0, 1.6, 0];

/** Mouse/touch look-around on flat screens; also flies the camera to tour stops / walls. */
function DesktopControls() {
  const session = useXR((s) => s.session);
  const focus = useVRStore((s) => s.focus);
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const dest = useRef<{ pos: Vector3; az: number } | null>(null);

  useEffect(() => {
    if (focus) dest.current = { pos: new Vector3(...focus.pos), az: focus.azimuth };
  }, [focus]);

  useFrame((_, dt) => {
    const c = controls.current;
    const d = dest.current;
    if (!c || !d) return;
    // dev-only: ?snap jumps instantly so layouts can be verified in throttled test tabs
    const snap = process.env.NODE_ENV !== "production" && window.location.search.includes("snap");
    const k = snap ? 1 : Math.min(1, dt * 4.5);
    // translate camera and its orbit target together so the viewer "walks" to the stop
    const delta = new Vector3().subVectors(d.pos, c.target).multiplyScalar(k);
    c.target.add(delta);
    c.object.position.add(delta);
    // turn by writing the camera's tiny offset from the target directly: exact, and
    // keeps the view horizontal (the OrbitControls angle setters only close ~90% of the gap)
    const ox = c.object.position.x - c.target.x;
    const oz = c.object.position.z - c.target.z;
    const az = Math.atan2(ox, oz);
    const dAz = Math.atan2(Math.sin(d.az - az), Math.cos(d.az - az));
    const next = az + dAz * k;
    c.object.position.set(c.target.x + 0.01 * Math.sin(next), c.target.y, c.target.z + 0.01 * Math.cos(next));
    c.update();
    if (delta.length() < 0.01 && Math.abs(dAz) < 0.004) dest.current = null;
  });

  if (session) return null;
  return (
    <OrbitControls
      ref={controls}
      target={ROOM_CENTER}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={-0.35}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
      onStart={() => {
        dest.current = null;
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
    // mutating the R3F camera is the intended way to change its projection
    // eslint-disable-next-line react-hooks/immutability
    cam.fov = size.width / size.height < 1 ? 92 : 70;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

/** Mirrors the XR session into the store so DOM overlays (detail sheet) can hide in VR. */
function XRFlag() {
  const session = useXR((s) => s.session);
  const setInVR = useVRStore((s) => s.setInVR);
  useEffect(() => {
    setInVR(Boolean(session));
  }, [session, setInVR]);
  return null;
}

function Origin() {
  const origin = useVRStore((s) => s.origin);
  return <XROrigin position={origin} />;
}

export default function VRScene({ data }: { data: VRData }) {
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [webgl, setWebgl] = useState(true);
  const [dpr, setDpr] = useState<[number, number]>([1, 1.75]);

  useEffect(() => {
    const probe = document.createElement("canvas");
    // one-off browser capability probe (cannot run during SSR)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(Boolean(probe.getContext("webgl2") || probe.getContext("webgl")));
    // phones/tablets: cap the pixel ratio to keep the frame rate up
    if (window.matchMedia("(max-width: 1023px)").matches) setDpr([1, 1.5]);

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
        <Canvas camera={{ position: [0, 1.6, 0.01], fov: 70 }} dpr={dpr}>
          <ResponsiveFov />
          <XR store={xrStore}>
            <Origin />
            <XRFlag />
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
          <span className="hidden sm:inline">Classic&nbsp;</span>2D
        </Link>
      </div>
    </div>
  );
}
