"use client";

import dynamic from "next/dynamic";

// Non-critical, client-only tooling. Loaded as separate async chunks after
// hydration so they stay out of the initial/shared bundle.
const Clarity = dynamic(() => import("./Clarity"), { ssr: false });
const WebMCP = dynamic(() => import("./WebMCP"), { ssr: false });

export default function DeferredTools() {
  return (
    <>
      <Clarity />
      <WebMCP />
    </>
  );
}
