"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ProductCard3DProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
}

export default function ProductCard3D({
  title,
  description,
  price,
  imageUrl,
  category,
}: ProductCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group cursor-pointer relative w-full perspective-[1000px]"
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="aspect-[4/5] bg-[#EBE5D9] mb-6 overflow-hidden relative shadow-xl"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
      </div>
      
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="flex justify-between items-start"
      >
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#9A8A7A] mb-2">{category}</p>
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#1C1816] mb-2">{title}</h3>
          <p className="text-sm text-[#7A614A] line-clamp-2 max-w-[85%]">{description}</p>
        </div>
        <p className="font-medium text-[#1C1816]">{price}</p>
      </div>
      
      {/* Invisible layer to catch mouse events properly over the 3D space */}
      <div className="absolute inset-0 z-10" />
    </motion.div>
  );
}
