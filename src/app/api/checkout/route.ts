import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/mail";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_MOCK = process.env.PAYSTACK_MOCK === "True";
const JWT_SECRET =
  process.env.JWT_SECRET || process.env.SECRET_KEY || "fallback-secret-for-dev";
const CALLBACK_URL =
  process.env.PAYSTACK_CALLBACK_URL || "http://localhost:3000/orders";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, phone, items, deliveryAddress, deliveryType, notes } = body;

    // Get the logged-in user
    let userId: number | null = null;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = decoded.userId;
      } catch {
        // Token invalid
      }
    }

    if (!userId) {
      return NextResponse.json(
        { status: false, message: "Please log in to checkout" },
        { status: 401 }
      );
    }

    // Generate a unique reference
    const reference = `ZING-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create the order in the database
    const order = await prisma.order.create({
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

    // ─── Mock Mode ───────────────────────────────────────────────────────
    if (PAYSTACK_MOCK) {
      const confirmedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "Confirmed", confirmedAt: new Date() },
        include: { items: true, user: true }
      });

      if (phone && userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { savedPhone: phone },
        });
      }

      // Send mock invoice email
      if (confirmedOrder.user?.email) {
        await sendInvoiceEmail(confirmedOrder.user.email, confirmedOrder, confirmedOrder.items);
      }

      return NextResponse.json({
        status: true,
        message: "Transaction initialized (MOCK)",
        data: {
          authorization_url: `${CALLBACK_URL}?reference=${reference}`,
          reference,
        },
      });
    }

    // ─── Real Paystack: Initialize transaction ───────────────────────────
    // Redirect flow — Paystack handles both card AND M-Pesa on their hosted page
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
          amount: Math.round(amount * 100), // Paystack expects lowest currency unit
          currency: "KES",
          callback_url: CALLBACK_URL,
          reference,
          channels: ["card", "mobile_money"], // Both options on Paystack's page
          metadata: {
            phone,
            order_id: order.id,
            custom_fields: [
              {
                display_name: "Phone Number",
                variable_name: "phone",
                value: phone || "",
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      // Paystack rejected — clean up the pending order
      await prisma.order.delete({ where: { id: order.id } });
      return NextResponse.json(
        { status: false, message: data.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
