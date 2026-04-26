"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      <div className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-6">
          Error
        </p>
        <h1 className="text-5xl md:text-8xl font-light text-white leading-tight mb-8">
          Something went wrong
        </h1>
        <p className="text-base md:text-lg text-white/60 mb-10">
          An unexpected error occurred. Try again, or head back home.
        </p>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => reset()}
            className="text-sm uppercase tracking-widest text-white/70 hover:text-white transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="text-sm uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
