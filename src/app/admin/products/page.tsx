import prisma from "@/lib/prisma";
import ProductsPageClient from "./ProductsPageClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { dateAdded: "desc" }
  });

  return <ProductsPageClient initialProducts={products} />;
}
