"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ label, children }) {
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  useEffect(() => {
    // Hide white screen after a pause (wait time)
    const timer = setTimeout(() => {
      setShowWhiteScreen(false);
    }, 600); // Pause for 0.6s in the middle
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* White transition screen with dynamic label */}
      <AnimatePresence>
        {showWhiteScreen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ 
              duration: 0.4, // Fast slide in (0.4s)
              ease: [0.76, 0, 0.24, 1] // Snap easing
            }}
          >
            <motion.span
              className="text-black text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }} // Quick fade in
            >
              {label}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - appears immediately after white screen */}
      {children}
    </>
  );
}
