import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "fallback-secret-for-dev";

export const dynamic = "force-dynamic";

// GET /api/orders -> the logged-in user's orders (newest first)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: { userId: number };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
      return NextResponse.json(
        { status: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ status: true, data: orders });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json(
      { status: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}
