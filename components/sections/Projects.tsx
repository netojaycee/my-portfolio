import { prisma } from "@/lib/prisma";
import { SectionHeader } from "../ui/SectionHeader";
import { ProjectCard } from "../ui/ProjectCard";

export async function Projects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      images: { orderBy: { order: "asc" } },
      stack: true,
    },
  });

  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const otherProjects = projects.filter((p) => p.id !== featuredProject?.id);

  return (
    <section id="projects" className="py-28 md:py-36 section-alt">
      <div className="container mx-auto px-6 md:px-8">
        <SectionHeader
          title="Featured Work."
          subtitle="A selection of production-grade platforms where I've managed the complete lifecycle — from database schema to cloud deployment."
        />

        <div className="space-y-8">
          {featuredProject && (
            <ProjectCard project={featuredProject as Parameters<typeof ProjectCard>[0]["project"]} featured />
          )}

          {otherProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project as Parameters<typeof ProjectCard>[0]["project"]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
