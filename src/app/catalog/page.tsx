"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard3D from "@/components/ProductCard3D";

const CATEGORIES = ["All", "Granola", "Trail Mix", "Premium"];

type CatalogProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPeoplesChoice: boolean;
};

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch {
        // ignore — empty catalog
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24">
      {/* Header Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl text-[#1C1816] mb-6">
            The Pantry.
          </h1>
          <p className="text-lg text-[#7A614A] max-w-2xl">
            Explore our full collection of artisanal, small-batch roasted goods. Every bag is packed with real ingredients and uncompromising flavor.
          </p>
        </motion.div>
      </section>

      {/* Categories Filter */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((category, i) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                activeCategory === category 
                  ? "bg-[#1C1816] text-[#FAF8F5]" 
                  : "bg-transparent text-[#7A614A] border border-[#DCD4C4] hover:border-[#1C1816] hover:text-[#1C1816]"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <a href={`/product/${product.id}`}>
                  <ProductCard3D
                    title={product.title}
                    description={product.description}
                    category={product.category}
                    price={`KES ${product.price.toLocaleString()}`}
                    imageUrl={product.image}
                  />
                </a>
              </motion.div>
            ))}
            {!loading && filteredProducts.length === 0 && (
              <p className="col-span-full text-center text-[#7A614A] py-12">
                No products found in this category.
              </p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
