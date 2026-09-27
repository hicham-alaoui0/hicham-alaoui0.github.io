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
import TailChart from "@/components/TailChart";
import EmployerLogo from "@/components/EmployerLogo";
import {
  profile,
  employers,
  SHOW_EMPLOYER_LOGOS,
  metrics,
  experience,
  projects,
  skills,
  education,
  certifications,
  services,
} from "@/lib/data";

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
      <h2 className={`t-section mt-5 ${invert ? "text-white" : "text-ink"}`}>{title}</h2>
      {lead && (
        <p className={`t-lead mt-5 ${invert ? "text-white/70" : "text-slate"}`}>{lead}</p>
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
      <section className="relative">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-8 pt-20 text-center md:px-10 md:pt-28">
          <p className="rise t-mono h-5 text-slate">
            <Typed
              phrases={[
                "AI Engineer",
                "LLM Agents · RAG",
                "Evals · MLOps",
                "Quant Risk · EVT",
              ]}
            />
          </p>
          <h1 className="rise rise-1 mx-auto mt-6 max-w-5xl t-hero text-ink">
            I build AI systems finance teams actually use.
          </h1>
          <p className="rise rise-2 mx-auto mt-7 max-w-2xl t-lead text-slate">{profile.subline}</p>
          <div className="rise rise-3 mt-9 flex flex-wrap items-center justify-center gap-6">
            <a href="#projects" className="btn-primary">
              See selected work
            </a>
            <a href={profile.cv} target="_blank" rel="noopener" className="btn-secondary">
              Download CV
            </a>
          </div>
        </div>
      </section>

      {/* hero media composition */}
      <section className="mx-auto mt-14 grid max-w-[1200px] gap-4 px-6 md:grid-cols-[1.45fr_0.55fr] md:px-10">
        {/* flagship card — shows the idea, not just the numbers */}
        <a
          href="/projects/evt-pre-trade-limits/"
          className="rise rise-3 group block overflow-hidden rounded-lg bg-near p-6 text-white md:p-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
              Flagship · pre-trade limits engine
            </span>
            <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
              <span className="dot-live" />
              in production
            </span>
          </div>

          <p className="mt-7 max-w-xl font-display text-2xl leading-snug tracking-tight text-white md:text-3xl">
            Static limits fire on normal trades. I fit the tail instead — and let the limit follow it.
          </p>

          <div className="mt-6">
            <TailChart />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-2">
              {["Python", "EVT / POT", "Streamlit", "Docker", "GitHub Actions"].map((t) => (
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

        {/* profile card */}
        <div className="rise rise-4 card-stone flex flex-col justify-between p-6 md:p-8">
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
              <dt className="text-slate">Relocation</dt>
              <dd className="text-right text-ink">{profile.relocation}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Focus</dt>
              <dd className="text-right text-ink">LLM systems · Quant risk</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Status</dt>
              <dd className="inline-flex items-center gap-2 text-right text-ink">
                <span className="dot-live" />
                Open to opportunities
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── WHERE I'VE WORKED ─────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 text-center md:px-10 md:py-24">
        <p className="t-mono text-slate">Experience across</p>
        <ul className="mt-10 grid grid-cols-2 items-start gap-x-8 gap-y-10 md:grid-cols-4">
          {employers.map((e) => (
            <li key={e.name} className="flex flex-col items-center gap-4">
              <span className="font-display text-lg tracking-tight text-ink/60 md:text-xl">{e.name}</span>
              {SHOW_EMPLOYER_LOGOS && <EmployerLogo src={e.logo} alt={`${e.name} logo`} />}
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
              className={`px-2 py-10 md:px-8 md:py-14 ${i > 0 ? "md:border-l md:border-line" : ""} ${
                i % 2 === 1 ? "border-l border-line md:border-l" : ""
              }`}
            >
              <p className="font-display text-4xl tracking-tight text-ink md:text-5xl">
                <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
              </p>
              <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-slate">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS (moved up: this is what people come for) ── */}
      <section
        id="projects"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-24 md:px-10 md:py-32"
      >
        <SectionHeader
          n="01"
          label="Selected work"
          title="AI and ML systems — shipped, in production, and in the works."
          lead="Each case study covers the problem, my role, the approach, and the measured outcome."
        />
        <div className="mt-12">
          <ProjectsGrid projects={projects} />
        </div>
      </section>

      {/* ── EXPERIENCE ────────────────────────────────────── */}
      <section id="experience" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32">
          <SectionHeader
            n="02"
            label="Experience"
            title="Three years turning market, risk, and survey data into tools teams rely on."
          />
          <Reveal>
            <ol className="relative mt-16 md:ml-2">
              {/* timeline rail */}
              <span aria-hidden className="absolute bottom-2 left-[5px] top-2 hidden w-px bg-line md:block" />
              {experience.map((e, i) => (
                <li
                  key={e.role + e.dates}
                  className="relative grid gap-6 border-b border-line py-10 last:border-b-0 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:pl-10 md:py-12"
                >
                  <span
                    aria-hidden
                    className={`absolute left-0 top-[3.1rem] hidden h-[11px] w-[11px] rounded-full border-2 md:block ${
                      i === 0 ? "border-coral bg-coral" : "border-line bg-white"
                    }`}
                  />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted">{e.dates}</p>
                    <h3 className="t-feature mt-3 text-ink">{e.role}</h3>
                    <p className="mt-1.5 text-base text-slate">{e.company}</p>
                  </div>
                  <div>
                    <ul className="space-y-3.5">
                      {e.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-slate">
                          <span aria-hidden className="mt-[0.65em] h-px w-3 shrink-0 bg-ink/30" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {e.stack.map((s) => (
                        <span key={s} className="tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ── CAPABILITIES ──────────────────────────────────── */}
      <section id="skills" className="scroll-mt-24 bg-green-wash py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <SectionHeader n="03" label="Capabilities" title="What I work with." />
          <Reveal>
            <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group} className="border-t-2 border-ink pt-6">
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

            <div className="mt-16 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="card-line p-8">
                <p className="t-mono text-slate">Education</p>
                <p className="mt-5 t-feature text-ink">{education.degree}</p>
                <p className="mt-3 text-sm text-slate">{education.school}</p>
                <p className="mt-1 font-mono text-xs text-muted">{education.years}</p>
                <p className="mt-5 text-sm leading-relaxed text-slate">{education.note}</p>
              </div>
              <div className="card-line p-8">
                <p className="t-mono text-slate">Certifications</p>
                <ul className="mt-5 divide-y divide-line">
                  {certifications.map((c) => (
                    <li key={c.title} className="py-3 first:pt-0 last:pb-0">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-baseline justify-between gap-4"
                      >
                        <span className="text-sm text-ink underline-offset-4 hover:underline">
                          {c.title} <span className="text-slate">— {c.issuer}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-muted">{c.date}</span>
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
      <section id="services" className="scroll-mt-24 bg-green py-24 text-white md:py-32">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          <SectionHeader
            n="04"
            label="Freelance"
            title="Engagements I take on."
            lead="Scoped up front, delivered with tests and docs, built so your team can run it without me."
            invert
          />
          <Reveal>
            <div className="mt-16 grid gap-4 md:grid-cols-3">
              {services.map((s, i) => (
                <div key={s.title} className="card-dark flex flex-col p-8">
                  <p className="font-mono text-xs text-coral">0{i + 1}</p>
                  <h3 className="t-feature mt-4 text-white">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">{s.desc}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-8">
                    {s.tags.map((t) => (
                      <span key={t} className="tag-dark">
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
      <section id="contact" className="scroll-mt-24 bg-stone py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:px-10">
          <div>
            <p className="t-mono text-slate">05 — Contact</p>
            <h2 className="t-heading mt-5 text-ink">
              Open to AI engineering roles in Canada or Europe, and select freelance work.
            </h2>
            <p className="t-lead mt-5 text-slate">
              LLM agents, retrieval, and evaluation — on top of solid ML and risk modeling, built for
              regulated environments.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <a href={`mailto:${profile.email}`} className="btn-primary">
                Email me
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                GitHub
              </a>
            </div>
          </div>

          <div className="rounded-md bg-white p-8 md:p-10">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
