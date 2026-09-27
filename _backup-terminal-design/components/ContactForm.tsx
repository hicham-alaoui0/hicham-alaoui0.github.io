"use client";

import { useState } from "react";
import { site, profile } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const configured = !site.formspree.includes("YOUR_FORM_ID");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!configured) {
      // Formspree not configured yet — fall back to the user's mail client.
      const subject = encodeURIComponent(
        `Portfolio contact from ${data.get("name")}`
      );
      const body = encodeURIComponent(
        `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`
      );
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.formspree, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-xl text-left">
      <p className="mb-4 font-mono text-xs text-dim">
        $ ./send-message --to {profile.email.split("@")[0]}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs text-mut">name *</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className="mt-1.5 w-full rounded border border-edge bg-panel px-3 py-2.5 text-sm text-ink placeholder-dim outline-none transition-colors focus:border-acc/60"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs text-mut">email *</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            className="mt-1.5 w-full rounded border border-edge bg-panel px-3 py-2.5 text-sm text-ink placeholder-dim outline-none transition-colors focus:border-acc/60"
          />
        </label>
      </div>
      <label className="mt-3 block">
        <span className="font-mono text-xs text-mut">message *</span>
        <textarea
          required
          name="message"
          rows={5}
          minLength={10}
          placeholder="Hi Hicham — we'd like to talk about..."
          className="mt-1.5 w-full resize-y rounded border border-edge bg-panel px-3 py-2.5 text-sm text-ink placeholder-dim outline-none transition-colors focus:border-acc/60"
        />
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-acc px-6 py-2.5 font-mono text-sm font-semibold text-[#04130c] transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {status === "sending" ? "sending..." : "send --now →"}
        </button>
        {status === "sent" && (
          <p className="font-mono text-xs text-acc">
            ✓ message sent — exit 0. I&apos;ll get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="font-mono text-xs text-amb">
            ✗ send failed — email me directly at {profile.email}
          </p>
        )}
      </div>
    </form>
  );
}
