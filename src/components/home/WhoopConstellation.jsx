"use client";

import { memo, useCallback, useId, useMemo, useState } from "react";
import { m, useTransform, useReducedMotion } from "framer-motion";

import { recoveryShade } from "@/lib/whoop-visuals.mjs";

const series = ["sleep", "recovery", "strain"];
const names = ["Sleep", "Recovery", "Day strain"];
function label(point, metric) {
  if (!point?.date) return "Loading your days…";
  const date = new Date(`${point.date}T12:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  if (point.value == null) return `${date} · No recorded data`;
  const minutes = Math.round(point.value * 60);
  const value = metric === 0 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : metric === 1 ? `${Math.round(point.value)}%` : `${point.value.toFixed(1)} / 21${point.ongoing ? " so far" : ""}`;
  return `${date} · ${names[metric]}: ${value}`;
}

const DayShape = memo(function DayShape({ index, data, progress, active, selected, select, pin, pinned, gradient }) {
  const points = series.map(key => data?.[`${key}Trend`]?.[index]);
  const emphasized = selected === index;
  const reduceMotion = useReducedMotion();
  const enlargement = emphasized ? 6 : 0;
  const heights = [points[0]?.value == null ? 5 : Math.max(5, points[0].value / 12 * 168), 22 + enlargement, points[2]?.value == null ? 5 : Math.max(5, points[2].value / 21 * 180)];
  const positions = [index * 19 + 15, (index % 10) * 54 + 44 - enlargement / 2, index * 19 + 15];
  const tops = [206 - heights[0], Math.floor(index / 10) * 53 + 47 - enlargement / 2, 206 - heights[2]];
  const widths = [11, 22 + enlargement, 11];
  const radii = [4, 11 + enlargement / 2, 3];
  const opacity = points.map((point, metric) => point?.value == null ? 0.13 : 0.4 + Math.min(1, point.value / [12, 100, 21][metric]) * 0.6);
  const reveal = useTransform(progress, [index * 0.002, 0.14 + index * 0.002], [0, 1]);
  const drawnHeight = useTransform(reveal, amount => heights[active] * amount);
  const drawnY = useTransform(drawnHeight, size => active === 1 ? tops[active] : 206 - size);
  const dotScale = useTransform(reveal, [0, 1], [0.25, 1]);
  const revealOpacity = useTransform(reveal, [0, 0.15, 1], [0, 0.6, 1]);
  const point = points[active];
  const accessibleLabel = useMemo(() => label(data?.[`${series[active]}Trend`]?.[index], active), [data, active, index]);
  function navigate(event) {
    const next = event.key === "ArrowRight" ? Math.min(29, index + 1) : event.key === "ArrowLeft" ? Math.max(0, index - 1) : event.key === "Home" ? 0 : event.key === "End" ? 29 : null;
    if (event.key === "Escape") { select(null); pin(null); return; }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); pin(index); return; }
    if (next == null) return;
    event.preventDefault();
    event.currentTarget.closest("svg").querySelectorAll('[role="button"]')[next].focus();
  }
  return <m.g style={!reduceMotion ? { opacity: revealOpacity, scale: active === 1 ? dotScale : 1, transformBox: "fill-box", transformOrigin: "center" } : undefined} role="button" aria-pressed={pinned === index} aria-label={accessibleLabel} tabIndex={data && (selected == null ? index === 0 : selected === index) ? 0 : -1} onPointerEnter={event => { if (event.pointerType === "mouse") select(index); }} onPointerLeave={event => { if (event.pointerType === "mouse") select(null); }} onFocus={() => select(index)} onBlur={() => select(null)} onClick={() => pin(index)} onKeyDown={navigate} className="cursor-pointer outline-none">
    <m.rect style={active === 1 && Number.isFinite(point?.value) ? { filter: `drop-shadow(0 2px 2px #000000b3) drop-shadow(0 0 ${emphasized ? 4 : 2}px ${recoveryShade(point.value)}99) drop-shadow(0 0 ${emphasized ? 9 : 5}px ${recoveryShade(point.value)}55)` } : undefined} x={positions[active]} y={reduceMotion ? tops[active] : drawnY} width={widths[active]} height={reduceMotion || active === 1 ? heights[active] : drawnHeight} rx={radii[active]} fill={active === 1 ? recoveryShade(points[1]?.value) : `url(#${gradient})`} fillOpacity={active === 1 ? points[1]?.value == null ? 0 : 1 : selected === index ? 1 : opacity[active]} stroke={active === 1 ? recoveryShade(points[1]?.value) : selected === index ? "#fff3e8" : "#f97316"} strokeOpacity={selected === index ? 0.85 : 0.35} strokeWidth={selected === index ? 1.5 : 0.6} />
  </m.g>;
}, (previous, next) => {
  // Only the old/new hovered or pinned days and the keyboard tab stop need updating.
  const tabStop = props => props.data && (props.selected == null ? props.index === 0 : props.selected === props.index);
  return previous.index === next.index && previous.data === next.data && previous.progress === next.progress && previous.active === next.active && previous.gradient === next.gradient && previous.select === next.select && previous.pin === next.pin
    && (previous.selected === previous.index) === (next.selected === next.index)
    && (previous.pinned === previous.index) === (next.pinned === next.index)
    && tabStop(previous) === tabStop(next);
});

export default function WhoopConstellation({ data, progress, active }) {
  const id = useId();
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);
  const selected = hovered ?? pinned;
  const togglePin = useCallback(index => {
    setPinned(current => index == null || current === index ? null : index);
  }, []);
  const point = selected == null ? null : data?.[`${series[active]}Trend`]?.[selected];
  return <div className="relative w-full">
    <m.svg viewBox="0 0 600 240" role="group" aria-label={`${names[active]} over the last 30 days. Each shape is one day.`} className="h-auto aspect-[5/2] md:aspect-auto md:h-[clamp(7rem,24dvh,12rem)] w-full overflow-visible">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffb474" /><stop offset="45%" stopColor="#f97316" /><stop offset="100%" stopColor="#743015" /></linearGradient></defs>
      <path d="M 14 207 H 586" stroke="white" strokeOpacity="0.07" strokeDasharray="2 7" />
      {Array.from({ length: 30 }, (_, index) => <DayShape key={index} index={index} data={data} progress={progress} active={active} selected={selected} select={setHovered} pin={togglePin} pinned={pinned} gradient={id} />)}
    </m.svg>
    <div className="flex min-h-10 md:min-h-16 items-center justify-between gap-3 md:rounded-xl md:border md:border-white/[0.06] md:bg-white/[0.025] md:px-3 text-[10px] text-white/70 sm:text-xs">
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 py-2">
        {active === 1 && point?.value != null && <span className="text-3xl font-light tracking-tight tabular-nums" style={{ color: recoveryShade(point.value) }}>{Math.round(point.value)}<span className="ml-0.5 text-sm">%</span></span>}
        <span>{point ? active === 1 && point.value != null ? `${label(point, active).split(" · ")[0]} · Recovery` : label(point, active) : <><span className="md:hidden">Tap a day to explore.</span><span className="hidden md:inline">Hover to explore. Tap to keep a day in focus.</span></>}</span>
      </div>
    </div>
    <div className={`${active === 1 ? "flex" : "hidden md:flex"} mt-2 md:mt-3 min-h-4 flex-wrap items-center justify-between gap-3 text-[9px] text-white/45 sm:text-[10px]`}>
      <span className="hidden md:inline">{active === 0 ? "Hours asleep" : active === 1 ? "Recovery · WHOOP bands" : "Strain / 21 · ongoing days marked ‘so far’"}</span>
      {active === 1 ? <div className="flex flex-wrap items-center gap-3 md:shrink-0">{[[17, "1–33%"], [50, "34–66%"], [84, "67–100%"]].map(([score, range]) => <span key={score} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full border border-white/15" style={{ backgroundColor: recoveryShade(score) }} />{range}</span>)}<span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full border border-[#777]" />No data</span></div> : <span className="hidden md:inline">Each shape = one day</span>}
    </div>
  </div>;
}
