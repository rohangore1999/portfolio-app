"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import { recentWork } from "@/constants/home";

export default function WorkDetailPage() {
  const { slug } = useParams();
  const { navigate, isTransitioning } = useTransition();

  const project = recentWork.find((item) => item.slug === slug);

  const handleAboutClick = () => navigate("/about", "about");
  const handleContactClick = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50 text-xl">Project not found.</p>
      </div>
    );
  }

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
        <div className="px-8 md:px-16 pt-36 pb-12">
          <button
            onClick={() => navigate("/work", "work")}
            className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-10 block"
          >
            ← Back to Work
          </button>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
            {project.category}
          </p>
          <h1 className="text-6xl md:text-9xl font-light text-white leading-none">
            {project.title}
          </h1>
        </div>

        {/* Cover image */}
        <div className="relative w-full h-[50vh] md:h-[70vh] px-8 md:px-16 mb-16">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Project info */}
        <div className="px-8 md:px-16 pb-24 max-w-3xl">
          <p className="text-white/50 text-lg md:text-xl leading-relaxed">
            Detailed case study coming soon. Check back for the full breakdown of
            the design decisions, technical architecture, and outcomes for{" "}
            <span className="text-white">{project.title}</span>.
          </p>
        </div>

      </motion.div>

      <Footer />
    </div>
  );
}
