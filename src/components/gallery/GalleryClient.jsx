"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import HorizontalScrollGallery from "./HorizontalScrollGallery";
import { galleryItems } from "@/constants/galleryData";


export default function GalleryClient() {
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

      {/* Main Scroll Container */}
      <motion.div
        ref={scrollContainerRef}
        className="h-screen h-dvh overflow-y-scroll overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <HorizontalScrollGallery items={galleryItems} scrollContainerRef={scrollContainerRef} />

        {/* Footer Section */}
        <Footer />
      </motion.div>
    </div>
  );
}
