import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-white">
      <Nav />
      <CommandPalette />
      <BackToTop />

      <main>
        {/* header */}
        <header className="mx-auto max-w-[900px] px-6 pb-14 pt-16 md:px-10 md:pt-24">
          <Link href="/#projects" className="btn-secondary">
            ← All projects
          </Link>

          <p className="t-mono mt-10 text-slate">{p.category}</p>
          <h1 className="t-display mt-5 text-ink">{p.title}</h1>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
            {p.impact.map((i) => (
              <li key={i} className="flex items-baseline gap-2.5 text-sm text-ink">
                <span aria-hidden className="text-coral">
                  —
                </span>
                {i}
              </li>
            ))}
          </ul>
        </header>

        {p.diagram && (
          <div className="mx-auto max-w-[1100px] px-6 md:px-10">
            <div className="overflow-hidden rounded-lg bg-stone p-6 md:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.diagram}
                alt={`${p.title} — architecture diagram`}
                className="w-full rounded-sm"
              />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[900px] px-6 pb-24 pt-16 md:px-10 md:pb-32">
          <div className="grid gap-10 border-b border-line pb-14 md:grid-cols-2 md:gap-16">
            <section>
              <h2 className="t-mono text-slate">Problem</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate">
                {p.problem}
              </p>
            </section>
            <section>
              <h2 className="t-mono text-slate">Approach</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate">
                {p.approach}
              </p>
            </section>
          </div>

          {p.results && (
            <section className="mt-14 rounded-lg bg-green p-8 text-white md:p-12">
              <h2 className="t-mono text-coral">Results</h2>
              <p className="t-lead mt-5 text-white/90">{p.results}</p>
            </section>
          )}

          {p.highlights && (
            <section className="mt-16">
              <h2 className="t-mono text-slate">Technical highlights</h2>
              <ul className="mt-6 border-t border-line">
                {p.highlights.map((h) => (
                  <li
                    key={h}
                    className="border-b border-line py-4 text-[15px] leading-relaxed text-slate"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-16">
            <h2 className="t-mono text-slate">Stack</h2>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-xs border border-line px-2.5 py-1 font-mono text-[11px] text-slate"
                >
                  {s}
                </span>
              ))}
            </div>
            {p.code && (
              <a
                href={p.code}
                target="_blank"
                className="btn-secondary mt-7"
              >
                View code →
              </a>
            )}
          </section>
        </div>

        {/* other case studies */}
        {others.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
              <p className="t-mono text-slate">More case studies</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/projects/${o.slug}/`}
                    className="card-line flex flex-col p-7 transition-colors hover:border-ink/40"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      {o.category}
                    </p>
                    <p className="t-feature mt-4 text-ink">{o.title}</p>
                    <p className="mt-4 text-sm text-slate">{o.impact[0]}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA band */}
        <section className="bg-stone">
          <div className="mx-auto max-w-[900px] px-6 py-24 text-center md:px-10">
            <h2 className="t-heading text-ink">Interested in similar work?</h2>
            <a
              href={`mailto:${profile.email}`}
              className="btn-primary mt-8"
            >
              {profile.email}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
