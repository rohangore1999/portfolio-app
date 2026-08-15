"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function ItemList({
  items,
  label = "Items",
  badgeLabel = "View",
}) {
  const router = useRouter();
  const { navigate } = useTransition();
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [hoveredImageFit, setHoveredImageFit] = useState("cover");
  const [hoveredPreviewAspect, setHoveredPreviewAspect] = useState("portrait");
  const listRef = useRef(null);
  const listLabelId = useId();

  const cursorX = useMotionValue(-300);
  const cursorY = useMotionValue(-300);

  const springX = useSpring(cursorX, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });
  const springY = useSpring(cursorY, {
    stiffness: 120,
    damping: 20,
    mass: 0.5,
  });

  const handleMouseMove = (e) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  const handleItemClick = (event, item) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(item.href, item.title.toLowerCase());
  };

  return (
    <section
      ref={listRef}
      onMouseMove={handleMouseMove}
      aria-labelledby={listLabelId}
      className="relative px-8 md:px-16 pb-16"
    >
      {/* Floating cursor image */}
      <m.div
        aria-hidden="true"
        className={`hidden md:block absolute pointer-events-none z-50 rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2 ${
          hoveredPreviewAspect === "landscape"
            ? "w-80 aspect-[16/10]"
            : "w-48 h-60"
        }`}
        style={{ left: springX, top: springY }}
        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.6 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {hoveredImage && (
          <Image
            src={hoveredImage}
            alt=""
            fill
            className={hoveredImageFit === "contain" ? "object-contain p-2" : "object-cover"}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <m.div
            className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center"
            animate={
              isHovering
                ? { scale: [null, 1.15, 1.05], rotate: [null, 5, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{
              duration: 0.5,
              times: [0, 0.6, 1],
              ease: ["easeInOut", "easeOut"],
            }}
          >
            <span className="text-white text-sm font-semibold">
              {badgeLabel}
            </span>
          </m.div>
        </div>
      </m.div>

      {/* Column header */}
      <p
        id={listLabelId}
        className="text-xs uppercase tracking-widest text-white/60 mb-4"
      >
        {label}
      </p>
      <div className="border-t border-white/20" />

      {/* Items */}
      <ul>
        {items.map((item, i) => (
          <li
            key={item.title}
            className={i < items.length - 1 ? "border-b border-white/20" : ""}
          >
            <a
              href={item.href}
              className="group flex items-center justify-between py-5 md:py-8 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              onClick={(event) => handleItemClick(event, item)}
              onMouseEnter={() => {
                if (item.image) {
                  setIsHovering(true);
                  setHoveredImage(item.image);
                  setHoveredImageFit(item.imagefit || "cover");
                  setHoveredPreviewAspect(item.previewAspect || "portrait");
                }

                router.prefetch(item.href);
              }}
              onMouseLeave={() => {
                setIsHovering(false);
                setHoveredImage(null);
                setHoveredImageFit("cover");
                setHoveredPreviewAspect("portrait");
              }}
            >
              {/* Left: title + description + tags */}
              <div className="transition-all duration-300 group-hover:translate-x-2 origin-left flex-1 min-w-0 md:pr-6">
                <h2 className="text-3xl md:text-6xl font-light text-white transition-all duration-300 group-hover:opacity-60 group-hover:scale-105 origin-left">
                  {item.title}
                </h2>
                {item.tagline && (
                  <p className="md:hidden mt-2 text-sm text-white/50 leading-relaxed max-w-xl">
                    {item.tagline}
                  </p>
                )}
                {item.description && (
                  <p className="hidden md:block mt-2 text-sm text-white/60 leading-relaxed max-w-xl transition-all duration-300 group-hover:opacity-80">
                    {item.description}
                  </p>
                )}
                <div className="md:hidden flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-[10px] uppercase tracking-widest">
                  {item.year && <span className="text-white/60">{item.year}</span>}
                  {item.year && item.category && (
                    <span aria-hidden="true" className="text-white/20">·</span>
                  )}
                  {item.category && <span className="text-white/60">{item.category}</span>}
                </div>
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 border border-white/20 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: year + category */}
              <div className="hidden md:flex flex-col items-end gap-1 transition-all duration-300 group-hover:opacity-60 group-hover:-translate-x-2 shrink-0 ml-8">
                {item.year && (
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    {item.year}
                  </span>
                )}
                <span className="text-xs md:text-sm text-white/60">
                  {item.category}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
