"use client";

import { useState } from "react";

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative z-50 bg-black text-white">
      <div className="mx-auto flex min-h-9 max-w-[1400px] items-center justify-center px-10 py-2 text-center text-[11px] leading-relaxed sm:text-xs">
        <p>
          Available for full-time roles and select freelance engagements.{" "}
          <a
            href="/#contact"
            className="underline underline-offset-2 hover:text-coral-soft"
          >
            Learn more
          </a>
        </p>
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/70 transition-colors hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
