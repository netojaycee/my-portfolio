import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
    include: {
      bullets: { orderBy: { order: "asc" } },
      tags: true,
    },
  });

  if (!experience) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Edit Experience"
        subtitle={`Modifying ${experience.role} at ${experience.company}`}
        className="mb-0"
      />
      
      <ExperienceForm initialData={experience} />
    </div>
  );
}
