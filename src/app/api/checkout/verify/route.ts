import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

// Verify a transaction after redirect from Paystack, and confirm the order in our DB.
// This lets the post-payment page confirm locally without relying solely on the webhook.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { status: false, message: "Missing reference" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.status && data.data?.status === "success") {
      const verifiedPhone =
        data.data.authorization?.mobile_money_number ||
        data.data.metadata?.phone ||
        null;

      const order = await prisma.order.findFirst({
        where: { paystackReference: reference },
      });

      if (order && order.status !== "Confirmed" && order.status !== "Delivered") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "Confirmed",
            confirmedAt: new Date(),
            phoneNumber: verifiedPhone || order.phoneNumber,
          },
        });

        if (verifiedPhone && data.data.channel === "mobile_money") {
          await prisma.user.update({
            where: { id: order.userId },
            data: { savedPhone: verifiedPhone },
          });
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { status: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
