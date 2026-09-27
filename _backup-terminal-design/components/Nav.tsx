"use client";

import { useEffect, useState } from "react";

const links = [
  { id: "experience", n: "01", label: "experience" },
  { id: "projects", n: "02", label: "projects" },
  { id: "skills", n: "03", label: "skills" },
  { id: "services", n: "04", label: "services" },
  { id: "contact", n: "05", label: "contact" },
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
      className={`fixed top-0 z-50 w-full transition-all ${
        scrolled
          ? "border-b border-edge bg-bg/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="/" className="font-mono text-sm font-semibold text-ink">
          <span className="text-acc">~/</span>hicham-alaoui
          <span className="text-dim"> $</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`/#${l.id}`}
                className={`font-mono text-xs transition-colors hover:text-acc ${
                  active === l.id ? "text-acc" : "text-mut"
                }`}
              >
                <span className="text-acc/60">{l.n}.</span> {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={openPalette}
              aria-label="Open command palette"
              className="rounded border border-edge px-2.5 py-1.5 font-mono text-[11px] text-dim transition-colors hover:border-acc/40 hover:text-acc"
            >
              ⌘K
            </button>
          </li>
          <li>
            <a
              href="/CV_Hicham_Alaoui.pdf"
              target="_blank"
              className="rounded border border-acc/40 px-3 py-1.5 font-mono text-xs font-medium text-acc transition-colors hover:bg-acc/10"
            >
              cv.pdf ↓
            </a>
          </li>
        </ul>

        <button
          aria-label="Menu"
          onClick={() => setOpen(!open)}
          className="font-mono text-sm text-acc md:hidden"
        >
          {open ? "[x]" : "[≡]"}
        </button>
      </nav>

      {open && (
        <ul className="space-y-1 border-b border-edge bg-bg/95 px-5 pb-4 backdrop-blur-md md:hidden">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`/#${l.id}`}
                onClick={() => setOpen(false)}
                className="block py-2 font-mono text-sm text-mut hover:text-acc"
              >
                <span className="text-acc/60">{l.n}.</span> {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/CV_Hicham_Alaoui.pdf"
              target="_blank"
              className="block py-2 font-mono text-sm text-acc"
            >
              cv.pdf ↓
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
