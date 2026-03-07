"use client";

import { motion } from "framer-motion";
import TimelineItem from "./TimelineItem";
import { experiences } from "@/constants/experience";

export default function ExperienceSection() {
  return (
    <section className="min-h-screen flex items-center py-24 px-6 snap-start">
      <div className="max-w-4xl mx-auto w-full">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Experience
        </motion.h2>

        <div className="space-y-16 relative pb-2">
          {/* Timeline Line - Positioned to pass through all dot centers */}
          <div className="absolute left-[0.5rem] md:left-0 top-2 bottom-0 w-0.5 bg-orange-500" />

          {/* Render Timeline Items */}
          {experiences.map((experience, index) => (
            <TimelineItem
              key={experience.id}
              title={experience.title}
              company={experience.company}
              period={experience.period}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
