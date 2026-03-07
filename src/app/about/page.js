"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import ExperienceSection from "@/components/about/ExperienceSection";
import PhilosophySection from "@/components/about/PhilosophySection";

export default function AboutPage() {
  const { navigate, isTransitioning } = useTransition();

  const handleAboutClick = () => {
    navigate("/about", "about");
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation onAboutClick={handleAboutClick} />

      {/* Snap Scroll Container */}
      <motion.div
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Hero + Image + Bio Section */}
        <AboutHeroSection />

        {/* Work Experience Timeline */}
        <ExperienceSection />

        {/* Philosophy Section */}
        <PhilosophySection />

        {/* Footer Section */}
        <section className="snap-start">
          <Footer />
        </section>
      </motion.div>
    </div>
  );
}
