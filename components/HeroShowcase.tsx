"use client";

import { useEffect, useRef, useState } from "react";
import Viz from "@/components/viz";
import { STATUS } from "@/components/VizPanel";
import type { Project } from "@/lib/data";

const DWELL = 6500; // ms each project stays on screen

/**
 * Rotating flagship card for the hero: one project at a time, each with its own animated visual.
 * The progress bar is the clock: when its CSS animation ends, the next project comes in,
 * so pausing the bar (hover, keyboard focus, pause button, off-screen, hidden tab) pauses the rotation.
 * With reduced motion there is no bar animation, so nothing rotates until the visitor picks a project.
 */
export default function HeroShowcase({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [stopped, setStopped] = useState(false); // pause button
  const [held, setHeld] = useState(false); // mouse over, or keyboard focus inside
  const [visible, setVisible] = useState(false); // on screen and tab in front

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let onScreen = false;
    const sync = () => setVisible(onScreen && !document.hidden);
    const obs = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        sync();
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      obs.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const n = projects.length;
  const go = (i: number) => {
    const next = (i + n) % n;
    if (next === active) return;
    setLeaving(active);
    setActive(next);
  };
  const paused = stopped || held || !visible;

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      data-paused={paused}
      className="hero-showcase rise rise-3 flex flex-col overflow-hidden rounded-lg bg-near text-white"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      {/* every slide sits in the same grid cell, so the card is always as tall as the tallest one */}
      <div className="grid flex-1">
        {projects.map((p, i) => {
          const on = i === active;
          return (
            <a
              key={p.slug}
              href={`/projects/${p.slug}/`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${p.title}`}
              inert={!on}
              data-active={on}
              data-inview={on && visible}
              className="hero-slide viz group flex flex-col p-6 pb-5 md:p-8 md:pb-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
                  {p.vizLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
                  <span className={p.status === "shipped" ? "inline-block h-1.5 w-1.5 rounded-full bg-white/50" : "dot-live"} />
                  {STATUS[p.status]}
                </span>
              </div>

              <p className="mt-7 max-w-xl font-display text-2xl leading-snug tracking-tight text-white md:text-3xl">
                {p.hook}
              </p>

              {/* the visual is mounted only while its slide is showing, so its entry animation replays each time */}
              <div className="mt-6 aspect-[560/200] w-full">
                {(on || i === leaving) && p.viz && <Viz kind={p.viz} />}
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <div className="flex flex-wrap gap-2">
                  {p.stack.slice(0, 5).map((t) => (
                    <span key={t} className="tag-dark">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-white/80 underline-offset-4 group-hover:underline">
                  Read the case study →
                </span>
              </div>
            </a>
          );
        })}
      </div>

      {/* one segment per project; the active one fills while its slide is on screen */}
      <div className="flex items-center gap-3 px-6 pb-4 md:px-8 md:pb-5">
        <div className="flex flex-1 gap-1.5">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-label={`Show ${p.title}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className="group/seg flex-1 cursor-pointer py-2.5"
            >
              <span className="block h-[3px] overflow-hidden rounded-pill bg-white/15 transition-colors group-hover/seg:bg-white/30">
                {i === active && (
                  <span
                    className="hero-progress block h-full rounded-pill bg-coral"
                    style={{ animationDuration: `${DWELL}ms` }}
                    onAnimationEnd={() => go(active + 1)}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={stopped ? "Resume rotating projects" : "Pause rotating projects"}
          aria-pressed={stopped}
          onClick={() => setStopped((v) => !v)}
          className="hero-pause grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-pill text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
            {stopped ? <path d="M3 1.5v9l7.5-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
