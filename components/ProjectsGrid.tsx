"use client";

import { useState } from "react";
import Link from "next/link";
import VizPanel from "@/components/VizPanel";
import { TAGS, type Project, type Tag } from "@/lib/data";

type Filter = "All" | Tag;

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const match = (p: Project) => filter === "All" || p.tags.includes(filter);
  const count = (f: Filter) =>
    f === "All" ? projects.length : projects.filter((p) => p.tags.includes(f)).length;

  const shownFeatured = projects.filter((p) => p.featured && match(p));
  const shownMore = projects.filter((p) => !p.featured && match(p));
  const filters: Filter[] = ["All", ...TAGS];

  return (
    <>
      {/* filters */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-active={filter === f}
            aria-pressed={filter === f}
            className="pill-outline"
          >
            {f}
            <span className="pill-count">{count(f)}</span>
          </button>
        ))}
      </div>

      {/* featured — every card leads with its own animated dark visual */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {shownFeatured.map((p, idx) => {
          const href = p.slug ? `/projects/${p.slug}/` : undefined;
          const wide = idx === 0 && shownFeatured.length % 2 === 1;
          return (
            <article
              key={p.title}
              className={`card-project group relative flex flex-col overflow-hidden ${
                wide ? "md:col-span-2 md:grid md:grid-cols-[1.15fr_0.85fr]" : ""
              }`}
            >
              <VizPanel project={p} />

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <p className="t-mono text-slate">{p.category}</p>
                <h3 className="t-card mt-3 text-ink">
                  {href ? (
                    <Link href={href} className="after:absolute after:inset-0">
                      {p.title}
                    </Link>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-slate">{p.approach}</p>

                <ul className="mt-5 space-y-2">
                  {p.impact.slice(0, 3).map((i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink">
                      <span aria-hidden className="text-coral">
                        —
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  {p.stack.slice(0, 5).map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="relative z-10 mt-5 flex items-center gap-6 border-t border-line pt-4">
                  {href && (
                    <Link href={href} className="btn-secondary">
                      Read case study
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  )}
                  {p.code && (
                    <a
                      href={p.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue underline underline-offset-4"
                    >
                      View code
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* more work — compact rows */}
      {shownMore.length > 0 && (
        <div className="mt-20">
          <p className="t-mono text-slate">More work</p>
          <div className="mt-6 border-t border-line">
            {shownMore.map((p) => (
              <article
                key={p.title}
                className="grid gap-3 border-b border-line py-6 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-10"
              >
                <p className="font-display text-2xl tracking-tight text-ink">{p.metric.value}</p>
                <div>
                  <h3 className="t-feature text-ink">
                    {p.slug ? (
                      <Link href={`/projects/${p.slug}/`} className="underline-offset-4 hover:underline">
                        {p.title}
                      </Link>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">{p.approach}</p>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted md:text-right">
                  {p.category.split("·")[0]}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {shownFeatured.length + shownMore.length === 0 && (
        <p className="mt-12 text-sm text-slate">No projects match this filter — try another one.</p>
      )}
    </>
  );
}
