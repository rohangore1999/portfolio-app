"use client";

import { useId, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

function dateLabel(date) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

function formatValue(value, unit) {
  if (value === null) return "No recorded data";
  if (unit === "sleep") {
    const minutes = Math.round(value * 60);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
  return unit === "recovery" ? `${Math.round(value)}%` : `${value.toFixed(1)} / 21`;
}

export default function WhoopTrend({ points, maximum, metric, unit, compact = false }) {
  const reduceMotion = useReducedMotion();
  const tooltipId = useId();
  const [active, setActive] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const bars = points || Array.from({ length: 30 }, () => ({ date: null, value: null }));
  const selected = active === null ? null : bars[active];
  const position = active === null ? 0 : (active + 0.5) / bars.length * 100;

  function navigate(event, index) {
    let next;
    if (event.key === "ArrowRight") next = Math.min(bars.length - 1, index + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = bars.length - 1;
    else if (event.key === "Escape") { setActive(null); return; }
    else return;
    event.preventDefault();
    setTabIndex(next);
    setActive(next);
    event.currentTarget.parentElement.querySelectorAll("button")[next].focus();
  }

  return <div className="relative mt-4" role="group" aria-label={`${metric} by day over the last 30 days`}>
    <AnimatePresence>
      {selected?.date && <m.div key="tooltip" id={tooltipId} role="tooltip" className="pointer-events-none absolute bottom-full z-20 mb-2 whitespace-nowrap rounded-lg border border-white/15 bg-[#202020] px-3 py-2 text-xs shadow-xl" style={{ left: `${position}%`, x: `${-position}%` }} initial={{ opacity: 0, y: reduceMotion ? 0 : 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.182 }}>
        <p className="text-[10px] text-white/55">{dateLabel(selected.date)}</p>
        <p className="mt-1 font-medium text-white">{selected.value === null ? "No recorded data" : `${metric}: ${formatValue(selected.value, unit)}${selected.ongoing ? " so far" : ""}`}</p>
      </m.div>}
    </AnimatePresence>
    <div className={`flex items-end gap-[3px] sm:gap-1 ${compact ? "h-16 sm:h-20" : "h-28 sm:h-36"}`}>
      {bars.map((point, index) => <button key={index} disabled={!point.date} tabIndex={index === tabIndex ? 0 : -1} aria-label={point.date ? `${dateLabel(point.date)} · ${metric}: ${formatValue(point.value, unit)}${point.ongoing ? " so far" : ""}` : "Loading chart"} aria-describedby={active === index ? tooltipId : undefined} className="relative flex h-full min-w-0 flex-1 items-end rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400" onPointerEnter={event => { if (event.pointerType === "mouse") setActive(index); }} onPointerLeave={event => { if (event.pointerType === "mouse") setActive(null); }} onFocus={() => { setTabIndex(index); setActive(index); }} onBlur={() => setActive(null)} onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>
        <m.span aria-hidden="true" className={`block w-full origin-bottom rounded-t-sm ${point.value === null ? "border-b border-dashed border-white/25" : ""}`} style={{ height: "100%" }} initial={{ scaleY: 0 }} animate={{ scaleY: point.value === null ? 0.018 : Math.max(0.018, Math.min(1, point.value / maximum)), backgroundColor: point.value === null ? "transparent" : active === index || index === bars.length - 1 ? "#f97316" : "rgba(249,115,22,0.35)", boxShadow: point.value === null || point.value <= 0 ? "none" : active === index || index === bars.length - 1 ? "inset 0 1px 0 rgba(255,255,255,0.28), 0 0 2px rgba(249,115,22,0.3)" : "inset 0 1px 0 rgba(255,255,255,0.12)" }} viewport={{ once: true, amount: 0.3 }} transition={{ scaleY: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }, backgroundColor: { duration: reduceMotion ? 0 : 0.18 }, boxShadow: { duration: reduceMotion ? 0 : 0.188 } }} />
      </button>)}
    </div>
    <div className="mt-2 flex justify-between text-[10px] text-white/45" aria-hidden="true"><span>{points?.[0]?.date ? dateLabel(points[0].date) : ""}</span><span>{points?.at(-1)?.date ? dateLabel(points.at(-1).date) : ""}</span></div>
  </div>;
}
