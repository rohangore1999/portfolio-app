"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Reset transition state when route changes (with delay for exit animation)
  useEffect(() => {
    if (isTransitioning) {
      // Wait for pause duration before triggering exit animation
      const exitTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 700); // 0.4s slide in + 0.3s pause = 0.7s total before exit starts
      
      return () => clearTimeout(exitTimer);
    }
  }, [pathname, isTransitioning]);

  const navigate = (href, label) => {
    // Show transition screen first
    setTransitionLabel(label);
    setIsTransitioning(true);

    // Wait for transition screen to appear and pause, then navigate
    setTimeout(() => {
      router.push(href);
    }, 700); // Navigate after slide in (0.4s) + pause (0.3s)
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {/* Global transition screen that appears before navigation */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ 
              duration: 0.4,
              ease: [0.76, 0, 0.24, 1]
            }}
          >
            <motion.span
              className="text-black text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              {transitionLabel}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
}
