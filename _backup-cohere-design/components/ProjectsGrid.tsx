"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/data";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category.split("·")[0].trim()));
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const [filter, setFilter] = useState("All");

  const match = (p: Project) =>
    filter === "All" ||
    p.category.toLowerCase().includes(filter.toLowerCase());

  const shownFeatured = featured.filter(match);
  const shownMore = more.filter(match);

  return (
    <>
      {/* taxonomy chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            data-active={filter === c}
            className="chip-coral"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {shownFeatured.map((p) => (
          <article
            key={p.title}
            className="card-line flex flex-col p-8 transition-colors hover:border-ink/40"
          >
            <p className="t-mono text-slate">{p.category}</p>

            <h3 className="t-card mt-5 text-ink">
              {p.slug ? (
                <Link
                  href={`/projects/${p.slug}/`}
                  className="underline-offset-4 hover:underline"
                >
                  {p.title}
                </Link>
              ) : (
                p.title
              )}
            </h3>

            <dl className="mt-6 space-y-4 text-[15px] leading-relaxed">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Problem
                </dt>
                <dd className="mt-1.5 text-slate">{p.problem}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Approach
                </dt>
                <dd className="mt-1.5 text-slate">{p.approach}</dd>
              </div>
            </dl>

            <ul className="mt-7 space-y-2 border-t border-line pt-6">
              {p.impact.map((i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-ink"
                >
                  <span aria-hidden className="text-coral">
                    —
                  </span>
                  {i}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-7">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-xs border border-line px-2.5 py-1 font-mono text-[11px] text-slate"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-6">
              {p.slug && (
                <Link href={`/projects/${p.slug}/`} className="btn-secondary">
                  Read case study →
                </Link>
              )}
              {p.code && (
                <a
                  href={p.code}
                  target="_blank"
                  className="text-sm text-blue underline underline-offset-4"
                >
                  View code
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {shownMore.length > 0 && (
        <div className="mt-20">
          <p className="t-mono text-slate">More work</p>
          <div className="mt-6 border-t border-line">
            {shownMore.map((p) => (
              <article
                key={p.title}
                className="grid gap-3 border-b border-line py-6 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10"
              >
                <div>
                  <h3 className="t-feature text-ink">{p.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
                    {p.approach}
                  </p>
                  <p className="mt-2 text-sm text-ink">{p.impact[0]}</p>
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
        <p className="mt-12 text-sm text-slate">
          No projects match this filter — try another category.
        </p>
      )}
    </>
  );
}
