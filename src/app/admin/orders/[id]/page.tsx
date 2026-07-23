import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderDetailsClient from "./OrderDetailsClient";

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = parseInt(params.id, 10);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: true
    }
  });

  if (!order) {
    notFound();
  }

  const subtotal = order.items.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0);
  const total = subtotal + order.deliveryFee;

  return <OrderDetailsClient order={order} subtotal={subtotal} total={total} />;
}
