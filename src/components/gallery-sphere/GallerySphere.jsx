"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { captionFor } from "@/utils/polaroidStack";
import styles from "./gallerySphere.module.css";

const PhotoSphere = dynamic(() => import("./PhotoSphere"), { ssr: false, loading: () => <p className={styles.loading}>Putting memories in orbit…</p> });

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => false;

function PhotoSurface({ item, onAspect }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={styles.photoSurface}>
      <Image src={`/_next/image?url=${encodeURIComponent(item.image)}&w=384&q=75`} unoptimized alt="" aria-hidden="true" fill className={styles.contain} />
      <Image
        src={item.image} alt={`${captionFor(item.id)} — photograph by Rohan Gore`} fill
        sizes="(max-width: 768px) 92vw, 85vw" quality={90} priority
        className={`${styles.contain} ${styles.detailImage}`} style={{ opacity: loaded ? 1 : 0 }}
        onLoad={(event) => { onAspect(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight); setLoaded(true); }}
      />
    </div>
  );
}

function PhotoViewer({ items, index, origin, onChange, onClose, reducedMotion }) {
  const dialog = useRef(null);
  const item = items[index];
  const caption = captionFor(item.id);
  const [aspect, setAspect] = useState(() => origin ? origin.width / origin.height : 0.75);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const gutter = viewport.width <= 600 ? 16 : 40;
  const availableHeight = Math.max(100, viewport.height - 190);
  const photoWidth = Math.min(viewport.width - gutter * 2, 1200, availableHeight * aspect);
  const photoHeight = photoWidth / aspect;
  const target = { left: (viewport.width - photoWidth) / 2, top: 70 + (availableHeight - photoHeight) / 2, width: photoWidth, height: photoHeight, opacity: 1 };
  const flight = reducedMotion ? 0 : 0.75;

  useEffect(() => {
    const previous = document.activeElement;
    const node = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      node.close();
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  return (
    <m.dialog
      ref={dialog}
      className={styles.viewer}
      aria-label="Photo viewer"
      aria-describedby="photo-caption"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); onChange((index - 1 + items.length) % items.length); }
        if (event.key === "ArrowRight") { event.preventDefault(); onChange((index + 1) % items.length); }
      }}
    >
      <m.div className={styles.viewerShade} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: flight }} />
      <m.div className={styles.viewerTop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.3 }}>
        <span className={styles.eyebrow}>A CLOSER LOOK</span>
        <button type="button" autoFocus className={styles.close} onClick={onClose}>Close <span aria-hidden="true">×</span></button>
      </m.div>
        <m.figure
          className={styles.figure}
          initial={origin && !reducedMotion ? { ...origin, opacity: 1 } : { ...target, opacity: 0 }}
          animate={target}
          exit={origin && !reducedMotion ? { ...origin, opacity: 1 } : { opacity: 0 }}
          transition={{ duration: flight, ease: [0.76, 0, 0.24, 1] }}
        >
          <PhotoSurface key={item.id} item={item} onAspect={setAspect} />
          <m.figcaption id="photo-caption" className={styles.caption} aria-live="polite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.45 }}>{caption}</m.figcaption>
        </m.figure>
      <m.div className={styles.viewerBottom} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.3 }}>
        <button type="button" aria-label="Previous photo" onClick={() => onChange((index - 1 + items.length) % items.length)}>← <span>Previous</span></button>
        <span className={styles.counter}>{String(index + 1).padStart(2, "0")} <span>/ {items.length}</span></span>
        <button type="button" aria-label="Next photo" onClick={() => onChange((index + 1) % items.length)}><span>Next</span> →</button>
      </m.div>
    </m.dialog>
  );
}

export default function GallerySphere({ items, isRouteReady = true }) {
  const gallery = useRef(null);
  useEffect(() => {
    // Dialog autofocus and focus restoration can match :focus-visible even
    // after a pointer click. Show rings only when navigating by keyboard.
    const setKeyboard = () => { gallery.current.dataset.focusInput = "keyboard"; };
    const setPointer = () => { gallery.current.dataset.focusInput = "pointer"; };
    document.addEventListener("keydown", setKeyboard, true);
    document.addEventListener("pointerdown", setPointer, true);
    return () => {
      document.removeEventListener("keydown", setKeyboard, true);
      document.removeEventListener("pointerdown", setPointer, true);
    };
  }, []);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const [unavailable, setUnavailable] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const openPhoto = useCallback((index, origin = null) => setSelected({ index, origin }), []);
  const changePhoto = useCallback((index) => setSelected({ index, origin: null }), []);
  const closePhoto = useCallback(() => setSelected(null), []);
  const handleHover = useCallback((index) => setHovered(index), []);
  const handleError = useCallback(() => setUnavailable(true), []);
  // Orbit is the only selectable view. Keep an accessible fallback for browsers
  // without WebGL and visitors who have requested reduced motion.
  const showGrid = unavailable || reducedMotion;

  return (
    <section ref={gallery} className={styles.gallery} data-focus-input="pointer" aria-labelledby="memories-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>OFF THE CLOCK. THROUGH MY LENS.</p>
          <h1 id="memories-title" className={styles.title}>Memories<span>.</span></h1>
        </div>
        <div className={styles.headerAside}>
          <p>{items.length} moments. No particular order.</p>
        </div>
      </header>

      {showGrid ? (
        <div className={styles.grid}>
          {items.map((item, index) => (
            <button key={item.id} type="button" className={styles.gridCard} onClick={() => openPhoto(index)} aria-label={`Open photo: ${captionFor(item.id)}`}>
              <div className={styles.gridImage}><Image src={item.image} alt={captionFor(item.id)} fill sizes="(max-width: 600px) 44vw, (max-width: 1000px) 29vw, 22vw" className={styles.cover} /></div>
              <span><small>{String(index + 1).padStart(2, "0")}</small>{captionFor(item.id)}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className={styles.stage}>
            <PhotoSphere items={items} onSelect={openPhoto} onHover={handleHover} onError={handleError} paused={!isRouteReady} selectedIndex={selected?.index ?? null} />
            <div className={styles.hoverCaption} aria-hidden="true">
              <AnimatePresence mode="wait">
                {hovered !== null && <m.span key={hovered} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>{captionFor(items[hovered].id)} <span>↗</span></m.span>}
              </AnimatePresence>
            </div>
          </div>
          <div className={styles.orbitFooter}>
            <p id="orbit-instructions"><span className={styles.desktopHint}>Drag to wander. Click to stay a little.</span><span className={styles.mobileHint}>Swipe to wander. Tap a memory.</span><span className="sr-only">Use arrow keys to rotate and Enter to open the central photo.</span></p>
            <span className={styles.orbitMark}><i /> LITTLE MOMENTS, IN ORBIT</span>
          </div>
        </>
      )}
      <AnimatePresence>
        {selected !== null && <PhotoViewer items={items} index={selected.index} origin={selected.origin} onChange={changePhoto} onClose={closePhoto} reducedMotion={reducedMotion} />}
      </AnimatePresence>
    </section>
  );
}
