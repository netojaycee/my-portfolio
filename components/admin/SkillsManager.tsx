"use client";

import { useState } from "react";
import { createCategory, updateCategory, deleteCategory, createSkill, updateSkill, deleteSkill } from "@/actions/skill.actions";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface SkillsManagerProps {
  initialCategories: any[];
}

export function SkillsManager({ initialCategories }: SkillsManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [addingSkillTo, setAddingSkillTo] = useState<string | null>(null);

  // Simplified inline form handling for brevity
  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);
    if (result.success) {
      window.location.reload(); // Quick refresh to get new state
    }
  };

  const handleAddSkill = async (categoryId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createSkill(categoryId, formData);
    if (result.success) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Category */}
      <section className="p-8 rounded-2xl bg-surface border border-border">
        <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight mb-6">Create New Category</h3>
        <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Icon Name</label>
            <input name="icon" required placeholder="Cloud, Server, Code..." className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border text-text" />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Title</label>
            <input name="title" required placeholder="Frontend..." className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border text-text" />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Description</label>
            <input name="description" required placeholder="Brief summary..." className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border text-text" />
          </div>
          <button type="submit" className="h-12 bg-accent text-white font-syne font-bold uppercase tracking-widest rounded-xl hover:bg-accent-hover transition-all">
            Add Category
          </button>
        </form>
      </section>

      {/* Categories List */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="p-6 bg-surface-2 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  {/* Dynamic icon logic */}
                  <Icons.Layout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-text uppercase tracking-tight">{cat.title}</h4>
                  <p className="text-xs text-muted font-lora">{cat.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAddingSkillTo(addingSkillTo === cat.id ? null : cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-[10px] font-mono uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                >
                  {addingSkillTo === cat.id ? "Cancel" : "+ Add Skill"}
                </button>
                <button
                  onClick={() => deleteCategory(cat.id).then(() => window.location.reload())}
                  className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Add Skill Form */}
              {addingSkillTo === cat.id && (
                <form onSubmit={(e) => handleAddSkill(cat.id, e)} className="mb-8 p-4 rounded-xl border border-dashed border-accent/30 bg-accent/5 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-accent uppercase tracking-widest ml-1">Skill Name</label>
                    <input name="name" required placeholder="Next.js..." className="w-full h-10 px-3 rounded-lg bg-surface border border-accent/20 text-text" />
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-accent uppercase tracking-widest ml-1">Level</label>
                    <select name="level" className="w-full h-10 px-3 rounded-lg bg-surface border border-accent/20 text-text">
                      <option value="EXPERT">Expert</option>
                      <option value="PROFICIENT">Proficient</option>
                      <option value="FAMILIAR">Familiar</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-mono text-accent uppercase tracking-widest ml-1">Order</label>
                    <input name="order" type="number" defaultValue="0" className="w-full h-10 px-3 rounded-lg bg-surface border border-accent/20 text-text" />
                  </div>
                  <button type="submit" className="h-10 bg-accent text-white font-syne font-bold uppercase tracking-widest rounded-lg text-[10px]">
                    Save Skill
                  </button>
                </form>
              )}

              {/* Skills Grid */}
              <div className="flex flex-wrap gap-3">
                {cat.skills.map((skill: any) => (
                  <div
                    key={skill.id}
                    className="group flex items-center gap-3 pl-4 pr-2 py-2 rounded-xl bg-surface-2 border border-border hover:border-accent/30 transition-all"
                  >
                    <span className="text-sm font-lora text-text">{skill.name}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-tighter border",
                      skill.level === "EXPERT" ? "bg-accent/10 border-accent/20 text-accent" : "bg-muted/10 border-muted/20 text-muted"
                    )}>
                      {skill.level}
                    </span>
                    <button
                      onClick={() => deleteSkill(skill.id).then(() => window.location.reload())}
                      className="p-1 rounded bg-surface border border-border text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
