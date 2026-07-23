"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, toggleCart } = useCart();
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsMobileMenuOpen(false); // Close menu on scroll down
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-colors duration-500",
        isScrolled || isMobileMenuOpen
          ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#DCD4C4] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2 cursor-pointer z-50">
        <a href="/" className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#1C1816] tracking-tighter hover:opacity-80 transition-opacity">
          Zing Healthy Treats<span className="text-[#D4A373]">.</span>
        </a>
      </div>

      <div className="hidden md:flex items-center gap-10 text-sm tracking-widest uppercase font-semibold text-[#7A614A]">
        <a href="/catalog" className="hover:text-[#1C1816] transition-colors relative group">
          Pantry
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1C1816] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="/subscribe" className="hover:text-[#1C1816] transition-colors relative group">
          Subscriptions
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1C1816] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#" className="hover:text-[#1C1816] transition-colors relative group">
          Our Story
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1C1816] transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>

      <div className="flex items-center gap-4 text-[#1C1816] z-50">
        <a href={isLoggedIn ? "/profile" : "/auth"} className="p-2 hover:bg-[#EBE5D9] rounded-full transition-colors flex items-center justify-center">
          <User className="w-5 h-5" strokeWidth={1.5} />
        </a>
        <button onClick={toggleCart} className="p-2 hover:bg-[#EBE5D9] rounded-full transition-colors relative">
          <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#1C1816] text-[#FAF8F5] text-[10px] font-bold flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-[#EBE5D9] rounded-full transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#FAF8F5] border-b border-[#DCD4C4] shadow-lg flex flex-col md:hidden py-6 px-6 gap-6 z-40"
          >
            <a href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1C1816] font-semibold text-lg uppercase tracking-widest text-center">
              Pantry
            </a>
            <a href="/subscribe" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1C1816] font-semibold text-lg uppercase tracking-widest text-center">
              Subscriptions
            </a>
            <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1C1816] font-semibold text-lg uppercase tracking-widest text-center">
              Our Story
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
