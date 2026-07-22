import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Ping the database with a lightweight query
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "success", message: "Database pinged successfully to prevent pausing." }, { status: 200 });
  } catch (error) {
    console.error("Keep-alive ping failed:", error);
    return NextResponse.json({ status: "error", message: "Failed to ping database." }, { status: 500 });
  }
}
