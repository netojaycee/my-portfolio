"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Sparkles } from "@react-three/drei";
import { TeleportTarget } from "@react-three/xr";
import type { Group } from "three";
import { MathUtils } from "three";
import { useVRStore } from "./store";
import type { VRData, VRExperience, VRProject, VRSkillCategory } from "./types";

const FONT = "/fonts/jetbrains-mono-500.woff";
const FONT_BOLD = "/fonts/jetbrains-mono-700.woff";

const C = {
  bg: "#0a0a0f",
  surface: "#111118",
  surface2: "#16161f",
  border: "#1e1e2e",
  accent: "#f97316",
  text: "#e2e8f0",
  muted: "#64748b",
  dim: "#94a3b8",
  green: "#34d399",
  blue: "#60a5fa",
};

const ROOM = 14;
const HALF = ROOM / 2;
const HEIGHT = 5;

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function statusColor(status: VRProject["status"]) {
  if (status === "LIVE") return C.green;
  if (status === "IN_DEVELOPMENT") return C.accent;
  return C.muted;
}

function statusLabel(status: VRProject["status"]) {
  if (status === "LIVE") return "LIVE";
  if (status === "IN_DEVELOPMENT") return "IN DEV";
  return "PRIVATE";
}

/** Dark room: floor (teleport target), walls, grid, ambient particles. */
function Room() {
  const setOrigin = useVRStore((s) => s.setOrigin);

  return (
    <group>
      <TeleportTarget onTeleport={(p) => setOrigin([p.x, 0, p.z])}>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[ROOM, ROOM]} />
          <meshStandardMaterial color={C.surface} roughness={0.9} metalness={0.1} />
        </mesh>
      </TeleportTarget>
      <gridHelper args={[ROOM, ROOM * 2, C.accent, C.border]} position-y={0.01} />

      {/* walls + ceiling */}
      {(
        [
          { p: [0, HEIGHT / 2, -HALF], r: [0, 0, 0] },
          { p: [0, HEIGHT / 2, HALF], r: [0, Math.PI, 0] },
          { p: [-HALF, HEIGHT / 2, 0], r: [0, Math.PI / 2, 0] },
          { p: [HALF, HEIGHT / 2, 0], r: [0, -Math.PI / 2, 0] },
        ] as const
      ).map((w, i) => (
        <mesh key={i} position={[...w.p]} rotation={[...w.r]}>
          <planeGeometry args={[ROOM, HEIGHT]} />
          <meshStandardMaterial color={C.bg} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, HEIGHT, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[ROOM, ROOM]} />
        <meshStandardMaterial color={C.bg} />
      </mesh>

      {/* accent light strips along the wall bases */}
      {[-HALF + 0.02, HALF - 0.02].map((z, i) => (
        <mesh key={i} position={[0, 0.05, z]}>
          <boxGeometry args={[ROOM, 0.04, 0.04]} />
          <meshBasicMaterial color={C.accent} />
        </mesh>
      ))}

      <Sparkles count={60} scale={[ROOM, HEIGHT, ROOM]} position-y={HEIGHT / 2} size={2} speed={0.2} color={C.accent} opacity={0.5} />
    </group>
  );
}

function Title() {
  return (
    <group position={[0, 4.4, -HALF + 0.05]}>
      <Text font={FONT_BOLD} fontSize={0.55} color={C.text} anchorX="center" anchorY="middle">
        JOHN EDEH
      </Text>
      <Text font={FONT} fontSize={0.2} color={C.accent} position={[0, -0.5, 0]} anchorX="center" anchorY="middle">
        {"$ full-stack & devops engineer — lagos, nigeria"}
      </Text>
    </group>
  );
}

function ProjectCard({ project, position, rotationY }: { project: VRProject; position: [number, number, number]; rotationY: number }) {
  const select = useVRStore((s) => s.select);
  const selected = useVRStore((s) => s.selectedId === project.id);
  const [hovered, setHovered] = useState(false);
  const group = useRef<Group>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const target = (hovered || selected ? 1.08 : 1) * 0.8;
    g.scale.setScalar(MathUtils.damp(g.scale.x, target, 8, delta));
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + phase.current) * 0.04;
  });

  const active = hovered || selected;

  return (
    <group position={position} rotation-y={rotationY}>
      <group ref={group} scale={0.8}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            select(selected ? null : project.id);
          }}
        >
          <boxGeometry args={[2, 2.6, 0.06]} />
          <meshStandardMaterial color={C.surface2} emissive={C.accent} emissiveIntensity={active ? 0.25 : 0} roughness={0.6} />
        </mesh>
        {/* accent left border, like the 2D cards */}
        <mesh position={[-0.99, 0, 0.035]}>
          <boxGeometry args={[0.04, 2.6, 0.02]} />
          <meshBasicMaterial color={active ? C.accent : C.border} />
        </mesh>

        <group position={[0, 0, 0.05]}>
          <mesh position={[-0.82, 1.05, 0]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color={statusColor(project.status)} />
          </mesh>
          <Text font={FONT} fontSize={0.1} color={C.dim} position={[-0.72, 1.05, 0]} anchorX="left" anchorY="middle">
            {statusLabel(project.status)}
          </Text>
          <Text font={FONT_BOLD} fontSize={0.2} color={C.text} position={[-0.85, 0.8, 0]} maxWidth={1.7} anchorX="left" anchorY="top" lineHeight={1.1}>
            {project.name}
          </Text>
          <Text font={FONT} fontSize={0.11} color={C.dim} position={[-0.85, 0.2, 0]} maxWidth={1.7} anchorX="left" anchorY="top" lineHeight={1.35}>
            {clip(project.tagline, 80)}
          </Text>
          <Text font={FONT} fontSize={0.09} color={C.accent} position={[-0.85, -0.7, 0]} maxWidth={1.7} anchorX="left" anchorY="top" lineHeight={1.5}>
            {project.stack.slice(0, 5).join(" · ")}
          </Text>
          <Text font={FONT} fontSize={0.09} color={C.muted} position={[-0.85, -1.15, 0]} anchorX="left" anchorY="middle">
            {selected ? "[ selected ]" : "[ select to open ]"}
          </Text>
        </group>
      </group>
    </group>
  );
}

function ProjectArc({ projects }: { projects: VRProject[] }) {
  const radius = 5.6;
  const span = 84; // degrees across the front of the room
  return (
    <>
      {projects.map((p, i) => {
        const a = projects.length === 1 ? 0 : MathUtils.degToRad(-span / 2 + (span / (projects.length - 1)) * i);
        return (
          <ProjectCard
            key={p.id}
            project={p}
            position={[Math.sin(a) * radius, 1.4, -Math.cos(a) * radius]}
            rotationY={-a}
          />
        );
      })}
    </>
  );
}

/** Large in-world panel for the selected project (HTML can't be seen in VR). */
function DetailPanel({ projects }: { projects: VRProject[] }) {
  const selectedId = useVRStore((s) => s.selectedId);
  const select = useVRStore((s) => s.select);
  const project = projects.find((p) => p.id === selectedId);
  if (!project) return null;

  return (
    <group position={[0, 1.8, -3.3]} scale={0.9}>
      <mesh>
        <boxGeometry args={[4.4, 3.1, 0.05]} />
        <meshStandardMaterial color={C.surface} emissive={C.accent} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 1.55, 0.03]}>
        <boxGeometry args={[4.4, 0.04, 0.02]} />
        <meshBasicMaterial color={C.accent} />
      </mesh>
      <group position={[0, 0, 0.04]}>
        <Text font={FONT_BOLD} fontSize={0.26} color={C.text} position={[-2, 1.3, 0]} anchorX="left" anchorY="top">
          {project.name}
        </Text>
        <Text font={FONT} fontSize={0.12} color={C.accent} position={[-2, 0.92, 0]} maxWidth={4} anchorX="left" anchorY="top">
          {project.tagline}
        </Text>
        <Text font={FONT} fontSize={0.1} color={C.dim} position={[-2, 0.55, 0]} maxWidth={4} anchorX="left" anchorY="top" lineHeight={1.45}>
          {clip(project.description, 300)}
        </Text>
        <Text font={FONT} fontSize={0.09} color={C.text} position={[-2, -0.35, 0]} maxWidth={4} anchorX="left" anchorY="top" lineHeight={1.45}>
          {project.highlights
            .slice(0, 2)
            .map((h) => `▸ ${clip(h, 130)}`)
            .join("\n")}
        </Text>
        <Text font={FONT} fontSize={0.085} color={C.muted} position={[-2, -1.3, 0]} maxWidth={4} anchorX="left" anchorY="top">
          {project.stack.slice(0, 8).join(" · ")}
        </Text>

        <PanelButton label="[ close ]" position={[1.45, -1.35, 0]} onActivate={() => select(null)} />
        {project.liveUrl && (
          <PanelButton
            label="[ open live ↗ ]"
            position={[0.2, -1.35, 0]}
            onActivate={() => window.open(project.liveUrl ?? "", "_blank", "noopener,noreferrer")}
          />
        )}
      </group>
    </group>
  );
}

function PanelButton({ label, position, onActivate }: { label: string; position: [number, number, number]; onActivate: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh
        position={[0.5, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        <planeGeometry args={[1.1, 0.26]} />
        <meshBasicMaterial color={hovered ? C.accent : C.surface2} />
      </mesh>
      <Text font={FONT_BOLD} fontSize={0.1} color={hovered ? C.bg : C.text} position={[0.5, 0, 0.005]} anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function WallPanel({ position, rotationY, width, height, children }: { position: [number, number, number]; rotationY: number; width: number; height: number; children: React.ReactNode }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color={C.surface2} roughness={0.7} />
      </mesh>
      <mesh position={[-width / 2 + 0.02, 0, 0.03]}>
        <boxGeometry args={[0.03, height, 0.02]} />
        <meshBasicMaterial color={C.accent} />
      </mesh>
      <group position={[-width / 2 + 0.2, height / 2 - 0.18, 0.04]}>{children}</group>
    </group>
  );
}

function SkillsWall({ categories }: { categories: VRSkillCategory[] }) {
  const zs = [-3.6, 0, 3.6];
  const ys = [3.0, 1.15];
  return (
    <>
      <Text font={FONT_BOLD} fontSize={0.3} color={C.text} position={[-HALF + 0.05, 4.45, 0]} rotation-y={Math.PI / 2} anchorX="center">
        {"$ cat skills.json"}
      </Text>
      {categories.slice(0, 6).map((cat, i) => {
        const expert = cat.skills.filter((s) => s.level === "EXPERT");
        const rest = cat.skills.filter((s) => s.level !== "EXPERT");
        return (
          <WallPanel key={cat.id} position={[-HALF + 0.05, ys[Math.floor(i / 3)], zs[i % 3]]} rotationY={Math.PI / 2} width={3.2} height={1.7}>
            <Text font={FONT_BOLD} fontSize={0.15} color={C.accent} anchorX="left" anchorY="top">
              {cat.title}
            </Text>
            <Text font={FONT} fontSize={0.1} color={C.text} position={[0, -0.28, 0]} maxWidth={2.8} anchorX="left" anchorY="top" lineHeight={1.5}>
              {expert.slice(0, 7).map((s) => s.name).join(" · ")}
            </Text>
            <Text font={FONT} fontSize={0.085} color={C.muted} position={[0, -1.0, 0]} maxWidth={2.8} anchorX="left" anchorY="top" lineHeight={1.5}>
              {rest.slice(0, 5).map((s) => s.name).join(" · ")}
            </Text>
          </WallPanel>
        );
      })}
    </>
  );
}

function ExperienceWall({ entries }: { entries: VRExperience[] }) {
  const n = Math.min(entries.length, 4);
  const spacing = 3;
  return (
    <>
      <Text font={FONT_BOLD} fontSize={0.3} color={C.text} position={[HALF - 0.05, 4.1, 0]} rotation-y={-Math.PI / 2} anchorX="center">
        {"$ git log --career"}
      </Text>
      {entries.slice(0, 4).map((e, i) => {
        const z = (i - (n - 1) / 2) * spacing;
        return (
          <WallPanel key={e.id} position={[HALF - 0.05, 1.9, z]} rotationY={-Math.PI / 2} width={2.7} height={2.6}>
            <mesh position={[0.1, -0.02, 0]}>
              <circleGeometry args={[0.05, 16]} />
              <meshBasicMaterial color={e.current ? C.green : C.muted} />
            </mesh>
            <Text font={FONT_BOLD} fontSize={0.14} color={C.text} position={[0.25, 0, 0]} maxWidth={2.1} anchorX="left" anchorY="top">
              {e.role}
            </Text>
            <Text font={FONT} fontSize={0.11} color={C.accent} position={[0, -0.5, 0]} maxWidth={2.3} anchorX="left" anchorY="top">
              {e.company}
            </Text>
            <Text font={FONT} fontSize={0.09} color={C.muted} position={[0, -0.72, 0]} anchorX="left" anchorY="top">
              {e.period}
            </Text>
            <Text font={FONT} fontSize={0.085} color={C.dim} position={[0, -1.0, 0]} maxWidth={2.3} anchorX="left" anchorY="top" lineHeight={1.45}>
              {clip(e.bullet, 170)}
            </Text>
          </WallPanel>
        );
      })}
    </>
  );
}

function ContactWall() {
  return (
    <group position={[0, 2.2, HALF - 0.05]} rotation-y={Math.PI}>
      <Text font={FONT_BOLD} fontSize={0.45} color={C.text} position={[0, 0.5, 0]} anchorX="center">
        {"Let's work together."}
      </Text>
      <Text font={FONT} fontSize={0.16} color={C.accent} position={[0, -0.1, 0]} anchorX="center">
        netojaycee@gmail.com
      </Text>
      <Text font={FONT} fontSize={0.13} color={C.dim} position={[0, -0.45, 0]} anchorX="center">
        github.com/netojaycee · linkedin.com/in/jc-edeh
      </Text>
    </group>
  );
}

export function World({ data }: { data: VRData }) {
  return (
    <>
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 10, 22]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[0, HEIGHT - 0.5, 0]} intensity={18} color="#ffffff" />
      <pointLight position={[0, 2, -HALF + 1.5]} intensity={10} color={C.accent} />

      <Room />
      <Title />
      <ProjectArc projects={data.projects} />
      <DetailPanel projects={data.projects} />
      <SkillsWall categories={data.skills} />
      <ExperienceWall entries={data.experience} />
      <ContactWall />
    </>
  );
}
