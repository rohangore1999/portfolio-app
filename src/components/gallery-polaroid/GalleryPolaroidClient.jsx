"use client";

import { useRef } from "react";
import { m } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import { galleryItems } from "@/constants/galleryData";
import GallerySphere from "../gallery-sphere/GallerySphere";

export default function GalleryPolaroidClient() {
  const { navigate, isTransitioning, isRouteReady } = useTransition();
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
      <m.div
        ref={scrollRef}
        initial={false}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GallerySphere items={galleryItems} isRouteReady={isRouteReady} />
        <Footer />
      </m.div>
    </div>
  );
}
