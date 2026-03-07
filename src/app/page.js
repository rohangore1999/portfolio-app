"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import StartScreen from "@/components/StartScreen";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import WorkSection from "@/components/home/WorkSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function Home() {
  // Start hidden; only show StartScreen on a true page refresh/direct load
  const [showLoading, setShowLoading] = useState(false);
  const { navigate } = useTransition();

  useEffect(() => {
    const isSoftNav = sessionStorage.getItem("softNavToHome");
    if (isSoftNav) {
      // Arrived via logo click / soft nav — consume flag, skip StartScreen
      sessionStorage.removeItem("softNavToHome");
    } else {
      // No flag means true browser reload or direct URL load
      setShowLoading(true);
    }
  }, []);

  const handleAboutClick = () => {
    navigate("/about", "about");
  };

  const handleGreetingComplete = () => {
    setShowLoading(false);
  };

  return (
    <>
      {/* Start Screen */}
      <StartScreen
        showLoading={showLoading}
        onComplete={handleGreetingComplete}
      />

      {/* Navigation */}
      {!showLoading && <Navigation onAboutClick={handleAboutClick} />}

      <motion.div
        className="h-screen overflow-y-scroll snap-y snap-mandatory dark:bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: showLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <HeroSection />

        <AboutSection onAboutClick={handleAboutClick} />

        <WorkSection />

        {/* Footer as snap section */}
        <section className="snap-start">
          <Footer />
        </section>
      </motion.div>
    </>
  );
}
