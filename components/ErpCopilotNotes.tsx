/** The parts of the ERP Copilot case study that the generic template has no slot for. */

const PATHS = [
  {
    tag: "Path A · built and tested",
    title: "A small read-only MCP server",
    points: [
      "Talks to SQL Server 2012 directly over ODBC",
      "Live ERP data, each query capped and time-boxed",
      "Any single SELECT over approved views, plus four named reports",
      "About 2,100 lines of Python with tests, maintained by the client",
    ],
  },
  {
    tag: "Path B · designed, not built",
    title: "Microsoft's Data API builder",
    points: [
      "Its documented minimum is SQL Server 2016, so it cannot point at the 2012 ERP",
      "Needs a 2016+ reporting copy, refreshed on a schedule",
      "Entity operations only: Microsoft states it intentionally does not turn questions into SQL",
      "Maintained by Microsoft, which some IT teams prefer",
    ],
  },
];

const HANDOFF = [
  { doc: "Recommendation", for: "Decision makers", text: "Path A or Path B, side by side, and when to switch." },
  { doc: "IT checklist", for: "IT and the DBA", text: "Everything to tick before go-live on the real ERP, driver test first." },
  { doc: "Login script", for: "The DBA", text: "Creates the read-only login. Idempotent, and valid on SQL Server 2012." },
  { doc: "Runbook", for: "Whoever runs it", text: "Rotate the password, read the audit log, cut access, troubleshoot." },
  { doc: "ODBC driver note", for: "IT", text: "Which driver to try first on a 2012 server, and why it must be tested on site." },
  { doc: "Demo script", for: "A first call", text: "Two minutes: three questions, two refused attacks, the audit log." },
];

const OPEN = [
  "It has not run against a real ERP. The books are fake, generated with a fixed seed, and SQL Server 2012 is emulated on a 2022 container at compatibility level 110.",
  "Answer quality is not measured yet. The 15-question eval and its expected figures are ready, but it has not been run against a model, so there is no pass rate.",
  "Path B is a written design, checked against Microsoft's documentation, not a working setup.",
  "Microsoft no longer documents any ODBC driver for SQL Server 2012, so the driver has to be proven on the client's server first.",
];

export default function ErpCopilotNotes() {
  return (
    <>
      <section className="mt-16">
        <h2 className="t-mono text-slate">Why not Microsoft&apos;s Data API builder?</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          It is the obvious choice, and Microsoft&apos;s own: it now ships an MCP server. But its documented minimum for
          SQL Server is 2016, and the server in this scenario is 2012. So the project builds the path that works today and
          writes up the other one, with what it would take.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PATHS.map((p, i) => (
            <div key={p.tag} className={i === 0 ? "card-line p-6" : "card-stone p-6"}>
              <p className={`font-mono text-[11px] uppercase tracking-wider ${i === 0 ? "text-coral" : "text-muted"}`}>{p.tag}</p>
              <p className="t-feature mt-3 text-ink">{p.title}</p>
              <ul className="mt-4 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm leading-relaxed text-slate">
                    <span aria-hidden className={i === 0 ? "text-coral" : "text-muted"}>
                      —
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          The two can run side by side later, because both expose the same approved views.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="t-mono text-slate">What a client would receive</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          The code is half of it. The other half is what lets an IT team say yes: who does what, in which order, and how
          to switch it off.
        </p>
        <ul className="mt-6 border-t border-line">
          {HANDOFF.map((h, i) => (
            <li key={h.doc} className="grid gap-1 border-b border-line py-4 md:grid-cols-[2.5rem_11rem_1fr] md:gap-4">
              <span className="font-mono text-xs text-coral">0{i + 1}</span>
              <span className="text-[15px] font-medium text-ink">
                {h.doc}
                <span className="block font-mono text-[11px] font-normal uppercase tracking-wider text-muted">{h.for}</span>
              </span>
              <span className="text-[15px] leading-relaxed text-slate">{h.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="t-mono text-slate">Not proven yet</h2>
        <ul className="mt-6 space-y-3">
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
          Next on the list: run the eval and publish the pass rate with its confidence interval, then build Path B on the
          reporting copy and compare the two on the same 15 questions.
        </p>
      </section>
    </>
  );
}
