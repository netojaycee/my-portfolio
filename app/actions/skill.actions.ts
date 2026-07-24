"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const title = formData.get("title") as string;
    const icon = formData.get("icon") as string;
    const description = formData.get("description") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    await prisma.skillCategory.create({
      data: { title, icon, description, order },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const title = formData.get("title") as string;
    const icon = formData.get("icon") as string;
    const description = formData.get("description") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    await prisma.skillCategory.update({
      where: { id },
      data: { title, icon, description, order },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.skillCategory.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function createSkill(categoryId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const level = formData.get("level") as any;
    const order = parseInt(formData.get("order") as string) || 0;

    await prisma.skill.create({
      data: { name, level, order, categoryId },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to create skill" };
  }
}

export async function updateSkill(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const level = formData.get("level") as any;
    const order = parseInt(formData.get("order") as string) || 0;

    await prisma.skill.update({
      where: { id },
      data: { name, level, order },
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update skill" };
  }
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to delete skill" };
  }
}
