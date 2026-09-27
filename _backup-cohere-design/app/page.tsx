import Nav from "@/components/Nav";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Typed from "@/components/Typed";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactForm from "@/components/ContactForm";
import CommandPalette from "@/components/CommandPalette";
import BackToTop from "@/components/BackToTop";
import {
  profile,
  metrics,
  experience,
  projects,
  skills,
  education,
  certifications,
  services,
} from "@/lib/data";

const stack = [
  "Python",
  "SQL",
  "PostgreSQL",
  "Docker",
  "TensorFlow",
  "Bloomberg",
  "GitHub Actions",
];

function SectionHeader({
  n,
  label,
  title,
  lead,
  invert = false,
}: {
  n: string;
  label: string;
  title: string;
  lead?: string;
  invert?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p className={`t-mono ${invert ? "text-coral" : "text-slate"}`}>
        {n} — {label}
      </p>
      <h2
        className={`t-section mt-5 ${invert ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`t-lead mt-5 ${invert ? "text-white/70" : "text-slate"}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen overflow-x-clip bg-white">
      <AnnouncementBar />
      <Nav />
      <CommandPalette />
      <BackToTop />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 pb-8 pt-20 text-center md:px-10 md:pt-28">
        <p className="rise t-mono h-5 text-slate">
          <Typed
            phrases={[
              "Data Scientist",
              "EQD Trading Analyst",
              "Quant Risk · EVT Modeling",
              "ML Engineer · MLOps",
            ]}
          />
        </p>
        <h1 className="rise rise-1 mx-auto mt-6 max-w-5xl t-hero text-ink">
          Production ML for risk, pricing, and decisions.
        </h1>
        <p className="rise rise-2 mx-auto mt-7 max-w-2xl t-lead text-slate">
          {profile.subline}
        </p>
        <div className="rise rise-3 mt-9 flex flex-wrap items-center justify-center gap-6">
          <a href="#projects" className="btn-primary">
            View selected work
          </a>
          <a href={profile.cv} target="_blank" className="btn-secondary">
            Download CV
          </a>
        </div>
      </section>

      {/* hero media composition */}
      <section className="mx-auto mt-14 grid max-w-[1200px] gap-4 px-6 md:grid-cols-[1.45fr_0.55fr] md:px-10">
        {/* console card */}
        <div className="rise rise-3 overflow-hidden rounded-lg bg-near p-6 text-white md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
              pre-trade limits engine
            </span>
            <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-coral" />
              running in production
            </span>
          </div>

          <p className="mt-8 font-display text-2xl leading-snug tracking-tight text-white md:text-3xl">
            Calibrate dynamic size and price limits on equity flow, then prove
            the tails hold.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Precision", v: "94%", s: "at 1.3% false-positive rate" },
              { k: "Coverage", v: "12M+", s: "intraday trades backtested" },
              { k: "Capital", v: "€1.8M", s: "risk-weighted assets released" },
            ].map((c) => (
              <div key={c.k} className="card-dark p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                  {c.k}
                </p>
                <p className="mt-2 font-display text-2xl text-white">{c.v}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">
                  {c.s}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
            {["Python", "EVT / POT", "Streamlit", "Docker", "GitHub Actions"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-xs border border-white/15 px-2.5 py-1 font-mono text-[11px] text-white/60"
                >
                  {t}
                </span>
              )
            )}
          </div>
        </div>

        {/* profile card */}
        <div className="rise rise-4 card-stone flex flex-col justify-between rounded-lg p-6 md:p-8">
          <div>
            <p className="t-mono text-slate">Currently</p>
            <p className="mt-4 font-display text-2xl leading-tight tracking-tight text-ink">
              EQD Trading Analyst
            </p>
            <p className="mt-2 text-sm text-slate">Société Générale ATS</p>
          </div>
          <dl className="mt-10 space-y-4 border-t border-black/10 pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Based in</dt>
              <dd className="text-right text-ink">{profile.location}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Focus</dt>
              <dd className="text-right text-ink">Quant risk · ML systems</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Status</dt>
              <dd className="inline-flex items-center gap-2 text-right text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                Open to work
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-24 text-center md:px-10 md:py-32">
        <p className="text-sm text-slate">
          Systems built and shipped with
        </p>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {stack.map((s) => (
            <li
              key={s}
              className="font-display text-lg tracking-tight text-ink/60 md:text-xl"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* ── METRICS ───────────────────────────────────────── */}
      <section className="border-y border-line">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 px-6 md:grid-cols-4 md:px-10">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`px-2 py-10 md:px-8 md:py-14 ${
                i > 0 ? "md:border-l md:border-line" : ""
              } ${i % 2 === 1 ? "border-l border-line md:border-l" : ""}`}
            >
              <p className="font-display text-4xl tracking-tight text-ink md:text-5xl">
                <CountUp
                  value={m.value}
                  suffix={m.suffix}
                  decimals={m.decimals ?? 0}
                />
              </p>
              <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-slate">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────────── */}
      <section
        id="experience"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24 md:px-10 md:py-32"
      >
        <SectionHeader
          n="01"
          label="Experience"
          title="Four years turning market and survey data into systems people run every day."
        />
        <Reveal>
          <div className="mt-16 border-t border-line">
            {experience.map((e) => (
              <article
                key={e.role + e.dates}
                className="grid gap-6 border-b border-line py-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:py-14"
              >
                <div>
                  <h3 className="t-feature text-ink">{e.role}</h3>
                  <p className="mt-2 text-base text-slate">{e.company}</p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                    {e.dates}
                  </p>
                </div>
                <div>
                  <ul className="space-y-4">
                    {e.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-[15px] leading-relaxed text-slate"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {e.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-xs border border-line px-2.5 py-1 font-mono text-[11px] text-slate"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────── */}
      <section
        id="projects"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-6 pb-24 md:px-10 md:pb-32"
      >
        <SectionHeader
          n="02"
          label="Projects"
          title="Selected work."
          lead="Each case study states the problem, the approach, and what changed once it shipped."
        />
        <div className="mt-14">
          <ProjectsGrid projects={projects} />
        </div>
      </section>

      {/* ── CAPABILITIES ──────────────────────────────────── */}
      <section
        id="skills"
        className="scroll-mt-24 bg-green-wash py-24 md:py-32"
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <SectionHeader n="03" label="Capabilities" title="What I work with." />
          <Reveal>
            <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group} className="border-t border-ink/15 pt-6">
                  <h3 className="t-mono text-ink">{group}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {items.map((s) => (
                      <li key={s} className="text-sm text-slate">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-2">
              <div className="card-line p-8">
                <p className="t-mono text-slate">Education</p>
                <p className="mt-5 t-feature text-ink">{education.degree}</p>
                <p className="mt-3 text-sm text-slate">{education.school}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {education.years}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-slate">
                  {education.note}
                </p>
              </div>
              <div className="card-line p-8">
                <p className="t-mono text-slate">Certifications</p>
                <ul className="mt-5 divide-y divide-line">
                  {certifications.map((c) => (
                    <li key={c.title} className="py-3.5 first:pt-0 last:pb-0">
                      <a
                        href={c.url}
                        target="_blank"
                        className="flex items-baseline justify-between gap-4"
                      >
                        <span className="text-sm text-blue underline-offset-4 hover:underline">
                          {c.title}{" "}
                          <span className="text-slate no-underline">
                            — {c.issuer}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-muted">
                          {c.date}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES (dark band) ──────────────────────────── */}
      <section
        id="services"
        className="scroll-mt-24 bg-green py-24 text-white md:py-32"
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <SectionHeader
            n="04"
            label="Freelance"
            title="Engagements I take on."
            lead="Scoped, delivered, and documented so your team can run it without me."
            invert
          />
          <Reveal>
            <div className="mt-16 grid gap-4 md:grid-cols-3">
              {services.map((s) => (
                <div key={s.title} className="card-dark flex flex-col p-8">
                  <h3 className="t-feature text-white">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/65">
                    {s.desc}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-8">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-xs border border-white/20 px-2.5 py-1 font-mono text-[11px] text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────── */}
      <section
        id="contact"
        className="scroll-mt-24 bg-stone py-24 md:py-32"
      >
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="t-mono text-slate">05 — Contact</p>
            <h2 className="t-heading mt-5 text-ink">
              Open to full-time roles and select freelance engagements.
            </h2>
            <p className="t-lead mt-5 text-slate">
              Data science, quant risk, data engineering, and workflow
              automation — production-first, validated, and built for regulated
              environments.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                {profile.email}
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                className="btn-secondary"
              >
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" className="btn-secondary">
                GitHub
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-md bg-white p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
