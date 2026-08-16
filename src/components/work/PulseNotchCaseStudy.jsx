"use client";

import { m, useReducedMotion } from "framer-motion";

const DOWNLOAD_URL =
  "https://github.com/rohangore1999/pulse-notch/releases/latest/download/PulseNotch.dmg";
const GITHUB_URL = "https://github.com/rohangore1999/pulse-notch";

const FLOW = [
  {
    number: "01",
    title: "WHOOP sensor",
    detail: "Heart Rate Broadcast is enabled on WHOOP 5.0.",
  },
  {
    number: "02",
    title: "Standard BLE",
    detail: "The wearable advertises Heart Rate Service 180D.",
  },
  {
    number: "03",
    title: "CoreBluetooth",
    detail: "The Mac subscribes to measurement characteristic 2A37.",
  },
  {
    number: "04",
    title: "Pulse Notch",
    detail: "BPM, chart history and threshold cues update locally.",
  },
];

const DETAILS = [
  {
    eyebrow: "Live context",
    title: "One hour, without leaving the moment",
    body: "The expanded view keeps a rolling one-hour, minute-average trend. Hovering reveals the time and BPM while collection continues live.",
  },
  {
    eyebrow: "Quiet coaching",
    title: "A cue only after it stays elevated",
    body: "A user-set threshold, sustained-duration check, snooze and restrained cooldown prevent a single noisy reading from becoming a distraction.",
  },
  {
    eyebrow: "Connection resilience",
    title: "Explicit selection, reliable return",
    body: "Nearby heart-rate monitors are shown for the user to choose. A device is remembered only after it delivers a valid reading, with wake recovery and stale-reading protection built in.",
  },
  {
    eyebrow: "Privacy by architecture",
    title: "Heart-rate data stays on the Mac",
    body: "There is no Pulse Notch account, developer-operated backend, analytics, cloud history or WHOOP cloud API connection. The app listens to BLE and does not write back to the wearable.",
  },
];

const LIVE_BPM_BENEFITS = [
  {
    title: "Notice what lasts",
    detail:
      "Separate one brief spike from a heart-rate change that continues through a demanding task, call or otherwise quiet desk day.",
  },
  {
    title: "Reset at a useful moment",
    detail:
      "Use your personal sustained threshold to consider a short breathing pause or walk instead of relying only on a fixed timer.",
  },
  {
    title: "See what follows",
    detail:
      "Watch the next few minutes to see whether breathing or a short walk is followed by a calmer live reading.",
  },
  {
    title: "Make room for demanding work",
    detail:
      "Notice which tasks or calls often coincide with higher BPM, then leave a short buffer around them when possible.",
  },
];

const REQUIREMENTS = [
  "Apple Silicon Mac — M1 or newer",
  "macOS 13 Ventura or newer",
  "WHOOP 5.0 with Heart Rate Broadcast enabled",
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

function TextLink({ href, children, tone = "quiet", newTab = true }) {
  const tones = {
    primary:
      "border-orange-500 bg-orange-500 text-black hover:border-orange-400 hover:bg-orange-400",
    quiet:
      "border-white/25 text-white/70 hover:border-white/60 hover:text-white",
  };

  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={`inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${tones[tone]}`}
    >
      {children}
    </a>
  );
}

export default function PulseNotchCaseStudy() {
  return (
    <div className="overflow-hidden px-8 md:px-16">
      <section aria-labelledby="cutout-title" className="border-t border-white/20 py-16 md:py-28">
        <Reveal className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/50">
              Built around the cutout
            </p>
          </div>
          <div className="md:col-span-8">
            <h2
              id="cutout-title"
              className="max-w-3xl text-3xl font-light leading-tight text-white sm:text-4xl md:text-6xl"
            >
              Useful at a glance. Detailed only when invited.
            </h2>
            <div className="mt-9 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-white">Compact</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Live BPM on the left; locally derived zone and a 60-second trend on the right.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Expanded</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  One-hour context, threshold state, reset, snooze and settings in a single panel.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Full screen</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Keep the compact view, hide it automatically, or enable presentation privacy.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="live-context-title" className="border-t border-white/20 py-16 md:py-28">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="mb-5 text-xs uppercase tracking-[0.22em] text-orange-500">
                Live context while you work
              </p>
              <h2
                id="live-context-title"
                className="text-3xl font-light leading-tight text-white sm:text-4xl md:text-6xl"
              >
                A hidden signal becomes useful context.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-white/60 md:col-span-4">
              Pulse Notch keeps live BPM and its recent pattern nearby. It cannot explain why heart rate changed, but it can help you connect the signal with your own work and how you feel.
            </p>
          </div>

          <ol className="mt-12 grid gap-px border-y border-white/20 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {LIVE_BPM_BENEFITS.map((benefit, index) => (
              <li
                key={benefit.title}
                className="min-h-48 bg-black py-7 sm:px-6"
              >
                <p className="font-mono text-xs text-orange-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-10 text-xl font-light text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{benefit.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section aria-labelledby="ble-title" className="border-t border-white/20 py-16 md:py-28">
        <Reveal>
          <div className="grid gap-7 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="mb-5 text-xs uppercase tracking-[0.22em] text-orange-500">
                Direct BLE flow
              </p>
              <h2
                id="ble-title"
                className="text-3xl font-light leading-tight text-white sm:text-4xl md:text-6xl"
              >
                Device to Mac. No cloud round trip.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-white/60 md:col-span-4">
              Pulse Notch listens to the standard Bluetooth Heart Rate Service. It does not start workouts, change WHOOP settings or write data back.
            </p>
          </div>

          <ol className="mt-12 grid border-y border-white/20 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((step, index) => (
              <li
                key={step.number}
                className={`min-h-48 py-7 sm:px-6 ${
                  index > 0 ? "border-t border-white/15 sm:border-t-0" : ""
                } ${
                  index > 1
                    ? "sm:border-t sm:border-white/15 lg:border-t-0"
                    : ""
                } ${index % 2 === 1 ? "sm:border-l sm:border-white/15" : ""} ${
                  index > 1 ? "lg:border-l lg:border-white/15" : ""
                }`}
              >
                <p className="font-mono text-xs text-orange-500">{step.number}</p>
                <h3 className="mt-10 text-xl font-light text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section aria-labelledby="details-title" className="border-t border-white/20 py-16 md:py-28">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                Designed for the background
              </p>
            </div>
            <h2
              id="details-title"
              className="text-3xl font-light leading-tight text-white sm:text-4xl md:col-span-8 md:text-6xl"
            >
              Calm when it is quiet. Resilient when the signal is not.
            </h2>
          </div>

          <div className="mt-12 grid border-t border-white/20 md:grid-cols-2">
            {DETAILS.map((detail, index) => (
              <article
                key={detail.title}
                className={`py-9 md:min-h-72 md:p-10 ${
                  index > 0 ? "border-t border-white/15 md:border-t-0" : ""
                } ${index % 2 === 1 ? "md:border-l md:border-white/15" : ""} ${
                  index > 1 ? "md:border-t md:border-white/15" : ""
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500/80">
                  {detail.eyebrow}
                </p>
                <h3 className="mt-7 max-w-md text-2xl font-light leading-tight text-white md:text-3xl">
                  {detail.title}
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60">
                  {detail.body}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="install-title" className="border-t border-white/20 py-16 md:py-28">
        <Reveal className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-orange-500">
              Requirements and installation
            </p>
            <h2
              id="install-title"
              className="text-3xl font-light leading-tight text-white sm:text-4xl md:text-5xl"
            >
              A focused build for Apple silicon.
            </h2>
            <ul className="mt-9 border-t border-white/15">
              {REQUIREMENTS.map((requirement) => (
                <li
                  key={requirement}
                  className="border-b border-white/15 py-4 text-sm text-white/55"
                >
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ol className="space-y-7">
              <li className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="font-mono text-xs text-white/50">01</span>
                <p className="text-sm leading-relaxed text-white/55">
                  Download the latest DMG, open it and drag Pulse Notch into Applications.
                </p>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="font-mono text-xs text-white/50">02</span>
                <p className="text-sm leading-relaxed text-white/55">
                  On first launch, macOS may block the ad-hoc signed app. Use System Settings, Privacy &amp; Security, then Open Anyway.
                </p>
              </li>
              <li className="grid grid-cols-[2.5rem_1fr] gap-3">
                <span className="font-mono text-xs text-white/50">03</span>
                <p className="text-sm leading-relaxed text-white/55">
                  Allow Bluetooth access, enable Heart Rate Broadcast in WHOOP and explicitly select your device.
                </p>
              </li>
            </ol>
            <p className="mt-10 border-l border-orange-500/60 pl-5 text-xs leading-relaxed text-white/55">
              Pulse Notch is an independent wellness project, not a medical device, and is not affiliated with, endorsed by or sponsored by WHOOP.
              Its zones, colors and coaching cues are calculated by Pulse Notch, not official WHOOP classifications.
            </p>
          </div>
        </Reveal>
      </section>

      <Reveal className="border-t border-white/20 py-14 text-center md:py-24">
        <p className="text-xs uppercase tracking-[0.22em] text-orange-500">
          Pulse Notch for macOS
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-light leading-tight text-white sm:text-5xl md:text-7xl">
          Your live heart rate, without another screen to check.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/60">
          Built for Apple Silicon Macs and WHOOP 5.0 Heart Rate Broadcast.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <TextLink href={DOWNLOAD_URL} tone="primary" newTab={false}>
            Download for Apple silicon
          </TextLink>
          <TextLink href={GITHUB_URL}>Explore on GitHub</TextLink>
        </div>
      </Reveal>
    </div>
  );
}
