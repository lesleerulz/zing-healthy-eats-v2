"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Star, ArrowLeft, Check } from "lucide-react";

import { useCart } from "@/components/CartProvider";

const MOCK_META = {
  description:
    "Crafted in small batches with real ingredients and uncompromising flavor. Enjoy it with cold milk, yogurt, or straight out of the bag.",
  ingredients: ["Rolled Oats", "Wild Honey", "Roasted Almonds", "Coconut Oil", "Vanilla Extract", "Sea Salt"],
  rating: 4.9,
  reviews: 128,
};

type Product = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

export default function ProductDetailsPage() {
  const { id: idParam } = useParams();
  const productId = Number(idParam);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  // Image is 120% height, so it can only shift up to -20% before revealing background
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!cancelled && data.status && data.data) {
          setProduct(data.data);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: `KES ${product.price.toLocaleString()}`,
      imageUrl: product.image,
      quantity: quantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-[#7A614A] uppercase tracking-widest text-xs font-semibold">
          Loading…
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-4">
        <p className="text-[#1C1816] font-[family-name:var(--font-playfair)] text-2xl">
          Product not found
        </p>
        <a href="/catalog" className="px-8 py-3 bg-[#1C1816] text-[#FAF8F5] rounded-full hover:bg-[#3A322C] transition-colors">
          Back to Pantry
        </a>
      </div>
    );
  }

  const display = {
    ...MOCK_META,
    title: product.title,
    description: product.description || MOCK_META.description,
    category: product.category,
    imageUrl: product.image,
    priceLabel: `KES ${product.price.toLocaleString()}`,
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
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%]">
              <div
                className="w-full h-full bg-cover bg-center mix-blend-multiply opacity-90"
                style={{ backgroundImage: `url('${display.imageUrl}')` }}
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
              <p className="text-xs uppercase tracking-[0.3em] text-[#9A8A7A] mb-4">{display.category}</p>
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1C1816] mb-6 leading-tight">
                {display.title}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-[#D4A373]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-[#7A614A]">{display.rating} ({display.reviews} reviews)</span>
              </div>

              <p className="text-2xl font-medium text-[#1C1816] mb-8">{display.priceLabel}</p>

              <p className="text-[#5C4D3C] text-lg leading-relaxed mb-12">
                {display.description}
              </p>

              {/* Add to Cart Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <div className="flex items-center border border-[#DCD4C4] rounded-full px-4 py-2 w-fit opacity-90">
                  <button
                    disabled={product.quantity === 0}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#7A614A] hover:text-[#1C1816] p-2 transition-colors disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-[#1C1816] font-medium">{product.quantity === 0 ? 0 : quantity}</span>
                  <button
                    disabled={product.quantity === 0 || quantity >= product.quantity}
                    onClick={() => setQuantity(Math.min(quantity + 1, product.quantity))}
                    className="text-[#7A614A] hover:text-[#1C1816] p-2 transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={product.quantity === 0}
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-full font-semibold tracking-wide transition-all duration-300 ${
                    product.quantity === 0 
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#1C1816] text-[#FAF8F5] hover:bg-[#3A322C]"
                  }`}
                >
                  {product.quantity === 0 ? (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Out of Stock
                    </>
                  ) : isAdded ? (
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
                      Add to order — KES {(product.price * quantity).toLocaleString()}
                    </>
                  )}
                </button>
              </div>

              {/* Ingredients List */}
              <div className="border-t border-[#DCD4C4] pt-8">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816] mb-6">Real Ingredients.</h3>
                <ul className="grid grid-cols-2 gap-y-4 text-[#7A614A]">
                  {display.ingredients.map((ing, i) => (
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
