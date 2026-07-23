"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Repeat } from "lucide-react";
import { useCart } from "@/components/CartProvider";

const SUBSCRIPTION_PLANS = [
  {
    id: "monthly_nuts",
    name: "Monthly Nuts Bundle",
    description: "A curated selection of our finest roasted nuts delivered to your door every month.",
    price: 3500, // KES
    interval: "month"
  }
];

export default function SubscribePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.status && data.data) {
            setFormData(prev => ({
              ...prev,
              name: data.data.username || prev.name,
              email: data.data.email || prev.email,
              phone: data.data.savedPhone || prev.phone,
            }));
          }
        }
      } catch {
        // ignore
      }
    }
    loadUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/subscribe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          planId: "monthly_nuts", 
          amount: SUBSCRIPTION_PLANS[0].price,
        })
      });

      const data = await response.json();

      if (data.status && data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        alert(data.message || "Subscription initialization failed");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="h-24"></div>
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <a 
          href="/catalog"
          className="inline-flex items-center text-[#7A614A] hover:text-[#1C1816] transition-colors mb-8 uppercase tracking-widest text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pantry
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Sales Pitch */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl text-[#1C1816] mb-6 leading-tight">
              Never Run Out of Goodness.
            </h1>
            <p className="text-[#5C4D3C] text-lg leading-relaxed mb-8">
              Join the **Zing Nuts Club**. We hand-select our finest roasted almonds, cashews, and macadamias, and deliver a fresh bundle to your door every single month. Pause or cancel anytime.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#4F7A4F] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#1C1816]">Freshly Roasted</h3>
                  <p className="text-[#7A614A] text-sm">Every batch is roasted just days before delivery.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Repeat className="w-6 h-6 text-[#4F7A4F] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#1C1816]">Automatic Delivery</h3>
                  <p className="text-[#7A614A] text-sm">Billed automatically. Zero hassle. Cancel anytime.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-[#EBE5D9] rounded-2xl border border-[#DCD4C4]">
              <h4 className="font-[family-name:var(--font-playfair)] text-xl text-[#1C1816] mb-2">Need Help?</h4>
              <p className="text-[#7A614A] text-sm">
                Call our support team directly at <span className="font-bold text-[#1C1816]">+254 116 837 977</span>
              </p>
            </div>
          </div>

          {/* Right Column - Subscription Form */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-[#EBE5D9]">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#1C1816] mb-2">Subscribe Now</h2>
              <p className="text-[#7A614A] mb-8">Set up your monthly recurring payment securely.</p>
              
              <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#DCD4C4] mb-8 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#1C1816]">Monthly Nuts Bundle</h3>
                  <p className="text-[#7A614A] text-sm">Billed every month</p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816]">KES 3,500</p>
                  <p className="text-[#7A614A] text-xs">/ month</p>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#7A614A] font-semibold mb-2 block">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-[#DCD4C4] rounded-lg focus:outline-none focus:border-[#1C1816] text-[#1C1816]" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#7A614A] font-semibold mb-2 block">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-[#DCD4C4] rounded-lg focus:outline-none focus:border-[#1C1816] text-[#1C1816]" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[#7A614A] font-semibold mb-2 block">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} placeholder="0712345678" onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-[#DCD4C4] rounded-lg focus:outline-none focus:border-[#1C1816] text-[#1C1816]" />
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#EBE5D9] border border-[#DCD4C4] rounded-xl mt-4">
                  <ShieldCheck className="w-5 h-5 text-[#7A614A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#1C1816]">Secure Subscription Setup</p>
                    <p className="text-xs text-[#7A614A] mt-1">You will be redirected to Paystack to authenticate your card or M-Pesa. You will be billed automatically every month.</p>
                  </div>
                </div>

                <button 
                  disabled={isProcessing}
                  type="submit" 
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#1C1816] text-[#FAF8F5] rounded-full font-semibold tracking-wide transition-all hover:bg-[#3A322C] disabled:opacity-70 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Setting up Subscription...
                    </>
                  ) : (
                    "Subscribe for KES 3,500 / month"
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
