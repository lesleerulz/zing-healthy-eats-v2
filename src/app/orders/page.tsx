"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Package, AlertCircle, RefreshCw } from "lucide-react";

const CONFIRM_TIMEOUT_MS = 120000; // 2 minutes
const POLL_INTERVAL_MS = 3000;

type Status =
  | "loading"
  | "confirmed"
  | "pending"
  | "failed"
  | "history"
  | "notfound"
  | "error";

type OrderItem = {
  productTitle: string;
  productPrice: number;
  quantity: number;
};

type OrderData = {
  found: boolean;
  reference?: string | null;
  status?: string;
  deliveryType?: string | null;
  deliveryAddress?: string | null;
  items?: OrderItem[];
};

function OrdersConfirmPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<Status>(reference ? "loading" : "history");
  const [failType, setFailType] = useState<"timeout" | "declined" | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [history, setHistory] = useState<OrderData[] | null>(null);
  const [attempt, setAttempt] = useState(0); // bump to retry

  useEffect(() => {
    // No reference => show the user's order history list.
    if (!reference) {
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch("/api/orders");
          const data = await res.json();
          if (!cancelled && data.status && Array.isArray(data.data)) {
            setHistory(data.data);
            setStatus("history");
          } else if (!cancelled) {
            setHistory([]);
            setStatus("history");
          }
        } catch {
          if (!cancelled) {
            setHistory([]);
            setStatus("history");
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    let cancelled = false;
    const startTime = Date.now();

    // Verify with Paystack and confirm the order in our DB.
    // Also surfaces an explicit failure (failed/abandoned) so we never hang.
    async function verifyOnce() {
      try {
        const res = await fetch(
          `/api/checkout/verify?reference=${encodeURIComponent(reference)}`,
          { method: "GET", cache: "no-store" }
        );
        const data = await res.json();
        if (cancelled) return;
        const ps = data?.data?.status;
        if (ps === "failed" || ps === "abandoned") {
          setFailType("declined");
          setStatus("failed");
        }
      } catch {
        // ignore — polling will reflect status
      }
    }

    async function load() {
      try {
        const res = await fetch(
          `/api/checkout/status?reference=${encodeURIComponent(reference)}`
        );
        const data = await res.json();
        if (cancelled) return;

        if (data.found) {
          setOrder(data);
          if (data.status === "Confirmed" || data.status === "Delivered") {
            setStatus("confirmed");
            return;
          }
          setStatus("pending");
        } else if (res.status === 404) {
          setStatus("notfound");
          return;
        } else {
          setStatus("error");
          return;
        }

        // Keep confirming until success or the 2-minute window elapses.
        if (Date.now() - startTime < CONFIRM_TIMEOUT_MS) {
          setTimeout(load, POLL_INTERVAL_MS);
        } else {
          setFailType("timeout");
          setStatus("failed");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    verifyOnce();
    load();
    return () => {
      cancelled = true;
    };
  }, [reference, attempt]);

  const handleRetry = () => setAttempt((a) => a + 1);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="h-24" />
      <div className="max-w-2xl mx-auto px-6 py-12">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Loader2 className="w-10 h-10 text-[#7A614A] animate-spin mb-4" />
            <p className="text-[#7A614A] uppercase tracking-widest text-xs font-semibold">
              Confirming your order…
            </p>
          </div>
        )}

        {(status === "confirmed" || status === "pending") && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#EBE5D9] p-8 md:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#4F7A4F]" />
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1C1816]">
                {status === "confirmed" ? "Order Confirmed!" : "Payment Received"}
              </h1>
            </div>

            <p className="text-[#7A614A] mb-6">
              {status === "confirmed"
                ? "Thank you! Your order has been confirmed and is being prepared."
                : "We've received your payment and are confirming your order. This usually takes a few seconds, but M-Pesa can take up to ~2 minutes — please keep this page open."}
            </p>

            {reference && (
              <div className="bg-[#EBE5D9] rounded-xl px-4 py-3 mb-6">
                <p className="text-xs uppercase tracking-widest text-[#7A614A] font-semibold">Reference</p>
                <p className="text-sm font-bold text-[#1C1816] break-all">{reference}</p>
              </div>
            )}

            {order?.items?.length > 0 && (
              <div className="space-y-3 mb-6">
                {order.items.map((item: OrderItem, i: number) => (
                  <div key={i} className="flex justify-between text-sm border-b border-[#EBE5D9] pb-3">
                    <span className="text-[#1C1816]">
                      {item.productTitle} <span className="text-[#9A8A7A]">× {item.quantity}</span>
                    </span>
                    <span className="text-[#7A614A] font-semibold">
                      KES {(item.productPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalog"
                className="flex-1 text-center px-6 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full font-semibold hover:bg-[#3A322C] transition-colors"
              >
                Back to Pantry
              </Link>
              <Link
                href="/profile"
                className="flex-1 text-center px-6 py-3 border border-[#1C1816] text-[#1C1816] rounded-full font-semibold hover:bg-[#EBE5D9] transition-colors"
              >
                View Profile
              </Link>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#EBE5D9] p-8 md:p-12 text-center"
          >
            <AlertCircle className="w-10 h-10 text-[#B45454] mx-auto mb-4" />
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1C1816] mb-3">
              We couldn&apos;t confirm your payment
            </h1>
            <p className="text-[#7A614A] mb-2">
              {failType === "declined"
                ? "Your payment was not completed or was declined."
                : "We&apos;re still waiting to hear back from your payment provider. It may still be processing."}
            </p>
            {reference && (
              <p className="text-xs text-[#9A8A7A] mb-6">
                Reference: <span className="font-bold break-all">{reference}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full font-semibold hover:bg-[#3A322C] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Check again
              </button>
              <Link
                href="/catalog"
                className="flex-1 text-center px-6 py-3 border border-[#1C1816] text-[#1C1816] rounded-full font-semibold hover:bg-[#EBE5D9] transition-colors"
              >
                Return to Pantry
              </Link>
            </div>
            <p className="text-xs text-[#9A8A7A] mt-6">
              If you were charged but this still shows, please contact support with your reference.
            </p>
          </motion.div>
        )}

        {status === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-[#EBE5D9] p-8 md:p-12"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1C1816] mb-2">
              Order History
            </h1>
            <p className="text-[#7A614A] mb-6">
              {history && history.length > 0
                ? "Here are your recent orders."
                : "You haven't placed any orders yet."}
            </p>

            <div className="space-y-4">
              {history?.map((o) => {
                const total = (o.items ?? []).reduce(
                  (sum: number, it) => sum + it.productPrice * it.quantity,
                  0
                );
                return (
                  <div
                    key={o.reference}
                    className="border border-[#EBE5D9] rounded-2xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#1C1816] break-all">
                        {o.reference}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          o.status === "Confirmed" || o.status === "Delivered"
                            ? "bg-green-500/10 text-green-600"
                            : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                    {(o.items ?? []).map((it, i) => (
                      <div key={i} className="flex justify-between text-sm text-[#5C4D3C] py-1">
                        <span>
                          {it.productTitle} <span className="text-[#9A8A7A]">× {it.quantity}</span>
                        </span>
                        <span className="font-medium">
                          KES {(it.productPrice * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-[#EBE5D9] mt-2 pt-2 text-sm font-bold text-[#1C1816]">
                      <span>Total</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Link
                href="/catalog"
                className="block text-center px-6 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full font-semibold hover:bg-[#3A322C] transition-colors"
              >
                Back to Pantry
              </Link>
            </div>
          </motion.div>
        )}

        {status === "notfound" && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <AlertCircle className="w-10 h-10 text-[#9A8A7A] mb-4" />
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816] mb-2">
              No order found
            </h1>
            <p className="text-[#7A614A] mb-6">
              We couldn&apos;t find an order for this reference.
            </p>
            <Link
              href="/catalog"
              className="px-8 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full hover:bg-[#3A322C] transition-colors"
            >
              Return to Pantry
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <Package className="w-10 h-10 text-[#9A8A7A] mb-4" />
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816] mb-2">
              Something went wrong
            </h1>
            <p className="text-[#7A614A] mb-6">
              We couldn&apos;t load your order status. Please check your profile or contact support.
            </p>
            <Link
              href="/profile"
              className="px-8 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full hover:bg-[#3A322C] transition-colors"
            >
              Go to Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersConfirmPage />
    </Suspense>
  );
}
