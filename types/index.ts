// Shared TypeScript types for the John Edeh portfolio
// All DB-facing types are derived from Prisma where possible.
// These types extend or alias Prisma payloads for component usage.

export type ActionResult = {
  success: boolean;
  error?: string;
};

export type ProjectStatus = "LIVE" | "IN_DEVELOPMENT" | "PRIVATE";
export type ProjectCategory =
  | "SAAS"
  | "MARKETPLACE"
  | "ECOMMERCE"
  | "MANAGEMENT"
  | "DEVOPS";
export type StackCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DEVOPS"
  | "DATABASE"
  | "INFRA";
export type SkillLevel = "EXPERT" | "PROFICIENT" | "FAMILIAR";

export type ProjectImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
  projectId: string;
};

export type StackItem = {
  id: string;
  name: string;
  category: StackCategory;
  projectId: string;
};

export type Highlight = {
  id: string;
  text: string;
  order: number;
  projectId: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  caseStudy: string;
  liveUrl: string | null;
  githubUrl: string | null;
  status: ProjectStatus;
  category: ProjectCategory;
  featured: boolean;
  published: boolean;
  order: number;
  images: ProjectImage[];
  stack: StackItem[];
  highlights: Highlight[];
  createdAt: Date;
  updatedAt: Date;
};

export type Skill = {
  id: string;
  name: string;
  level: SkillLevel;
  order: number;
  categoryId: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  icon: string;
  description: string;
  order: number;
  skills: Skill[];
};

export type Bullet = {
  id: string;
  text: string;
  order: number;
  experienceId: string;
};

export type Tag = {
  id: string;
  name: string;
  experienceId: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  order: number;
  bullets: Bullet[];
  tags: Tag[];
};
