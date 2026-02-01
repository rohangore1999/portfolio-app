"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { greetings } from "@/constants/home";

export default function StartScreen({ showLoading, onComplete }) {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

  useEffect(() => {
    // Only run greeting animation if showLoading is true
    if (!showLoading) return;

    // Cycle through greetings
    if (currentGreetingIndex < greetings.length - 1) {
      const timer = setTimeout(
        () => {
          setCurrentGreetingIndex((prev) => prev + 1);
        },
        currentGreetingIndex === 0 ? 800 : 250
      ); // First word waits 800ms, others 250ms
      return () => clearTimeout(timer);
    } else {
      // After all greetings, hide loading screen (last word waits longer)
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000); // Last word waits 1000ms before exit
      return () => clearTimeout(finalTimer);
    }
  }, [currentGreetingIndex, showLoading, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {showLoading && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            y: "100%",
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
          }}
        >
          <div className="relative h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentGreetingIndex}
                className="text-black text-5xl md:text-7xl font-bold absolute"
                initial={
                  currentGreetingIndex === 0
                    ? { opacity: 0 } // First word: just fade in
                    : { y: 100, opacity: 0 } // Others: scroll up from bottom
                }
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                {greetings[currentGreetingIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
