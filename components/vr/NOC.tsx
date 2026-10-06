"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Mesh, MeshBasicMaterial } from "three";
import { Color } from "three";
import { C, FONT, FONT_BOLD, useHover } from "./parts";
import { trackEvent } from "@/lib/track";

// Replay of the real incident: full-site 504, host load average 150 → 23, fixed
// live in ~15 minutes. The racks in the room read this signal so their LEDs go
// red during the outage and green once it's resolved.
export const incidentSignal = { load: 150 };

const BARS = 37;
const RUN = 11; // seconds for the replay
const HOLD = 5; // seconds to hold the resolved state
const PEAK = 150;
const FIXED = 23;

const LOG = [
  "› 504 · prod down · load avg 150",
  "› vmstat/docker stats: one pool starved",
  "› 2 commits, 1 memory ceiling",
  "› hotfix live · permanent fix → CI",
  "✓ load 150→23 · mem 5.97GiB→801MB",
];
const LOG_AT = [0, 0.2, 0.45, 0.75, 0.97];

function loadAt(p: number) {
  if (p < 0.1) return PEAK;
  const q = Math.min(1, (p - 0.1) / 0.75);
  const eased = q * q * (3 - 2 * q);
  return FIXED + (PEAK - FIXED) * (1 - eased);
}

export function levelColor(load: number) {
  if (load > 100) return C.red;
  if (load > 50) return C.amber;
  return C.green;
}

export function NOC({ position }: { position: [number, number, number] }) {
  const clock = useThree((s) => s.clock);
  const t0 = useRef(0);
  const acc = useRef(0);
  const bars = useRef<(Mesh | null)[]>([]);
  const color = useRef(new Color());
  const [view, setView] = useState({ load: PEAK, lines: 1, min: 0 });
  const { hovered, handlers } = useHover();

  useFrame((_, delta) => {
    const cycle = RUN + HOLD;
    const tc = (clock.elapsedTime - t0.current) % cycle;
    const p = Math.min(1, tc / RUN);
    const load = loadAt(p);
    incidentSignal.load = load;

    for (let i = 0; i < BARS; i++) {
      const m = bars.current[i];
      if (!m) continue;
      const pi = i / (BARS - 1);
      const visible = pi <= p;
      const h = visible ? Math.max(0.02, (loadAt(pi) / PEAK) * 1.1) : 0.001;
      m.scale.y = h;
      m.position.y = -0.62 + h / 2;
      (m.material as MeshBasicMaterial).color.set(color.current.set(levelColor(loadAt(pi))));
    }

    acc.current += delta;
    if (acc.current > 0.1) {
      acc.current = 0;
      const lines = LOG_AT.filter((a) => p >= a).length;
      const next = { load: Math.round(load), lines, min: Math.round(p * 15) };
      setView((v) => (v.load === next.load && v.lines === next.lines && v.min === next.min ? v : next));
    }
  });

  const status = view.load > 100 ? "504 OUTAGE" : view.load > FIXED + 3 ? "RECOVERING" : "RESOLVED";
  const sColor = levelColor(view.load);

  return (
    <group position={position}>
      <mesh
        {...handlers}
        onClick={(e) => {
          e.stopPropagation();
          t0.current = clock.elapsedTime;
          trackEvent("noc_replay");
        }}
      >
        <boxGeometry args={[8.8, 2.1, 0.06]} />
        <meshStandardMaterial color="#0d0d14" emissive={C.accent} emissiveIntensity={hovered ? 0.12 : 0.03} />
      </mesh>
      <mesh position={[0, 1.05, 0.04]}>
        <boxGeometry args={[8.8, 0.03, 0.02]} />
        <meshBasicMaterial color={C.accent} />
      </mesh>

      <group position={[0, 0, 0.05]}>
        <Text font={FONT_BOLD} fontSize={0.13} color={C.dim} position={[-4.2, 0.9, 0]} anchorX="left" anchorY="middle">
          {"$ ssh prod-web  ·  load average  ·  The Punch Nigeria"}
        </Text>
        <mesh position={[3.0, 0.9, 0]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color={sColor} />
        </mesh>
        <Text font={FONT_BOLD} fontSize={0.12} color={sColor} position={[3.12, 0.9, 0]} anchorX="left" anchorY="middle">
          {status}
        </Text>

        {/* chart */}
        <mesh position={[-2.2, -0.63, 0]}>
          <planeGeometry args={[3.9, 0.01]} />
          <meshBasicMaterial color={C.border} />
        </mesh>
        {Array.from({ length: BARS }, (_, i) => (
          <mesh
            key={i}
            ref={(m) => {
              bars.current[i] = m;
            }}
            position={[-4.0 + i * 0.1, -0.62, 0.01]}
          >
            <boxGeometry args={[0.075, 1, 0.02]} />
            <meshBasicMaterial color={C.red} />
          </mesh>
        ))}

        {/* reading */}
        <Text font={FONT_BOLD} fontSize={0.7} color={sColor} position={[-0.1, 0.3, 0]} anchorX="left" anchorY="middle">
          {String(view.load)}
        </Text>
        <Text font={FONT} fontSize={0.11} color={C.muted} position={[-0.08, -0.22, 0]} anchorX="left" anchorY="middle">
          {`load avg · T+${String(view.min).padStart(2, "0")} min`}
        </Text>
        <Text font={FONT} fontSize={0.1} color={C.muted} position={[-0.08, -0.7, 0]} anchorX="left" anchorY="middle">
          {hovered ? "[ click to replay ]" : "23M pageviews/mo · live incident replay"}
        </Text>

        {/* log */}
        <Text font={FONT} fontSize={0.1} color={C.text} position={[1.35, 0.55, 0]} maxWidth={2.9} anchorX="left" anchorY="top" lineHeight={1.7}>
          {LOG.slice(0, view.lines).join("\n")}
        </Text>
      </group>
    </group>
  );
}
