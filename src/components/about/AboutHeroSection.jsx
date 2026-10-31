"use client";

import { m } from "framer-motion";
import Image from "next/image";
import aboutImage from "../../../public/images/about/rohan-at-myntra.webp";

export default function AboutHeroSection({ yearsOfExperience }) {
  return (
    <section className="min-h-dvh md:min-h-0 md:h-dvh flex flex-col px-6 pt-[calc(var(--nav-height)+0.5rem)] pb-4 snap-start md:overflow-hidden">
      {/* Hero Text */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center shrink-0 mb-3 md:mb-2"
      >
        <h1 className="text-2xl md:text-5xl lg:text-6xl md:[@media(max-height:600px)]:text-4xl font-bold w-full mb-4 [@media(min-height:700px)]:mb-8 md:mb-0">
          {["About", "me,", "a", "Software", "Engineer"].map((word, index) => (
            <m.span
              key={`line1-${index}`}
              className={`inline-block mr-2 ${
                word === "About" || word === "me,"
                  ? "text-white/40"
                  : "text-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              {word}
            </m.span>
          ))}
          <br />
          {["living", "in", "Bangalore"].map((word, index) => (
            <m.span
              key={`line2-${index}`}
              className={`inline-block mr-2 ${
                word === "Bangalore" ? "text-orange-500" : "text-white"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: (5 + index) * 0.05,
                ease: "easeOut",
              }}
            >
              {word}
            </m.span>
          ))}
        </h1>
      </m.div>

      {/* Image + Bio Grid — fills remaining height */}
      <div className="grid md:grid-cols-2 gap-3 md:gap-8 shrink-0 md:flex-1 md:min-h-0 md:grid-rows-1">
        {/* Image */}
        <m.div
          className="relative rounded-lg overflow-hidden order-2 md:order-1 aspect-[3/4] max-h-[70svh] w-full max-w-xl mx-auto md:aspect-auto md:h-full md:min-h-0 md:max-h-none"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Image
            src={aboutImage}
            alt="Rohan Gore standing beside the Myntra logo"
            fill
            className="object-contain"
            sizes="(min-width: 768px) 50vw, calc(100vw - 48px)"
            priority
            placeholder="blur"
            quality={90}
          />
        </m.div>

        {/* Bio Text */}
        <m.div
          className="flex flex-col justify-center order-1 md:order-2 shrink-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-4 leading-tight">
            Hi, I&apos;m <span className="text-orange-500">Rohan Gore</span>
          </h2>
          <p className="text-sm md:text-lg text-white/70 leading-snug mb-1 [@media(min-height:700px)]:mb-2 md:mb-4">
            Technical Lead at{" "}
            <span className="text-orange-500 font-semibold">Myntra</span>, with{" "}
            <strong className="font-semibold text-white">{yearsOfExperience}+ years</strong>{" "}
            of building software and still getting suspicious when something works
            on the first try.
          </p>
          <p className="text-sm md:text-lg text-white/70 leading-snug">
            Outside work, I lift, take photos, and eat roughly the same meals every
            day. Keeping the days boring to see what the years can do.
          </p>
        </m.div>
      </div>
    </section>
  );
}
