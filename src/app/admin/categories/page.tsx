import prisma from "@/lib/prisma";
import CategoryManager from "./CategoryManager";
import PageWrapper from "../PageWrapper";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <PageWrapper>
      <CategoryManager categories={categories} />
    </PageWrapper>
  );
}
