"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types";

// Guard every mutation
async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

type ImageInput = { url: string; alt?: string };
type StackInput = { name: string; category: string };
type HighlightInput = { text: string };

function parseJsonField<T>(formData: FormData, key: string): T[] {
  const raw = formData.get(key) as string | null;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function createProject(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const caseStudy = formData.get("caseStudy") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const status = formData.get("status") as any;
    const category = formData.get("category") as any;
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";

    const images = parseJsonField<ImageInput>(formData, "imagesJson");
    const stack = parseJsonField<StackInput>(formData, "stackJson");
    const highlights = parseJsonField<HighlightInput>(formData, "highlightsJson");

    await prisma.project.create({
      data: {
        name,
        slug,
        tagline,
        description,
        caseStudy,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        status,
        category,
        featured,
        published,
        images: { create: images.map((img, i) => ({ url: img.url, alt: img.alt || "", order: i })) },
        stack: { create: stack.map((s) => ({ name: s.name, category: s.category as any })) },
        highlights: { create: highlights.map((h, i) => ({ text: h.text, order: i })) },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to create project" };
  }
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const tagline = formData.get("tagline") as string;
    const description = formData.get("description") as string;
    const caseStudy = formData.get("caseStudy") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const status = formData.get("status") as any;
    const category = formData.get("category") as any;
    const featured = formData.get("featured") === "on";
    const published = formData.get("published") === "on";

    const images = parseJsonField<ImageInput>(formData, "imagesJson");
    const stack = parseJsonField<StackInput>(formData, "stackJson");
    const highlights = parseJsonField<HighlightInput>(formData, "highlightsJson");

    // Run sequentially rather than wrapped in prisma.$transaction([...]): an
    // interactive transaction needs to hold one connection across every
    // statement, and over Neon's pooled connection string that reliably hit
    // P2028 ("unable to start a transaction in the given time") even with a
    // generous timeout. Sacrifices atomicity on a mid-request crash, an
    // acceptable tradeoff for a low-concurrency personal admin panel.
    await prisma.project.update({
      where: { id },
      data: {
        name,
        slug,
        tagline,
        description,
        caseStudy,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        status,
        category,
        featured,
        published,
      },
    });
    await prisma.projectImage.deleteMany({ where: { projectId: id } });
    await prisma.stackItem.deleteMany({ where: { projectId: id } });
    await prisma.highlight.deleteMany({ where: { projectId: id } });
    if (images.length) {
      await prisma.projectImage.createMany({
        data: images.map((img, i) => ({ url: img.url, alt: img.alt || "", order: i, projectId: id })),
      });
    }
    if (stack.length) {
      await prisma.stackItem.createMany({
        data: stack.map((s) => ({ name: s.name, category: s.category as any, projectId: id })),
      });
    }
    if (highlights.length) {
      await prisma.highlight.createMany({
        data: highlights.map((h, i) => ({ text: h.text, order: i, projectId: id })),
      });
    }

    revalidatePath("/");
    revalidatePath(`/projects/${slug}`);
    revalidatePath("/admin/projects");
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update project" };
  }
  redirect("/admin/projects");
}

export async function deleteProject(id: string, _formData?: FormData): Promise<void> {
  await requireAdmin();
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
  } catch (e) {
    console.error(e);
  }
}

export async function togglePublished(id: string, published: boolean, _formData?: FormData): Promise<void> {
  await requireAdmin();
  try {
    await prisma.project.update({ where: { id }, data: { published } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
  } catch (e) {
    console.error(e);
  }
}

export async function reorderProjects(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  try {
    // Sequential, not $transaction — see note in updateProject about Neon's
    // pooled connection and interactive transactions.
    for (const [index, id] of ids.entries()) {
      await prisma.project.update({ where: { id }, data: { order: index } });
    }
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to reorder projects" };
  }
}
