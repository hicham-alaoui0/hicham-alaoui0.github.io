import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import BackToTop from "@/components/BackToTop";
import CommandPalette from "@/components/CommandPalette";
import { projects, profile } from "@/lib/data";

export function generateStaticParams() {
  return projects
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title} — Hicham Alaoui`,
    description: p.problem,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  const others = projects.filter((x) => x.slug && x.slug !== slug).slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[60vh]" />
      <Nav />
      <CommandPalette />
      <BackToTop />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-32">
        <Link
          href="/#projects"
          className="font-mono text-xs text-mut transition-colors hover:text-acc"
        >
          ← cd ../projects
        </Link>

        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-cy">
          {p.category}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
          {p.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {p.impact.map((i) => (
            <span
              key={i}
              className="rounded border border-acc/25 bg-acc/5 px-2.5 py-1 font-mono text-xs text-acc"
            >
              {i}
            </span>
          ))}
        </div>

        {p.diagram && (
          <div className="card mt-10 overflow-hidden rounded-lg p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.diagram}
              alt={`${p.title} — architecture diagram`}
              className="w-full rounded"
            />
          </div>
        )}

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="card rounded-lg p-6">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-cy">
              {"//"} Problem
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mut">{p.problem}</p>
          </div>
          <div className="card rounded-lg p-6">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-cy">
              {"//"} Approach
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mut">{p.approach}</p>
          </div>
        </div>

        {p.results && (
          <div className="card mt-4 rounded-lg border-l-2 border-l-acc p-6 md:p-8">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-acc">
              {"//"} Results
            </h2>
            <p className="mt-3 leading-relaxed text-ink">{p.results}</p>
          </div>
        )}

        {p.highlights && (
          <div className="mt-12">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-cy">
              {"//"} Technical highlights
            </h2>
            <ul className="mt-5 space-y-3">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-mut">
                  <span className="mt-0.5 select-none font-mono text-acc">▸</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded border border-edge bg-panel px-2.5 py-1 font-mono text-xs text-mut"
            >
              {s}
            </span>
          ))}
          {p.code && (
            <a
              href={p.code}
              target="_blank"
              className="ml-auto rounded border border-acc/40 px-4 py-1.5 font-mono text-xs font-medium text-acc transition-colors hover:bg-acc/10"
            >
              view code →
            </a>
          )}
        </div>

        {/* other case studies */}
        <div className="mt-20">
          <p className="mb-4 font-mono text-xs text-dim">$ ls ../case-studies/</p>
          <div className="grid gap-3 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/projects/${o.slug}/`}
                className="card block rounded-lg p-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-cy">
                  {o.category}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink">{o.title}</p>
                <p className="mt-2 font-mono text-[11px] text-acc">
                  {o.impact[0]}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card mt-16 rounded-lg p-8 text-center">
          <p className="font-mono text-sm text-acc">
            <span className="text-dim">$</span> ./connect --now
          </p>
          <p className="mt-3 text-lg font-bold text-ink">
            Interested in similar work?
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-5 inline-block rounded bg-acc px-6 py-2.5 font-mono text-sm font-semibold text-[#04130c] transition-opacity hover:opacity-85"
          >
            {profile.email}
          </a>
        </div>
      </main>
    </div>
  );
}
