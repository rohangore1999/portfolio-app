"use client";

import { motion } from "framer-motion";
import MagneticLink from "./MagneticLink";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Large Email with Arrow */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="mailto:gorerohan15@gmail.com"
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white hover:text-orange-500 transition-colors inline-block group border-b-2 border-white/20 hover:border-orange-500 pb-2"
          >
            <span className="break-all">
              GOREROHAN15@GMAIL.COM{" "}
              <motion.span
                className="text-2xl sm:text-3xl md:text-5xl inline-block align-middle"
                animate={{ 
                  x: [0, 6, 0],
                  y: [0, -6, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ↗
              </motion.span>
            </span>
          </a>
        </motion.div>

        {/* Bottom Info - Two Columns */}
        <motion.div
          className="flex flex-col md:flex-row justify-between gap-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Copyright */}
          <div>
            <p className="text-white/50 mb-2">© {currentYear} Rohan Gore</p>
          </div>

          {/* Right: Socials */}
          <div>
            <p className="text-white/50 uppercase tracking-wider text-xs mb-3">
              Socials
            </p>
            <div className="flex gap-6">
              <MagneticLink
                href="https://www.linkedin.com/in/rohan-gore-355178179/"
                target="_blank"
                className="text-white/70 hover:text-orange-500 transition-colors uppercase"
              >
                LinkedIn
              </MagneticLink>
              <MagneticLink
                href="https://github.com/rohangore1999"
                target="_blank"
                className="text-white/70 hover:text-orange-500 transition-colors uppercase"
              >
                GitHub
              </MagneticLink>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
