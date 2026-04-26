"use client";

import Image from "next/image";
import { motion, useAnimationControls, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { captionFor, rotationFor, offsetFor } from "@/utils/polaroidStack";

export default function PolaroidCard({
  item,
  stackPos,
  isTop,
  onSwipeAway,
  fontClass,
  enterStagger = false,
}) {
  const x = useMotionValue(0);
  const dragRotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const controls = useAnimationControls();
  const caption = captionFor(item.id);
  const baseRotation = rotationFor(item.id, stackPos);
  const baseOffset = offsetFor(item.id, stackPos);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const firstTime = isFirstRun.current;
    isFirstRun.current = false;
    const useEntrance = firstTime && enterStagger;

    controls.start({
      x: baseOffset.x,
      y: baseOffset.y,
      rotate: baseRotation,
      scale: 1 - stackPos * 0.02,
      transition: useEntrance
        ? {
            type: "spring",
            stiffness: 190,
            damping: 22,
            delay: 0.05 + stackPos * 0.09,
          }
        : { type: "spring", stiffness: 220, damping: 26 },
    });
  }, [stackPos, baseRotation, baseOffset.x, baseOffset.y, controls, enterStagger]);

  const handleDragEnd = async (_, info) => {
    const swiped =
      Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600;

    if (swiped) {
      const dir = info.offset.x > 0 ? 1 : -1;
      await controls.start({
        x: dir * 700,
        y: 40,
        rotate: dir * 28,
        opacity: 0,
        transition: { duration: 0.45, ease: [0.32, 0, 0.67, 0] },
      });
      onSwipeAway?.();
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 320, damping: 24 },
      });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 100 - stackPos, x: isTop ? x : baseOffset.x }}
      initial={
        enterStagger
          ? { y: -40, rotate: 0, scale: 0.88 }
          : {
              x: baseOffset.x,
              y: baseOffset.y,
              rotate: baseRotation,
              scale: 1 - stackPos * 0.02,
            }
      }
      animate={controls}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: "grabbing" } : undefined}
    >
      <motion.div style={{ rotate: isTop ? dragRotate : 0 }}>
        <div
          className="bg-white p-3 pb-14 md:p-4 md:pb-20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_8px_20px_-4px_rgba(0,0,0,0.5)] w-[85vw] max-w-[340px] md:w-[480px] md:max-w-[480px]"
          style={{ cursor: isTop ? "grab" : "default" }}
        >
          <div className="relative aspect-3/4 w-full bg-neutral-200 overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 85vw, 480px"
              priority={stackPos === 0}
              quality={85}
              placeholder={item.blurDataURL ? "blur" : "empty"}
              blurDataURL={item.blurDataURL}
              draggable={false}
            />
          </div>
          <div
            className={`mt-3 md:mt-4 text-center text-neutral-800 text-2xl md:text-3xl ${fontClass}`}
            style={{ transform: "rotate(-2deg)" }}
          >
            {caption}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
