"use client";

import { m } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="min-h-screen flex items-center py-16 md:py-24 px-6 border-t border-white/10 snap-start">
      <m.figure
        className="max-w-5xl mx-auto text-center w-full"
        initial={{ y: 24 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <blockquote className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] text-white text-balance">
          <span className="block">&quot;Becoming Uncommon</span>
          <span className="block mt-2 md:mt-3">
            Amongst The <span className="text-orange-500">Uncommon.</span>&quot;
          </span>
        </blockquote>
        <figcaption className="mt-8 md:mt-10 text-sm md:text-base text-white/50">
          Inspired by <cite className="not-italic">David Goggins</cite>
        </figcaption>
      </m.figure>
    </section>
  );
}
