"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-[#1C1816]/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF8F5] shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#DCD4C4]">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816]">Your Order</h2>
              <button 
                onClick={toggleCart}
                className="p-2 text-[#7A614A] hover:text-[#1C1816] transition-colors rounded-full hover:bg-[#EBE5D9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#7A614A] gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="font-medium">Your pantry is empty.</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 px-6 py-2 border border-[#DCD4C4] rounded-full text-sm hover:bg-[#EBE5D9] transition-colors text-[#1C1816]"
                  >
                    Start foraging
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id}
                      className="flex gap-4"
                    >
                      {/* Item Image */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#EBE5D9] shrink-0">
                        <div 
                          className="w-full h-full bg-cover bg-center mix-blend-multiply"
                          style={{ backgroundImage: `url('${item.imageUrl}')` }}
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <h3 className="font-medium text-[#1C1816] text-sm leading-snug pr-4">{item.title}</h3>
                          <p className="text-[#7A614A] text-sm mt-1">{item.price}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-[#DCD4C4] rounded-full px-2 py-1 w-fit">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-[#7A614A] hover:text-[#1C1816] p-1 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-[#1C1816] text-sm font-medium">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-[#7A614A] hover:text-[#1C1816] p-1 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <p className="font-semibold text-[#1C1816] text-sm">
                            Ksh {(parseFloat(item.price.replace(/Ksh |KES |,/g, '')) * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-[#DCD4C4] p-6 bg-[#FAF8F5]">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[#7A614A] text-sm mb-1">Subtotal</p>
                    <p className="text-xs text-[#9A8A7A]">Shipping & taxes calculated at checkout</p>
                  </div>
                  <p className="font-[family-name:var(--font-playfair)] text-3xl text-[#1C1816]">
                    Ksh {cartTotal.toLocaleString()}
                  </p>
                </div>
                
                <a 
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#1C1816] text-[#FAF8F5] rounded-full font-semibold tracking-wide transition-all hover:bg-[#3A322C]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
