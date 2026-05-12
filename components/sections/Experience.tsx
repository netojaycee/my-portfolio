import { prisma } from "@/lib/prisma";
import { SectionHeader } from "../ui/SectionHeader";
import { ExperienceClient } from "./ExperienceClient";

export async function Experience() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: {
      bullets: { orderBy: { order: "asc" } },
      tags: true,
    },
  });

  return (
    <section id="experience" className="py-28 md:py-36 section-alt">
      <div className="container mx-auto px-6 md:px-8">
        <SectionHeader
          title="The Journey."
          subtitle="A track record of engineering reliability and shipping full-stack products for high-traffic media and enterprise SaaS."
        />

        <ExperienceClient experiences={experiences} />
      </div>
    </section>
  );
}
