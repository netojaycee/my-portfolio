import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VRExperience } from "@/components/vr/VRExperience";
import type { VRData } from "@/components/vr/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VR Showcase",
  description:
    "Walk through John Edeh's portfolio in 3D — or put on a headset and step inside it. Built with WebXR, React Three Fiber and the same database as the main site.",
  robots: { index: false, follow: true },
};

async function getVRData(): Promise<VRData> {
  const [projects, skills, experience] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: {
        stack: true,
        highlights: { orderBy: { order: "asc" } },
      },
    }),
    prisma.skillCategory.findMany({
      orderBy: { order: "asc" },
      include: { skills: { orderBy: { order: "asc" } } },
    }),
    prisma.experience.findMany({
      orderBy: { order: "asc" },
      include: { bullets: { orderBy: { order: "asc" }, take: 1 } },
    }),
  ]);

  return {
    projects: projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      liveUrl: p.liveUrl,
      status: p.status,
      stack: p.stack.map((s) => s.name),
      highlights: p.highlights.map((h) => h.text),
    })),
    skills: skills.map((c) => ({
      id: c.id,
      title: c.title,
      skills: c.skills.map((s) => ({ name: s.name, level: s.level })),
    })),
    experience: experience.map((e) => ({
      id: e.id,
      role: e.role,
      company: e.company,
      period: e.period,
      current: e.current,
      bullet: e.bullets[0]?.text ?? "",
    })),
  };
}

export default async function VRPage() {
  const data = await getVRData();
  return <VRExperience data={data} />;
}
