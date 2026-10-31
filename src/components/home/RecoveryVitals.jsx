"use client";

import { useId, useMemo, useState } from "react";
import { m, useReducedMotion, useTransform } from "framer-motion";
import Counter from "./WhoopCounter";
import { sparklineGeometry } from "@/lib/whoop-sparkline.mjs";

function dateLabel(date) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
}

function Vital({ label, unit, value, points = [], samples = 0, progress }) {
  const gradient = useId();
  const clip = useId();
  const [active, setActive] = useState(null);
  const reduceMotion = useReducedMotion();
  const reveal = useTransform(progress, [0.08, 0.28], [0, 1]);
  const revealWidth = useTransform(reveal, [0, 1], [0, 200]);
  const segments = useMemo(() => sparklineGeometry(points), [points]);
  const selected = active == null ? null : points[active];
  const reading = selected ? `${dateLabel(selected.date)} · ${selected.value == null ? "No reading" : `${Math.round(selected.value)} ${unit}`}` : null;
  function pointAt(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setActive(Math.max(0, Math.min(points.length - 1, Math.round((event.clientX - rect.left) / rect.width * (points.length - 1)))));
  }
  function navigate(event) {
    if (event.key === "Escape") { setActive(null); return; }
    const index = active ?? points.length - 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowUp" ? index + 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : null;
    if (next == null) return;
    event.preventDefault();
    setActive(Math.max(0, Math.min(points.length - 1, next)));
  }
  return <div className="min-w-0">
    <p className="text-[10px] text-white/60 sm:text-xs">{label}</p>
    <p className="mt-1 text-[28px] font-light leading-none tracking-tight tabular-nums md:text-4xl">
      <Counter value={value ?? null} progress={progress} /><span className="ml-1.5 text-xs tracking-normal text-white/40">{unit}</span>
    </p>
    <p className="mt-1 text-[9px] text-white/40">30-day average</p>
    <div data-vital-chart role="slider" aria-label={`${label} daily readings`} aria-valuemin={1} aria-valuemax={Math.max(1, points.length)} aria-valuenow={(active ?? Math.max(0, points.length - 1)) + 1} aria-valuetext={reading ?? "Use arrow keys to explore daily readings"} aria-disabled={!points.length} tabIndex={points.length ? 0 : -1}
      onPointerMove={event => { if (points.length) pointAt(event); }} onPointerDown={event => { if (points.length) pointAt(event); }} onPointerLeave={event => { if (event.pointerType === "mouse") setActive(null); }} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setActive(points.length - 1); }} onBlur={() => setActive(null)} onKeyDown={navigate}
      className="mt-1 h-11 cursor-crosshair rounded-sm focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-orange-300">
      <svg viewBox="0 0 200 44" preserveAspectRatio="none" aria-hidden="true" className="h-full w-full overflow-visible">
        <defs><clipPath id={clip}><m.rect x="0" y="0" height="44" width={reduceMotion ? 200 : revealWidth} /></clipPath><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fb923c" stopOpacity=".15" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></linearGradient></defs>
        <path d="M4 42H196" stroke="white" strokeOpacity=".08" />
        {segments.map((segment, index) => {
          const path = segment.map((point, i) => `${i ? "L" : "M"}${point.x},${point.y}`).join(" ");
          return <g key={index} clipPath={`url(#${clip})`}>
            {segment.length > 1 && <m.path d={`${path} L${segment.at(-1).x},44 L${segment[0].x},44 Z`} fill={`url(#${gradient})`} style={{ opacity: reduceMotion ? 1 : reveal }} />}
            {segment.length === 1 ? <m.circle cx={segment[0].x} cy={segment[0].y} r="1.7" fill="#fb923c" style={{ opacity: reduceMotion ? 1 : reveal }} /> : <m.path d={path} fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"  />}
          </g>;
        })}
        {selected && <line x1={4 + active / Math.max(1, points.length - 1) * 192} x2={4 + active / Math.max(1, points.length - 1) * 192} y1="2" y2="42" stroke="#fed7aa" strokeOpacity=".6" strokeDasharray="2 3" />}
      </svg>
    </div>
    <p data-vital-reading aria-live="polite" className="min-h-7 text-[9px] leading-tight text-white/45 sm:text-[10px]">{reading ? <>Daily · {reading}</> : samples ? <>{samples} readings · <span className="md:hidden">Tap</span><span className="hidden md:inline">Hover</span> to explore</> : "No recorded data"}</p>
  </div>;
}

export default function RecoveryVitals({ data, progress }) {
  return <div data-supporting-metrics aria-label="Recovery supporting metrics" className="mt-3 grid grid-cols-2 gap-4 border-t border-white/10 pt-3 md:mt-5 md:gap-6 md:pt-4 [&>div+div]:border-l [&>div+div]:border-white/10 [&>div+div]:pl-4 md:[&>div+div]:pl-6">
    <Vital label="Resting heart rate" unit="bpm" value={data?.restingHeartRate} points={data?.restingHeartRateTrend} samples={data?.samples?.restingHeartRate} progress={progress} />
    <Vital label="HRV" unit="ms" value={data?.hrv} points={data?.hrvTrend} samples={data?.samples?.hrv} progress={progress} />
  </div>;
}
