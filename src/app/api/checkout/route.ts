import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_MOCK = process.env.PAYSTACK_MOCK === 'true';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, amount, phone, provider, reference } = body;

    // 1. Initialize standard Paystack transaction
    if (action === 'initialize') {
      if (PAYSTACK_MOCK) {
        return NextResponse.json({
          status: true,
          message: "Transaction initialized (MOCK)",
          data: {
            authorization_url: `http://localhost:3000/orders?reference=${reference || 'MOCK-REF'}`,
            access_code: "MOCK-CODE",
            reference: reference || "MOCK-REF"
          }
        });
      }

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Convert to kobo/cents if needed, depending on currency
          callback_url: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/orders` : 'http://localhost:3000/orders',
          reference
        })
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    // 2. Charge Mobile Money (M-Pesa, etc.)
    if (action === 'charge_mobile_money') {
      if (PAYSTACK_MOCK) {
        return NextResponse.json({
          status: true,
          message: "Charge initiated (MOCK)",
          data: {
            status: "success",
            reference: reference || "MOCK-KES-REF",
            display_text: "MOCK: Check your phone for prompt"
          }
        });
      }

      const response = await fetch('https://api.paystack.co/charge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          currency: 'KES',
          mobile_money: {
            phone,
            provider: provider || 'mpesa'
          },
          reference
        })
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ status: false, message: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
