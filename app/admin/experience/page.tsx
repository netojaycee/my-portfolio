import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Plus, GripVertical, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteExperience } from "@/actions/experience.actions";

export default async function AdminExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
    include: {
      bullets: { orderBy: { order: "asc" } },
      tags: true,
    },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Manage Experience"
          subtitle="Define your career timeline and key professional achievements."
          className="mb-0"
        />
        <Link
          href="/admin/experience/new"
          className="h-12 px-6 bg-accent text-white rounded-xl flex items-center gap-2 font-syne font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
        >
          <Plus className="w-4 h-4" /> New Experience
        </Link>
      </div>

      <div className="space-y-6">
        {experiences.map((exp: any) => (
          <div key={exp.id} className="p-8 rounded-2xl bg-surface border border-border group hover:border-accent/30 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                  <GripVertical className="w-5 h-5 cursor-grab" />
                </div>
                <div>
                  <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight">{exp.role}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted font-lora">
                    <span className="font-bold text-text">{exp.company}</span>
                    <span>•</span>
                    <span>{exp.period}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/experience/${exp.id}`}
                  className="p-3 rounded-xl bg-surface-2 border border-border text-muted hover:text-text hover:bg-border transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </Link>
                <form action={deleteExperience.bind(null, exp.id)}>
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-surface-2 border border-border text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {exp.tags.map((tag: any) => (
                <span key={tag.id} className="px-2 py-0.5 rounded bg-surface-2 border border-border text-[10px] font-mono text-dim uppercase tracking-wider">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="p-12 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
            <p className="text-muted font-lora">No experience entries found. Click "New Experience" to start building your timeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
