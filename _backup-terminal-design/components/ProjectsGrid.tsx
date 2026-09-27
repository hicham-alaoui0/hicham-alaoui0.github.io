"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/data";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-edge bg-panel px-2 py-0.5 font-mono text-[11px] text-mut">
      {children}
    </span>
  );
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) =>
      p.category.split("·").forEach((c) => set.add(c.trim()))
    );
    return ["all", ...Array.from(set).sort()];
  }, [projects]);

  const [filter, setFilter] = useState("all");

  const match = (p: Project) =>
    filter === "all" ||
    p.category.toLowerCase().includes(filter.toLowerCase());

  const shownFeatured = featured.filter(match);
  const shownMore = more.filter(match);

  return (
    <>
      {/* filter chips */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-xs text-dim">$ filter --tag</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded border px-3 py-1 font-mono text-xs transition-colors ${
              filter === c
                ? "border-acc/60 bg-acc/10 text-acc"
                : "border-edge text-mut hover:border-acc/40 hover:text-acc"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {shownFeatured.map((p) => (
          <article key={p.title} className="card flex flex-col rounded-lg p-6 md:p-7">
            <p className="font-mono text-[11px] uppercase tracking-widest text-cy">
              {p.category}
            </p>
            <h3 className="mt-2 text-lg font-bold text-ink">
              {p.slug ? (
                <Link
                  href={`/projects/${p.slug}/`}
                  className="transition-colors hover:text-acc"
                >
                  {p.title}
                </Link>
              ) : (
                p.title
              )}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mut">
              <span className="font-mono text-xs text-dim">problem → </span>
              {p.problem}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mut">
              <span className="font-mono text-xs text-dim">approach → </span>
              {p.approach}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.impact.map((i) => (
                <span
                  key={i}
                  className="rounded border border-acc/25 bg-acc/5 px-2 py-0.5 font-mono text-[11px] text-acc"
                >
                  {i}
                </span>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
              {p.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
              <span className="ml-auto flex items-center gap-3">
                {p.code && (
                  <a
                    href={p.code}
                    target="_blank"
                    className="font-mono text-xs text-cy transition-colors hover:text-acc"
                  >
                    [code]
                  </a>
                )}
                {p.slug && (
                  <Link
                    href={`/projects/${p.slug}/`}
                    className="font-mono text-xs text-acc transition-colors hover:text-cy"
                  >
                    case study →
                  </Link>
                )}
              </span>
            </div>
          </article>
        ))}
      </div>

      {shownMore.length > 0 && (
        <>
          <p className="mb-4 mt-12 font-mono text-xs text-dim">
            $ ls more-projects/
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {shownMore.map((p) => (
              <article
                key={p.title}
                className="card flex items-start justify-between gap-4 rounded-lg p-5"
              >
                <div>
                  <h3 className="text-sm font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-dim">
                    {p.approach}
                  </p>
                  <p className="mt-2 font-mono text-[11px] text-acc">
                    {p.impact[0]}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-dim">
                  {p.category.split("·")[0]}
                </span>
              </article>
            ))}
          </div>
        </>
      )}

      {shownFeatured.length + shownMore.length === 0 && (
        <p className="font-mono text-sm text-dim">
          $ no projects match this filter — try another tag.
        </p>
      )}
    </>
  );
}
