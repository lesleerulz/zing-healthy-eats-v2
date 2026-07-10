"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("zing-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage and update total whenever cart changes
  useEffect(() => {
    localStorage.setItem("zing-cart", JSON.stringify(cart));
    
    const total = cart.reduce((sum, item) => {
      const priceNumeric = parseFloat(item.price.replace(/KES |,|_/g, ''));
      return sum + (priceNumeric * item.quantity);
    }, 0);
    
    setCartTotal(total);
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === newItem.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prevCart, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) => 
      prevCart.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("zing-cart");
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{ cart, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
