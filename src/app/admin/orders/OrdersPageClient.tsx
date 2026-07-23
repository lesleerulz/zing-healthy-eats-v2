"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Eye } from "lucide-react";
import PageWrapper from "../PageWrapper";

type OrderType = any; // Simplify for now since we just pass it from server

export default function OrdersPageClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = initialOrders.filter((order) => 
    order.id.toString().includes(searchQuery) ||
    order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Orders</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-[#1A1A23] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A373] transition-colors"
          />
        </div>
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
              {filteredOrders.map((order) => {
                const total = order.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
                const itemsCount = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

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
                      Ksh {total.toLocaleString()}
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
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                    No orders found matching "{searchQuery}".
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
