"use client";

import { useActionState } from "react";
import { createExperience, updateExperience } from "@/actions/experience.actions";
import { Save, Loader2, Trash2 } from "lucide-react";

interface ExperienceFormProps {
  initialData?: any;
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const isEdit = !!initialData;
  const [state, formAction, isPending] = useActionState(
    isEdit ? updateExperience.bind(null, initialData.id) : createExperience,
    { success: false }
  );

  return (
    <form action={formAction} className="space-y-8 max-w-4xl">
      <div className="p-8 rounded-2xl bg-surface border border-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Role / Job Title</label>
            <input name="role" defaultValue={initialData?.role} required className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Company / Organization</label>
            <input name="company" defaultValue={initialData?.company} required className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Location</label>
            <input name="location" defaultValue={initialData?.location} required className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Period (e.g. Nov 2024 – Present)</label>
            <input name="period" defaultValue={initialData?.period} required className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text" />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="current" defaultChecked={initialData?.current} className="w-5 h-5 rounded border-border text-accent focus:ring-accent" />
            <span className="text-sm font-syne font-bold text-text uppercase tracking-widest">Currently Working Here</span>
          </label>
          <div className="flex-1 flex items-center justify-end gap-2">
            <label className="text-[10px] font-mono text-dim uppercase tracking-widest">Order</label>
            <input name="order" type="number" defaultValue={initialData?.order || 0} className="w-20 h-10 px-3 rounded-lg bg-surface-2 border border-border text-text text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Tech Tags (Comma separated)</label>
          <input name="tags" defaultValue={initialData?.tags?.map((t: any) => t.name).join(", ")} placeholder="React, AWS, Node.js..." className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Key Achievements (One per line)</label>
          <textarea name="bullets" defaultValue={initialData?.bullets?.map((b: any) => b.text).join("\n")} required rows={8} className="w-full p-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text font-lora leading-relaxed" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 h-14 bg-accent text-white font-syne font-bold uppercase tracking-widest rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> {isEdit ? "Update Entry" : "Save Experience"}</>}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-8 h-14 bg-surface border border-border text-text font-syne font-bold uppercase tracking-widest rounded-xl hover:bg-surface-2 transition-all"
        >
          Cancel
        </button>
      </div>

      {state.error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium text-center">{state.error}</div>}
    </form>
  );
}
