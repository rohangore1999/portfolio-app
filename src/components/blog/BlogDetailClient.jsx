"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTransition } from "@/context/TransitionContext";

export default function BlogDetailClient({ post, content }) {
  const { navigate, isTransitioning } = useTransition();

  const handleAboutClick = () => navigate("/about", "about");
  const handleContactClick = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

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
        <div className="px-8 md:px-16 pt-24 md:pt-36 pb-12">
          <button
            onClick={() => navigate("/blog", "blog")}
            className="text-sm uppercase tracking-widest text-white/50 hover:text-white transition-colors mb-10 block"
          >
            ← Back to Blog
          </button>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
            {post.category}
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-white leading-tight max-w-5xl">
            {post.title}
          </h1>
        </div>

        {/* Cover image */}
        <div className="relative w-full h-[50vh] md:h-[70vh] px-8 md:px-16 mb-16">
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* MDX content */}
        <div className="px-8 md:px-16 pb-24 max-w-3xl md:max-w-none prose prose-invert prose-lg
          prose-headings:font-light prose-headings:text-white
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-a:text-orange-500 prose-a:no-underline hover:prose-a:text-orange-400
          prose-code:text-orange-400 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
          prose-blockquote:border-l-orange-500 prose-blockquote:text-white/50
          prose-strong:text-white prose-li:text-white/70
          prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:w-full prose-img:my-10">
          {content}
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
