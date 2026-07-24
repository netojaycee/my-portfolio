"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

export async function createExperience(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const period = formData.get("period") as string;
    const current = formData.get("current") === "on";
    const order = parseInt(formData.get("order") as string) || 0;
    const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);
    const bullets = (formData.get("bullets") as string).split("\n").map((b) => b.trim()).filter(Boolean);

    await prisma.experience.create({
      data: {
        role,
        company,
        location,
        period,
        current,
        order,
        tags: {
          create: tags.map((name) => ({ name })),
        },
        bullets: {
          create: bullets.map((text, index) => ({ text, order: index })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to create experience" };
  }
}

export async function updateExperience(id: string, _prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  try {
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const period = formData.get("period") as string;
    const current = formData.get("current") === "on";
    const order = parseInt(formData.get("order") as string) || 0;
    const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);
    const bullets = (formData.get("bullets") as string).split("\n").map((b) => b.trim()).filter(Boolean);

    // Delete existing tags and bullets first (simple sync strategy)
    await prisma.tag.deleteMany({ where: { experienceId: id } });
    await prisma.bullet.deleteMany({ where: { experienceId: id } });

    await prisma.experience.update({
      where: { id },
      data: {
        role,
        company,
        location,
        period,
        current,
        order,
        tags: {
          create: tags.map((name) => ({ name })),
        },
        bullets: {
          create: bullets.map((text, index) => ({ text, order: index })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to update experience" };
  }
}

export async function deleteExperience(id: string, _formData?: FormData): Promise<void> {
  await requireAdmin();
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/experience");
  } catch (e) {
    console.error(e);
  }
}

export async function reorderExperience(ids: string[]): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.experience.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Failed to reorder experience" };
  }
}
