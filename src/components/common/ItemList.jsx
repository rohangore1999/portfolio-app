"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function ItemList({
  items,
  label = "Items",
  badgeLabel = "View",
}) {
  const { navigate } = useTransition();
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const listRef = useRef(null);

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
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={listRef}
      onMouseMove={handleMouseMove}
      className="relative px-8 md:px-16 pb-16"
    >
      {/* Floating cursor image */}
      <motion.div
        className="absolute pointer-events-none z-50 w-48 h-60 rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2"
        style={{ left: springX, top: springY }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.6 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {hoveredImage && (
          <Image
            src={hoveredImage}
            alt="preview"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center"
            animate={
              isHovering
                ? { scale: [null, 1.15, 1.05], rotate: [null, 5, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{
              duration: 0.5,
              times: [0, 0.6, 1],
              ease: ["easeInOut", "easeOut"],
            }}
          >
            <span className="text-white text-sm font-semibold">
              {badgeLabel}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Column header */}
      <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
        {label}
      </p>
      <div className="border-t border-white/20" />

      {/* Items */}
      {items.map((item, i) => (
        <div
          key={item.title}
          className={`group flex items-center justify-between py-5 md:py-8 cursor-pointer ${i < items.length - 1 ? "border-b border-white/20" : ""}`}
          onClick={() => navigate(item.href, item.title.toLowerCase())}
          onMouseEnter={() => {
            if (item.image) {
              setIsHovering(true);
              setHoveredImage(item.image);
            }
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoveredImage(null);
          }}
        >
          {/* Left: title + description + tags */}
          <div className="transition-all duration-300 group-hover:translate-x-2 origin-left flex-1 min-w-0 pr-6">
            <h2 className="text-3xl md:text-6xl font-light text-white transition-all duration-300 group-hover:opacity-60 group-hover:scale-105 origin-left">
              {item.title}
            </h2>
            {item.description && (
              <p className="hidden md:block mt-2 text-sm text-white/35 leading-relaxed max-w-xl transition-all duration-300 group-hover:opacity-60">
                {item.description}
              </p>
            )}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 border border-white/15 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: year + category */}
          <div className="hidden md:flex flex-col items-end gap-1 transition-all duration-300 group-hover:opacity-60 group-hover:-translate-x-2 shrink-0 ml-8">
            {item.year && (
              <span className="text-xs uppercase tracking-widest text-white/25">
                {item.year}
              </span>
            )}
            <span className="text-xs md:text-sm text-white/40">
              {item.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
