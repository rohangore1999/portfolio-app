"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function LogoLink({ onClick }) {
  const { position, handleMouseMove, handleMouseLeave: magneticMouseLeave } = useMagnetic(0.3);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    magneticMouseLeave();
    setIsHovered(false);
  };

  return (
    <motion.a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="relative text-xl font-semibold text-black dark:text-white hover:opacity-70 transition-opacity overflow-hidden inline-block cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {/* Default text - slides up on hover */}
      <motion.span
        className="inline-block"
        animate={{
          y: isHovered ? -30 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {"</>"} by Rohan.
      </motion.span>

      {/* Revealed text on hover - slides up from below */}
      <motion.span
        className="absolute inset-0 inline-block"
        animate={{
          y: isHovered ? 0 : 30,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        Rohan Gore.
      </motion.span>
    </motion.a>
  );
}
