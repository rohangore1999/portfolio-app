"use client";

import { motion } from "framer-motion";
import AboutMeButton from "./AboutMeButton";
import { aboutWords } from "@/constants/about";

export default function AboutSection({ onAboutClick }) {
  return (
    <section className="h-screen flex items-center justify-center snap-start px-8 relative">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Animated text */}
        <motion.div
          className="text-3xl md:text-6xl max-w-2xl text-black dark:text-white/80 overflow-hidden md:space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animate each word from bottom to top */}
          {aboutWords.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.03,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* About Me Button */}
        <AboutMeButton onClick={onAboutClick} />
      </div>
    </section>
  );
}
