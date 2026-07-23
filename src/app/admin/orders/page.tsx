import prisma from "@/lib/prisma";
import OrdersPageClient from "./OrdersPageClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" }
  });

  return <OrdersPageClient initialOrders={orders} />;
}
