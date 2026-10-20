"use client";

import { createContext, useCallback, useContext, useState, useEffect, useLayoutEffect, useRef, useTransition as useRouteTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";

const TransitionContext = createContext();
const PATH_LABELS = { "/about": "about", "/work": "work", "/blog": "blog", "/gallery": "gallery", "/contact": "contact" };
const labelFor = pathname => PATH_LABELS[pathname] ??
  (/^\/(work|blog)\//.test(pathname) ? pathname.split("/").pop() : null);

export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [routePending, startRouteTransition] = useRouteTransition();
  const [navigation, setNavigation] = useState(() => {
    const label = labelFor(pathname);
    return label ? { id: 0, from: pathname, href: pathname, label, phase: "covering", intro: true } : null;
  });
  const active = useRef(navigation);
  const sequence = useRef(0);
  const timeout = useRef(null);
  const [error, setError] = useState("");

  const update = useCallback(value => {
    active.current = value;
    setNavigation(value);
  }, []);

  const reveal = useCallback(id => {
    if (active.current?.id !== id) return;
    clearTimeout(timeout.current);
    update({ ...active.current, phase: "revealing" });
  }, [update]);

  // Wait for the route to commit and React's pending work to finish. Give the
  // incoming page a frame underneath the cover, then reveal it.
  useLayoutEffect(() => {
    if (navigation?.phase !== "navigating" || routePending || pathname === navigation.from) return;
    const frame = requestAnimationFrame(() => reveal(navigation.id));
    return () => cancelAnimationFrame(frame);
  }, [navigation, pathname, routePending, reveal]);

  useEffect(() => () => {
    clearTimeout(timeout.current);
  }, []);

  const navigate = useCallback((href, label) => {
    if (active.current) return; // One navigation through the full cover/reveal.
    const destination = new URL(href, window.location.origin);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === pathname) {
      if (destination.search !== window.location.search || destination.hash !== window.location.hash) router.push(href);
      return;
    }

    setError("");
    const next = { id: ++sequence.current, from: pathname, href, label: label || labelFor(destination.pathname) || "page", phase: "covering", intro: false };
    update(next);
    // Prepare the destination while the cover animates, not afterward.
    router.prefetch(href);
    timeout.current = setTimeout(() => {
      if (active.current?.id !== next.id) return;
      setError("This page is taking longer to open. Please try again.");
      reveal(next.id);
    }, 15000);
  }, [pathname, router, reveal, update]);

  const covered = useCallback(() => {
    const current = active.current;
    if (current?.phase !== "covering") return;
    if (current.intro) { reveal(current.id); return; }
    update({ ...current, phase: "navigating" });
    if (current.href === "/") sessionStorage.setItem("softNavToHome", "true");
    // Swap only once the outgoing page is covered. The pending flag holds the
    // cover on slow routes; there is no fixed navigation or dismissal timer.
    startRouteTransition(() => router.push(current.href));
  }, [router, reveal, update, startRouteTransition]);

  // Fade only the outgoing page. Incoming pages render underneath the cover.
  const isTransitioning = Boolean(navigation && !navigation.intro && navigation.phase !== "revealing" && pathname === navigation.from);

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning, isRouteReady: navigation === null }}>
      <AnimatePresence onExitComplete={() => {
        if (active.current?.phase === "revealing") update(null);
      }}>
        {navigation && navigation.phase !== "revealing" && (
          <m.div
            key={navigation.id}
            role="status"
            aria-label={`Opening ${navigation.label}`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
            initial={{ y: reduceMotion ? 0 : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: reduceMotion ? 0 : "-100%" }}
            onAnimationComplete={covered}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <m.span
              className="text-black text-5xl md:text-7xl font-bold px-[10px] md:px-0 text-center block max-w-[90vw]"
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.12 }}
            >
              {navigation.label}
            </m.span>
          </m.div>
        )}
      </AnimatePresence>
      {children}
      {error && <p role="alert" className="fixed bottom-6 left-6 right-6 z-[110] rounded-lg bg-white px-5 py-3 text-sm text-black">{error}</p>}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransition must be used within TransitionProvider");
  return context;
}
