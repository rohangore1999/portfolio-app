"use client";

import { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import MagneticLink from "./MagneticLink";
import LogoLink from "./LogoLink";
import { useTransition } from "@/context/TransitionContext";

export default function Navigation({ onAboutClick, onContactClick }) {
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
            <Link href="/about" prefetch={true} onClick={(e) => { e.preventDefault(); onAboutClick(); }}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                About
              </MagneticLink>
            </Link>

            <Link href="/work" prefetch={true} onClick={handleWorkClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Work
              </MagneticLink>
            </Link>

            <Link href="/blog" prefetch={true} onClick={handleBlogClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Blog
              </MagneticLink>
            </Link>

            <Link href="/gallery" prefetch={true} onClick={handleGalleryClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Gallery
              </MagneticLink>
            </Link>

            <Link href="/contact" prefetch={true} onClick={handleContactClick}>
              <MagneticLink className="text-base cursor-pointer font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
                Contact
              </MagneticLink>
            </Link>
          </div>

          {/* Right: Menu Button - Mobile */}
          <button
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
            className="fixed inset-0 z-[150] bg-white dark:bg-white flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
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
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <Link href="/about" prefetch={true} onClick={handleAboutClickMobile}>
                <m.span
                  className="text-4xl font-semibold text-black hover:opacity-70 transition-opacity cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  About
                </m.span>
              </Link>

              <Link href="/work" prefetch={true} onClick={handleWorkClick}>
                <m.span
                  className="text-4xl font-semibold text-black hover:opacity-70 transition-opacity cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Work
                </m.span>
              </Link>

              <Link href="/blog" prefetch={true} onClick={handleBlogClick}>
                <m.span
                  className="text-4xl font-semibold text-black hover:opacity-70 transition-opacity cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  Blog
                </m.span>
              </Link>

              <Link href="/gallery" prefetch={true} onClick={handleGalleryClick}>
                <m.span
                  className="text-4xl font-semibold text-black hover:opacity-70 transition-opacity cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Gallery
                </m.span>
              </Link>

              <Link href="/contact" prefetch={true} onClick={handleContactClick}>
                <m.span
                  className="text-4xl font-semibold text-black hover:opacity-70 transition-opacity cursor-pointer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  Contact
                </m.span>
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
