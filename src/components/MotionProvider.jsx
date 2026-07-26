"use client";

import { LazyMotion, domMax } from "framer-motion";

/**
 * Loads framer-motion's animation features lazily (as a separate async chunk)
 * instead of shipping them in the critical bundle. All components use the
 * lightweight `m` component; `domMax` includes gestures, layout, and drag.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
