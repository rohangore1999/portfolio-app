"use client";

import Image from "next/image";
import { m, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { advanceHeroMarquee } from "@/lib/hero-marquee.mjs";
import { usePageActivity } from "@/hooks/usePageActivity";
import heroImage from "../../../public/images/home/rohan-home-mobile.jpg";
import desktopHeroImage from "../../../public/images/home/rohan-home-desktop.jpg";
import styles from "./heroSection.module.css";

function MarqueeName({ active, scrollContainerRef }) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);
  const targetDirection = useRef(1);
  const prevTime = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const itemWidth = useRef(0);
  const visible = useInView(viewportRef);
  const pageActive = usePageActivity();

  useEffect(() => {
    const item = trackRef.current?.firstElementChild;
    if (!item) return;
    const measure = () => {
      const width = item.getBoundingClientRect().width;
      if (width <= 0) return;
      const previousWidth = itemWidth.current;
      if (previousWidth > 0 && previousWidth !== width) {
        baseX.set(baseX.get() / previousWidth * width);
      }
      itemWidth.current = width;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(item);
    return () => observer.disconnect();
  }, [baseX]);

  useEffect(() => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    let previous = container.scrollTop;
    const onScroll = () => {
      const next = container.scrollTop;
      const delta = next - previous;
      previous = next;
      if (Math.abs(delta) > 0.5 && window.matchMedia("(max-width: 767px)").matches) {
        targetDirection.current = delta > 0 ? 1 : -1;
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);

  useAnimationFrame((t) => {
    if (!active || !visible || !pageActive || reduceMotion || !window.matchMedia("(max-width: 767px)").matches) { prevTime.current = null; return; }
    if (prevTime.current === null) {
      prevTime.current = t;
      return;
    }
    const delta = Math.min(t - prevTime.current, 50);
    prevTime.current = t;

    const next = advanceHeroMarquee({
      position: baseX.get(),
      direction: direction.current,
      targetDirection: targetDirection.current,
      width: itemWidth.current,
      deltaSeconds: delta / 1000,
    });
    direction.current = next.direction;
    baseX.set(next.position);
  });

  return (
    <div ref={viewportRef} className="overflow-hidden" data-name-marquee>
    <m.div
      ref={trackRef}
      className="flex w-max whitespace-nowrap"
      style={{ x: baseX }}
    >
      {[...Array(4)].map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-flex shrink-0 font-sans text-white font-light whitespace-nowrap leading-none tracking-tight"
          style={{ fontSize: "max(9rem, 15vw)" }}
        >
          <span>Rohan Gore</span>
          <span className="px-8 tracking-normal">—</span>
        </span>
      ))}
    </m.div>
    </div>
  );
}

export default function HeroSection({ active = true, scrollContainerRef }) {
  const reduceMotion = useReducedMotion();
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundColor: "#000",
        height: "100dvh",
      }}
    >
      {/* Single semantic page heading (visually hidden; the marquee/desktop
          name below are decorative duplicates). Keeps exactly one H1. */}
      <h1 className="sr-only">Rohan Gore — Software Engineer</h1>

      {/* Portrait image — mobile only */}
      <div className="md:hidden absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Rohan Gore"
          unoptimized
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "60% center" }}
        />
      </div>

      {/* Gradient overlay — mobile only */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

      {/* Separate the entrance from the continuous, scroll-responsive loop. */}
      <m.div
        className="md:hidden absolute inset-x-0 z-10 overflow-hidden"
        data-mobile-name-reveal
        style={{ bottom: "calc(6rem + env(safe-area-inset-bottom))" }}
        initial={{ y: "10svh" }}
        animate={{ y: active || reduceMotion ? 0 : "10svh" }}
        transition={{ duration: reduceMotion ? 0 : 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <MarqueeName active={active} scrollContainerRef={scrollContainerRef} />
      </m.div>

      {/* Designation — mobile only, pinned to bottom */}
      <m.div
        className="md:hidden absolute left-6 z-10"
        style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        initial={{ y: "10svh" }}
        animate={{ y: active || reduceMotion ? 0 : "10svh" }}
        transition={{ duration: reduceMotion ? 0 : 1.5, delay: reduceMotion ? 0 : 0.07, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="font-sans text-white/80 font-light tracking-widest uppercase"
          style={{ fontSize: "24px" }}
        >
          Software Engineer
        </p>
      </m.div>

      {/* Preserve the entire photo height; narrower tablets crop only the dark left edge. */}
      <div className={styles.desktopPhoto} style={{ aspectRatio: `${desktopHeroImage.width} / ${desktopHeroImage.height}` }}>
        <Image
          src={desktopHeroImage}
          alt="Rohan Gore at the gym"
          unoptimized
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 768px) 124vh, 1px"
          className="object-contain"
        />
      </div>

      <div className={styles.desktopCopy}>
        <m.p
          aria-hidden="true"
          className={styles.name}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: active ? 1 : 0, y: active || reduceMotion ? 0 : 24 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>Rohan</span>{" "}<span>Gore</span>
        </m.p>
        <m.p
          className={styles.designation}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: active ? 1 : 0, y: active || reduceMotion ? 0 : 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.12, ease: "easeOut" }}
        >
          Software Engineer
        </m.p>
      </div>
    </section>
  );
}
