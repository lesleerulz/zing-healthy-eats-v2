import prisma from "@/lib/prisma";
import { DollarSign, ShoppingBag, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import PageWrapper from "./PageWrapper";

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, lowStockItems, recentOrders, allOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "Pending" } }),
    prisma.product.count({ where: { quantity: { lt: 5 } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true, items: true },
    }),
    prisma.order.findMany({ include: { items: true } })
  ]);

  const totalRevenue = allOrders.reduce((sum, order) => {
    const itemsTotal = order.items.reduce((itemSum, item) => itemSum + (item.quantity * item.productPrice), 0);
    return sum + itemsTotal + order.deliveryFee;
  }, 0);

  const stats = [
    { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-[#D4A373]" },
    { name: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, color: "text-[#F5F5F5]" },
    { name: "Pending Orders", value: pendingOrders.toString(), icon: Clock, color: "text-[#F5F5F5]" },
    { name: "Low Stock Items", value: lowStockItems.toString(), icon: AlertTriangle, color: "text-red-400" },
  ];

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-[#1A1A23] border border-[#2A2A35] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#9CA3AF] mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-[#F5F5F5]">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-[#0F0F12] ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#1A1A23] border border-[#2A2A35] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#2A2A35] flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#F5F5F5]">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm text-[#D4A373] hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F0F12] text-xs uppercase tracking-wider text-[#9CA3AF]">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A35]">
              {recentOrders.map((order) => {
                const total = order.items.reduce((s, i) => s + i.quantity * i.productPrice, 0) + order.deliveryFee;
                return (
                  <tr key={order.id} className="hover:bg-[#2A2A35]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">{order.user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#9CA3AF]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#F5F5F5]">${total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" :
                        order.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                        "bg-blue-500/10 text-blue-500"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#9CA3AF]">
                    No recent orders found.
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
