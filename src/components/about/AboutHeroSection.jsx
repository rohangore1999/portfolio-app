"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutHeroSection() {
  return (
    <section className="h-screen flex items-center justify-center px-6 py-12 snap-start">
      <div className="max-w-7xl w-full">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            {/* Line 1: About me, a Software Engineer */}
            {["About", "me,", "a", "Software", "Engineer"].map(
              (word, index) => (
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
              )
            )}
            <br />
            {/* Line 2: living in Bangalore */}
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

        {/* Image + Bio Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image - Left Side on Desktop, Bottom on Mobile */}
          <motion.div
            className="w-full aspect-square max-h-[50vh] relative rounded-lg overflow-hidden flex items-center justify-center order-2 md:order-1 -ml-[25px] md:ml-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image
              src="/images/about/about-image.jpeg"
              alt="Rohan Gore - Software Engineer and Fitness Enthusiast"
              fill
              className="object-contain"
              priority
              quality={90}
            />
            {/* Gradient overlay to blend all edges with black background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(rgba(0, 0, 0, 0.8) 1%, transparent 8%), 
                  linear-gradient(to top, rgba(0, 0, 0, .8) 0%, transparent 10%), 
                  linear-gradient(to right, rgba(0, 0, 0, 0.8) 12%, transparent 15%), 
                  linear-gradient(to left, rgba(0, 0, 0, 0.8) 10%, transparent 30%)
                `,
              }}
            />
          </motion.div>

          {/* Bio Text - Right Side on Desktop, Top on Mobile */}
          <motion.div
            className="flex flex-col justify-center order-1 md:order-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Hi, I'm <span className="text-orange-500">Rohan Gore</span>
            </h2>
            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-4">
              5+ years of turning coffee and code into products people actually
              use. Currently doing this at{" "}
              <span className="text-orange-500 font-semibold">Myntra</span>.
            </p>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              I'm a fitness freak, because iron taught me what 5 years of
              engineering couldn't.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
