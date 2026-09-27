"use client";

import { useEffect, useState } from "react";

const links = [
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Capabilities" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const openPalette = () => window.dispatchEvent(new Event("open-palette"));

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-colors ${
        scrolled ? "border-b border-line-2" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        {/* left — wordmark */}
        <a
          href="/"
          className="font-display text-base tracking-tight text-ink"
        >
          Hicham Alaoui
        </a>

        {/* center — sections */}
        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`/#${l.id}`}
                className={`text-sm transition-colors hover:text-ink ${
                  active === l.id ? "text-ink" : "text-slate"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* right — actions */}
        <div className="hidden items-center gap-5 md:flex">
          <button
            onClick={openPalette}
            aria-label="Open command palette"
            className="rounded-xs border border-line px-2 py-1 font-mono text-[11px] text-slate transition-colors hover:border-ink hover:text-ink"
          >
            ⌘K
          </button>
          <a
            href="/CV_Hicham_Alaoui.pdf"
            target="_blank"
            className="btn-primary"
          >
            Download CV
          </a>
        </div>

        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="text-sm text-ink md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line-2 bg-white px-6 pb-6 pt-2 md:hidden">
          <ul>
            {links.map((l) => (
              <li key={l.id} className="border-b border-line-2">
                <a
                  href={`/#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-lg text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/CV_Hicham_Alaoui.pdf"
            target="_blank"
            className="btn-primary mt-6"
          >
            Download CV
          </a>
        </div>
      )}
    </header>
  );
}
