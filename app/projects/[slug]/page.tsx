import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import CommandPalette from "@/components/CommandPalette";
import VizPanel from "@/components/VizPanel";
import { projects, profile } from "@/lib/data";

export function generateStaticParams() {
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug as string }));
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

  const others = projects
    .filter((x) => x.slug && x.slug !== slug && x.featured && x.tags.some((t) => p.tags.includes(t)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <CommandPalette />
      <BackToTop />

      <main>
        {/* header */}
        <header className="mx-auto max-w-[1100px] px-6 pb-12 pt-16 md:px-10 md:pt-24">
          <Link href="/#projects" className="btn-secondary">
            ← All projects
          </Link>
          <p className="t-mono mt-10 text-slate">{p.category}</p>
          <h1 className="t-display mt-5 max-w-4xl text-ink">{p.title}</h1>
          <p className="t-lead mt-6 max-w-3xl text-slate">{p.problem}</p>

          {(p.role || p.timeframe) && (
            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6 text-sm">
              {p.role && (
                <div className="max-w-xl">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">My role</dt>
                  <dd className="mt-1.5 text-ink">{p.role}</dd>
                </div>
              )}
              {p.timeframe && (
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">When</dt>
                  <dd className="mt-1.5 text-ink">{p.timeframe}</dd>
                </div>
              )}
            </dl>
          )}
        </header>

        {/* animated visual */}
        {p.viz && (
          <div className="mx-auto max-w-[1100px] px-6 md:px-10">
            <VizPanel project={p} size="page" />
          </div>
        )}

        {/* KPI strip */}
        {p.kpis && (
          <div className="mx-auto mt-4 max-w-[1100px] px-6 md:px-10">
            <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-line md:grid-cols-4">
              {p.kpis.map((k, i) => (
                <div
                  key={k.label}
                  className={`p-6 md:p-7 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                    i > 1 ? "border-t border-line md:border-t-0" : ""
                  } ${i === 2 ? "md:border-l" : ""}`}
                >
                  <p className="font-display text-3xl tracking-tight text-ink md:text-4xl">{k.value}</p>
                  <p className="mt-2 text-sm leading-snug text-slate">{k.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[900px] px-6 pb-24 pt-16 md:px-10 md:pb-32">
          <section>
            <h2 className="t-mono text-slate">Approach</h2>
            <p className="t-lead mt-4 text-ink">{p.approach}</p>
          </section>

          {p.results && (
            <section className="mt-14 rounded-lg bg-green p-8 text-white md:p-12">
              <h2 className="t-mono text-coral">Results</h2>
              <p className="t-lead mt-5 text-white/90">{p.results}</p>
            </section>
          )}

          {p.diagram && (
            <section className="mt-16">
              <h2 className="t-mono text-slate">Architecture</h2>
              <div className="mt-5 overflow-x-auto rounded-lg bg-stone p-5 md:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.diagram}
                  alt={`${p.title} — architecture diagram`}
                  className="w-full min-w-[640px] rounded-sm"
                />
              </div>
            </section>
          )}

          {p.highlights && (
            <section className="mt-16">
              <h2 className="t-mono text-slate">Technical highlights</h2>
              <ul className="mt-6 border-t border-line">
                {p.highlights.map((h, i) => (
                  <li
                    key={h}
                    className="flex gap-5 border-b border-line py-4 text-[15px] leading-relaxed text-slate"
                  >
                    <span className="font-mono text-xs text-coral">0{i + 1}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-16">
            <h2 className="t-mono text-slate">Stack</h2>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {p.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
            {p.code && (
              <a href={p.code} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-7">
                View code →
              </a>
            )}
          </section>
        </div>

        {/* related case studies */}
        {others.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
              <p className="t-mono text-slate">Related case studies</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/projects/${o.slug}/`}
                    className="card-project flex flex-col p-7"
                  >
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{o.category}</p>
                    <p className="t-feature mt-4 text-ink">{o.title}</p>
                    <p className="mt-5 font-display text-3xl tracking-tight text-ink">{o.metric.value}</p>
                    <p className="mt-1 text-sm text-slate">{o.metric.label}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA band */}
        <section className="bg-stone">
          <div className="mx-auto max-w-[900px] px-6 py-24 text-center md:px-10">
            <h2 className="t-heading text-ink">Building something similar?</h2>
            <a href={`mailto:${profile.email}`} className="btn-primary mt-8">
              {profile.email}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
