"use client";

import { m, useReducedMotion } from "framer-motion";
import AboutMeButton from "./AboutMeButton";

export default function AboutSection({ onAboutClick }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="min-h-screen min-h-dvh flex items-center justify-center snap-start px-8 py-24 relative">
      <div className="max-w-6xl w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-16">
        <div className="w-full max-w-2xl min-w-0">
          <m.p
            className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/50 mb-6 md:mb-8"
            initial={{ y: 16 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
          >
            My days are predictable.
          </m.p>
          <m.p
            className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.15] tracking-tight text-white text-balance"
            initial={{ y: 24 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.12, ease: "easeOut" }}
          >
            What they’re adding up to is{" "}
            <span className="text-orange-500">still a mystery.</span>
          </m.p>
        </div>

        <div className="shrink-0 self-center">
          <AboutMeButton onClick={onAboutClick} />
        </div>
        </div>
      </div>
    </section>
  );
}
