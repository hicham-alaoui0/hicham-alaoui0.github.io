import Link from "next/link";

/** The parts of the Aloi case study that the generic template has no slot for. */

const RULE = [
  "Collect every number the tools returned in this conversation. Dates are left out.",
  "Find each currency amount and percentage in the answer, in English or continental notation, with scale words such as bn or million.",
  "A figure passes if a fetched number rounds to it at the precision the answer used. The last digit may be off by one.",
  "Anything left over is listed under the answer in yellow. A chart is held to the same rule: every value handed to a drawing tool must have been fetched.",
];

type Verdict = "found" | "flagged" | "blind";
const CASES: { says: string; data: string; verdict: Verdict; why: string }[] = [
  { says: "10Y 5.22%", data: '"yield_pct": 5.22', verdict: "found", why: "exact match" },
  { says: "$4,880", data: "4879.6", verdict: "found", why: "rounds to it at zero decimals" },
  { says: "$1.67 trillion", data: "1666501944341", verdict: "found", why: "scale word applied" },
  { says: "up 12%", data: "no 12 anywhere", verdict: "flagged", why: "never fetched, or worked out in the model's head" },
  { says: "+47 bp", data: '"latest": 47', verdict: "blind", why: "no currency or percent sign, so it is not checked" },
  { says: "Nvidia at $172.40", data: "AMD: 172.4", verdict: "blind", why: "the value exists; the check does not know whose it is" },
];
const VERDICT: Record<Verdict, { label: string; className: string }> = {
  found: { label: "passes", className: "text-green" },
  flagged: { label: "flagged", className: "text-danger" },
  blind: { label: "blind spot", className: "text-muted" },
};

const HOLDS = [
  {
    title: "Your data",
    text: "With a Bloomberg Terminal, Aloi reads it through the local Desktop API on your own licence. Without one it uses Yahoo Finance. Crypto, macro series, filings and news come from public APIs.",
  },
  {
    title: "Your model",
    text: "Claude through the Anthropic API, a local model through Ollama, or any OpenAI-compatible endpoint, which is how a company points it at the model it has approved.",
  },
  {
    title: "Your machine",
    text: "There is no server of mine in the loop. One setting cuts every public source, so the program talks to the Terminal and the model and nothing else.",
  },
];

const OPEN = [
  "Nobody outside has used it. It is a beta in preparation, not a product with users.",
  "The check works on values, not on meaning. A real number attached to the wrong company passes, and so does a sentence that says more than the data does.",
  "The free data sources are unofficial or rate-limited and can change without notice.",
];

/** For engineers, low on the page: how the parts fit and what the loop does on every step. */
export function AloiUnderTheHood() {
  return (
    <section className="mt-16">
      <h2 className="t-mono text-slate">Under the hood</h2>

      <figure className="mt-5">
        <div className="overflow-x-auto rounded-lg bg-stone p-5 md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diagrams/aloi-architecture.svg"
            alt="Aloi architecture: the terminal UI drives the agent loop, which talks to models through one protocol and to tools through one type; tools reach market data through a second protocol and public sources over HTTP; a figure check compares each answer with the tool results."
            className="w-full min-w-[640px] rounded-sm"
          />
        </div>
        <figcaption className="mt-4 text-sm leading-relaxed text-slate">
          The agent loop talks to models through one protocol and to market data through another. A new model or
          data source is one adapter; the loop, the tools and the checks do not change.
        </figcaption>
      </figure>

      <figure className="mt-10">
        <div className="overflow-x-auto rounded-lg bg-stone p-5 md:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diagrams/aloi-loop.svg"
            alt="One turn of the loop: build the context, stream the model, run any tool calls and repeat. A reply without tool calls passes two guards, each of which can send one correction. Then the held text is shown, the final figure check runs and the turn is saved."
            className="w-full min-w-[640px] rounded-sm"
          />
        </div>
        <figcaption className="mt-4 text-sm leading-relaxed text-slate">
          The loop sends the model back to work in two cases only, the red path: an answer with figures that have no
          source before anything was fetched, and a chart that was asked for but not drawn. Once data has been
          fetched, a figure with no source is reported to the reader and the answer stands.
        </figcaption>
      </figure>
    </section>
  );
}

export default function AloiNotes() {
  return (
    <>
      <section className="mt-16">
        <h2 className="t-mono text-slate">The figure check, step by step</h2>
        <ol className="mt-6 border-t border-line">
          {RULE.map((line, i) => (
            <li key={line} className="flex gap-5 border-b border-line py-4 text-[15px] leading-relaxed text-slate">
              <span className="font-mono text-xs text-coral">0{i + 1}</span>
              <span>{line}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
                <th className="py-3 pr-6 font-normal">The answer says</th>
                <th className="py-3 pr-6 font-normal">A tool returned</th>
                <th className="py-3 pr-6 font-normal">Result</th>
                <th className="py-3 font-normal">Why</th>
              </tr>
            </thead>
            <tbody>
              {CASES.map((c) => (
                <tr key={c.says} className="border-b border-line align-top">
                  <td className="py-3 pr-6 font-mono text-[13px] text-ink">{c.says}</td>
                  <td className="py-3 pr-6 font-mono text-[13px] text-slate">{c.data}</td>
                  <td className={`whitespace-nowrap py-3 pr-6 font-medium ${VERDICT[c.verdict].className}`}>
                    {VERDICT[c.verdict].label}
                  </td>
                  <td className="py-3 text-slate">{c.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          The first and fifth rows are from the recorded run above. The others illustrate the rule.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="t-mono text-slate">Who holds what</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOLDS.map((h) => (
            <div key={h.title} className="card-stone p-6">
              <p className="t-feature text-ink">{h.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="t-mono text-slate">Not proven yet</h2>
        <ul className="mt-6 space-y-3">
          <li className="flex gap-3 text-[15px] leading-relaxed text-ink">
            <span aria-hidden className="text-coral">
              —
            </span>
            <span>
              The eval is 28 questions I wrote myself, run once. By the standard of my own{" "}
              <Link href="/projects/llm-eval-harness/" className="underline underline-offset-4 hover:text-blue">
                evaluation toolkit
              </Link>
              , that is a smoke test, not a result.
            </span>
          </li>
          {OPEN.map((line) => (
            <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-ink">
              <span aria-hidden className="text-coral">
                —
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] leading-relaxed text-slate">
          Next on the list: record the tool results so the eval can be replayed and run several times, and tie each
          figure to the instrument and date it came from.
        </p>
      </section>
    </>
  );
}
