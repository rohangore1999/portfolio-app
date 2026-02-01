"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center snap-start px-8">
      <div className="max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-normal leading-tight text-black dark:text-white"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Hero Section.
        </motion.h1>
      </div>
    </section>
  );
}
