"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AboutMeButton({ onClick }) {
  const [cursorTrails, setCursorTrails] = useState([]);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate magnetic effect (button follows cursor)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) * 0.3; // 30% of distance
        const offsetY = (y - centerY) * 0.3;
        setButtonPosition({ x: offsetX, y: offsetY });

        // Add new trail particle
        const newTrail = {
          id: Date.now(),
          x,
          y,
        };
        setCursorTrails((prev) => [...prev.slice(-8), newTrail]);
      }}
      onMouseLeave={() => {
        setCursorTrails([]);
        setButtonPosition({ x: 0, y: 0 });
      }}
    >
      {/* Cursor trail particles */}
      {cursorTrails.map((trail) => (
        <motion.div
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

      <motion.button
        className="relative w-48 h-48 rounded-full text-lg font-medium flex items-center justify-center overflow-hidden cursor-pointer"
        style={{
          x: buttonPosition.x,
          y: buttonPosition.y,
        }}
        animate={{
          x: buttonPosition.x,
          y: buttonPosition.y,
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
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          variants={{
            hover: { opacity: 0 },
          }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute inset-0 bg-orange-500 pointer-events-none"
          variants={{
            hover: { opacity: 1 },
          }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.span
          className="relative z-10 pointer-events-none"
          variants={{
            hover: { color: "#ffffff" },
          }}
          initial={{ color: "#000000" }}
          transition={{ duration: 0.3 }}
        >
          About me
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
