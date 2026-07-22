import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/products/[id] -> single product (storefront)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { status: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      include: { category: { select: { name: true } } },
    });

    if (!product) {
      return NextResponse.json(
        { status: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      data: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category?.name ?? "Uncategorized",
        quantity: product.quantity,
      },
    });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to load product" },
      { status: 500 }
    );
  }
}
