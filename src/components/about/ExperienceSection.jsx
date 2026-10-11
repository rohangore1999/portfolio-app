"use client";

import { m } from "framer-motion";
import TimelineItem from "./TimelineItem";
import { experiences } from "@/constants/experience";

export default function ExperienceSection() {
  return (
    <section className="min-h-screen flex items-center py-24 px-6 snap-start">
      <div className="max-w-4xl mx-auto w-full">
        <m.h2
          className="text-4xl md:text-5xl font-bold text-white mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Experience
        </m.h2>

        <div>
          {experiences.map((experience, index) => (
            <div key={experience.id} className="relative pb-16 last:pb-0">
              {index < experiences.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-2 md:left-0 top-[1.125rem] bottom-[-1.125rem] w-0.5 -translate-x-1/2 bg-orange-500"
                />
              )}
              <TimelineItem
                roles={experience.roles}
                current={experience.current}
                company={experience.company}
                period={experience.period}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
