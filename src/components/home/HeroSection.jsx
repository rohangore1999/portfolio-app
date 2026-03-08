"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, wrap } from "framer-motion";
import { useRef } from "react";

function MarqueeName() {
  const baseX = useMotionValue(0);
  const speed = 100;
  const prevTime = useRef(null);
  const trackRef = useRef(null);
  const itemWidth = useRef(0);

  useAnimationFrame((t) => {
    if (prevTime.current === null) {
      prevTime.current = t;
      // measure one item's width (half the track = 2 copies)
      if (trackRef.current) {
        itemWidth.current = trackRef.current.scrollWidth / 2;
      }
      return;
    }
    const delta = t - prevTime.current;
    prevTime.current = t;

    const next = baseX.get() - (speed * delta) / 1000;
    // wrap back to 0 once we've scrolled exactly one "set" (half the track)
    baseX.set(itemWidth.current > 0 ? wrap(-itemWidth.current, 0, next) : next);
  });

  return (
    <motion.div
      ref={trackRef}
      className="flex whitespace-nowrap"
      style={{ x: baseX }}
    >
      {[...Array(4)].map((_, i) => (
        <h1
          key={i}
          className="font-sans text-white font-light whitespace-nowrap leading-none tracking-tight pr-16"
          style={{ fontSize: "max(9rem, 15vw)" }}
        >
          Rohan Gore —
        </h1>
      ))}
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative snap-start overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: "#000",
        height: "100dvh",
        marginTop: "var(--nav-height)",
      }}
    >
      {/* Portrait image — mobile only */}
      <div className="md:hidden absolute inset-0 z-0">
        <Image
          src="/images/home/hero-section-web.jpg"
          alt="Rohan Gore"
          fill
          priority
          className="object-cover origin-center scale-105"
          style={{ objectPosition: "center 60%" }}
        />
      </div>

      {/* Gradient overlay — mobile only */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Name — mobile only, marquee scrolling near bottom */}
      <div
        className="md:hidden absolute inset-x-0 z-10 overflow-hidden"
        style={{ bottom: "calc(6rem + env(safe-area-inset-bottom))" }}
      >
        <MarqueeName />
      </div>

      {/* Designation — mobile only, pinned to bottom */}
      <motion.div
        className="md:hidden absolute left-6 z-10"
        style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <p
          className="font-sans text-white/80 font-light tracking-widest uppercase"
          style={{ fontSize: "24px" }}
        >
          Software Engineer
        </p>
      </motion.div>

      {/* Desktop — full background image with text overlay */}
      <div className="hidden md:block absolute inset-0 z-0">
        <Image
          src="/images/home/hero-section-web.jpg"
          alt="Rohan Gore"
          fill
          priority
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      </div>

      {/* Desktop — text only, centered at bottom */}
      <div className="hidden md:flex flex-col items-center gap-4 z-10 absolute bottom-12 left-0 right-0">
        <motion.h1
          className="font-sans text-white font-light text-center whitespace-nowrap leading-none tracking-tight"
          style={{ fontSize: "clamp(5rem, 10vw, 12rem)" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Rohan Gore
        </motion.h1>

        <motion.p
          className="font-sans text-white/50 font-light tracking-widest uppercase"
          style={{ fontSize: "clamp(0.75rem, 1vw, 1rem)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          Software Engineer
        </motion.p>
      </div>
    </section>
  );
}
