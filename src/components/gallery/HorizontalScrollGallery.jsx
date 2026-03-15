"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const ITEM_WIDTH = 480;
const ITEM_HEIGHT = 640;
const ITEM_WIDTH_MOBILE = 320;
const ITEM_HEIGHT_MOBILE = 480;
const GAP = 30;
const GAP_MOBILE = 15;

export default function HorizontalScrollGallery({ items, scrollContainerRef }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    container: scrollContainerRef,
  });

  // Virtualization: Track which images are currently visible
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 7 });

  // Calculate total distance for horizontal movement
  // Need to scroll enough to show the last card fully centered
  const totalDistance = (items.length - 1) * (ITEM_WIDTH + GAP) + ITEM_WIDTH;
  const totalDistanceMobile = (items.length - 1) * (ITEM_WIDTH_MOBILE + GAP_MOBILE) + ITEM_WIDTH_MOBILE;
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);
  const xMobile = useTransform(scrollYProgress, [0, 1], [0, -totalDistanceMobile]);

  // Very fast spring animation - near instant response
  const smoothX = useSpring(x, {
    stiffness: 300,   // Extremely high = extremely fast
    damping: 15,      // Very low damping = minimal drag
    mass: 0.05,       // Ultra light = instant response
    restDelta: 0.001,
    restSpeed: 0.001,
  });

  const smoothXMobile = useSpring(xMobile, {
    stiffness: 300,   // Matched to desktop
    damping: 15,      // Minimal resistance
    mass: 0.05,       // Ultra light and fast
    restDelta: 0.001,
    restSpeed: 0.001,
  });

  // Update visible range based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate current position in pixels
    const currentX = Math.abs(latest * totalDistance);
    const currentXMobile = Math.abs(latest * totalDistanceMobile);
    
    // Determine center card index (use desktop calculation as reference)
    const centerIndex = Math.floor(currentX / (ITEM_WIDTH + GAP));
    
    // Buffer: show 3 cards before and 3 cards after the center
    const bufferSize = 3;
    const startIndex = Math.max(0, centerIndex - bufferSize);
    const endIndex = Math.min(items.length, centerIndex + bufferSize + 1);
    
    // Only update if range changed (avoid unnecessary re-renders)
    setVisibleRange(prev => {
      if (prev.start !== startIndex || prev.end !== endIndex) {
        return { start: startIndex, end: endIndex };
      }
      return prev;
    });
  });

  return (
    <>
      {/* Intro Section */}
      <section className="h-[50vh] flex flex-col justify-end items-center text-center pb-10 md:pb-16">
        <motion.h1
          className="font-sans text-white font-light text-6xl md:text-8xl uppercase tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Gallery
        </motion.h1>
        <motion.p
          className="font-sans text-white/50 font-light tracking-widest uppercase text-sm mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          Mobile Photography
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="text-white/40 text-xs md:text-sm uppercase tracking-widest">
            Scroll to explore
          </p>
          <motion.svg
            className="w-5 h-5 md:w-6 md:h-6 text-white/40"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </motion.svg>
        </motion.div>
      </section>

      {/* Scroll Container */}
      <div ref={containerRef} className="h-[5000vh] relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-visible">
          {/* Desktop Gallery - Virtualized */}
          <motion.div
            className="hidden md:block relative"
            style={{ 
              x: smoothX,
              width: ITEM_WIDTH,
              height: ITEM_HEIGHT,
              willChange: "transform",
            }}
          >
          {items.map((item, index) => {
            // Check if this image is in the visible range
            const isVisible = index >= visibleRange.start && index < visibleRange.end;
            
            return (
              <div
                key={item.id}
                className="absolute w-[480px] h-[640px] rounded-xl overflow-hidden"
                style={{
                  left: index * (ITEM_WIDTH + GAP),
                  top: 0,
                }}
              >
                {isVisible && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="480px"
                    priority={index < 3}
                    quality={90}
                    placeholder={item.blurDataURL ? "blur" : "empty"}
                    blurDataURL={item.blurDataURL}
                  />
                )}
                {/* Show placeholder for non-visible images */}
                {!isVisible && item.blurDataURL && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.blurDataURL})`,
                      filter: 'blur(20px)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Mobile Gallery - Virtualized */}
        <motion.div
          className="block md:hidden relative"
          style={{ 
            x: smoothXMobile,
            width: ITEM_WIDTH_MOBILE,
            height: ITEM_HEIGHT_MOBILE,
            willChange: "transform",
          }}
        >
          {items.map((item, index) => {
            // Check if this image is in the visible range
            const isVisible = index >= visibleRange.start && index < visibleRange.end;
            
            return (
              <div
                key={item.id}
                className="absolute w-[320px] h-[480px] rounded-xl overflow-hidden"
                style={{
                  left: index * (ITEM_WIDTH_MOBILE + GAP_MOBILE),
                  top: 0,
                }}
              >
                {isVisible && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                    priority={index < 3}
                    quality={90}
                    placeholder={item.blurDataURL ? "blur" : "empty"}
                    blurDataURL={item.blurDataURL}
                  />
                )}
                {/* Show placeholder for non-visible images */}
                {!isVisible && item.blurDataURL && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.blurDataURL})`,
                      filter: 'blur(20px)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>

      {/* Outro Section */}
      <section className="h-screen flex justify-center items-center">
        <motion.p
          className="font-sans text-white/50 text-6xl md:text-8xl font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          End
        </motion.p>
      </section>
    </>
  );
}
