"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback) {
  document.addEventListener("visibilitychange", callback);
  window.addEventListener("site-menu-change", callback);
  return () => {
    document.removeEventListener("visibilitychange", callback);
    window.removeEventListener("site-menu-change", callback);
  };
}
const snapshot = () => !document.hidden && !document.documentElement.dataset.menuOpen;
const serverSnapshot = () => true;

// Suspend continuous decorative work while another surface covers the page.
export function usePageActivity() { return useSyncExternalStore(subscribe, snapshot, serverSnapshot); }
