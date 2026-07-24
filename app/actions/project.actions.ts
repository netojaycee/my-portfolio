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
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to reorder projects" };
  }
}
