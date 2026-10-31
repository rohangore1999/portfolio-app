"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import WhoopConstellation from "./WhoopConstellation";
import Counter from "./WhoopCounter";
import RecoveryVitals from "./RecoveryVitals";
import styles from "./whoopPreview.module.css";
import { animate, m, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";

function subscribeCompact(callback) {
  const query = window.matchMedia("(max-width: 767px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function compactSnapshot() { return window.matchMedia("(max-width: 767px)").matches; }
function serverCompactSnapshot() { return false; }

function dateLabel(date) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}


function MetricScene({ item, index, reduceMotion, data, error, scrollContainerRef, headerHeight }) {
  const scene = useRef(null);
  const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, serverCompactSnapshot);
  const pinned = !reduceMotion;
  const { scrollYProgress } = useScroll({ container: scrollContainerRef, target: scene, offset: pinned ? [`start ${headerHeight}px`, "end end"] : ["start end", "end start"] });
  const ready = useMotionValue(0);
  useEffect(() => {
    if (!data) { ready.set(0); return; }
    const animation = animate(ready, 1, { duration: reduceMotion ? 0 : 0.65, ease: "linear" });
    return () => animation.stop();
  }, [data, ready, reduceMotion]);
  // Keep scroll-driven choreography, but ease in data arriving mid-chapter.
  const metricProgress = useTransform([scrollYProgress, ready], ([scroll, loaded]) => Math.min(scroll, loaded * 0.3));
  const opacity = useTransform(scrollYProgress, [0, 0.78, 0.94, 1], [1, 1, index === 2 ? 1 : 0.4, index === 2 ? 1 : 0]);
  const stackScale = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, index === 2 ? 1 : 0.9]);
  const stackY = useTransform(scrollYProgress, [0, 0.78, 1], [0, 0, index === 2 ? 0 : -36]);
  const stackRotation = useTransform(scrollYProgress, [0, 0.78, 1], [0, 0, index === 2 ? 0 : 3]);
  const numberY = useTransform(scrollYProgress, [0, 0.22, 0.84, 1], [compact ? 18 : 40, 0, compact ? -4 : -12, index === 2 ? (compact ? -4 : -12) : (compact ? -35 : -110)]);
  const numberScale = useTransform(scrollYProgress, [0, 0.22, 0.84, 1], [compact ? 0.94 : 0.85, 1, 1, compact ? 1.02 : 1.06]);
  const graphY = useTransform(scrollYProgress, [0, 0.3, 0.84, 1], [compact ? 24 : 60, 0, 0, index === 2 ? 0 : (compact ? -18 : -60)]);
  const graphScale = useTransform(scrollYProgress, [0, 0.3, 1], [0.9, 1, 1.03]);
  const copyY = useTransform(scrollYProgress, [0, 0.24, 0.84, 1], [compact ? 12 : 30, 0, compact ? -4 : -25, index === 2 ? (compact ? -4 : -25) : (compact ? -40 : -170)]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [compact ? 12 : 90, compact ? -24 : -120]);
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.25, 0.88, 1], [0, compact ? 0.09 : 0.035, compact ? 0.09 : 0.035, 0]);
  const minutes = data?.sleep != null ? Math.round(data.sleep * 60) : null;
  return <section ref={scene} data-chapter={index} aria-label={`${item.label} monthly statistics`} style={pinned && index < 2 ? { marginBottom: `calc(${headerHeight}px - 100dvh)` } : undefined} className={`${item.key === "recovery" ? styles.recoveryScene : ""} ${pinned ? "relative h-[220dvh] md:h-[400dvh]" : "relative py-12 sm:py-16"}`}>
    <m.div style={pinned ? { top: headerHeight, height: `calc(100dvh - ${headerHeight}px)`, scale: stackScale, y: stackY, rotateX: stackRotation, transformOrigin: "center top", zIndex: index + 1 } : undefined} className={pinned ? "sticky flex items-center overflow-clip bg-transparent" : "relative"}>
    {pinned && <m.span aria-hidden="true" style={{ y: backdropY, opacity: backdropOpacity, ...(compact && index === 2 ? { fontSize: "clamp(2.75rem, 15vw, 6.5rem)" } : {}) }} className="pointer-events-none absolute inset-x-0 top-[6%] md:top-[12%] select-none whitespace-nowrap md:whitespace-normal text-[clamp(3rem,17vw,7rem)] md:text-[clamp(5rem,20vw,18rem)] font-semibold uppercase leading-none tracking-[-0.08em]">{item.label}</m.span>}
    <m.div data-scene-grid style={reduceMotion ? {} : { opacity }} className="relative grid w-full items-center gap-4 md:gap-6 md:grid-cols-2 md:gap-20">

      <div aria-busy={!data && !error} data-loading-error={error || undefined} className={`${!data ? styles.loadingMetrics : styles.loadedMetrics} ${index === 1 ? "min-w-0 md:order-2" : "min-w-0"}`}>
        <m.div style={pinned ? { y: numberY, scale: numberScale } : {}}><p className="flex flex-wrap items-baseline gap-x-1.5 text-[10px] leading-relaxed tracking-[0.16em] text-orange-400 md:tracking-[0.22em]"><span className="hidden md:inline">0{index + 1} /</span><span>{item.label.toUpperCase()}</span><span className="whitespace-nowrap">· MONTHLY AVERAGE</span></p>
        <div data-primary-number className="mt-3 md:mt-5 whitespace-nowrap text-[clamp(3.5rem,10vw,8rem)] font-light leading-none tracking-[-0.06em] tabular-nums">
          {data ? item.key === "sleep" ? minutes == null ? "—" : <><Counter progress={metricProgress} value={Math.floor(minutes / 60)} /><span className="mx-1 text-[0.3em] tracking-normal text-white/35">h</span><Counter progress={metricProgress} value={minutes % 60} /><span className="ml-1 text-[0.3em] tracking-normal text-white/35">m</span></> : <><Counter progress={metricProgress} value={data[item.key] == null ? null : item.key === "recovery" ? Math.round(data[item.key]) : data[item.key]} decimals={item.key === "strain" ? 1 : 0} /><span className="ml-2 text-[0.3em] tracking-normal text-white/35">{item.key === "recovery" ? "%" : "/21"}</span></> : "—"}
        </div>
        </m.div>
        <m.div data-primary-chart style={pinned ? { y: graphY, scale: graphScale } : {}} className="mt-3 md:mt-6 origin-left"><WhoopConstellation data={data} progress={metricProgress} active={index} /></m.div>
        <p data-sample-count className="mt-2 md:mt-4 text-[10px] text-white/40">{data ? <>Last 30 days · <span className="md:hidden">{data.samples[item.key]} {index === 0 ? "nights recorded" : index === 2 ? "completed days" : "recovery readings"}</span><span className="hidden md:inline">{`${data.samples[item.key]} ${index === 0 ? "recorded nights" : index === 2 ? "completed days · current strain is ‘so far’" : "recovery readings"}`}</span></> : "Syncing your days…"}</p>
        {item.key === "recovery" && <RecoveryVitals data={data} progress={metricProgress} />}
      </div>
      <m.div data-scene-caption style={pinned ? { y: copyY } : {}} className={index === 1 ? "md:order-1" : ""}>
        <h3 className="max-w-md text-2xl md:text-4xl font-light leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">{item.caption}</h3>
        <p className="mt-2 md:mt-5 max-w-sm text-sm leading-relaxed text-white/50 sm:text-base">{item.title}</p>
      </m.div>
    </m.div>
    </m.div>
  </section>;
}

export default function WhoopPreview({ scrollContainerRef }) {
  const ref = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let frame = 0;
    let current = -1;
    function update() {
      frame = 0;
      // Follow the chapter entering the reading area below the sticky header.
      const containerTop = container.getBoundingClientRect().top;
      const readingLine = containerTop + headerHeight + (container.clientHeight - headerHeight) * 0.3;
      const chapters = ref.current?.querySelectorAll('[data-chapter]') ?? [];
      let next = 0;
      chapters.forEach((chapter, index) => {
        if (chapter.getBoundingClientRect().top <= readingLine) next = index;
      });
      // Re-render only when the chapter changes, never on every scroll frame.
      if (next !== current) { current = next; setActiveChapter(next); }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    container.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    schedule();
    return () => {
      container.removeEventListener("scroll", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [scrollContainerRef, headerHeight]);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(([entry]) => setHeaderHeight(Math.ceil(entry.target.getBoundingClientRect().height)));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  const reduceMotion = useReducedMotion();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort("timeout"), 20000);
    fetch("/api/whoop/preview", { method: "POST", signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("unavailable"); return response.json(); })
      .then(value => { setData(value); setError(false); })
      .catch(error => { if (controller.signal.reason === "timeout" || error.name !== "AbortError") setError(true); })
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  const metrics = [
    { key: "sleep", label: "Sleep", caption: "Offline, but productive.", title: "Time spent doing absolutely nothing.", maximum: 12 },
    { key: "recovery", label: "Recovery", caption: "Negotiations ongoing.", title: "Me vs. the consequences of yesterday.", maximum: 100 },
    { key: "strain", label: "Day strain", caption: "Effort has entered the chat.", title: "Some days asked for a little more.", maximum: 21 },
  ];
  function jump(index) {
    const container = scrollContainerRef.current;
    const chapter = ref.current?.querySelectorAll('[data-chapter]')[index];
    if (!container || !chapter) return;
    const chapterTop = chapter.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    // Match the scene's scroll offsets and land after every reveal has completed,
    // safely before its exit or the next chapter's entrance.
    const pinnedTravel = Math.max(0, chapter.offsetHeight - container.clientHeight + headerHeight);
    const settledOffset = reduceMotion ? 0 : pinnedTravel * 0.45;
    container.scrollTo({ top: Math.max(0, chapterTop - headerHeight + settledOffset), behavior: reduceMotion ? "instant" : "smooth" });
  }

  return <section ref={ref} aria-label="My last 30 days, measured by WHOOP" className="relative isolate snap-start overflow-clip bg-[#080808] px-6 text-white sm:px-8">
    <div className="relative mx-auto w-full max-w-6xl perspective-[1200px]">
      <header ref={headerRef} className="sticky top-0 z-30 flex flex-wrap items-start justify-between gap-3 md:gap-4 border-b border-white/10 bg-[#080808] pt-20 pb-4 md:pt-28 md:pb-8">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-orange-400">SAME HUMAN. LAST 30 DAYS.</p>
          <h2 className="mt-2 md:mt-4 max-w-xl text-xl font-light leading-snug tracking-tight text-white/90 md:text-3xl">“If you can’t measure it, you can’t fix it.”</h2>
          <p data-sample-count className="mt-2 md:mt-4 text-[10px] md:text-xs text-white/45">{data ? `${dateLabel(data.periodStart)} – ${dateLabel(data.periodEnd)}` : "Gathering the receipts…"} · WHOOP {process.env.NODE_ENV === "development" && <span className="ml-2 hidden md:inline text-white/25">LOCAL PREVIEW</span>}</p>
        </div>
        <nav aria-label="Metric chapters" className="flex w-full justify-between gap-3 md:w-auto md:justify-start md:gap-5">
          {metrics.map((item, index) => <button key={item.key} type="button" onClick={() => jump(index)} aria-current={activeChapter === index ? "step" : undefined} className={styles.chapterButton}><span className="hidden md:inline">0{index + 1} </span>{item.label}</button>)}
        </nav>
      </header>
      {error && <div role="status" className="fixed bottom-6 left-6 right-6 z-40 mx-auto max-w-sm rounded-xl border border-white/10 bg-[#141414] px-5 py-4 text-sm text-white/60">Couldn’t sync WHOOP. <button onClick={() => { setError(false); setAttempt(value => value + 1); }} className="text-orange-400 underline">Try again</button></div>}<div aria-busy={!data && !error}>
        {metrics.map((item, index) => <MetricScene key={item.key} item={item} index={index} reduceMotion={reduceMotion} data={data} error={error} scrollContainerRef={scrollContainerRef} headerHeight={headerHeight} />)}
      </div>
    </div>
  </section>;
}
