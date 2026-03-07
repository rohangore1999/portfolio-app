"use client";

import { motion } from "framer-motion";

export default function TimelineItem({ title, company, period, index }) {
  return (
    <motion.div
      className="relative pl-8 md:pl-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      {/* Timeline Dot - Centered on the line */}
      <div className="absolute left-[0.125rem] md:left-0 top-2 w-3 h-3 bg-orange-500 rounded-full md:-translate-x-1" />
      
      {/* Job Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {title}
      </h3>
      
      {/* Company & Period */}
      <p className="text-orange-500 font-semibold">
        {company} • {period}
      </p>
    </motion.div>
  );
}
