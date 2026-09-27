"use client";

import { useEffect, useRef, useState } from "react";
import Viz from "@/components/viz";
import type { Project } from "@/lib/data";

const STATUS: Record<Project["status"], string> = {
  production: "in production",
  shipped: "shipped",
  building: "building now",
};

/** Dark animated card used on project cards and case-study pages. */
export default function VizPanel({
  project,
  size = "card",
}: {
  project: Project;
  size?: "card" | "page";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!project.viz) return null;
  const draft = process.env.NODE_ENV !== "production" && !project.verified;

  return (
    <div
      ref={ref}
      data-inview={inView}
      className={`viz relative flex h-full flex-col bg-near text-white ${
        size === "page" ? "rounded-lg p-6 md:p-10" : "p-6 md:p-7"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        {project.vizLabel && (
          <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
            {project.vizLabel}
          </span>
        )}
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          <span className={project.status === "shipped" ? "inline-block h-1.5 w-1.5 rounded-full bg-white/50" : "dot-live"} />
          {STATUS[project.status]}
        </span>
        {draft && (
          <span
            title="Contains invented numbers — set verified: true in lib/data.ts once they're real. Hidden in production builds."
            className="ml-auto rounded-xs bg-[#ff9f1c] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-black"
          >
            Draft numbers
          </span>
        )}
      </div>

      <div className="mt-5 flex-1">
        <Viz kind={project.viz} />
      </div>

      {size === "card" && (
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <p className="font-display text-3xl tracking-tight text-white md:text-4xl">{project.metric.value}</p>
          <p className="max-w-[26ch] text-right text-xs leading-relaxed text-white/60">{project.metric.label}</p>
        </div>
      )}
    </div>
  );
}
