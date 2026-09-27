import { profile } from "@/lib/data";

const sections = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Capabilities" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-near text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24">
          <div>
            <p className="t-mono text-coral">Work moves fast</p>
            <h2 className="t-heading mt-5 max-w-lg text-white">
              Have a risk, pricing, or data problem worth solving?
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="btn-primary btn-primary-invert mt-8"
            >
              {profile.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="t-mono text-white">Sections</p>
              <ul className="mt-5 space-y-3">
                {sections.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      className="text-sm text-muted transition-colors hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-mono text-white">Elsewhere</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={profile.github}
                    target="_blank"
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={profile.cv}
                    target="_blank"
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    Curriculum vitae
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-muted">
          <p>© {new Date().getFullYear()} Hicham Alaoui</p>
          <p>{profile.location} · Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
