"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ProductCard3D from "@/components/ProductCard3D";

interface FeaturedProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

export default function HomePageClient({ featuredProducts }: { featuredProducts: FeaturedProduct[] }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    '/granola_hero.jpg',
    '/product2.jpg',
    '/product4.jpg',
    '/product7.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#EBE5D9] min-h-screen text-[#2A2421] selection:bg-[#D4A373] selection:text-white" ref={containerRef}>
      <main className="pt-32 pb-20">
        {/* Editorial Hero Section */}
        <section className="relative h-[85vh] w-full px-6 md:px-12 lg:px-24 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
            
            {/* Left Typography */}
            <motion.div 
              style={{ y: y1, opacity }}
              className="lg:col-span-7 z-20 flex flex-col justify-center"
            >
              <div className="overflow-hidden mb-4">
                <motion.p 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  className="text-sm md:text-base uppercase tracking-[0.3em] text-[#8B7355] font-medium"
                >
                  Est. 2024 — Artisanal Batches
                </motion.p>
              </div>
              
              <h1 className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter text-[#1C1816]">
                <div className="overflow-hidden">
                  <motion.span 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
                    className="block"
                  >
                    Raw.
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                    className="block text-[#7A614A] italic pr-8"
                  >
                    Roasted.
                  </motion.span>
                </div>
                <div className="overflow-hidden">
                  <motion.span 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
                    className="block"
                  >
                    Real.
                  </motion.span>
                </div>
              </h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                className="mt-12 flex items-center gap-8"
              >
                <a href="/catalog" className="group relative overflow-hidden bg-transparent text-[#1C1816] pb-2 uppercase tracking-widest text-sm font-semibold">
                  <span className="relative z-10">Shop the collection</span>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#1C1816] origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0"></div>
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#D4A373] origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Abstract Visual (Carousel) */}
            <motion.div 
              style={{ y: y2 }}
              className="lg:col-span-5 hidden lg:flex justify-end relative h-[600px] w-full"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
                className="absolute right-0 top-10 w-[80%] h-full bg-[#DCD4C4] rounded-t-[200px] overflow-hidden shadow-2xl relative"
              >
                {/* Carousel Images */}
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={currentImageIndex}
                    src={heroImages[currentImageIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                    alt="Artisanal Granola"
                  />
                </AnimatePresence>
                
                {/* Carousel Progress Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {heroImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        idx === currentImageIndex ? "w-8 bg-[#1C1816]" : "w-2 bg-[#1C1816]/30"
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#DCD4C4]/80 via-transparent to-transparent z-10 pointer-events-none"></div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute -left-12 bottom-32 bg-[#FAF8F5] p-6 shadow-xl max-w-xs z-30"
              >
                <p className="font-[family-name:var(--font-playfair)] italic text-[#7A614A] text-lg mb-2">"The crunch is unmistakable."</p>
                <p className="text-xs uppercase tracking-widest text-[#9A8A7A]">Slow baked for 4 hours</p>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* Products Showcase (Ingredient Book Style) */}
        <section className="w-full relative px-6 md:px-12 lg:px-24 py-32 bg-[#F3EAD3] mt-12 overflow-hidden">
          
          {/* Subtle Paper Noise Texture Overlay */}
          <div 
            className="absolute inset-0 z-0 mix-blend-multiply opacity-20 pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
          ></div>

          {/* Proper SVG Torn Paper Edge */}
          <svg 
            className="absolute top-0 left-0 w-full h-[40px] -mt-[39px] z-20 pointer-events-none" 
            preserveAspectRatio="none" 
            width="100%" 
            height="100%"
          >
            <defs>
              <filter id="torn-edge" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            {/* The rect sits halfway down, so its top edge gets distorted upwards/downwards creating a rip */}
            <rect x="-5%" y="20" width="110%" height="50" fill="#F3EAD3" filter="url(#torn-edge)" />
          </svg>
          
          {/* Add a subtle "book spine" inner shadow on the left for the ingredient book look */}
          <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-[#D4A373]/30 to-transparent pointer-events-none z-10"></div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b-2 border-dashed border-[#DCD4C4] pb-8 relative z-20">
            <h2 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#1C1816]">The Harvest</h2>
            <Link href="/catalog" className="uppercase tracking-widest text-xs font-semibold text-[#7A614A] hover:text-[#1C1816] transition-colors mt-6 md:mt-0">
              View Entire Pantry &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: index * 0.1 }}
              >
                <Link href={`/product/${product.id}`} className="block">
                  <ProductCard3D 
                    {...product} 
                    price={`Ksh ${parseFloat(product.price).toLocaleString()}`} 
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
