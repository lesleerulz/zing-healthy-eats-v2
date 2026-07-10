"use client";
import React, { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mpesa">("mpesa");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Build the items array from the cart for order creation
    const orderItems = cart.map(item => ({
      id: item.id,
      title: item.title,
      price: parseFloat(item.price.replace(/KES |,|_/g, '')),
      quantity: item.quantity,
    }));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: paymentMethod === "card" ? "initialize" : "charge_mobile_money",
          email: formData.email,
          phone: formData.phone,
          amount: cartTotal,
          provider: "mpesa",
          items: orderItems,
        })
      });

      const data = await response.json();

      if (data.status) {
        if (paymentMethod === "card" && data.data.authorization_url) {
          // Clear cart and redirect to Paystack secure checkout
          clearCart();
          window.location.href = data.data.authorization_url;
        } else if (paymentMethod === "mpesa") {
          // M-Pesa push sent to phone (or mock success)
          clearCart();
          window.location.href = `/orders?reference=${data.data.reference}`;
        }
      } else {
        alert("Payment failed: " + data.message);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-32 px-6 flex flex-col items-center justify-center">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1C1816] mb-4">Your order is empty.</h1>
        <a href="/catalog" className="px-8 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full hover:bg-[#3A322C] transition-colors">
          Return to Pantry
        </a>
      </div>
    );
  }

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
          
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-7">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#1C1816] mb-10">Secure Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div>
                <h2 className="text-sm uppercase tracking-widest text-[#7A614A] font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" name="name" placeholder="Full Name" onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-[#DCD4C4] rounded-lg focus:outline-none focus:border-[#1C1816] text-[#1C1816] placeholder-[#9A8A7A]" />
                  <input required type="email" name="email" placeholder="Email Address" onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-[#DCD4C4] rounded-lg focus:outline-none focus:border-[#1C1816] text-[#1C1816] placeholder-[#9A8A7A]" />
                  <input required type="tel" name="phone" placeholder="Phone (e.g. 0712345678)" onChange={handleInputChange} className="w-full px-4 py-3 bg-transparent border border-[#DCD4C4] rounded-lg focus:outline-none focus:border-[#1C1816] text-[#1C1816] placeholder-[#9A8A7A] md:col-span-2" />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-sm uppercase tracking-widest text-[#7A614A] font-semibold mb-4">Payment Method</h2>
                <div className="flex flex-col gap-4">
                  <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-[#1C1816] bg-[#EBE5D9]' : 'border-[#DCD4C4] hover:border-[#1C1816]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'mpesa'} onChange={() => setPaymentMethod('mpesa')} className="accent-[#1C1816] w-4 h-4" />
                      <span className="font-semibold text-[#1C1816]">M-Pesa (Mobile Money)</span>
                    </div>
                    <span className="text-xs font-semibold text-[#25D366] bg-[#25D366]/10 px-2 py-1 rounded">INSTANT</span>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#1C1816] bg-[#EBE5D9]' : 'border-[#DCD4C4] hover:border-[#1C1816]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#1C1816] w-4 h-4" />
                      <span className="font-semibold text-[#1C1816]">Credit / Debit Card</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                disabled={isProcessing}
                type="submit" 
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#1C1816] text-[#FAF8F5] rounded-full font-semibold tracking-wide transition-all hover:bg-[#3A322C] disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Securely...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay KES {cartTotal.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#EBE5D9] p-8 rounded-3xl sticky top-32">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-[#FAF8F5] shrink-0 relative">
                      <div className="w-full h-full bg-cover bg-center mix-blend-multiply" style={{ backgroundImage: `url('${item.imageUrl}')` }} />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#7A614A] text-white text-[10px] flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-medium text-[#1C1816] text-sm leading-tight mb-1">{item.title}</h3>
                      <p className="text-[#7A614A] text-sm font-semibold">
                         KES {(parseFloat(item.price.replace(/KES |,|_/g, '')) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#DCD4C4] pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-[#7A614A]">
                  <span>Subtotal</span>
                  <span>KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#7A614A]">
                  <span>Delivery</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between font-bold text-[#1C1816] text-xl pt-4 border-t border-[#DCD4C4] mt-4">
                  <span>Total</span>
                  <span>KES {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
