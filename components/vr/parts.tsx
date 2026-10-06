"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Vector3, MathUtils } from "three";
import type { Group } from "three";
import { useVRStore, type PanelPose } from "./store";
import { trackEvent } from "@/lib/track";

export const FONT = "/fonts/jetbrains-mono-500.woff";
export const FONT_BOLD = "/fonts/jetbrains-mono-700.woff";

export const C = {
  bg: "#0a0a0f",
  surface: "#111118",
  surface2: "#16161f",
  border: "#1e1e2e",
  accent: "#f97316",
  text: "#e2e8f0",
  muted: "#64748b",
  dim: "#94a3b8",
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  blue: "#60a5fa",
};

import { HALF } from "./layout";
export { ROOM, HALF, HEIGHT } from "./layout";

export function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

const WALLS = {
  front: { position: [0, 0, -HALF], rotationY: 0 },
  right: { position: [HALF, 0, 0], rotationY: -Math.PI / 2 },
  left: { position: [-HALF, 0, 0], rotationY: Math.PI / 2 },
  back: { position: [0, 0, HALF], rotationY: Math.PI },
} as const;

/**
 * Local frame of a wall: +x is the viewer's right, +y up, +z toward the room.
 * Children are laid out in this frame so every wall uses the same maths.
 */
export function Wall({ side, children }: { side: keyof typeof WALLS; children: ReactNode }) {
  const w = WALLS[side];
  return (
    <group position={[...w.position]} rotation-y={w.rotationY}>
      {children}
    </group>
  );
}

/** Pose that puts the detail panel ~3m in front of wherever the viewer is looking. */
export function usePanelPose() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  return useCallback((): PanelPose => {
    const dir = new Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    if (dir.lengthSq() < 1e-4) dir.set(0, 0, -1);
    dir.normalize();
    const pos = new Vector3();
    camera.getWorldPosition(pos);
    return {
      position: [pos.x + dir.x * 3.1, Math.max(1.5, pos.y) + (size.width / size.height < 1 ? 0.9 : 0.55), pos.z + dir.z * 3.1],
      rotationY: Math.atan2(-dir.x, -dir.z),
    };
  }, [camera, size]);
}

export function useHover() {
  const [hovered, setHovered] = useState(false);
  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = "";
    },
  };
  return { hovered, handlers };
}

/**
 * Clickable card on a wall. `position` is the card centre in wall space.
 * Children are laid out from the card's top-left corner.
 */
export function Tile({
  id,
  label,
  width,
  height,
  position,
  highlight = false,
  children,
}: {
  id: string;
  label?: string;
  width: number;
  height: number;
  position: [number, number, number];
  highlight?: boolean;
  children: ReactNode;
}) {
  const select = useVRStore((s) => s.select);
  const selected = useVRStore((s) => s.selectedId === id);
  const poseFor = usePanelPose();
  const { hovered, handlers } = useHover();
  const group = useRef<Group>(null);
  const [phase] = useState(() => Math.random() * Math.PI * 2);
  const active = hovered || selected;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.scale.setScalar(MathUtils.damp(g.scale.x, active ? 1.06 : 1, 8, delta));
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.02;
  });

  return (
    <group position={position}>
      <group ref={group}>
        <mesh
          {...handlers}
          onClick={(e) => {
            e.stopPropagation();
            if (selected) select(null);
            else {
              select(id, poseFor());
              trackEvent("card_open", { card: label ?? id, kind: id.startsWith("inc-") ? "incident" : id.startsWith("p-") ? "project" : id.startsWith("s-") ? "skills" : "career", where: "3d" });
            }
          }}
        >
          <boxGeometry args={[width, height, 0.06]} />
          <meshStandardMaterial color={C.surface2} emissive={C.accent} emissiveIntensity={active ? 0.28 : highlight ? 0.08 : 0} roughness={0.6} />
        </mesh>
        <mesh position={[-width / 2 + 0.02, 0, 0.035]}>
          <boxGeometry args={[0.04, height, 0.02]} />
          <meshBasicMaterial color={active || highlight ? C.accent : C.border} />
        </mesh>
        <group position={[-width / 2 + 0.16, height / 2 - 0.16, 0.05]}>{children}</group>
      </group>
    </group>
  );
}

/** Flat button centred on `position`. */
export function ActionButton({
  label,
  position,
  width = 1.8,
  primary = false,
  onActivate,
}: {
  label: string;
  position: [number, number, number];
  width?: number;
  primary?: boolean;
  onActivate: () => void;
}) {
  const { hovered, handlers } = useHover();
  const lit = hovered || primary;
  return (
    <group position={position}>
      <mesh
        {...handlers}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <planeGeometry args={[width, 0.34]} />
        <meshBasicMaterial color={lit ? C.accent : C.surface2} />
      </mesh>
      <Text font={FONT_BOLD} fontSize={0.115} color={lit ? "#000000" : C.text} position={[0, 0, 0.005]} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}
