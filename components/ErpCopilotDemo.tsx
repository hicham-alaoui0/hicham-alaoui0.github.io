"use client";

/**
 * A console you can click, in the spirit of the project's own demo console. Nothing here talks to
 * a database: every figure, assumption, SQL statement, refusal and audit line was recorded from
 * the real MCP server running on the demo ERP (fake data, SQL Server 2012 emulated). The fiscal-year
 * and payables figures come from the project's demo script and rebuild guide, which recorded them
 * from the same tools.
 */
import { useState } from "react";

type Audit = { ts: string; tool: string; status: "allowed" | "blocked"; detail: string };

type Answer = {
  id: string;
  question: string;
  call: string;
  totals: { label: string; value: string }[];
  table?: { head: string[]; rows: string[][] };
  assumptions: string[];
  sql?: string;
  audit?: Audit[];
  source: string;
};

type Attack = { id: string; label: string; sql: string; reason: string; ts: string };

const AGING_SQL = `SELECT TOP (?) x.customer_id, x.customer_name,
       SUM(CASE WHEN x.days_past_due <= 0 THEN x.balance ELSE 0 END)                 AS current_amount,
       SUM(CASE WHEN x.days_past_due BETWEEN 1 AND 30 THEN x.balance ELSE 0 END)    AS days_1_30,
       SUM(CASE WHEN x.days_past_due BETWEEN 31 AND 60 THEN x.balance ELSE 0 END)   AS days_31_60,
       SUM(CASE WHEN x.days_past_due BETWEEN 61 AND 90 THEN x.balance ELSE 0 END)   AS days_61_90,
       SUM(CASE WHEN x.days_past_due > 90 THEN x.balance ELSE 0 END)                AS days_over_90,
       SUM(CASE WHEN x.days_past_due > 0 THEN x.balance ELSE 0 END)                 AS total_past_due,
       SUM(x.balance)                                                               AS total_open_balance,
       SUM(CASE WHEN x.days_past_due > 60 THEN x.balance ELSE 0 END) AS over_60_days
FROM (
    SELECT i.customer_id, i.customer_name,
           i.total_amount - ISNULL(a.applied, 0)        AS balance,
           DATEDIFF(day, i.due_date, CAST(? AS date))   AS days_past_due
    FROM reporting.v_ar_invoices i
    LEFT JOIN (SELECT document_no, SUM(applied_amount) AS applied
               FROM reporting.v_ar_receipts
               WHERE applied_date <= CAST(? AS date)
               GROUP BY document_no) a ON a.document_no = i.document_no
    WHERE i.invoice_date <= CAST(? AS date)
) x
WHERE x.balance <> 0
GROUP BY x.customer_id, x.customer_name
ORDER BY SUM(CASE WHEN x.days_past_due > 60 THEN x.balance ELSE 0 END) DESC`;

const ANSWERS: Answer[] = [
  {
    id: "overdue",
    question: "Who is most overdue past 60 days?",
    call: 'ar_aging(sort_by="over_60_days", limit=5)',
    totals: [
      { label: "Customers with a balance", value: "156" },
      { label: "Total past due", value: "$584,900.99" },
      { label: "Total open balance", value: "$1,419,620.83" },
    ],
    table: {
      head: ["Customer", "Over 60 days", "Past due", "Open balance"],
      rows: [
        ["Griffin-Stafford", "33,639.41", "63,059.81", "65,131.45"],
        ["Carson Inc", "30,636.00", "44,796.06", "48,657.98"],
        ["Ross PLC", "13,167.68", "17,227.44", "25,383.59"],
        ["Noble-Moody", "12,286.38", "13,194.74", "18,699.53"],
        ["Mcgrath Inc", "12,260.23", "22,428.79", "30,962.06"],
      ],
    },
    assumptions: [
      "Aged by days past the due date as of 2026-10-31; buckets Current, 1-30, 31-60, 61-90, over 90.",
      "Balances include tax and freight and are net of payments and credit memos applied on or before that date.",
      "Unapplied credit memos are negative balances and reduce what the customer owes.",
      "Voided invoices are excluded. Totals cover ALL customers; the table shows only the top 5.",
    ],
    sql: AGING_SQL,
    audit: [
      { ts: "22:42:40.488", tool: "report_date", status: "allowed", detail: "1 row · 49 ms" },
      { ts: "22:42:40.512", tool: "ar_aging", status: "allowed", detail: "totals · 1 row · 23 ms" },
      { ts: "22:42:40.541", tool: "ar_aging", status: "allowed", detail: "by customer · 5 rows · 27 ms" },
    ],
    source: "Recorded from the tool, with its audit log lines.",
  },
  {
    id: "fiscal",
    question: "What were our sales last fiscal year?",
    call: 'sales_by_month(year=2026, year_type="fiscal")',
    totals: [
      { label: "Net sales, fiscal 2026", value: "$8,609,473.14" },
      { label: "Gross sales, fiscal 2026", value: "$8,657,742.93" },
    ],
    assumptions: [
      "A trap on purpose: this ERP's fiscal year runs July to June and is named for the year it ends, so fiscal 2026 is July 2025 to June 2026.",
      "Net sales are after credit memos; tax and freight are reported separately, so the answer says which figure it gives.",
    ],
    source: "Figures recorded from the tool in the project's demo script.",
  },
  {
    id: "payables",
    question: "What do we owe our vendors?",
    call: "open_ap()",
    totals: [
      { label: "Open payables", value: "$690,528.99" },
      { label: "Unpaid bills", value: "125" },
      { label: "Vendors", value: "82" },
    ],
    assumptions: [
      "As of the ERP's business date, 2026-10-31. The tool also rebuilds payables for any past date from the payment history.",
    ],
    source: "Figures recorded from the tool in the project's rebuild guide.",
  },
];

const ATTACKS: Attack[] = [
  { id: "delete", label: "Delete every invoice", sql: "DELETE FROM dbo.arinvc", reason: "DELETE is not allowed in a read-only query.", ts: "demo console" },
  {
    id: "payroll",
    label: "Read the payroll table",
    sql: "SELECT * FROM dbo.prempy",
    reason: "'dbo.prempy' is not an approved dataset. Use list_datasets to see what is available.",
    ts: "03:02:33",
  },
  {
    id: "stacked",
    label: "Hide a DELETE after a SELECT",
    sql: "SELECT TOP 1 customer_id FROM reporting.v_customers; DELETE FROM dbo.arinvc WHERE 1 = 0",
    reason: "Exactly one statement is allowed (stacked statements are blocked).",
    ts: "03:04:06",
  },
  {
    id: "catalog",
    label: "Browse the system catalog",
    sql: "SELECT name FROM sys.tables",
    reason: "System object or procedure 'sys' is not allowed.",
    ts: "03:02:36",
  },
  {
    id: "into",
    label: "Copy data into a new table",
    sql: "SELECT * INTO reporting.stolen FROM reporting.v_customers",
    reason: "INTO is not allowed in a read-only query.",
    ts: "03:02:38",
  },
  { id: "exec", label: "Run an operating-system command", sql: "EXEC xp_cmdshell 'dir'", reason: "EXEC is not allowed in a read-only query.", ts: "03:02:37" },
];

const CAPTIONS = {
  ask: {
    who: "Claude asks, the tools answer",
    title: "Answers finance can check",
    text: "Each question maps to one read-only tool. The answer comes with grand totals for every customer, the assumptions behind the number and the exact SQL that ran, so it can be checked against the ERP's own reports.",
  },
  break: {
    who: "The guard and the database refuse",
    title: "Now try to make it write",
    text: "These go through run_query, the only tool that accepts free SQL. The guard refuses them before anything reaches the database. The SQL login would refuse them again: it holds one grant, SELECT on the approved views.",
  },
};

export default function ErpCopilotDemo() {
  const [mode, setMode] = useState<"ask" | "break">("ask");
  const [answerId, setAnswerId] = useState(ANSWERS[0].id);
  const [attackId, setAttackId] = useState(ATTACKS[0].id);
  const [showSql, setShowSql] = useState(false);

  const answer = ANSWERS.find((a) => a.id === answerId) ?? ANSWERS[0];
  const attack = ATTACKS.find((a) => a.id === attackId) ?? ATTACKS[0];
  const caption = CAPTIONS[mode];
  const items = mode === "ask" ? ANSWERS.map((a) => ({ id: a.id, label: a.question, sub: a.call })) : ATTACKS.map((a) => ({ id: a.id, label: a.label, sub: a.sql }));
  const current = mode === "ask" ? answerId : attackId;

  const pick = (id: string) => {
    setShowSql(false);
    if (mode === "ask") setAnswerId(id);
    else setAttackId(id);
  };

  return (
    <div className="rounded-lg bg-near p-6 text-white md:p-10">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          a console you can click
        </span>
        <span className="rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          recorded from the real tools
        </span>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
          shipped · demo ERP, fake data
        </span>
      </div>

      <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] lg:gap-12">
        {/* caption, mode switch and the list of questions or attacks */}
        <div className="flex min-w-0 flex-col">
          <div aria-live="polite" className="min-h-[11.5rem] lg:min-h-[13rem]">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/80">
              <span className={`inline-block h-2 w-2 rounded-full ${mode === "ask" ? "bg-mint" : "bg-coral"}`} />
              {caption.who}
            </p>
            <h2 className="mt-3 font-display text-xl leading-tight tracking-tight text-white md:text-2xl lg:text-3xl">
              {caption.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 lg:text-[15px]">{caption.text}</p>
          </div>

          <div role="group" aria-label="Mode" className="mt-5 inline-flex w-fit rounded-pill border border-white/20 p-1">
            {(["ask", "break"] as const).map((m) => (
              <button
                key={m}
                aria-pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setShowSql(false);
                }}
                className={`rounded-pill px-4 py-1.5 text-sm transition-colors ${
                  mode === m ? (m === "ask" ? "bg-white text-near" : "bg-coral text-near") : "text-white/75 hover:text-white"
                }`}
              >
                {m === "ask" ? "Ask a question" : "Try to break it"}
              </button>
            ))}
          </div>

          <ul className="mt-5 space-y-2">
            {items.map((it) => {
              const on = it.id === current;
              return (
                <li key={it.id}>
                  <button
                    aria-pressed={on}
                    onClick={() => pick(it.id)}
                    className={`w-full rounded-md border px-4 py-3 text-left transition-colors ${
                      on
                        ? mode === "ask"
                          ? "border-mint/60 bg-mint/10"
                          : "border-coral/60 bg-coral/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/30"
                    }`}
                  >
                    <span className="block text-sm text-white">{it.label}</span>
                    <span className="mt-1 block truncate font-mono text-[11px] text-white/50">{it.sub}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* the console */}
        <div className="mt-8 min-w-0 rounded-md border border-white/10 bg-black/35 p-4 md:p-6 lg:mt-0" aria-live="polite">
          {mode === "ask" ? (
            <div key={answer.id} className="fade-in">
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Finance asks</p>
              <p className="mt-2 font-display text-lg leading-snug text-white md:text-xl">{answer.question}</p>

              <div className="mt-4 rounded-sm border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[12px] text-white/85">
                <span className="text-white/45">tool call · </span>
                {answer.call}
              </div>

              <div className={`mt-4 grid gap-2 ${answer.totals.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {answer.totals.map((t) => (
                  <div key={t.label} className="rounded-sm border border-white/10 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">{t.label}</p>
                    <p className="mt-1.5 font-display text-xl tracking-tight text-white md:text-2xl">{t.value}</p>
                  </div>
                ))}
              </div>

              {answer.table && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse font-mono text-[12px]">
                    <thead>
                      <tr className="text-white/45">
                        {answer.table.head.map((h, i) => (
                          <th key={h} className={`border-b border-white/10 pb-2 font-normal ${i ? "text-right" : "text-left"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {answer.table.rows.map((r) => (
                        <tr key={r[0]} className="text-white/85">
                          {r.map((c, i) => (
                            <td
                              key={i}
                              className={`border-b border-white/5 py-1.5 ${i ? "text-right tabular-nums" : "text-left"} ${
                                i === 1 ? "text-coral-soft" : ""
                              }`}
                            >
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-white/40">Assumptions returned with the answer</p>
              <ul className="mt-2 space-y-1.5">
                {answer.assumptions.map((a) => (
                  <li key={a} className="flex gap-2.5 text-[13px] leading-relaxed text-white/70">
                    <span aria-hidden className="text-white/35">
                      —
                    </span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>

              {answer.sql && (
                <div className="mt-4">
                  <button
                    aria-expanded={showSql}
                    onClick={() => setShowSql((s) => !s)}
                    className="font-mono text-[12px] text-mint hover:text-white"
                  >
                    {showSql ? "▾ Hide the SQL that ran" : "▸ Show the SQL that ran"}
                  </button>
                  {showSql && (
                    <pre className="mt-2 max-h-64 overflow-auto rounded-sm border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/75">
                      {answer.sql}
                    </pre>
                  )}
                </div>
              )}

              {answer.audit && (
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Audit log</p>
                  <ul className="mt-2 space-y-1 font-mono text-[11px] text-white/60">
                    {answer.audit.map((l) => (
                      <li key={l.ts} className="flex flex-wrap gap-x-3">
                        <span className="text-white/35">{l.ts}</span>
                        <span>{l.tool}</span>
                        <span className="text-mint">{l.status}</span>
                        <span>{l.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-4 text-[12px] text-white/40">{answer.source}</p>
            </div>
          ) : (
            <div key={attack.id} className="fade-in">
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">run_query(sql=…)</p>
              <pre className="mt-2 whitespace-pre-wrap break-words rounded-sm border border-white/10 bg-white/[0.04] p-3 font-mono text-[12.5px] leading-relaxed text-white/90">
                {attack.sql}
              </pre>

              <div className="mt-4 rounded-sm border border-coral/50 bg-coral/10 p-4">
                <p className="font-mono text-[13px] leading-relaxed text-coral-soft">
                  <span className="font-semibold text-coral">BLOCKED</span> Blocked by the read-only guard: {attack.reason}
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60">Nothing was sent to the database. The attempt is in the audit log.</p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">If the guard were bypassed</p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                  The login <span className="font-mono text-white/85">claude_reader</span> holds one grant: SELECT on the
                  approved views. Writes, DDL and EXECUTE are denied, everything on <span className="font-mono text-white/85">dbo</span>{" "}
                  is denied, and payroll has its own DENY. The security tests check this with a raw connection as that login,
                  with all of the server code bypassed.
                </p>
              </div>

              <p className="mt-4 text-[12px] text-white/40">
                The refusal is recorded from the real server{attack.ts === "demo console" ? " in its demo console." : "."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
