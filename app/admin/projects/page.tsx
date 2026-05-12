import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Plus, GripVertical, Edit2, Trash2, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { togglePublished, deleteProject } from "@/actions/project.actions";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Manage Projects"
          subtitle="Your complete portfolio of work, ordered by priority."
          className="mb-0"
        />
        <Link
          href="/admin/projects/new"
          className="h-12 px-6 bg-accent text-white rounded-xl flex items-center gap-2 font-syne font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-2 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-mono text-dim uppercase tracking-widest">Image</th>
              <th className="px-6 py-4 text-[10px] font-mono text-dim uppercase tracking-widest">Project Name</th>
              <th className="px-6 py-4 text-[10px] font-mono text-dim uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-mono text-dim uppercase tracking-widest text-center">Visibility</th>
              <th className="px-6 py-4 text-[10px] font-mono text-dim uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((project) => (
              <tr key={project.id} className="group hover:bg-surface-2 transition-colors">
                <td className="px-6 py-4">
                  <div className="relative w-16 h-10 rounded-md overflow-hidden bg-surface-2 border border-border">
                    {project.images[0] ? (
                      <Image
                        src={project.images[0].url}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-dim">
                        <Globe className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-syne font-bold text-text group-hover:text-accent transition-colors">
                      {project.name}
                    </span>
                    <span className="text-xs text-muted font-lora truncate max-w-xs">
                      {project.tagline}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-6 py-4 text-center">
                  <form action={togglePublished.bind(null, project.id, !project.published)}>
                    <button
                      type="submit"
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border transition-all",
                        project.published
                          ? "bg-green/10 text-green border-green/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}
                    >
                      {project.published ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="p-2 rounded-lg bg-surface-2 text-muted hover:text-text hover:bg-border transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <form action={deleteProject.bind(null, project.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg bg-surface-2 text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted font-lora">
                  No projects found. Click "New Project" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Inline helper for client-side visibility toggle without needing a separate component for now
import { cn } from "@/lib/utils";
