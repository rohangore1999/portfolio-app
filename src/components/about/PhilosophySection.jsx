"use client";

import { motion } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="min-h-screen flex items-center py-16 md:py-24 px-6 border-t border-white/10 snap-start">
      <div className="max-w-4xl mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-8 md:mb-12 whitespace-nowrap">
            "Always a student"
          </h2>
          <div className="space-y-4 md:space-y-6 text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed">
            <p>Every rep teaches discipline.</p>
            <p>Every bug teaches patience.</p>
            <p>Every day is a chance to improve.</p>
            <p className="pt-4 md:pt-6 text-white font-semibold">
              I don't believe in perfection—I believe in{" "}
              <span className="text-orange-500">progressive overload</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
