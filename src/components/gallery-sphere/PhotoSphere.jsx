"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPhotoSphere } from "./createPhotoSphere";
import styles from "./gallerySphere.module.css";

export default function PhotoSphere({ items, onSelect, onHover, onError, paused, selectedIndex }) {
  const host = useRef(null);
  const engine = useRef(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState("loading");
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    try {
      engine.current = createPhotoSphere(host.current, items, { onSelect, onHover, onError, onReady: handleReady, onPhase: setPhase });
      return () => { engine.current.dispose(); engine.current = null; };
    } catch {
      onError();
    }
  }, [items, onSelect, onHover, onError, handleReady]);

  useEffect(() => { engine.current?.setPaused(paused); }, [paused]);
  useEffect(() => { engine.current?.setSelection(selectedIndex); }, [selectedIndex]);

  return (
    <>
      <div
        ref={host}
        className={styles.canvas}
        role="group"
        tabIndex={0}
        aria-label="Interactive photo sphere"
        aria-describedby="orbit-instructions"
        data-ready={ready}
        data-intro-phase={phase}
      />
      <div className={styles.introWordmark} aria-hidden="true" data-visible={phase === "gather" || phase === "spin"}>
        <span>by Rohan.</span><small>A FEW THINGS WORTH KEEPING</small>
      </div>
      {phase === "loading" && <p className={styles.loading} role="status">Putting memories in orbit…</p>}
    </>
  );
}
