"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.category.create({
    data: { name, description },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.category.update({
    where: { id },
    data: { name, description },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
}

export async function deleteCategory(id: number) {
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/catalog");
}
