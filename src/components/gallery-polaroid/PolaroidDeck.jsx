"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Caveat } from "next/font/google";
import PolaroidCard from "./PolaroidCard";

const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"] });
const VISIBLE = 4;

export default function PolaroidDeck({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [enterStagger, setEnterStagger] = useState(true);
  const total = items.length;
  const isFinished = activeIndex >= total;

  useEffect(() => {
    const t = setTimeout(() => setEnterStagger(false), 900);
    return () => clearTimeout(t);
  }, []);

  const handleSwipeAway = useCallback(() => {
    setActiveIndex((i) => i + 1);
  }, []);

  const handleReset = useCallback(() => setActiveIndex(0), []);

  const visibleStack = items
    .slice(activeIndex, activeIndex + VISIBLE)
    .map((item, stackPos) => ({ item, stackPos }));

  return (
    <section className="relative w-full bg-black overflow-hidden">
      <div className="px-6 pt-32 md:pt-40 pb-8 max-w-3xl mx-auto text-center">
        <motion.h1
          className="font-sans text-white font-light text-5xl md:text-7xl uppercase tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Memories
        </motion.h1>
        <motion.p
          className={`text-white/50 text-lg md:text-xl mt-2 ${caveat.className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {String(Math.min(activeIndex + 1, total)).padStart(2, "0")} of {String(total).padStart(2, "0")}
        </motion.p>
      </div>

      <div className="relative mx-auto w-[85vw] max-w-[340px] md:w-[480px] md:max-w-[480px] aspect-[2/3]">
        <AnimatePresence mode="popLayout">
          {!isFinished &&
            visibleStack.map(({ item, stackPos }) => (
              <PolaroidCard
                key={item.id}
                item={item}
                stackPos={stackPos}
                isTop={stackPos === 0}
                onSwipeAway={handleSwipeAway}
                fontClass={caveat.className}
                enterStagger={enterStagger}
              />
            ))}
        </AnimatePresence>

        {isFinished && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className={`text-white/80 text-3xl md:text-4xl ${caveat.className}`}>
              That's the whole roll.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 border border-white/40 text-white/80 text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              Reshuffle
            </button>
          </motion.div>
        )}
      </div>

      <div className="px-6 pt-24 md:pt-28 pb-20 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(total, 8) }).map((_, i) => {
            const segment = Math.floor((activeIndex / total) * Math.min(total, 8));
            const isActive = i === segment && !isFinished;
            return (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-6 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            );
          })}
        </div>
        <p className="text-center text-white/40 text-xs tracking-[0.3em] uppercase mt-10">
          {isFinished ? "End of roll" : "Drag a polaroid to flick it away"}
        </p>
      </div>
    </section>
  );
}
