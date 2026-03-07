"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";
import { recentWork } from "@/constants/home";

export default function WorkSection() {
  const { navigate } = useTransition();
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const sectionRef = useRef(null);

  // Start off-screen so image doesn't flash at origin on mount
  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);

  const springX = useSpring(cursorX, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });
  const springY = useSpring(cursorY, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative bg-black flex flex-col snap-start px-8 md:px-16 pt-20 md:pt-28 pb-8 md:pb-12 overflow-hidden h-[calc(100vh-70px)] md:h-screen"
    >
      {/* Floating cursor image
          left/top = cursor position, -translate-x/y-1/2 shifts it so center = cursor */}
      <motion.div
        className="absolute pointer-events-none z-50 w-48 h-60 rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2"
        style={{ left: springX, top: springY }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.6 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {hoveredImage && (
          <Image
            src={hoveredImage}
            alt="Project preview"
            fill
            className="object-cover"
          />
        )}
        {/* Orange "View" badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center"
            animate={isHovering ? {
              scale: [null, 1.15, 1.05],
              rotate: [null, 5, 0],
            } : { scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              times: [0, 0.6, 1],
              ease: ["easeInOut", "easeOut"],
            }}
          >
            <span className="text-white text-sm font-semibold">View</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Label */}
      <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
        Recent Work
      </p>

      {/* Divider */}
      <div className="border-t border-white/20" />

      {/* Work items */}
      <div className="flex-1">
        {recentWork.map((item) => (
          <div
            key={item.title}
            className="group flex items-center justify-between py-4 md:py-6 border-b border-white/20 cursor-pointer"
            onClick={() => navigate(item.href, "work")}
            onMouseEnter={() => {
              setIsHovering(true);
              setHoveredImage(item.image);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
              setHoveredImage(null);
            }}
          >
            <h2 className="text-3xl md:text-6xl font-light text-white transition-all duration-300 group-hover:opacity-60 group-hover:scale-105 group-hover:translate-x-2 origin-left">
              {item.title}
            </h2>
            <span className="text-xs md:text-sm text-white/40 transition-all duration-300 group-hover:opacity-60 group-hover:scale-105 group-hover:-translate-x-2 hidden md:block">
              {item.category}
            </span>
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/work", "work")}
          className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          View All Work →
        </button>
      </div>
    </section>
  );
}
