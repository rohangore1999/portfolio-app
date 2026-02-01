"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useTransition } from "@/context/TransitionContext";

export default function ContactPage() {
  const { navigate } = useTransition();

  const handleAboutClick = () => {
    navigate("/about", "about");
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation onAboutClick={handleAboutClick} />
      <div className="flex items-center justify-center px-8 min-h-screen">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Contact
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Get in touch with me...
          </p>
          <Link
            href="/"
            className="text-lg text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
