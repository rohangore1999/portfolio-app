"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import MagneticLink from "./MagneticLink";
import LogoLink from "./LogoLink";
import styles from "./navigation.module.css";
import { useTransition } from "@/context/TransitionContext";

export default function Navigation({ onAboutClick, onContactClick }) {
  const reduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigate } = useTransition();
  const menuButton = useRef(null);
  const drawer = useRef(null);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const trigger = menuButton.current;
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    document.documentElement.dataset.menuOpen = "true";
    window.dispatchEvent(new Event("site-menu-change"));
    const surfaces = [document.documentElement, document.body, ...document.querySelectorAll('[data-page-scroll]')];
    const previous = surfaces.map(element => element.style.overflow);
    surfaces.forEach(element => { element.style.overflow = "hidden"; });
    const frame = requestAnimationFrame(() => drawer.current?.querySelector('button')?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(frame);
      desktop.removeEventListener("change", closeOnDesktop);
      surfaces.forEach((element, index) => { element.style.overflow = previous[index]; });
      delete document.documentElement.dataset.menuOpen;
      window.dispatchEvent(new Event("site-menu-change"));
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [isMobileMenuOpen]);

  function handleMenuKey(event) {
    if (event.key === "Escape") { setIsMobileMenuOpen(false); return; }
    if (event.key !== "Tab") return;
    const targets = drawer.current?.querySelectorAll('a[href], button');
    if (!targets?.length) return;
    const first = targets[0], last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

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
    if (onContactClick) onContactClick();
    else navigate("/contact", "contact");
  };

  const handleAboutClickMobile = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onAboutClick) onAboutClick();
    else navigate("/about", "about");
  };

  return (
    <>
      <m.nav
        className={`fixed md:absolute top-0 left-0 right-0 z-40 ${isMobileMenuOpen ? "" : "backdrop-blur-xs"}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
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
            ref={menuButton}
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
      <div
        ref={drawer}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        onKeyDown={handleMenuKey}
        data-open={isMobileMenuOpen}
        className={styles.drawer}
      >
        {/* Header with Logo and Close */}
        <div className="flex items-center justify-between px-6 py-4">
          <LogoLink onClick={handleHomeClick} lightSurface />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-medium text-black hover:opacity-70 transition-opacity"
          >
            Close
          </button>
        </div>

        {/* Navigation Links - Vertical */}
        <nav aria-label="Mobile navigation" className={styles.links}>
          <Link href="/about" prefetch={false} onNavigate={handleAboutClickMobile}>
            <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
              About
            </span>
          </Link>

          <Link href="/work" prefetch={false} onNavigate={handleWorkClick}>
            <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
              Work
            </span>
          </Link>

          <Link href="/blog" prefetch={false} onNavigate={handleBlogClick}>
            <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
              Blog
            </span>
          </Link>

          <Link href="/gallery" prefetch={false} onNavigate={handleGalleryClick}>
            <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
              Gallery
            </span>
          </Link>

          <Link href="/contact" prefetch={false} onNavigate={handleContactClick}>
            <span className="inline-block text-4xl font-semibold text-black hover:opacity-70 cursor-pointer">
              Contact
            </span>
          </Link>
        </nav>
      </div>
    </>
  );
}
