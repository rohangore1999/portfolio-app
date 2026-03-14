"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
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

  // Calculate total distance for horizontal movement
  const totalDistance = (items.length - 1) * (ITEM_WIDTH + GAP);
  const totalDistanceMobile = (items.length - 1) * (ITEM_WIDTH_MOBILE + GAP_MOBILE);
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);
  const xMobile = useTransform(scrollYProgress, [0, 1], [0, -totalDistanceMobile]);

  // Add smooth spring animation to the scroll
  const smoothX = useSpring(x, {
    stiffness: 100,   // Lower = slower, more elastic (default: 100)
    damping: 30,      // Higher = less bouncy (default: 10)
    mass: 0.5,        // Higher = more inertia (default: 1)
  });

  const smoothXMobile = useSpring(xMobile, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
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
      </section>

      {/* Scroll Container */}
      <div ref={containerRef} className="h-[300vh] relative">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-visible">
          <div className="w-[320px] md:w-[480px] flex items-center justify-start overflow-visible">
            {/* Desktop Gallery */}
            <motion.div
              className="hidden md:flex gap-[30px] will-change-transform"
              style={{ x: smoothX }}
            >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[480px] h-[640px] rounded-xl relative overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="480px"
                  priority={item.id <= 5}
                  quality={90}
                  placeholder={item.blurDataURL ? "blur" : "empty"}
                  blurDataURL={item.blurDataURL}
                />
              </div>
            ))}
          </motion.div>

          {/* Mobile Gallery */}
          <motion.div
            className="flex md:hidden gap-[15px] will-change-transform"
            style={{ x: smoothXMobile }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[320px] h-[480px] rounded-xl relative overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority={item.id <= 5}
                  quality={90}
                  placeholder={item.blurDataURL ? "blur" : "empty"}
                  blurDataURL={item.blurDataURL}
                />
              </div>
            ))}
          </motion.div>
        </div>
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
