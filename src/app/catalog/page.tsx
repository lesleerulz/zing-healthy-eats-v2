"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard3D from "@/components/ProductCard3D";

// Hardcoded for now, but we will fetch this from Prisma!
const CATALOG_PRODUCTS = [
  {
    id: 1,
    title: "Signature Honey Almond",
    description: "Oats baked with pure wild honey, roasted almonds, and a hint of vanilla.",
    price: "KES 1,200",
    category: "Granola",
    imageUrl: "/product1.jpg"
  },
  {
    id: 2,
    title: "Tropical Sunrise",
    description: "A vibrant blend of dried mango, toasted coconut, macadamia nuts, and cashews.",
    price: "KES 1,500",
    category: "Trail Mix",
    imageUrl: "/product2.jpg"
  },
  {
    id: 3,
    title: "Dark Choc Hazelnut",
    description: "Roasted hazelnuts bound together with rich 70% dark chocolate and sea salt.",
    price: "KES 1,800",
    category: "Premium",
    imageUrl: "/product3.jpg"
  },
  {
    id: 4,
    title: "Berry Antioxidant Blend",
    description: "A tangy and sweet mix of goji berries, dried cranberries, walnuts, and pumpkin seeds.",
    price: "KES 1,450",
    category: "Trail Mix",
    imageUrl: "/product4.jpg"
  },
  {
    id: 5,
    title: "Maple Pecan Crunch",
    description: "Autumn flavors packed into crunchy oats with real maple syrup and toasted pecans.",
    price: "KES 1,300",
    category: "Granola",
    imageUrl: "/product5.jpg"
  },
  {
    id: 6,
    title: "Spicy Sriracha Cashews",
    description: "For the bold. Jumbo cashews roasted in our house-made honey sriracha glaze.",
    price: "KES 1,600",
    category: "Premium",
    imageUrl: "/product6.jpg"
  },
  {
    id: 7,
    title: "Zesty Lemon & Poppy",
    description: "Bright and refreshing granola baked with fresh lemon zest and poppy seeds.",
    price: "KES 1,150",
    category: "Granola",
    imageUrl: "/product7.jpg"
  },
  {
    id: 8,
    title: "Savoury Rosemary Nuts",
    description: "A refined mix of walnuts and almonds roasted with fresh rosemary and sea salt.",
    price: "KES 1,700",
    category: "Premium",
    imageUrl: "/product8.jpg"
  },
  {
    id: 9,
    title: "Classic Power Mix",
    description: "The essential trail mix with peanuts, raisins, sunflower seeds, and dark chocolate drops.",
    price: "KES 950",
    category: "Trail Mix",
    imageUrl: "/product9.jpg"
  }
];

const CATEGORIES = ["All", "Granola", "Trail Mix", "Premium"];

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(CATALOG_PRODUCTS);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProducts(CATALOG_PRODUCTS);
    } else {
      setFilteredProducts(CATALOG_PRODUCTS.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

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
                  <ProductCard3D {...product} />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
