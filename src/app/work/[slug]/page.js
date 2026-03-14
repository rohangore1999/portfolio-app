"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";
import { allProjects } from "@/constants/work";

export default function WorkDetailPage() {
  const { slug } = useParams();
  const { navigate, isTransitioning } = useTransition();
  const [loadedVideos, setLoadedVideos] = useState(new Set());

  const project = allProjects.find((item) => item.slug === slug);
  const currentIndex = allProjects.findIndex((item) => item.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const handleAboutClick = () => navigate("/about", "about");
  const handleContactClick = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  const handleVideoLoad = (index) => {
    setLoadedVideos((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50 text-xl">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
      />

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: isTransitioning ? 0 : 1,
          y: isTransitioning ? 30 : 0,
        }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Header */}
        <div className="px-8 md:px-16 pt-24 md:pt-36 pb-10">
          {/* Back + links row */}
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => navigate("/work", "work")}
              className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              ← Back to Work
            </button>

            {/* External links — on mobile show only the most important ones */}
            <div className="flex items-center gap-4 md:gap-5">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:block text-xs uppercase tracking-widest text-white/50 hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  GitHub ↗
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  {project.liveLabel ?? "Live"} ↗
                </a>
              )}
              {project.blog && (
                <button
                  onClick={() => navigate(project.blog, "blog")}
                  className="text-xs uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  Blog →
                </button>
              )}
            </div>
          </div>

          {/* Meta row: category + year */}
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              {project.category}
            </p>
            {project.year && (
              <p className="text-xs uppercase tracking-widest text-white/25">
                {project.year}
              </p>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-9xl font-light text-white leading-tight md:leading-none mb-6 md:mb-8">
            {project.title}
          </h1>

          {/* Tags — hidden on mobile, visible on desktop */}
          {project.tags?.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-widest text-white/50 border border-white/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/20 mb-6 md:mb-8" />

          {/* Tagline + description */}
          {project.tagline && (
            <p className="text-base md:text-2xl font-normal text-white/70 leading-relaxed">
              {project.tagline}
            </p>
          )}
          {project.description && (
            <p className="hidden md:block mt-4 text-sm md:text-base font-normal text-white/50 leading-relaxed">
              {project.description}
            </p>
          )}
          {project.blog && (
            <button
              onClick={() => navigate(project.blog, "blog")}
              className="hidden md:inline-flex mt-6 items-center gap-2 text-sm uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 cursor-pointer group"
            >
              Read the full write-up
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </div>

        {/* Gallery — each image at its natural aspect ratio */}
        {project.media?.length > 0 && (
          <div className="px-8 md:px-16 mb-16 flex flex-col gap-6">
            {project.media.map((item, i) => (
              <motion.div
                key={i}
                className="w-full rounded-xl overflow-hidden border border-white/10"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 * i }}
              >
                {item.type === "youtube" ? (
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    {/* Skeleton Loader - show until iframe loads */}
                    {!loadedVideos.has(i) && (
                      <div className="absolute inset-0 bg-white/5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>
                    )}

                    {/* iframe - fade in when loaded */}
                    <iframe
                      src={item.src}
                      onLoad={() => handleVideoLoad(i)}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                        loadedVideos.has(i) ? "opacity-100" : "opacity-0"
                      }`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${project.title} demo`}
                    />
                  </div>
                ) : item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={`${project.title} — image ${i + 1}`}
                    width={1600}
                    height={900}
                    className="w-full h-auto transition-transform duration-700 hover:scale-[1.01]"
                    priority={i === 0}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="px-8 md:px-16 pb-24">
          <div className="border-t border-white/20 pt-10 flex items-center justify-between">
            {prevProject ? (
              <button
                onClick={() =>
                  navigate(prevProject.href, prevProject.title.toLowerCase())
                }
                className="group flex flex-col gap-1 text-left transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <span className="text-xs uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
                  ← Previous
                </span>
                <span className="text-xl md:text-3xl font-light text-white/60 group-hover:text-white transition-colors">
                  {prevProject.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextProject ? (
              <button
                onClick={() =>
                  navigate(nextProject.href, nextProject.title.toLowerCase())
                }
                className="group flex flex-col gap-1 text-right transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <span className="text-xs uppercase tracking-widest text-white/30 group-hover:text-white/50 transition-colors">
                  Next →
                </span>
                <span className="text-xl md:text-3xl font-light text-white/60 group-hover:text-white transition-colors">
                  {nextProject.title}
                </span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
