import type { VRData } from "./types";

// Single source of truth for where things sit in the room, shared by the 3D
// scene (World) and the guided tour used on small screens (WallNav).

export const ROOM = 12;
export const HALF = ROOM / 2;
export const HEIGHT = 5.6;

export type Side = "front" | "right" | "left" | "back";

export const WALL_FRAME = {
  front: { base: [0, 0, -HALF], rotationY: 0 },
  right: { base: [HALF, 0, 0], rotationY: -Math.PI / 2 },
  left: { base: [-HALF, 0, 0], rotationY: Math.PI / 2 },
  back: { base: [0, 0, HALF], rotationY: Math.PI },
} as const;

export const NOC_POS: [number, number] = [0, 3.65];
export const incidentPos = (i: number, n: number): [number, number] => [(i - (n - 1) / 2) * 1.76, 1.4];
export const projectPos = (i: number): [number, number] => [((i % 4) - 1.5) * 2.7, [4.0, 2.55, 1.1][Math.floor(i / 4)] ?? 1.1];
export const skillPos = (i: number): [number, number] => [((i % 3) - 1) * 3.6, i < 3 ? 3.1 : 1.3];
export const careerPos = (i: number, n: number): [number, number] => [(i - (n - 1) / 2) * 2.9, 3.4];

export type Stop = {
  id: string;
  wall: Side;
  group: "proof" | "projects" | "skills" | "career";
  label: string;
  x: number;
  y: number;
  /** distance from the wall the camera stops at (smaller = bigger text) */
  standoff: number;
};

const GROUP_OF: Record<Side, Stop["group"]> = { front: "proof", right: "projects", left: "skills", back: "career" };

export const GROUP_LABEL: Record<Stop["group"], string> = {
  proof: "Punch proof",
  projects: "Projects",
  skills: "Skills",
  career: "Career + contact",
};

/** Ordered tour stops: Punch proof first, then projects, skills, career/contact. */
export function buildStops(d: VRData): Stop[] {
  const stops: Stop[] = [];
  const add = (wall: Side, id: string, label: string, [x, y]: [number, number], standoff: number) =>
    stops.push({ id, wall, group: GROUP_OF[wall], label, x, y, standoff });

  add("front", "noc", "Live incident replay · 504 outage", NOC_POS, 4.8);
  d.incidents.forEach((inc, i) => add("front", inc.id, inc.title, incidentPos(i, d.incidents.length), 2.6));
  d.projects.slice(0, 12).forEach((p, i) => add("right", `p-${p.id}`, p.name, projectPos(i), 2.4));
  d.skills.slice(0, 6).forEach((c, i) => add("left", `s-${c.id}`, c.title, skillPos(i), 3.4));
  const n = Math.min(d.experience.length, 4);
  d.experience.slice(0, 4).forEach((e, i) => add("back", `e-${e.id}`, `${e.role} · ${e.company}`, careerPos(i, n), 3.0));
  add("back", "contact-a", "Hire me · Email and CV", [-2.1, 1.2], 4.4);
  add("back", "contact-b", "LinkedIn and GitHub", [2.1, 1.2], 4.4);
  return stops;
}

/** World-space camera pose that frames a stop head-on. */
export function stopPose(s: Stop): { pos: [number, number, number]; azimuth: number } {
  const f = WALL_FRAME[s.wall];
  const th = f.rotationY;
  const lim = HALF - 0.6;
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const x = f.base[0] + s.x * Math.cos(th) + s.standoff * Math.sin(th);
  const z = f.base[2] - s.x * Math.sin(th) + s.standoff * Math.cos(th);
  // look slightly up at the item so it sits above the bottom HUD
  const y = clamp(s.y - 0.5, 1.0, 3.2);
  return { pos: [clamp(x, -lim, lim), y, clamp(z, -lim, lim)], azimuth: th };
}
