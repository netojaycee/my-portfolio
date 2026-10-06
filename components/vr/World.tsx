"use client";

import { useMemo, type ReactNode } from "react";
import { Text, Sparkles } from "@react-three/drei";
import { TeleportTarget } from "@react-three/xr";
import { useVRStore } from "./store";
import { NOC } from "./NOC";
import { Racks } from "./Racks";
import {
  ActionButton,
  C,
  FONT,
  FONT_BOLD,
  HALF,
  HEIGHT,
  ROOM,
  Tile,
  Wall,
  clip,
} from "./parts";
import { CONTACT } from "./content";
import type { DetailItem, VRData, VRExperience, VRProject, VRSkillCategory } from "./types";

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
        <mesh rotation-x={-Math.PI / 2}>
          <planeGeometry args={[ROOM, ROOM]} />
          <meshStandardMaterial color={C.surface} roughness={0.9} metalness={0.1} />
        </mesh>
      </TeleportTarget>
      <gridHelper args={[ROOM, ROOM * 2, C.accent, C.border]} position-y={0.01} />

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

      {[-HALF + 0.02, HALF - 0.02].map((z, i) => (
        <mesh key={i} position={[0, 0.05, z]}>
          <boxGeometry args={[ROOM, 0.04, 0.04]} />
          <meshBasicMaterial color={C.accent} />
        </mesh>
      ))}

      <Sparkles count={40} scale={[ROOM, HEIGHT, ROOM]} position-y={HEIGHT / 2} size={2} speed={0.2} color={C.accent} opacity={0.5} />
    </group>
  );
}

function Heading({ children, y, size = 0.3 }: { children: string; y: number; size?: number }) {
  return (
    <Text font={FONT_BOLD} fontSize={size} color={C.text} position={[0, y, 0.05]} anchorX="center" anchorY="middle">
      {children}
    </Text>
  );
}

function Panel({ position, width, height, highlight = false, children }: { position: [number, number, number]; width: number; height: number; highlight?: boolean; children: ReactNode }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial color={C.surface2} roughness={0.7} emissive={C.accent} emissiveIntensity={highlight ? 0.07 : 0} />
      </mesh>
      <mesh position={[-width / 2 + 0.02, 0, 0.03]}>
        <boxGeometry args={[0.04, height, 0.02]} />
        <meshBasicMaterial color={highlight ? C.accent : C.border} />
      </mesh>
      <group position={[-width / 2 + 0.18, height / 2 - 0.16, 0.04]}>{children}</group>
    </group>
  );
}

/* ───────────── FRONT: Punch proof ───────────── */

function ProofWall({ data }: { data: VRData }) {
  const n = data.incidents.length;
  return (
    <Wall side="front">
      <Text font={FONT_BOLD} fontSize={0.46} color={C.text} position={[0, 5.2, 0.05]} anchorX="center" anchorY="middle">
        JOHN EDEH
      </Text>
      <Text font={FONT} fontSize={0.15} color={C.accent} position={[0, 4.86, 0.05]} anchorX="center" anchorY="middle">
        {"The Punch Nigeria Ltd · running production infra for 23M+ pageviews/month"}
      </Text>
      <NOC position={[0, 3.65, 0.05]} />
      {data.incidents.map((inc, i) => (
        <Tile key={inc.id} id={inc.id} width={1.65} height={2.2} position={[(i - (n - 1) / 2) * 1.76, 1.4, 0.05]} highlight>
          <Text font={FONT_BOLD} fontSize={0.22} color={C.accent} maxWidth={1.38} anchorX="left" anchorY="top" lineHeight={1.05}>
            {inc.metric}
          </Text>
          <Text font={FONT} fontSize={0.082} color={C.muted} position={[0, -0.55, 0]} maxWidth={1.38} anchorX="left" anchorY="top">
            {inc.metricLabel}
          </Text>
          <Text font={FONT_BOLD} fontSize={0.125} color={C.text} position={[0, -0.9, 0]} maxWidth={1.38} anchorX="left" anchorY="top" lineHeight={1.15}>
            {inc.title}
          </Text>
          <Text font={FONT} fontSize={0.085} color={C.dim} position={[0, -1.3, 0]} maxWidth={1.38} anchorX="left" anchorY="top" lineHeight={1.4}>
            {inc.summary}
          </Text>
          <Text font={FONT} fontSize={0.075} color={C.muted} position={[0, -1.85, 0]} anchorX="left" anchorY="top">
            [ read the story ]
          </Text>
        </Tile>
      ))}
    </Wall>
  );
}

/* ───────────── RIGHT: projects ───────────── */

function ProjectsWall({ projects }: { projects: VRProject[] }) {
  return (
    <Wall side="right">
      <Heading y={4.55}>{"$ ls ~/shipped"}</Heading>
      {projects.slice(0, 8).map((p, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <Tile key={p.id} id={`p-${p.id}`} width={2.4} height={1.3} position={[(col - 1.5) * 2.7, row === 0 ? 3.15 : 1.65, 0.05]}>
            <mesh position={[0.05, -0.05, 0]}>
              <circleGeometry args={[0.045, 16]} />
              <meshBasicMaterial color={statusColor(p.status)} />
            </mesh>
            <Text font={FONT} fontSize={0.075} color={C.dim} position={[0.14, -0.05, 0]} anchorX="left" anchorY="middle">
              {statusLabel(p.status)}
            </Text>
            <Text font={FONT_BOLD} fontSize={0.15} color={C.text} position={[0, -0.2, 0]} maxWidth={2.1} anchorX="left" anchorY="top">
              {clip(p.name, 26)}
            </Text>
            <Text font={FONT} fontSize={0.082} color={C.dim} position={[0, -0.45, 0]} maxWidth={2.1} anchorX="left" anchorY="top" lineHeight={1.35}>
              {clip(p.tagline, 62)}
            </Text>
            <Text font={FONT} fontSize={0.07} color={C.accent} position={[0, -0.92, 0]} maxWidth={2.1} anchorX="left" anchorY="top">
              {p.stack.slice(0, 4).join(" · ")}
            </Text>
          </Tile>
        );
      })}
    </Wall>
  );
}

/* ───────────── LEFT: skills ───────────── */

function SkillsWall({ categories }: { categories: VRSkillCategory[] }) {
  return (
    <Wall side="left">
      <Heading y={4.55}>{"$ cat skills.json"}</Heading>
      {categories.slice(0, 6).map((cat, i) => {
        const expert = cat.skills.filter((s) => s.level === "EXPERT");
        const rest = cat.skills.filter((s) => s.level !== "EXPERT");
        return (
          <Panel key={cat.id} position={[((i % 3) - 1) * 3.6, i < 3 ? 3.1 : 1.3, 0.05]} width={3.4} height={1.55}>
            <Text font={FONT_BOLD} fontSize={0.14} color={C.accent} anchorX="left" anchorY="top">
              {cat.title}
            </Text>
            <Text font={FONT} fontSize={0.095} color={C.text} position={[0, -0.27, 0]} maxWidth={3.0} anchorX="left" anchorY="top" lineHeight={1.5}>
              {expert.slice(0, 7).map((s) => s.name).join(" · ")}
            </Text>
            <Text font={FONT} fontSize={0.08} color={C.muted} position={[0, -0.95, 0]} maxWidth={3.0} anchorX="left" anchorY="top" lineHeight={1.5}>
              {rest.slice(0, 5).map((s) => s.name).join(" · ")}
            </Text>
          </Panel>
        );
      })}
    </Wall>
  );
}

/* ───────────── BACK: career + contact ───────────── */

function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function CareerWall({ entries }: { entries: VRExperience[] }) {
  const n = Math.min(entries.length, 4);
  return (
    <Wall side="back">
      <Heading y={4.85}>{"$ git log --career"}</Heading>
      {entries.slice(0, 4).map((e, i) => (
        <Panel key={e.id} position={[(i - (n - 1) / 2) * 2.9, 3.4, 0.05]} width={2.7} height={2.0} highlight={e.current}>
          <mesh position={[0.05, -0.05, 0]}>
            <circleGeometry args={[0.05, 16]} />
            <meshBasicMaterial color={e.current ? C.green : C.muted} />
          </mesh>
          <Text font={FONT_BOLD} fontSize={0.125} color={C.text} position={[0.2, 0, 0]} maxWidth={2.2} anchorX="left" anchorY="top">
            {e.role}
          </Text>
          <Text font={FONT} fontSize={0.105} color={C.accent} position={[0, -0.3, 0]} maxWidth={2.4} anchorX="left" anchorY="top">
            {e.company}
          </Text>
          <Text font={FONT} fontSize={0.08} color={C.muted} position={[0, -0.5, 0]} anchorX="left" anchorY="top">
            {e.period}
          </Text>
          <Text font={FONT} fontSize={0.078} color={C.dim} position={[0, -0.75, 0]} maxWidth={2.35} anchorX="left" anchorY="top" lineHeight={1.4}>
            {clip(e.bullet, 150)}
          </Text>
        </Panel>
      ))}

      <Text font={FONT_BOLD} fontSize={0.4} color={C.text} position={[0, 1.75, 0.05]} anchorX="center" anchorY="middle">
        {"Let's work together."}
      </Text>
      <Text font={FONT} fontSize={0.125} color={C.dim} position={[0, 1.3, 0.05]} anchorX="center" anchorY="middle">
        Open to full-time roles, contracts and hard production problems · remote or hybrid
      </Text>
      <ActionButton label="✉  Email me" primary position={[-3.15, 0.65, 0.05]} onActivate={() => (window.location.href = `mailto:${CONTACT.email}`)} />
      <ActionButton label="↓  Download CV" position={[-1.05, 0.65, 0.05]} onActivate={() => openUrl(CONTACT.cv)} />
      <ActionButton label="in  LinkedIn" position={[1.05, 0.65, 0.05]} onActivate={() => openUrl(CONTACT.linkedin)} />
      <ActionButton label="GitHub" position={[3.15, 0.65, 0.05]} onActivate={() => openUrl(CONTACT.github)} />
    </Wall>
  );
}

/* ───────────── Detail panel ───────────── */

function DetailPanel({ items }: { items: Map<string, DetailItem> }) {
  const selectedId = useVRStore((s) => s.selectedId);
  const pose = useVRStore((s) => s.panelPose);
  const select = useVRStore((s) => s.select);
  const item = selectedId ? items.get(selectedId) : undefined;
  if (!item) return null;

  return (
    <group position={pose.position} rotation-y={pose.rotationY} scale={0.8}>
      <mesh>
        <boxGeometry args={[4.3, 3.3, 0.05]} />
        <meshStandardMaterial color={C.surface} emissive={C.accent} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 1.65, 0.03]}>
        <boxGeometry args={[4.3, 0.04, 0.02]} />
        <meshBasicMaterial color={C.accent} />
      </mesh>
      <group position={[-1.95, 1.45, 0.04]}>
        <Text font={FONT_BOLD} fontSize={0.25} color={C.text} maxWidth={3.9} anchorX="left" anchorY="top">
          {item.title}
        </Text>
        <Text font={FONT} fontSize={0.12} color={C.accent} position={[0, -0.38, 0]} maxWidth={3.9} anchorX="left" anchorY="top">
          {item.subtitle}
        </Text>
        <Text font={FONT} fontSize={0.1} color={C.dim} position={[0, -0.75, 0]} maxWidth={3.9} anchorX="left" anchorY="top" lineHeight={1.45}>
          {item.body}
        </Text>
        {item.bullets.length > 0 && (
          <Text font={FONT} fontSize={0.09} color={C.text} position={[0, -1.95, 0]} maxWidth={3.9} anchorX="left" anchorY="top" lineHeight={1.45}>
            {item.bullets.map((b) => `▸ ${clip(b, 120)}`).join("\n")}
          </Text>
        )}
        <Text font={FONT} fontSize={0.082} color={C.muted} position={[0, -2.55, 0]} maxWidth={3.9} anchorX="left" anchorY="top">
          {item.footer}
        </Text>
      </group>
      <ActionButton label="[ close ]" position={[1.55, -1.45, 0.04]} width={1.0} onActivate={() => select(null)} />
      {item.url && <ActionButton label="open live ↗" primary position={[0.4, -1.45, 0.04]} width={1.3} onActivate={() => openUrl(item.url ?? "")} />}
    </group>
  );
}

function buildItems(data: VRData): Map<string, DetailItem> {
  const m = new Map<string, DetailItem>();
  for (const inc of data.incidents) {
    m.set(inc.id, {
      id: inc.id,
      title: inc.title,
      subtitle: `${inc.metric} — ${inc.metricLabel}`,
      body: clip(inc.detail, 520),
      bullets: [],
      footer: "The Punch Nigeria Ltd · production infrastructure",
      url: null,
    });
  }
  for (const p of data.projects) {
    m.set(`p-${p.id}`, {
      id: `p-${p.id}`,
      title: p.name,
      subtitle: p.tagline,
      body: clip(p.description, 300),
      bullets: p.highlights.slice(0, 2),
      footer: p.stack.slice(0, 8).join(" · "),
      url: p.liveUrl,
    });
  }
  return m;
}

export function World({ data }: { data: VRData }) {
  const items = useMemo(() => buildItems(data), [data]);

  return (
    <>
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 9, 20]} />
      <ambientLight intensity={0.75} />
      <pointLight position={[0, HEIGHT - 0.6, 0]} intensity={16} color="#ffffff" />
      <pointLight position={[0, 2, -HALF + 1.5]} intensity={9} color={C.accent} />

      <Room />
      <Racks />
      <ProofWall data={data} />
      <ProjectsWall projects={data.projects} />
      <SkillsWall categories={data.skills} />
      <CareerWall entries={data.experience} />
      <DetailPanel items={items} />
    </>
  );
}
