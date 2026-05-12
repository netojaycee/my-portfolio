import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SkillsManager } from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      skills: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Manage Technical Arsenal"
        subtitle="Organize your skills into categories and define your expertise levels."
        className="mb-0"
      />
      
      <SkillsManager initialCategories={categories} />
    </div>
  );
}
