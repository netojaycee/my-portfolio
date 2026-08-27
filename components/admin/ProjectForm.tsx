"use client";

import { useState, useActionState, useRef } from "react";
import { createProject, updateProject } from "@/app/actions/project.actions";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Trash2, Save, Loader2, Upload, ArrowUp, ArrowDown, ImageIcon } from "lucide-react";

interface ProjectFormProps {
  initialData?: any; // Full project with includes
}

const STACK_CATEGORIES = ["FRONTEND", "BACKEND", "DEVOPS", "DATABASE", "INFRA"];
const PROJECT_CATEGORIES = ["SAAS", "MARKETPLACE", "ECOMMERCE", "MANAGEMENT", "DEVOPS", "DESKTOP"];

export function ProjectForm({ initialData }: ProjectFormProps) {
  const isEdit = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for dynamic lists
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    (initialData?.images || []).map((img: any) => ({ url: img.url, alt: img.alt || "" }))
  );
  const [stack, setStack] = useState<{ id: string; name: string; category: string }[]>(
    (initialData?.stack || []).map((s: any) => ({ id: s.id || Math.random().toString(), name: s.name, category: s.category }))
  );
  const [highlights, setHighlights] = useState<{ id: string; text: string }[]>(
    (initialData?.highlights || []).map((h: any) => ({ id: h.id || Math.random().toString(), text: h.text }))
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [state, formAction, isPending] = useActionState(
    isEdit ? updateProject.bind(null, initialData.id) : createProject,
    { success: false }
  );

  const addStackItem = () => {
    setStack([...stack, { id: Math.random().toString(), name: "", category: "FRONTEND" }]);
  };
  const removeStackItem = (id: string) => setStack(stack.filter((item) => item.id !== id));
  const updateStackItem = (id: string, patch: Partial<{ name: string; category: string }>) =>
    setStack(stack.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const addHighlight = () => setHighlights([...highlights, { id: Math.random().toString(), text: "" }]);
  const removeHighlight = (id: string) => setHighlights(highlights.filter((item) => item.id !== id));
  const updateHighlight = (id: string, text: string) =>
    setHighlights(highlights.map((item) => (item.id === id ? { ...item, text } : item)));

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const uploaded: { url: string; alt: string }[] = [];
      for (const file of Array.from(fileList)) {
        const url = await uploadToCloudinary(file);
        uploaded.push({ url, alt: "" });
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (e: any) {
      setUploadError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const moveImage = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  };

  return (
    <form action={formAction} className="space-y-12 max-w-5xl">
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      <input
        type="hidden"
        name="stackJson"
        value={JSON.stringify(stack.filter((s) => s.name.trim()).map((s) => ({ name: s.name, category: s.category })))}
      />
      <input
        type="hidden"
        name="highlightsJson"
        value={JSON.stringify(highlights.filter((h) => h.text.trim()).map((h) => ({ text: h.text })))}
      />

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

          {/* Images */}
          <section className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight">Images</h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 text-xs font-mono text-accent hover:underline uppercase tracking-widest disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {uploadError}
              </div>
            )}

            {images.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-dim border border-dashed border-border rounded-xl">
                <ImageIcon className="w-8 h-8" />
                <p className="text-sm">No images yet. First image becomes the hero image.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={img.url + index} className="relative group rounded-xl overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt || ""} className="w-full h-32 object-cover" />
                    {index === 0 && (
                      <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-widest bg-accent text-white px-2 py-1 rounded-md">
                        Hero
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="p-2 rounded-lg bg-surface text-text disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                        className="p-2 rounded-lg bg-surface text-text disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 rounded-lg bg-red-500/80 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Stack Items */}
          <section className="p-8 rounded-2xl bg-surface border border-border space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight">Stack</h3>
              <button
                type="button"
                onClick={addStackItem}
                className="text-xs font-mono text-accent hover:underline uppercase tracking-widest"
              >
                + Add Stack Item
              </button>
            </div>

            <div className="space-y-3">
              {stack.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <input
                    value={item.name}
                    onChange={(e) => updateStackItem(item.id, { name: e.target.value })}
                    placeholder="e.g. NestJS"
                    className="flex-1 h-11 px-4 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text text-sm"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => updateStackItem(item.id, { category: e.target.value })}
                    className="h-11 px-3 rounded-xl bg-surface-2 border border-border focus:border-accent outline-none transition-all text-text text-sm"
                  >
                    {STACK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeStackItem(item.id)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
              {highlights.map((h) => (
                <div key={h.id} className="flex gap-4">
                  <div className="flex-1">
                    <input
                      value={h.text}
                      onChange={(e) => updateHighlight(h.id, e.target.value)}
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
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </option>
                  ))}
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
