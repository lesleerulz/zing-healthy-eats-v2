import prisma from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";
import PageWrapper from "../PageWrapper";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Orders</h1>
      </div>

      <div className="bg-[#1A1A23] border border-[#2A2A35] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0F12] text-xs uppercase tracking-wider text-[#9CA3AF]">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Customer Email</th>
                <th className="px-6 py-3 font-medium">Items</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A35]">
              {orders.map((order) => {
                const total = order.items.reduce((sum, item) => sum + (item.quantity * item.productPrice), 0) + order.deliveryFee;
                const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <tr key={order.id} className="hover:bg-[#2A2A35]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F5F5]">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {order.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {itemsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">
                      ${total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" :
                        order.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-[#2A2A35] text-[#D4A373] hover:bg-[#D4A373] hover:text-[#0F0F12] transition-colors"
                        title="View Order"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
