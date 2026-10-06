import type { ProjectStatus, SkillLevel } from "@/types";

// Plain, serialisable slices of the Prisma models — safe to pass from the
// server page into the client-only 3D scene.
export type VRProject = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  liveUrl: string | null;
  status: ProjectStatus;
  stack: string[];
  highlights: string[];
};

export type VRSkillCategory = {
  id: string;
  title: string;
  skills: { name: string; level: SkillLevel }[];
};

export type VRExperience = {
  id: string;
  role: string;
  company: string;
  period: string;
  current: boolean;
  bullet: string;
};

export type VRIncident = {
  id: string;
  metric: string;
  metricLabel: string;
  title: string;
  summary: string;
  detail: string;
};

export type VRData = {
  incidents: VRIncident[];
  projects: VRProject[];
  skills: VRSkillCategory[];
  experience: VRExperience[];
};

/** Anything that can open in the big in-world detail panel. */
export type DetailItem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  footer: string;
  url: string | null;
};
