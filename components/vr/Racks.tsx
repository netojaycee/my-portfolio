"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { MeshBasicMaterial } from "three";
import { Color } from "three";
import { C } from "./parts";
import { incidentSignal, levelColor } from "./NOC";

const ROWS = 12;
const COLS = 4;

function Rack({ position, rotationY, seed }: { position: [number, number, number]; rotationY: number; seed: number }) {
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const base = useRef(new Color());

  // LED colour follows the incident replay; each LED blinks on its own phase.
  useFrame((state) => {
    base.current.set(levelColor(incidentSignal.load));
    const t = state.clock.elapsedTime;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const blink = 0.35 + 0.65 * Math.abs(Math.sin(t * (1.3 + ((i * 7 + seed) % 5) * 0.4) + i));
      m.color.copy(base.current).multiplyScalar(blink);
    });
  });

  return (
    <group position={position} rotation-y={rotationY} scale={0.72}>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.85, 2.3, 0.75]} />
        <meshStandardMaterial color="#0d0d14" roughness={0.5} metalness={0.4} />
      </mesh>
      {Array.from({ length: ROWS }, (_, r) => (
        <group key={r} position={[0, 0.3 + r * 0.17, 0.38]}>
          <mesh>
            <planeGeometry args={[0.7, 0.12]} />
            <meshBasicMaterial color={C.surface2} />
          </mesh>
          {Array.from({ length: COLS }, (_, c) => (
            <mesh key={c} position={[-0.25 + c * 0.1, 0, 0.005]}>
              <circleGeometry args={[0.025, 8]} />
              <meshBasicMaterial
                ref={(m) => {
                  mats.current[r * COLS + c] = m;
                }}
                color={C.green}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function Racks() {
  const angle = 0.3;
  return (
    <>
      <Rack position={[5.45, 0, -5.55]} rotationY={-angle} seed={1} />
      <Rack position={[-5.45, 0, -5.55]} rotationY={angle} seed={3} />
    </>
  );
}
