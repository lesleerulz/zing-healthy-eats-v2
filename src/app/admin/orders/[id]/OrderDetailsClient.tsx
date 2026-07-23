"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "../actions";

type OrderType = any;

export default function OrderDetailsClient({ order, subtotal, total }: { order: OrderType, subtotal: number, total: number }) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    const result = await updateOrderStatus(order.id, status);
    if (!result.success) {
      alert("Failed to update status. Please try again.");
      setStatus(order.status); // revert
    }
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Order #{order.id}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isUpdating}
            className="bg-[#1A1A23] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4A373] transition-colors disabled:opacity-50"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={handleUpdateStatus}
            disabled={isUpdating || status === order.status}
            className="bg-[#D4A373] text-black hover:bg-[#D4A373]/90 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-[#D4A373]" />
                Order Items
              </h2>
            </div>
            <table className="w-full text-left">
              <thead className="border-b border-white/5 text-sm text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Qty</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {order.items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{item.productTitle}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">Ksh {item.productPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-300">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-white font-medium">
                      Ksh {(item.productPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-6 bg-white/5 space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span>Ksh {order.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                <span>Total</span>
                <span className="text-[#D4A373]">Ksh {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-[#D4A373]" />
                Customer
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  <img 
                    src={order.user.profilePicture.startsWith('http') ? order.user.profilePicture : `/images/${order.user.profilePicture}`} 
                    alt={order.user.username}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default_profile.webp';
                    }}
                  />
                </div>
                <div>
                  <div className="font-medium text-white">{order.user.username}</div>
                  <div className="text-sm text-gray-400">{order.user.email}</div>
                </div>
              </div>
              {order.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {order.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#D4A373]" />
                Delivery Details
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <span className="block text-gray-500 mb-1">Address</span>
                <span className="text-gray-300">{order.deliveryAddress || "Not provided"}</span>
              </div>
              {order.notes && (
                <div className="text-sm">
                  <span className="block text-gray-500 mb-1">Order Notes</span>
                  <p className="text-gray-300 bg-white/5 p-3 rounded-lg italic">"{order.notes}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1A1A23] rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#D4A373]" />
                Payment
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {order.mpesaReceiptNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">M-Pesa Ref</span>
                  <span className="text-white font-medium">{order.mpesaReceiptNumber}</span>
                </div>
              )}
              {order.paystackReference && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Paystack Ref</span>
                  <span className="text-white font-medium">{order.paystackReference}</span>
                </div>
              )}
              {!order.mpesaReceiptNumber && !order.paystackReference && (
                <div className="text-sm text-gray-500 italic">No payment reference available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
