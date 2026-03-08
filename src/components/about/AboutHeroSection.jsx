"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect } from "react";

export default function AboutHeroSection() {
  const imgRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (imgRef.current) {
        imgRef.current.style.objectPosition = window.innerWidth >= 768 ? "center center" : "center 85%";
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <section className="h-dvh flex flex-col px-6 pt-[calc(var(--nav-height)+0.5rem)] pb-4 snap-start overflow-hidden">
      {/* Hero Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center shrink-0 mb-3 md:mb-2"
      >
        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold w-[92vw] mb-8 md:mb-0">
          {["About", "me,", "a", "Software", "Engineer"].map((word, index) => (
            <motion.span
              key={`line1-${index}`}
              className={`inline-block mr-2 ${
                word === "About" || word === "me,"
                  ? "text-white/40"
                  : "text-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          {["living", "in", "Bangalore"].map((word, index) => (
            <motion.span
              key={`line2-${index}`}
              className={`inline-block mr-2 ${
                word === "Bangalore" ? "text-orange-500" : "text-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: (5 + index) * 0.05,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Image + Bio Grid — fills remaining height */}
      <div className="grid md:grid-cols-2 gap-3 md:gap-8 flex-1 min-h-0 md:h-full grid-rows-1">
        {/* Image */}
        <motion.div
          className="relative rounded-lg overflow-hidden order-2 md:order-1 h-[500px] md:h-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
                    <Image
            ref={imgRef}
            src="/images/home/arnold-pose-2.jpg"
            alt="Rohan Gore - Software Engineer and Fitness Enthusiast"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(rgba(0,0,0,0.8) 1%, transparent 8%),
                linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 10%),
                linear-gradient(to right, rgba(0,0,0,0.8) 12%, transparent 15%),
                linear-gradient(to left, rgba(0,0,0,0.8) 10%, transparent 30%)
              `,
            }}
          />
        </motion.div>

        {/* Bio Text */}
        <motion.div
          className="flex flex-col justify-center order-1 md:order-2 shrink-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-4 leading-tight">
            Hi, I'm <span className="text-orange-500">Rohan Gore</span>
          </h2>
          <p className="text-sm md:text-lg text-white/70 leading-snug mb-1 md:mb-4">
            5+ years of turning coffee and code into products people actually
            use. Currently doing this at{" "}
            <span className="text-orange-500 font-semibold">Myntra</span>.
          </p>
          <p className="text-sm md:text-lg text-white/70 leading-snug">
            I'm a fitness freak, because iron taught me what 5 years of
            engineering couldn't.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
