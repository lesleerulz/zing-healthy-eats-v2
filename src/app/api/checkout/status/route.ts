import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public status lookup used by the post-payment redirect page (/orders?reference=...)
// The reference is an unguessable random string, so exposing minimal status is safe.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ found: false }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { paystackReference: reference },
      include: {
        items: {
          select: {
            productTitle: true,
            productPrice: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      reference: order.paystackReference,
      status: order.status,
      createdAt: order.createdAt,
      deliveryType: order.deliveryType,
      deliveryAddress: order.deliveryAddress,
      items: order.items,
    });
  } catch (error) {
    console.error("Order status error:", error);
    return NextResponse.json({ found: false, error: "Lookup failed" }, { status: 500 });
  }
}
