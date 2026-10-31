"use client";

import { m } from "framer-motion";
import Link from "next/link";
import { useMagnetic } from "@/hooks/useMagnetic";

export default function MagneticLink({ href, onClick, children, className = "", target }) {
  const { position, handleMouseMove, handleMouseLeave } = useMagnetic(0.3);

  // If it's a button (no href)
  if (!href) {
    const Element = onClick ? m.button : m.span;
    return (
      <Element
        onClick={onClick}
        className={`inline-block ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: position.x, y: position.y }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      >
        {children}
      </Element>
    );
  }

  // If it's a link
  return (
    <m.div
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      <Link href={href} onClick={onClick} className={className} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
        {children}
      </Link>
    </m.div>
  );
}
