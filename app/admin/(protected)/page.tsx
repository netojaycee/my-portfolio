import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Briefcase, Code, User, Eye, Rocket, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [projectCount, skillCount, expCount, publishedCount] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.project.count({ where: { published: true } }),
  ]);

  const stats = [
    { label: "Total Projects", value: projectCount, icon: Briefcase, color: "text-blue-500" },
    { label: "Published", value: publishedCount, icon: Rocket, color: "text-green" },
    { label: "Skills", value: skillCount, icon: Code, color: "text-accent" },
    { label: "Experience", value: expCount, icon: User, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Overview"
          subtitle="A quick look at your portfolio content status."
          className="mb-0"
        />
        <Link
          href="/"
          target="_blank"
          className="h-12 px-6 bg-surface border border-border rounded-xl flex items-center gap-2 font-syne font-bold uppercase tracking-widest text-xs hover:bg-surface-2 transition-all"
        >
          <Eye className="w-4 h-4" /> View Site
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-8 rounded-2xl bg-surface border border-border flex flex-col items-center text-center group hover:border-accent/30 transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-4xl font-syne font-bold text-text mb-1 tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs font-mono text-muted uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 p-8 rounded-2xl border border-border bg-surface">
          <h3 className="text-xl font-syne font-bold text-text mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-accent" /> Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/projects/new"
              className="p-6 rounded-xl bg-surface-2 border border-border hover:border-accent/50 transition-all group"
            >
              <h4 className="font-syne font-bold text-text mb-1 group-hover:text-accent">Add Project</h4>
              <p className="text-xs text-muted font-lora">Create a new case study and upload images.</p>
            </Link>
            <Link
              href="/admin/skills"
              className="p-6 rounded-xl bg-surface-2 border border-border hover:border-accent/50 transition-all group"
            >
              <h4 className="font-syne font-bold text-text mb-1 group-hover:text-accent">Update Skills</h4>
              <p className="text-xs text-muted font-lora">Add new tech stack or reorder categories.</p>
            </Link>
          </div>
        </div>

        {/* System Info */}
        <div className="p-8 rounded-2xl border border-border bg-surface flex flex-col justify-center items-center text-center">
          <LayoutDashboard className="w-12 h-12 text-accent/20 mb-6" />
          <h3 className="text-lg font-syne font-bold text-text mb-2">Management Ready</h3>
          <p className="text-sm text-muted font-lora">
            Your portfolio is currently connected to Neon DB via Prisma 7.
          </p>
        </div>
      </div>
    </div>
  );
}
