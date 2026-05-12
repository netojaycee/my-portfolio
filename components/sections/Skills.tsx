import { prisma } from "@/lib/prisma";
import { SectionHeader } from "../ui/SectionHeader";
import { SkillsClient } from "./SkillsClient";

export async function Skills() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: { orderBy: { order: "asc" } },
    },
  });

  return (
    <section id="skills" className="py-28 md:py-36 bg-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-accent/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <SectionHeader
          title="Technical Arsenal."
          subtitle="Specialised in the modern cloud-native ecosystem — from backend architecture and real-time systems to automated DevOps pipelines."
          align="center"
        />

        <SkillsClient categories={categories} />
      </div>
    </section>
  );
}
