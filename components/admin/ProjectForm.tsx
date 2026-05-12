"use client";

import { useState, useActionState } from "react";
import { createProject, updateProject } from "@/actions/project.actions";
import { Trash2, Save, Loader2 } from "lucide-react";


interface ProjectFormProps {
  initialData?: any; // Full project with includes
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const isEdit = !!initialData;

  // Local state for dynamic lists
  const [images, setImages] = useState(initialData?.images || []);
  const [stack, setStack] = useState(initialData?.stack || []);
  const [highlights, setHighlights] = useState(initialData?.highlights || []);

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateProject.bind(null, initialData.id) : createProject,
    { success: false }
  );

  const addStackItem = () => {
    setStack([...stack, { id: Math.random().toString(), name: "", category: "FRONTEND" }]);
  };

  const removeStackItem = (id: string) => {
    setStack(stack.filter((item: any) => item.id !== id));
  };

  const addHighlight = () => {
    setHighlights([...highlights, { id: Math.random().toString(), text: "", order: highlights.length }]);
  };

  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter((item: any) => item.id !== id));
  };

  return (
    <form action={formAction} className="space-y-12 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Project Name</label>
                <input
                  name="name"
                  defaultValue={initialData?.name}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">URL Slug</label>
                <input
                  name="slug"
                  defaultValue={initialData?.slug}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Tagline</label>
              <input
                name="tagline"
                defaultValue={initialData?.tagline}
                required
                className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Short Description</label>
              <textarea
                name="description"
                defaultValue={initialData?.description}
                required
                rows={3}
                className="w-full p-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text font-lora"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Case Study (Markdown)</label>
              <textarea
                name="caseStudy"
                defaultValue={initialData?.caseStudy}
                required
                rows={10}
                className="w-full p-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text font-mono text-sm leading-relaxed"
              />
            </div>
          </section>

          {/* Highlights */}
          <section className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight">Key Highlights</h3>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs font-mono text-accent hover:underline uppercase tracking-widest"
              >
                + Add Highlight
              </button>
            </div>

            <div className="space-y-4">
              {highlights.map((h: any, index: number) => (
                <div key={h.id} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      name={`highlights[${index}].text`}
                      defaultValue={h.text}
                      className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text text-sm"
                      placeholder="Enter a technical highlight..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHighlight(h.id)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <section className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight">Status & Visibility</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Category</label>
                <select
                  name="category"
                  defaultValue={initialData?.category || "SAAS"}
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text"
                >
                  <option value="SAAS">SaaS</option>
                  <option value="MARKETPLACE">Marketplace</option>
                  <option value="ECOMMERCE">E-Commerce</option>
                  <option value="MANAGEMENT">Management</option>
                  <option value="DEVOPS">DevOps</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Project Status</label>
                <select
                  name="status"
                  defaultValue={initialData?.status || "LIVE"}
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text"
                >
                  <option value="LIVE">Live</option>
                  <option value="IN_DEVELOPMENT">In Development</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={initialData ? initialData.published : true}
                    className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-syne font-bold text-text uppercase tracking-widest">Published</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={initialData?.featured}
                    className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-syne font-bold text-text uppercase tracking-widest">Featured</span>
                </label>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight">Project Links</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">Live URL</label>
                <input
                  name="liveUrl"
                  defaultValue={initialData?.liveUrl}
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text text-sm font-mono"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-dim uppercase tracking-widest ml-1">GitHub URL</label>
                <input
                  name="githubUrl"
                  defaultValue={initialData?.githubUrl}
                  className="w-full h-12 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text text-sm font-mono"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="sticky bottom-8 space-y-4">
            {state.error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {state.error}
              </div>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-16 bg-accent text-white font-syne font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-accent/20 hover:bg-accent-hover transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <><Save className="w-5 h-5" /> {isEdit ? "Update Project" : "Create Project"}</>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full h-14 bg-surface border border-border text-text font-syne font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-surface-2 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
