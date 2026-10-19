"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import ExperienceSection from "@/components/about/ExperienceSection";
import PhilosophySection from "@/components/about/PhilosophySection";

export default function AboutPageClient({ yearsOfExperience }) {
  const { navigate, isTransitioning } = useTransition();
  const scrollContainerRef = useRef(null);

  const handleAboutClick = () => navigate("/about", "about");

  const handleContactClick = () => {
    const footer = scrollContainerRef.current?.querySelector("#contact");
    footer?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
      />

      {/* Snap Scroll Container */}
      <m.div
        ref={scrollContainerRef}
        className="h-screen h-dvh overflow-y-scroll snap-y snap-mandatory"
        initial={false}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Hero + Image + Bio Section */}
        <AboutHeroSection yearsOfExperience={yearsOfExperience} />

        {/* Work Experience Timeline */}
        <ExperienceSection />

        {/* Philosophy Section */}
        <PhilosophySection />

        {/* Footer Section */}
        <section className="snap-start">
          <Footer />
        </section>
      </m.div>
    </div>
  );
}
