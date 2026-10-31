"use client";

import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function useMagnetic(strength = 0.3) {
  const reduceMotion = useReducedMotion();
  const targetX = useMotionValue(0), targetY = useMotionValue(0);
  const spring = { stiffness: 150, damping: 18, mass: 0.2 };
  const x = useSpring(targetX, spring), y = useSpring(targetY, spring);
  function handleMouseMove(event) {
    if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    targetX.set((event.clientX - rect.left - rect.width / 2) * strength);
    targetY.set((event.clientY - rect.top - rect.height / 2) * strength);
  }
  function handleMouseLeave() { targetX.set(0); targetY.set(0); }
  return { position: { x, y }, handleMouseMove, handleMouseLeave };
}
