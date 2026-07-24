import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { order: "asc" } },
      stack: { orderBy: { category: "asc" } },
      highlights: { orderBy: { order: "asc" } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Edit Project"
        subtitle={`Modifying ${project.name}`}
        className="mb-0"
      />
      
      <ProjectForm initialData={project} />
    </div>
  );
}
