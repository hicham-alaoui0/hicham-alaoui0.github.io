import Nav from "@/components/Nav";
import Typed from "@/components/Typed";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import ProjectsGrid from "@/components/ProjectsGrid";
import ContactForm from "@/components/ContactForm";
import CommandPalette from "@/components/CommandPalette";
import BackToTop from "@/components/BackToTop";
import { Spotlight } from "@/components/ui/spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Marquee } from "@/components/ui/marquee";
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

function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <h2 className="font-mono text-sm font-semibold tracking-widest text-acc">
        <span className="text-dim">{"//"}</span> {n} — {title.toUpperCase()}
      </h2>
      <div className="h-px flex-1 bg-edge" />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-edge bg-panel px-2 py-0.5 font-mono text-[11px] text-mut">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[110vh]" />
      <div className="glow pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#2ee59d" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[95vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.webp"
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-right opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/70 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
      </div>
      <Nav />
      <CommandPalette />
      <BackToTop />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-32 md:grid-cols-[1.15fr_0.85fr] md:pt-40">
        <div>
          <div className="rise mb-5 inline-flex items-center rounded-full border border-edge bg-panel/80 px-4 py-1.5">
            <AnimatedShinyText className="font-mono text-xs">
              ● open to opportunities — full-time & freelance
            </AnimatedShinyText>
          </div>
          <p className="rise font-mono text-sm text-acc">
            <span className="text-dim">$</span> whoami
          </p>
          <h1 className="rise rise-1 mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Hicham Alaoui
          </h1>
          <p className="rise rise-2 mt-3 h-7 font-mono text-base text-cy md:text-lg">
            <Typed
              phrases={[
                "Data Scientist",
                "EQD Trading Analyst",
                "Quant Risk · EVT Modeling",
                "ML Engineer · MLOps",
                "Data & Decision Systems",
              ]}
            />
          </p>
          <p className="rise rise-3 mt-5 max-w-xl leading-relaxed text-mut">
            {profile.headline} {profile.subline}
          </p>
          <div className="rise rise-4 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="rounded bg-acc px-5 py-2.5 font-mono text-sm font-semibold text-[#04130c] transition-opacity hover:opacity-85"
            >
              ./view-projects
            </a>
            <a
              href={profile.cv}
              target="_blank"
              className="rounded border border-edge-2 px-5 py-2.5 font-mono text-sm text-ink transition-colors hover:border-acc/50 hover:text-acc"
            >
              cv --download
            </a>
            <div className="ml-1 flex items-center gap-4 font-mono text-sm">
              <a href={profile.github} target="_blank" className="text-mut transition-colors hover:text-acc">github</a>
              <a href={profile.linkedin} target="_blank" className="text-mut transition-colors hover:text-acc">linkedin</a>
              <a href={`mailto:${profile.email}`} className="text-mut transition-colors hover:text-acc">email</a>
            </div>
          </div>
        </div>

        <div className="rise rise-2 card relative rounded-lg font-mono text-[13px] leading-6 shadow-2xl">
          <BorderBeam size={140} duration={10} colorFrom="#2ee59d" colorTo="#4cc2ff" />
          <div className="flex items-center gap-1.5 border-b border-edge px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-dim">hicham@quant — zsh</span>
          </div>
          <div className="px-5 py-4">
            <p><span className="text-acc">$</span> <span className="text-ink">cat profile.yaml</span></p>
            <p className="text-dim">---</p>
            <p><span className="text-cy">role:</span> <span className="text-ink">Data Scientist & EQD Trading Analyst</span></p>
            <p><span className="text-cy">firm:</span> <span className="text-ink">Société Générale ATS</span></p>
            <p><span className="text-cy">base:</span> <span className="text-ink">{profile.location}</span></p>
            <p><span className="text-cy">focus:</span> <span className="text-amb">[quant_risk, ml_systems, data_eng]</span></p>
            <p><span className="text-cy">status:</span> <span className="text-acc">open_to_opportunities ●</span></p>
            <p className="mt-3"><span className="text-acc">$</span> <span className="text-ink">./run --latest</span></p>
            <p className="text-mut">→ EVT limits model <span className="text-acc">94% precision</span> @ 1.3% FPR</p>
            <p className="text-mut">→ 12M+ trades · <span className="text-acc">€1.8M RWA released</span></p>
            <p className="text-mut">→ deployed: docker + CI/CD <span className="text-acc">✓ prod</span></p>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="relative border-y border-edge bg-panel/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-edge px-5 md:grid-cols-4 md:divide-x">
          {metrics.map((m) => (
            <div key={m.label} className="px-4 py-8 md:px-8">
              <p className="font-mono text-3xl font-bold text-ink md:text-4xl">
                <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
              </p>
              <p className="mt-2 text-xs leading-relaxed text-dim">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TECH MARQUEE */}
      <Marquee
        text="DATA SCIENCE · QUANT RISK · MLOPS · EVT · PYTHON · SQL ·"
        fontSize="sm"
        strokeWidth="1.5px"
        duration={28}
        className="py-10"
      />

      {/* EXPERIENCE */}
      <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
        <SectionHeader n="01" title="experience" />
        <Reveal>
        <div className="space-y-4">
          {experience.map((e) => (
            <article key={e.role + e.dates} className="card rounded-lg p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-bold text-ink">
                  {e.role} <span className="font-normal text-dim">@</span>{" "}
                  <span className="text-acc">{e.company}</span>
                </h3>
                <span className="font-mono text-xs text-dim">{e.dates}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-mut">
                    <span className="mt-0.5 select-none font-mono text-acc">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {e.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
        </Reveal>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24">
        <SectionHeader n="02" title="projects" />
        <Reveal>
          <ProjectsGrid projects={projects} />
        </Reveal>
      </section>

      {/* SKILLS */}
      <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24">
        <SectionHeader n="03" title="skills" />
        <Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="card rounded-lg p-6">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-cy">
                {group}
              </h3>
              <ul className="mt-4 space-y-2">
                {items.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-mut">
                    <span className="select-none font-mono text-acc/70">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card rounded-lg p-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-cy">
              Education
            </h3>
            <p className="mt-4 font-bold text-ink">{education.degree}</p>
            <p className="mt-1 text-sm text-mut">{education.school}</p>
            <p className="mt-1 font-mono text-xs text-dim">{education.years}</p>
            <p className="mt-3 text-xs leading-relaxed text-dim">{education.note}</p>
          </div>
          <div className="card rounded-lg p-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-cy">
              Certifications
            </h3>
            <ul className="mt-4 space-y-3">
              {certifications.map((c) => (
                <li key={c.title} className="flex items-baseline justify-between gap-3 text-sm">
                  <a
                    href={c.url}
                    target="_blank"
                    className="text-mut transition-colors hover:text-acc"
                  >
                    {c.title}{" "}
                    <span className="text-dim">— {c.issuer}</span>
                  </a>
                  <span className="shrink-0 font-mono text-[11px] text-dim">{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </Reveal>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24">
        <SectionHeader n="04" title="freelance services" />
        <Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card rounded-lg p-6">
              <h3 className="font-bold text-ink">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mut">{s.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-28">
        <SectionHeader n="05" title="contact" />
        <Reveal>
        <div className="card relative rounded-lg p-8 text-center md:p-14">
          <BorderBeam size={180} duration={14} colorFrom="#2ee59d" colorTo="#4cc2ff" />
          <p className="font-mono text-sm text-acc">
            <span className="text-dim">$</span> ./connect --now
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
            Open to full-time roles & select freelance engagements.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mut">
            Data science, quant risk, data engineering, and workflow automation —
            production-first, validated, and built for regulated environments.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded bg-acc px-6 py-3 font-mono text-sm font-semibold text-[#04130c] transition-opacity hover:opacity-85"
            >
              {profile.email}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              className="rounded border border-edge-2 px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-acc/50 hover:text-acc"
            >
              linkedin →
            </a>
            <a
              href={profile.github}
              target="_blank"
              className="rounded border border-edge-2 px-6 py-3 font-mono text-sm text-ink transition-colors hover:border-acc/50 hover:text-acc"
            >
              github →
            </a>
          </div>

          <div className="mx-auto mt-10 max-w-xl border-t border-edge pt-2">
            <ContactForm />
          </div>
        </div>
        </Reveal>
      </section>

      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-6 font-mono text-xs text-dim">
          <p>
            © {new Date().getFullYear()} Hicham Alaoui — built with Next.js
          </p>
          <p>
            <span className="text-acc">●</span> {profile.location} · exit 0
          </p>
        </div>
      </footer>
    </div>
  );
}
