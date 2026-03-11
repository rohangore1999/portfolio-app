"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WorkList from "@/components/work/WorkList";
import { useTransition } from "@/context/TransitionContext";

export default function WorkPage() {
  const { navigate, isTransitioning } = useTransition();

  const handleAboutClick = () => navigate("/about", "about");
  const handleContactClick = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation onAboutClick={handleAboutClick} onContactClick={handleContactClick} />

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 30 : 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Hero */}
        <div className="px-8 md:px-16 pt-24 md:pt-36 pb-16">
          <h1 className="text-5xl md:text-8xl font-light text-white leading-tight max-w-4xl">
            Engineering ideas into products
          </h1>
        </div>

        {/* Work list */}
        <WorkList />
      </motion.div>

      <Footer />
    </div>
  );
}
