"use client";

import { useRef, useLayoutEffect } from "react";
import { useReducedMotion } from "framer-motion";

export default function WhoopCounter({ value, decimals = 0, progress }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  useLayoutEffect(() => {
    if (value == null || !ref.current) return;
    const write = position => {
      const fraction = reduceMotion ? 1 : Math.max(0, Math.min(1, position / 0.24));
      const eased = 1 - (1 - fraction) ** 3;
      const text = (value * eased).toFixed(decimals);
      if (ref.current && ref.current.textContent !== text) ref.current.textContent = text;
    };
    write(progress.get());
    return progress.on("change", write);
  }, [value, decimals, reduceMotion, progress]);
  return <span ref={ref} aria-label={value == null ? "Unavailable" : value.toFixed(decimals)}>{value == null ? "—" : value.toFixed(decimals)}</span>;
}

