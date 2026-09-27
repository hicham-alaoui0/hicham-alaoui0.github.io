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
      { label: "go: home", hint: "section", action: () => go("/") },
      { label: "go: experience", hint: "section", action: () => go("/#experience") },
      { label: "go: projects", hint: "section", action: () => go("/#projects") },
      { label: "go: skills", hint: "section", action: () => go("/#skills") },
      { label: "go: services", hint: "section", action: () => go("/#services") },
      { label: "go: contact", hint: "section", action: () => go("/#contact") },
      ...projects
        .filter((p) => p.slug)
        .map((p) => ({
          label: `case study: ${p.title}`,
          hint: p.category,
          action: () => go(`/projects/${p.slug}/`),
        })),
      { label: "download cv.pdf", hint: "file", action: () => go(profile.cv) },
      { label: "open github", hint: "link", action: () => go(profile.github) },
      { label: "open linkedin", hint: "link", action: () => go(profile.linkedin) },
      { label: "send email", hint: "link", action: () => go(`mailto:${profile.email}`) },
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
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-edge-2 bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-edge px-4">
          <span className="font-mono text-sm text-acc">$</span>
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
            placeholder="type a command or search..."
            className="w-full bg-transparent py-3.5 font-mono text-sm text-ink placeholder-dim outline-none"
          />
          <kbd className="rounded border border-edge px-1.5 py-0.5 font-mono text-[10px] text-dim">
            esc
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono text-xs text-dim">
              command not found: {query}
            </li>
          )}
          {filtered.map((c, i) => (
            <li key={c.label}>
              <button
                onClick={c.action}
                onMouseEnter={() => setIndex(i)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                  i === index ? "bg-acc/10 text-acc" : "text-mut"
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-dim">
                  {c.hint}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-edge px-4 py-2 font-mono text-[10px] text-dim">
          ↑↓ navigate · ↵ run · esc close
        </div>
      </div>
    </div>
  );
}
