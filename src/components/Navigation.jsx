"use client";

import { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import MagneticLink from "./MagneticLink";
import LogoLink from "./LogoLink";
import { useTransition } from "@/context/TransitionContext";

export default function Navigation({ onAboutClick, onContactClick }) {
  const reduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigate } = useTransition();

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate("/", "home");
  };

  const handleWorkClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate("/work", "work");
  };

  const handleBlogClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate("/blog", "blog");
  };

  const handleGalleryClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    navigate("/gallery", "gallery");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onContactClick?.();
  };

  const handleAboutClickMobile = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onAboutClick();
  };

  return (
    <>
      <m.nav
        className="fixed md:absolute top-0 left-0 right-0 z-40 backdrop-blur-xs"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Rohan - with special hover effect */}
          <LogoLink onClick={handleHomeClick} />

          {/* Right: Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" prefetch={true} onNavigate={(e) => { e.preventDefault(); onAboutClick(); }}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                About
              </MagneticLink>
            </Link>

            <Link href="/work" prefetch={true} onNavigate={handleWorkClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Work
              </MagneticLink>
            </Link>

            <Link href="/blog" prefetch={true} onNavigate={handleBlogClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Blog
              </MagneticLink>
            </Link>

            <Link href="/gallery" prefetch={true} onNavigate={handleGalleryClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Gallery
              </MagneticLink>
            </Link>

            <Link href="/contact" prefetch={true} onNavigate={handleContactClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Contact
              </MagneticLink>
            </Link>
          </div>

          {/* Right: Menu Button - Mobile */}
          <button
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-base font-medium text-black dark:text-white hover:opacity-70 transition-opacity"
          >
            Menu
          </button>
        </div>
      </m.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <m.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={event => { if (event.key === "Escape") setIsMobileMenuOpen(false); }}
            className="fixed inset-0 z-[150] bg-white dark:bg-white flex flex-col"
            initial={{ x: reduceMotion ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header with Logo and Close */}
            <div className="flex items-center justify-between px-6 py-4">
              <LogoLink onClick={handleHomeClick} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-medium text-black hover:opacity-70 transition-opacity"
              >
                Close
              </button>
            </div>

            {/* Navigation Links - Vertical */}
            <m.nav aria-label="Mobile navigation" className="flex-1 flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, delay: reduceMotion ? 0 : 0.12, ease: "easeOut" }}
            >
              <Link href="/about" prefetch={true} onNavigate={handleAboutClickMobile}>
                <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
                  About
                </span>
              </Link>

              <Link href="/work" prefetch={true} onNavigate={handleWorkClick}>
                <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
                  Work
                </span>
              </Link>

              <Link href="/blog" prefetch={true} onNavigate={handleBlogClick}>
                <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
                  Blog
                </span>
              </Link>

              <Link href="/gallery" prefetch={true} onNavigate={handleGalleryClick}>
                <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
                  Gallery
                </span>
              </Link>

              <Link href="/contact" prefetch={true} onNavigate={handleContactClick}>
                <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
                  Contact
                </span>
              </Link>
            </m.nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
