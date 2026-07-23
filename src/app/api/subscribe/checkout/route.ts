import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_MOCK = process.env.PAYSTACK_MOCK === "True";
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || "http://localhost:3000/orders";
const PAYSTACK_PLAN_CODE = process.env.PAYSTACK_PLAN_CODE || "PLN_mocknuts"; // Must be set in .env

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, planId, amount } = body;

    if (!email || !phone || !amount) {
      return NextResponse.json({ status: false, message: "Missing required fields" }, { status: 400 });
    }

    // Attempt to match with an existing user, or create a guest user record
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: email.split("@")[0],
          passwordHash: "guest",
          savedPhone: phone,
        }
      });
    }

    // Generate unique reference
    const reference = "SUB_" + crypto.randomBytes(8).toString("hex");

    // Create Subscription record in DB
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planCode: PAYSTACK_PLAN_CODE,
        status: "Pending", // Will become active on successful charge
        amount: amount,
        paystackSubCode: reference, // we track the transaction ref here initially
      }
    });

    if (PAYSTACK_MOCK) {
      // Mock flow
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "Active" }
      });
      return NextResponse.json({
        status: true,
        data: {
          authorization_url: `${PAYSTACK_CALLBACK_URL}?reference=${reference}`,
          reference,
        }
      });
    }

    // Initialize Paystack Transaction with `plan` parameter to start recurring billing
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        amount: amount * 100, // KES to lowest unit
        reference: reference,
        plan: PAYSTACK_PLAN_CODE, // This tells Paystack to start a subscription!
        callback_url: PAYSTACK_CALLBACK_URL,
        channels: ["card", "mobile_money"],
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({ status: true, data: data.data });
    } else {
      return NextResponse.json({ status: false, message: data.message }, { status: 400 });
    }

  } catch (error) {
    console.error("Subscription init error:", error);
    return NextResponse.json({ status: false, message: "Internal server error" }, { status: 500 });
  }
}
