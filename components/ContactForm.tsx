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
    <form onSubmit={onSubmit} className="text-left">
      <p className="t-mono text-slate">Send a message</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-ink">Name</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className="field mt-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-ink">Email</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            className="field mt-2"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm text-ink">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          minLength={10}
          placeholder="Hi Hicham — we'd like to talk about..."
          className="field mt-2 resize-y"
        />
      </label>

      <div className="mt-7 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary"
        >
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
        {status === "sent" && (
          <p className="text-sm text-ink">
            Message sent — I&apos;ll get back to you shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-danger">
            Send failed — email me directly at {profile.email}
          </p>
        )}
      </div>
    </form>
  );
}
