"use client";

import { motion } from "framer-motion";

export default function WorkSection() {
  return (
    <section className="h-screen flex items-start justify-start snap-start px-8 pt-32">
      <motion.div
        className="max-w-4xl"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-8">
          Recent Work
        </p>
        <h2 className="text-4xl md:text-6xl font-semibold text-black dark:text-white">
          Coming soon...
        </h2>
      </motion.div>
    </section>
  );
}
