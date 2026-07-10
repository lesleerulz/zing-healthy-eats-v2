import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/products?category=Granola  -> active products (storefront)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: Prisma.ProductWhereInput = { isActive: true };
    if (category && category !== "All") {
      where.category = { name: category };
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { dateAdded: "desc" },
    });

    const mapped = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category?.name ?? "Uncategorized",
      isPeoplesChoice: p.isPeoplesChoice,
    }));

    return NextResponse.json({ status: true, data: mapped });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to load products" },
      { status: 500 }
    );
  }
}
