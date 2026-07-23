import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendInvoiceEmail } from "@/lib/mail";

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

      // Extract the phone number from the payment
      // For M-Pesa: Paystack includes it in the authorization object
      const verifiedPhone =
        data.authorization?.mobile_money_number ||
        data.metadata?.phone ||
        null;

      // Find the order by paystack reference
      const order = await prisma.order.findFirst({
        where: { paystackReference: reference },
        include: { items: true, user: true }
      });

      // 1. IS THIS A NORMAL ORDER?
      if (order && order.status !== "Confirmed" && order.status !== "Delivered") {
        // Update order status to Confirmed
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "Confirmed",
            confirmedAt: new Date(),
            phoneNumber: verifiedPhone || order.phoneNumber,
          },
        });

        // Send Invoice Email
        if (order.user?.email) {
          await sendInvoiceEmail(order.user.email, order, order.items);
        }

        // If M-Pesa payment succeeded, save the verified phone to the user
        // A successful M-Pesa charge proves the number is real and belongs to them
        if (verifiedPhone && data.channel === "mobile_money") {
          await prisma.user.update({
            where: { id: order.userId },
            data: { savedPhone: verifiedPhone },
          });
        }

        // Deduct stock
        for (const item of order.items) {
          if (item.productId) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { quantity: { decrement: item.quantity } },
            });
          }
        }
      } 
      
      // 2. IS THIS A SUBSCRIPTION CHARGE?
      else if (data.plan) {
        // Find existing subscription by email to connect
        const user = await prisma.user.findUnique({ where: { email: data.customer.email } });
        if (user) {
          // Check if this is the first payment (reference matches) or recurring
          let subscription = await prisma.subscription.findFirst({
            where: { paystackSubCode: reference, userId: user.id }
          });
          
          if (!subscription) {
            // Might be a recurring charge (new reference), find the active one
            subscription = await prisma.subscription.findFirst({
              where: { userId: user.id, status: "Active" }
            });
          }

          if (subscription) {
            // Activate the subscription if it was pending
            if (subscription.status !== "Active") {
              await prisma.subscription.update({
                where: { id: subscription.id },
                data: { status: "Active" }
              });
            }

            // Create a brand new order for the delivery team to pack the nuts bundle!
            const bundleOrder = await prisma.order.create({
              data: {
                userId: user.id,
                status: "Confirmed",
                confirmedAt: new Date(),
                deliveryAddress: user.address || "Pending Address",
                phoneNumber: verifiedPhone || user.savedPhone || "000",
                paystackReference: reference,
                items: {
                  create: [
                    {
                      productId: null, // Custom bundle item
                      productTitle: "Monthly Nuts Bundle",
                      productPrice: data.amount / 100,
                      quantity: 1,
                    }
                  ]
                }
              },
              include: { items: true, user: true }
            });

            // Send Invoice Email for the recurring bundle payment
            await sendInvoiceEmail(user.email, bundleOrder, bundleOrder.items);
          }
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
