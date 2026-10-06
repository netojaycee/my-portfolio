import { prisma } from "@/lib/prisma";
import { VRExperience } from "@/components/vr/VRExperience";
import { HeroOverlay } from "@/components/vr/HeroOverlay";
import { INCIDENT_META } from "@/components/vr/content";
import type { VRData } from "@/components/vr/types";

// Content is DB-driven; admin actions call revalidatePath("/") so edits show up
// immediately, and the page is otherwise cached for 5 minutes.
export const revalidate = 300;

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
      include: { bullets: { orderBy: { order: "asc" } } },
    }),
  ]);

  // The Punch entry is the strongest proof on the site: its bullets become the
  // incident cards. Headline metrics are static copy; the story text is the DB bullet.
  const punch = experience.find((e) => /punch/i.test(e.company));
  const incidents = INCIDENT_META.flatMap((meta, i) => {
    const text = meta.bullets
      .map((b) => punch?.bullets[b]?.text)
      .filter((t): t is string => Boolean(t))
      .join("\n\n");
    if (!text) return [];
    return [
      {
        id: `inc-${i}`,
        metric: meta.metric,
        metricLabel: meta.metricLabel,
        title: meta.title,
        summary: meta.summary,
        detail: text,
      },
    ];
  });

  return {
    incidents,
    projects: projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      liveUrl: p.liveUrl,
      featured: p.featured,
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

export default async function Home() {
  const data = await getVRData();
  return <VRExperience data={data} overlay={<HeroOverlay />} />;
}
