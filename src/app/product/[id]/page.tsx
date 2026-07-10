"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Star, ArrowLeft, Check } from "lucide-react";

// In reality, this would be fetched from Prisma based on the `id` param
const MOCK_PRODUCT = {
  id: 1,
  title: "Signature Honey Almond",
  description: "Oats baked with pure wild honey, roasted almonds, and a hint of vanilla. Our signature blend is meticulously crafted in small batches to ensure the perfect crunch in every bite. Enjoy it with cold milk, yogurt, or straight out of the bag.",
  price: "KES 1,200",
  category: "Granola",
  imageUrl: "/product1.jpg",
  ingredients: ["Rolled Oats", "Wild Honey", "Roasted Almonds", "Coconut Oil", "Vanilla Extract", "Sea Salt"],
  rating: 4.9,
  reviews: 128
};

import { useCart } from "@/components/CartProvider";

export default function ProductDetailsPage() {
  const { scrollYProgress } = useScroll();
  // Image is 120% height, so it can only shift up to -20% before revealing background
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: MOCK_PRODUCT.id,
      title: MOCK_PRODUCT.title,
      price: MOCK_PRODUCT.price,
      imageUrl: MOCK_PRODUCT.imageUrl,
      quantity: quantity
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      
      {/* Navigation spacer */}
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        {/* Back button */}
        <motion.a 
          href="/catalog"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center text-[#7A614A] hover:text-[#1C1816] transition-colors mb-12 uppercase tracking-widest text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Pantry
        </motion.a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column - Image (Sticky) */}
          <div className="relative h-[60vh] lg:h-[80vh] lg:sticky lg:top-32 rounded-3xl overflow-hidden shadow-2xl bg-[#EBE5D9]">
            <motion.div 
              style={{ y }}
              className="absolute inset-0 w-full h-[120%]"
            >
              <div 
                className="w-full h-full bg-cover bg-center mix-blend-multiply opacity-90"
                style={{ backgroundImage: `url('${MOCK_PRODUCT.imageUrl}')` }}
              />
            </motion.div>
          </div>

          {/* Right Column - Details */}
          <div className="py-8 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#9A8A7A] mb-4">{MOCK_PRODUCT.category}</p>
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1C1816] mb-6 leading-tight">
                {MOCK_PRODUCT.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-[#D4A373]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-[#7A614A]">{MOCK_PRODUCT.rating} ({MOCK_PRODUCT.reviews} reviews)</span>
              </div>

              <p className="text-2xl font-medium text-[#1C1816] mb-8">{MOCK_PRODUCT.price}</p>
              
              <p className="text-[#5C4D3C] text-lg leading-relaxed mb-12">
                {MOCK_PRODUCT.description}
              </p>

              {/* Add to Cart Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <div className="flex items-center border border-[#DCD4C4] rounded-full px-4 py-2 w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#7A614A] hover:text-[#1C1816] p-2 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-[#1C1816] font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#7A614A] hover:text-[#1C1816] p-2 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full font-semibold tracking-wide transition-all duration-300 ${
                    isAdded 
                      ? "bg-emerald-600 text-white" 
                      : "bg-[#1C1816] text-[#FAF8F5] hover:bg-[#3A322C]"
                  }`}
                >
                  {isAdded ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Added to Cart
                    </motion.div>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to order — KES {(parseFloat(MOCK_PRODUCT.price.replace(/KES |,|_/g, '')) * quantity).toLocaleString()}
                    </>
                  )}
                </button>
              </div>

              {/* Ingredients List */}
              <div className="border-t border-[#DCD4C4] pt-8">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816] mb-6">Real Ingredients.</h3>
                <ul className="grid grid-cols-2 gap-y-4 text-[#7A614A]">
                  {MOCK_PRODUCT.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]"></div>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
