import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_MOCK = process.env.PAYSTACK_MOCK === "True";
const JWT_SECRET =
  process.env.JWT_SECRET || process.env.SECRET_KEY || "fallback-secret-for-dev";
const CALLBACK_URL =
  process.env.PAYSTACK_CALLBACK_URL || "http://localhost:3000/orders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, amount, phone, provider, items, deliveryAddress, deliveryType, notes } = body;

    // Get the logged-in user (optional — guest checkout is possible)
    let userId: number | null = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = decoded.userId;
      } catch {
        // Token invalid — proceed as guest (or reject if you want auth required)
      }
    }

    // Generate a unique reference
    const reference = `ZING-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // ─── 1. Initialize standard Paystack transaction (Card) ──────────────
    if (action === "initialize") {
      // Create the order in the database first
      let order = null;
      if (userId && items && items.length > 0) {
        order = await prisma.order.create({
          data: {
            userId,
            paystackReference: reference,
            phoneNumber: phone || null,
            deliveryAddress: deliveryAddress || null,
            deliveryType: deliveryType || "delivery",
            notes: notes || null,
            status: "Pending",
            items: {
              create: items.map((item: { id: number; title: string; price: number; quantity: number }) => ({
                productId: item.id,
                productTitle: item.title,
                productPrice: item.price,
                quantity: item.quantity,
              })),
            },
          },
        });
      }

      if (PAYSTACK_MOCK) {
        // In mock mode, skip Paystack and simulate success
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "Confirmed", confirmedAt: new Date() },
          });
        }
        return NextResponse.json({
          status: true,
          message: "Transaction initialized (MOCK)",
          data: {
            authorization_url: `${CALLBACK_URL}?reference=${reference}`,
            access_code: "MOCK-CODE",
            reference,
          },
        });
      }

      const response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            amount: Math.round(amount * 100), // Paystack expects amount in lowest currency unit
            callback_url: CALLBACK_URL,
            reference,
            metadata: {
              phone,
              order_id: order?.id,
            },
          }),
        }
      );
      const data = await response.json();
      return NextResponse.json(data);
    }

    // ─── 2. Charge Mobile Money (M-Pesa) ─────────────────────────────────
    if (action === "charge_mobile_money") {
      // Create the order in the database first
      let order = null;
      if (userId && items && items.length > 0) {
        order = await prisma.order.create({
          data: {
            userId,
            paystackReference: reference,
            phoneNumber: phone || null,
            deliveryAddress: deliveryAddress || null,
            deliveryType: deliveryType || "delivery",
            notes: notes || null,
            status: "Pending",
            items: {
              create: items.map((item: { id: number; title: string; price: number; quantity: number }) => ({
                productId: item.id,
                productTitle: item.title,
                productPrice: item.price,
                quantity: item.quantity,
              })),
            },
          },
        });
      }

      if (PAYSTACK_MOCK) {
        if (order) {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "Confirmed",
              confirmedAt: new Date(),
            },
          });

          // Mock: save the phone as verified since "M-Pesa succeeded"
          if (phone && userId) {
            await prisma.user.update({
              where: { id: userId },
              data: { savedPhone: phone },
            });
          }
        }

        return NextResponse.json({
          status: true,
          message: "Charge initiated (MOCK)",
          data: {
            status: "success",
            reference,
            display_text: "MOCK: Payment successful! Check your order history.",
          },
        });
      }

      const response = await fetch("https://api.paystack.co/charge", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          currency: "KES",
          mobile_money: {
            phone,
            provider: provider || "mpesa",
          },
          reference,
          metadata: {
            phone,
            order_id: order?.id,
          },
        }),
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { status: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
