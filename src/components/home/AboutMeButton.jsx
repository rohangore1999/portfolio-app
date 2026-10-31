"use client";

import { useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

import { useMagnetic } from "@/hooks/useMagnetic";

export default function AboutMeButton({ onClick }) {
  const [cursorTrails, setCursorTrails] = useState([]);
  const { position, handleMouseMove, handleMouseLeave } = useMagnetic(0.3);
  const reduceMotion = useReducedMotion();
  const lastTrail = useRef(0);
  const trailId = useRef(0);

  return (
    <m.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        if (reduceMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const now = performance.now();
        if (now - lastTrail.current < 40) return;
        lastTrail.current = now;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add new trail particle
        const newTrail = {
          id: ++trailId.current,
          x,
          y,
        };
        setCursorTrails((prev) => [...prev.slice(-8), newTrail]);
      }}
      onMouseLeave={() => {
        setCursorTrails([]);
        handleMouseLeave();
      }}
    >
      {/* Cursor trail particles */}
      {cursorTrails.map((trail) => (
        <m.div
          key={trail.id}
          className="absolute w-3 h-3 rounded-full bg-orange-500 pointer-events-none"
          style={{
            left: trail.x - 6,
            top: trail.y - 6,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ))}

      <m.button
        className="relative w-48 h-48 rounded-full text-lg font-medium flex items-center justify-center overflow-hidden cursor-pointer"
        style={{
          x: position.x,
          y: position.y,
        }}
        whileHover="hover"
        whileTap={{
          scale: 0.95,
        }}
        onClick={onClick}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
        variants={{
          hover: {
            scale: [null, 1.1, 1.05],
            rotate: [null, 5, 0],
            transition: {
              duration: 0.5,
              times: [0, 0.6, 1],
              ease: ["easeInOut", "easeOut"],
            },
          },
        }}
      >
        {/* Animated background that changes to orange on hover */}
        <m.div
          className="absolute inset-0 bg-white pointer-events-none"
          variants={{
            hover: { opacity: 0 },
          }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <m.div
          className="absolute inset-0 bg-orange-500 pointer-events-none"
          variants={{
            hover: { opacity: 1 },
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <m.span
          className="relative z-10 pointer-events-none"
          variants={{
            hover: { color: "#ffffff" },
          }}
          initial={{ color: "#000000" }}
          transition={{ duration: 0.3 }}
        >
          About me
        </m.span>
      </m.button>
    </m.div>
  );
}
