"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import StartScreen from "@/components/StartScreen";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import WorkSection from "@/components/home/WorkSection";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function Home() {
  const [showLoading, setShowLoading] = useState(false);
  const { navigate } = useTransition();

  const handleAboutClick = () => {
    navigate("/about", "about");
  };

  // Check if this is a fresh page load (not navigation)
  useEffect(() => {
    const hasShownGreeting = sessionStorage.getItem("greetingShown");
    
    // Only show greeting if it hasn't been shown in this session
    if (!hasShownGreeting) {
      setShowLoading(true);
      sessionStorage.setItem("greetingShown", "true");
    }
  }, []);

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
      </motion.div>
    </>
  );
}
