"use client";

import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import StartScreen from "@/components/StartScreen";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import WorkSection from "@/components/home/WorkSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useTransition } from "@/context/TransitionContext";

export default function Home() {
  const [showLoading, setShowLoading] = useState(false);
  const { navigate } = useTransition();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const isSoftNav = sessionStorage.getItem("softNavToHome");
    if (isSoftNav) {
      sessionStorage.removeItem("softNavToHome");
    } else {
      setShowLoading(true);
    }
  }, []);

  const handleAboutClick = () => navigate("/about", "about");

  const handleContactClick = () => {
    const footer = scrollContainerRef.current?.querySelector("#contact");
    footer?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGreetingComplete = () => setShowLoading(false);

  return (
    <>
      {/* Start Screen */}
      <StartScreen
        showLoading={showLoading}
        onComplete={handleGreetingComplete}
      />

      {/* Navigation */}
      {!showLoading && <Navigation onAboutClick={handleAboutClick} onContactClick={handleContactClick} />}

      <motion.div
        ref={scrollContainerRef}
        className="h-screen h-dvh overflow-y-scroll snap-y snap-mandatory dark:bg-black"
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
