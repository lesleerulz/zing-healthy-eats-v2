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

          {/* Right Column - Subscription Form (Coming Soon) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#EBE5D9] text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-[#EBE5D9] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-[#7A614A]" />
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1C1816] mb-4">Coming Soon</h2>
              <p className="text-[#7A614A] text-lg leading-relaxed max-w-md">
                We're putting the finishing touches on our exclusive Zing Nuts Club subscription service. 
                <br/><br/>
                Stay tuned! You'll soon be able to get your favorite roasted nuts delivered automatically to your door.
              </p>
              
              <button 
                disabled
                className="w-full max-w-sm mt-8 py-4 bg-[#EBE5D9] text-[#7A614A] rounded-full font-semibold tracking-wide cursor-not-allowed"
              >
                Subscriptions Opening Soon
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
