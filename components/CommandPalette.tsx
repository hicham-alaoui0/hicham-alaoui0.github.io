"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { projects, profile } from "@/lib/data";

type Cmd = {
  label: string;
  hint: string;
  action: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      if (href.startsWith("http") || href.startsWith("mailto")) {
        window.open(href, href.startsWith("mailto") ? "_self" : "_blank");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const commands: Cmd[] = useMemo(
    () => [
      { label: "Home", hint: "section", action: () => go("/") },
      { label: "Experience", hint: "section", action: () => go("/#experience") },
      { label: "Projects", hint: "section", action: () => go("/#projects") },
      { label: "Capabilities", hint: "section", action: () => go("/#skills") },
      { label: "Services", hint: "section", action: () => go("/#services") },
      { label: "Contact", hint: "section", action: () => go("/#contact") },
      ...projects
        .filter((p) => p.slug)
        .map((p) => ({
          label: `Case study — ${p.title}`,
          hint: p.category,
          action: () => go(`/projects/${p.slug}/`),
        })),
      { label: "Download CV", hint: "file", action: () => go(profile.cv) },
      { label: "GitHub", hint: "link", action: () => go(profile.github) },
      { label: "LinkedIn", hint: "link", action: () => go(profile.linkedin) },
      { label: "Email Hicham", hint: "link", action: () => go(`mailto:${profile.email}`) },
    ],
    [go]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [query, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-sm border border-line bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="text-sm text-muted">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && filtered[index]) {
                filtered[index].action();
              }
            }}
            placeholder="Search sections, case studies, links…"
            className="w-full bg-transparent py-3.5 text-sm text-ink placeholder-muted outline-none"
          />
          <kbd className="rounded-xs border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
            esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted">
              No results for “{query}”
            </li>
          )}
          {filtered.map((c, i) => (
            <li key={c.label}>
              <button
                onClick={c.action}
                onMouseEnter={() => setIndex(i)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === index ? "bg-blue-wash text-blue" : "text-ink"
                }`}
              >
                <span>{c.label}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                  {c.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          ↑↓ navigate · ↵ open · esc close
        </div>
      </div>
    </div>
  );
}
