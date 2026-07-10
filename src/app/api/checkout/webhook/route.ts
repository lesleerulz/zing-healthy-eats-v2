import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

// Paystack sends webhook events here after payment
export async function POST(req: Request) {
  try {
    // Verify the webhook signature
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Paystack webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const phone = data.metadata?.phone || null;

      // Find the order by paystack reference
      const order = await prisma.order.findFirst({
        where: { paystackReference: reference },
      });

      if (order) {
        // Update order status to Confirmed
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "Confirmed",
            confirmedAt: new Date(),
            phoneNumber: phone || order.phoneNumber,
          },
        });

        // If M-Pesa payment succeeded, save the verified phone to the user
        // (Your clever phone verification idea — a successful M-Pesa charge proves the number is real)
        if (phone && data.channel === "mobile_money") {
          await prisma.user.update({
            where: { id: order.userId },
            data: { savedPhone: phone },
          });
        }
      }
    }

    // Paystack expects a 200 response
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
