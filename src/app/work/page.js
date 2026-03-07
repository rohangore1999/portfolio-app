"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";

export default function WorkPage() {
  const { navigate, isTransitioning } = useTransition();

  const handleAboutClick = () => {
    navigate("/about", "about");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation onAboutClick={handleAboutClick} />
      <motion.div
        className="flex-1 flex items-center justify-center px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 30 : 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            My Work
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Projects and portfolio coming soon...
          </p>
          <Link
            href="/"
            className="text-lg text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
}
