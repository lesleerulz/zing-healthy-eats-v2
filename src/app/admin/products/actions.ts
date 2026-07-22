"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const image = formData.get("image") as string;
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const isActive = formData.get("isActive") === "on";

  await prisma.product.create({
    data: {
      title,
      description,
      price,
      quantity,
      image,
      categoryId,
      isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect("/admin/products");
}

export async function updateProduct(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const image = formData.get("image") as string;
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const isActive = formData.get("isActive") === "on";

  await prisma.product.update({
    where: { id },
    data: {
      title,
      description,
      price,
      quantity,
      image,
      categoryId,
      isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect("/admin/products");
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
}
