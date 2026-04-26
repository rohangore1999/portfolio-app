"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import { galleryItems } from "@/constants/galleryData";
import PolaroidDeck from "./PolaroidDeck";

export default function GalleryPolaroidClient() {
  const { navigate, isTransitioning } = useTransition();
  const scrollRef = useRef(null);

  const handleAboutClick = () => navigate("/about", "about");

  const handleContactClick = () => {
    const footer = scrollRef.current?.querySelector("#contact");
    footer?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
      />
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PolaroidDeck items={galleryItems} />
        <Footer />
      </motion.div>
    </div>
  );
}
