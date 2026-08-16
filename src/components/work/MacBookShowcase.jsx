"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

const DEFAULT_SCREENSHOT = "/images/work/pulse-notch/notch-live-elevated-437.png";
const DEFAULT_FRAME = "/images/work/pulse-notch/macbook-pro.svg";

function MacBookFrame({ screenshotSrc, frameSrc, alt, priority = false }) {
  return (
    <div className="relative aspect-[1008/580] w-full">
      <Image
        src={frameSrc}
        alt=""
        fill
        sizes="(min-width: 768px) 86vw, 720px"
        className="pointer-events-none z-0 select-none object-contain"
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
      />

      <div className="absolute inset-x-[10.5%] top-[1.55%] bottom-[8.2%] z-10 overflow-hidden rounded-t-[2.4%] bg-black">
        <Image
          src={screenshotSrc}
          alt={alt}
          fill
          sizes="(min-width: 768px) 86vw, 720px"
          className="object-cover object-top"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
}

export default function MacBookShowcase({
  screenshotSrc = DEFAULT_SCREENSHOT,
  frameSrc = DEFAULT_FRAME,
  alt = "Pulse Notch showing live WHOOP heart rate around the MacBook camera cutout",
  priority = false,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.figure
      className="mx-auto w-full max-w-7xl"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hidden md:block">
        <MacBookFrame
          screenshotSrc={screenshotSrc}
          frameSrc={frameSrc}
          alt={alt}
          priority={priority}
        />
      </div>

      <div className="relative aspect-[16/10] overflow-hidden md:hidden">
        <div className="absolute left-1/2 top-0 w-[112%] min-w-[430px] -translate-x-1/2">
          <MacBookFrame
            screenshotSrc={screenshotSrc}
            frameSrc={frameSrc}
            alt={alt}
            priority={priority}
          />
        </div>
      </div>

      <figcaption className="mt-5 flex flex-col gap-2 border-t border-white/15 pt-4 text-[11px] uppercase tracking-[0.18em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>Live WHOOP Heart Rate Broadcast</span>
        <span>Rendered locally on macOS</span>
      </figcaption>
    </m.figure>
  );
}
