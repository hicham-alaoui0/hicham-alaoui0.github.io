/**
 * Animated SVG visuals for the dark project cards.
 * All illustrative — they explain each system at a glance; they are not live data.
 * Animations are pure CSS (see globals.css: .flow .draw .fade-in .glow .bar-grow .bar-grow-x)
 * and pause until the card scrolls into view (VizPanel sets data-inview).
 */
import TailChart from "@/components/TailChart";
import type { VizKey } from "@/lib/data";

const W = 560;
const H = 200;
const mono = "IBM Plex Mono, ui-monospace, monospace";
const CORAL = "#ff7759";
const CORAL_SOFT = "#ffad9b";
const DIM = "rgba(255,255,255,0.22)";
const TXT = "rgba(255,255,255,0.55)";

function Label({ x, y, children, anchor = "start", fill = TXT }: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  fill?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={mono} fontSize={10} fill={fill} letterSpacing="0.04em">
      {children}
    </text>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

const toPath = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

/* ── Agents → skills ─────────────────────────────────────────────── */
function AgentsViz() {
  const agents = ["rebalance", "review", "data", "reporting", "design"];
  const ay = (i: number) => 44 + i * 30;
  const cols = 8;
  const skill = (k: number) => ({ x: 340 + (k % cols) * 28, y: 40 + Math.floor(k / cols) * 25 });
  const active: [number, number][] = [[0, 3], [0, 10], [1, 14], [2, 20], [2, 27], [3, 33], [4, 38], [4, 45]];
  const hot = new Set(active.map(([, s]) => s));
  return (
    <Frame label="Illustration: an analyst task is routed to 5 agents, which call a subset of 46 skills.">
      <Label x={20} y={22}>TASK</Label>
      <Label x={150} y={22}>5 AGENTS</Label>
      <Label x={340} y={22}>46 SKILLS</Label>

      {agents.map((_, i) => (
        <path key={`t${i}`} className="flow" d={`M 56 104 C 100 104, 110 ${ay(i)}, 150 ${ay(i)}`} fill="none" stroke="rgba(255,255,255,0.3)" />
      ))}
      {active.map(([a, s], i) => {
        const p = skill(s);
        return (
          <path
            key={`a${i}`}
            className="flow"
            style={{ animationDelay: `${i * 0.15}s` }}
            d={`M 250 ${ay(a)} C 295 ${ay(a)}, 300 ${p.y}, ${p.x - 5} ${p.y}`}
            fill="none"
            stroke="rgba(255,119,89,0.55)"
          />
        );
      })}

      <circle cx={40} cy={104} r={16} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" />
      <circle className="glow" cx={40} cy={104} r={4} fill={CORAL} />

      {agents.map((a, i) => (
        <g key={a} className="fade-in" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
          <rect x={150} y={ay(i) - 10} width={100} height={20} rx={4} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)" />
          <Label x={200} y={ay(i) + 3.5} anchor="middle" fill="rgba(255,255,255,0.8)">{a}</Label>
        </g>
      ))}

      {Array.from({ length: 46 }, (_, k) => {
        const p = skill(k);
        const on = hot.has(k);
        return (
          <circle
            key={k}
            className={on ? "glow" : "fade-in"}
            style={{ animationDelay: `${on ? (k % 5) * 0.3 : 0.3 + k * 0.015}s` }}
            cx={p.x}
            cy={p.y}
            r={on ? 5 : 4}
            fill={on ? CORAL : DIM}
          />
        );
      })}
    </Frame>
  );
}

/* ── RAG: retrieve → rerank → cite ───────────────────────────────── */
function RagViz() {
  const chunks = [
    { p: "p.14 §3.2", s: 0.91 },
    { p: "p.15 §3.3", s: 0.87 },
    { p: "p.41 §7.1", s: 0.82 },
    { p: "p.9  §2.4", s: 0.58 },
    { p: "p.63 §9.0", s: 0.37 },
  ];
  return (
    <Frame label="Illustration: a question retrieves five document chunks; the top three are reranked and cited in the answer.">
      <Label x={10} y={24}>QUERY</Label>
      <Label x={180} y={24}>RETRIEVE + RERANK</Label>
      <Label x={410} y={24}>ANSWER</Label>

      <rect x={10} y={62} width={140} height={76} rx={6} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      <Label x={22} y={86} fill="rgba(255,255,255,0.85)">Max weight per</Label>
      <Label x={22} y={102} fill="rgba(255,255,255,0.85)">stock in the</Label>
      <Label x={22} y={118} fill="rgba(255,255,255,0.85)">index at rebal?</Label>
      <path className="flow" d="M 150 100 L 176 100" stroke="rgba(255,255,255,0.4)" />

      {chunks.map((c, i) => {
        const y = 42 + i * 28;
        const top = i < 3;
        return (
          <g key={c.p}>
            <Label x={180} y={y + 11} fill={top ? "rgba(255,255,255,0.8)" : TXT}>{c.p}</Label>
            <rect
              className="bar-grow-x"
              style={{ animationDelay: `${0.3 + i * 0.12}s` }}
              x={250}
              y={y}
              width={c.s * 110}
              height={14}
              rx={2}
              fill={top ? CORAL : DIM}
            />
            <Label x={366} y={y + 11} fill={top ? CORAL_SOFT : TXT}>{c.s.toFixed(2)}</Label>
            {top && (
              <path className="flow" style={{ animationDelay: `${i * 0.2}s` }} d={`M 396 ${y + 7} C 405 ${y + 7}, 400 100, 408 100`} fill="none" stroke="rgba(255,119,89,0.5)" />
            )}
          </g>
        );
      })}

      <rect className="fade-in" style={{ animationDelay: "0.9s" }} x={410} y={52} width={140} height={96} rx={6} fill="rgba(255,119,89,0.08)" stroke="rgba(255,119,89,0.45)" />
      <g className="fade-in" style={{ animationDelay: "1.1s" }}>
        <Label x={422} y={76} fill="rgba(255,255,255,0.9)">Capped at 10%</Label>
        <Label x={422} y={92} fill="rgba(255,255,255,0.9)">per constituent</Label>
        <Label x={422} y={108} fill="rgba(255,255,255,0.9)">at each rebal.</Label>
        <Label x={422} y={130} fill={CORAL}>[p.14] [p.15]</Label>
      </g>
      <Label x={550} y={172} anchor="end" fill={TXT}>no evidence → “not found”</Label>
    </Frame>
  );
}

/* ── Evals: pass rate vs release gate ────────────────────────────── */
function EvalsViz() {
  const vals = [61, 68, 74, 83, 88, 92];
  const x0 = 50;
  const x1 = 530;
  const yTop = 34;
  const yBot = 160;
  const y = (v: number) => yBot - ((v - 50) / 50) * (yBot - yTop);
  const x = (i: number) => x0 + (i * (x1 - x0)) / (vals.length - 1);
  const pts: [number, number][] = vals.map((v, i) => [x(i), y(v)]);
  return (
    <Frame label="Illustration: evaluation pass rate rising from 61% to 92% across six versions, crossing an 85% release gate.">
      {[60, 70, 80, 90, 100].map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.07)" />
          <Label x={x0 - 8} y={y(v) + 3} anchor="end" fill="rgba(255,255,255,0.35)">{v}</Label>
        </g>
      ))}
      <line x1={x0} x2={x1} y1={y(85)} y2={y(85)} stroke={CORAL_SOFT} strokeDasharray="5 4" />
      <Label x={x0 + 4} y={y(85) - 6} fill={CORAL_SOFT}>RELEASE GATE 85%</Label>

      <path className="draw" pathLength={1} d={toPath(pts)} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={2} />
      {pts.map(([px, py], i) => (
        <g key={i} className="fade-in" style={{ animationDelay: `${0.4 + i * 0.25}s` }}>
          <circle cx={px} cy={py} r={5} fill={vals[i] >= 85 ? CORAL : "#17171c"} stroke={vals[i] >= 85 ? CORAL : "rgba(255,255,255,0.8)"} strokeWidth={1.5} />
          <Label x={px} y={yBot + 22} anchor="middle" fill="rgba(255,255,255,0.45)">{`v${i + 1}`}</Label>
        </g>
      ))}
      <Label x={x1} y={y(92) - 12} anchor="end" fill={CORAL}>92% PASS</Label>
      <Label x={x(0) + 8} y={y(61) + 16} fill={TXT}>61%</Label>
    </Frame>
  );
}

/* ── Equity curve: strategy vs benchmark ─────────────────────────── */
function EquityViz() {
  const n = 60;
  let s = 100;
  let b = 100;
  const S: number[] = [s];
  const B: number[] = [b];
  for (let i = 1; i < n; i++) {
    s *= 1 + 0.0018 + 0.011 * Math.sin(i * 1.7) + 0.007 * Math.sin(i * 0.53 + 1);
    b *= 1 + 0.0011 + 0.01 * Math.sin(i * 1.7 + 0.4) + 0.006 * Math.sin(i * 0.41);
    S.push(s);
    B.push(b);
  }
  const all = [...S, ...B];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const x = (i: number) => 20 + (i * 470) / (n - 1);
  const y = (v: number) => 165 - ((v - lo) / (hi - lo)) * 125;
  const sp: [number, number][] = S.map((v, i) => [x(i), y(v)]);
  const bp: [number, number][] = B.map((v, i) => [x(i), y(v)]);
  const area = `${toPath(sp)} L ${x(n - 1)} 170 L ${x(0)} 170 Z`;
  return (
    <Frame label="Illustration: the paper portfolio's equity curve ends above its benchmark.">
      <defs>
        <linearGradient id="eqfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={CORAL} stopOpacity="0.22" />
          <stop offset="1" stopColor={CORAL} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={20} x2={520} y1={170} y2={170} stroke="rgba(255,255,255,0.15)" />
      <path className="fade-in" style={{ animationDelay: "1.2s" }} d={area} fill="url(#eqfill)" />
      <path className="draw" pathLength={1} d={toPath(bp)} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      <path className="draw" pathLength={1} d={toPath(sp)} fill="none" stroke={CORAL} strokeWidth={2} />
      <circle className="glow" cx={sp[n - 1][0]} cy={sp[n - 1][1]} r={4} fill={CORAL} />
      <Label x={498} y={sp[n - 1][1] + 4} fill={CORAL}>+11.4%</Label>
      <Label x={498} y={bp[n - 1][1] + 4} fill={TXT}>+7.2%</Label>
      <Label x={20} y={24} fill={CORAL}>— strategy</Label>
      <Label x={110} y={24}>— benchmark</Label>
      <Label x={520} y={190} anchor="end" fill="rgba(255,255,255,0.35)">6 months · paper trading</Label>
    </Frame>
  );
}

/* ── Training loss ───────────────────────────────────────────────── */
function LossViz() {
  const n = 50;
  const train = Array.from({ length: n + 1 }, (_, i) => 1.25 + 2.95 * Math.exp(-i / 8) + 0.04 * Math.sin(i * 1.9));
  const val = Array.from({ length: n + 1 }, (_, i) => 1.46 + 2.8 * Math.exp(-i / 8.5) + 0.03 * Math.sin(i * 1.3 + 1));
  const x = (i: number) => 50 + (i * 470) / n;
  const y = (v: number) => 165 - ((v - 1) / 3.5) * 130;
  return (
    <Frame label="Illustration: training and validation loss curves falling, ending at a validation loss of 1.47.">
      {[1.5, 2.5, 3.5, 4.5].map((v) => (
        <g key={v}>
          <line x1={50} x2={520} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.07)" />
          <Label x={42} y={y(v) + 3} anchor="end" fill="rgba(255,255,255,0.35)">{v.toFixed(1)}</Label>
        </g>
      ))}
      <path className="draw" pathLength={1} d={toPath(train.map((v, i) => [x(i), y(v)]))} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      <path className="draw" pathLength={1} style={{ animationDelay: "0.5s" }} d={toPath(val.map((v, i) => [x(i), y(v)]))} fill="none" stroke={CORAL} strokeWidth={2} />
      <circle className="glow" cx={x(n)} cy={y(val[n])} r={4} fill={CORAL} />
      <Label x={520} y={y(val[n]) - 12} anchor="end" fill={CORAL}>VAL LOSS 1.47</Label>
      <Label x={60} y={24} fill="rgba(255,255,255,0.6)">— train</Label>
      <Label x={130} y={24} fill={CORAL}>— val</Label>
      <Label x={520} y={190} anchor="end" fill="rgba(255,255,255,0.35)">steps → 5,000</Label>
      <Label x={60} y={190} fill="rgba(255,255,255,0.35)">10.8M params</Label>
    </Frame>
  );
}

/* ── Rebalancing runs grid ───────────────────────────────────────── */
function RunsViz() {
  const rows = 7;
  const cols = 12;
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <Frame label="Illustration: a grid of monthly rebalancing runs per index, mostly OK, with a few warnings and exceptions flagged.">
      {months.map((m, c) => (
        <Label key={c} x={86 + c * 38} y={24} anchor="middle" fill="rgba(255,255,255,0.35)">{m}</Label>
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <Label x={12} y={44 + r * 20} fill="rgba(255,255,255,0.4)">{`IDX-0${r + 1}`}</Label>
          {Array.from({ length: cols }, (_, c) => {
            const exc = (r * 5 + c * 3) % 23 === 0 && c > 0;
            const warn = !exc && (r * 7 + c * 2) % 11 === 0;
            const live = c === cols - 1;
            return (
              <rect
                key={c}
                className={live ? "glow" : "fade-in"}
                style={{ animationDelay: live ? `${r * 0.2}s` : `${0.2 + c * 0.06 + r * 0.02}s` }}
                x={70 + c * 38}
                y={34 + r * 20}
                width={32}
                height={14}
                rx={2}
                fill={live ? "transparent" : exc ? CORAL : warn ? "rgba(255,173,155,0.45)" : "rgba(255,255,255,0.14)"}
                stroke={live ? "rgba(255,255,255,0.5)" : "none"}
                strokeDasharray={live ? "3 2" : undefined}
              />
            );
          })}
        </g>
      ))}
      <rect x={70} y={184} width={10} height={8} rx={1} fill="rgba(255,255,255,0.14)" />
      <Label x={86} y={191}>ok</Label>
      <rect x={120} y={184} width={10} height={8} rx={1} fill="rgba(255,173,155,0.45)" />
      <Label x={136} y={191}>warning</Label>
      <rect x={200} y={184} width={10} height={8} rx={1} fill={CORAL} />
      <Label x={216} y={191}>exception caught</Label>
      <Label x={522} y={191} anchor="end">running ▸</Label>
    </Frame>
  );
}

/* ── Pricing: ranked promo actions vs margin floor ───────────────── */
function PricingViz() {
  const acts = [
    { a: "−10% · coffee", v: 18.4 },
    { a: "bundle · snacks", v: 14.9 },
    { a: "−15% · dairy", v: 12.2 },
    { a: "2-for-1 · juice", v: 9.8 },
    { a: "−20% · bakery", v: 4.1 },
    { a: "−25% · frozen", v: -1.4 },
  ];
  const zero = 200;
  const k = 16;
  const floor = 6;
  return (
    <Frame label="Illustration: promotion actions ranked by expected margin uplift; actions above the margin floor are recommended.">
      <Label x={12} y={22}>PROMO ACTION</Label>
      <Label x={zero} y={22}>EXPECTED MARGIN UPLIFT (k€)</Label>
      <line x1={zero} x2={zero} y1={32} y2={172} stroke="rgba(255,255,255,0.25)" />
      <line x1={zero + floor * k} x2={zero + floor * k} y1={32} y2={172} stroke={CORAL_SOFT} strokeDasharray="4 4" />
      <Label x={zero + floor * k + 4} y={186} fill={CORAL_SOFT}>margin floor</Label>
      {acts.map((d, i) => {
        const yy = 36 + i * 23;
        const ok = d.v >= floor;
        const w = Math.abs(d.v) * k;
        return (
          <g key={d.a}>
            <Label x={zero - 32} y={yy + 11} anchor="end" fill={ok ? "rgba(255,255,255,0.85)" : TXT}>{d.a}</Label>
            <rect
              className="bar-grow-x"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              x={d.v >= 0 ? zero : zero - w}
              y={yy}
              width={w}
              height={15}
              rx={2}
              fill={ok ? CORAL : DIM}
            />
            <Label x={(d.v >= 0 ? zero + w : zero) + 6} y={yy + 11} fill={ok ? CORAL_SOFT : TXT}>
              {d.v > 0 ? `+${d.v}` : d.v}
            </Label>
          </g>
        );
      })}
    </Frame>
  );
}

/* ── CO2 drivers ─────────────────────────────────────────────────── */
function Co2Viz() {
  const d = [
    { k: "Livestock", v: 41 },
    { k: "Fertilizer", v: 27 },
    { k: "Energy use", v: 14 },
    { k: "Land use", v: 11 },
    { k: "Other", v: 7 },
  ];
  const zero = 130;
  const k = 7.5;
  return (
    <Frame label="Illustration: share of emissions variance by driver; livestock and fertilizer together explain 68%.">
      <Label x={12} y={22}>DRIVER</Label>
      <Label x={zero} y={22}>SHARE OF VARIANCE EXPLAINED</Label>
      {d.map((r, i) => {
        const yy = 38 + i * 28;
        const top = i < 2;
        return (
          <g key={r.k}>
            <Label x={zero - 10} y={yy + 12} anchor="end" fill={top ? "rgba(255,255,255,0.85)" : TXT}>{r.k}</Label>
            <rect className="bar-grow-x" style={{ animationDelay: `${0.3 + i * 0.12}s` }} x={zero} y={yy} width={r.v * k} height={17} rx={2} fill={top ? CORAL : DIM} />
            <Label x={zero + r.v * k + 8} y={yy + 12} fill={top ? CORAL_SOFT : TXT}>{`${r.v}%`}</Label>
          </g>
        );
      })}
      <path className="fade-in" style={{ animationDelay: "1s" }} d="M 470 40 L 480 40 L 480 83 L 470 83" fill="none" stroke={CORAL} />
      <text className="fade-in" style={{ animationDelay: "1.1s" }} x={488} y={67} fontFamily="Space Grotesk, sans-serif" fontSize={22} fill={CORAL}>
        68%
      </text>
    </Frame>
  );
}

export default function Viz({ kind }: { kind: VizKey }) {
  switch (kind) {
    case "tail":
      return <TailChart />;
    case "agents":
      return <AgentsViz />;
    case "rag":
      return <RagViz />;
    case "evals":
      return <EvalsViz />;
    case "equity":
      return <EquityViz />;
    case "loss":
      return <LossViz />;
    case "runs":
      return <RunsViz />;
    case "pricing":
      return <PricingViz />;
    case "co2":
      return <Co2Viz />;
  }
}
