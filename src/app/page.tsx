import prisma from "@/lib/prisma";
import HomePageClient from "./HomePageClient";

export default async function Home() {
  const latestProducts = await prisma.product.findMany({
    take: 3,
    orderBy: {
      dateAdded: "desc"
    },
    include: {
      category: true
    }
  });

  const featuredProducts = latestProducts.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: `Ksh ${p.price.toLocaleString()}`,
    category: p.category?.name || "Uncategorized",
    imageUrl: p.image.startsWith('http') || p.image.startsWith('/') ? p.image : `/${p.image}`
  }));

  return <HomePageClient featuredProducts={featuredProducts} />;
}
