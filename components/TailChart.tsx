/**
 * Illustrative fat-tailed distribution with a static limit vs. an EVT limit.
 * Pure SVG, no data dependency — it explains the idea, it is not real data.
 */
export default function TailChart() {
  const W = 560;
  const H = 200;
  const padX = 8;
  const top = 34;
  const base = H - 30;
  const n = 46;
  const k = 5;
  const threshold = 0.6; // POT threshold u (share of the x-range)
  const staticLimit = 0.44;
  const evtLimit = 0.86;

  const raw = Array.from({ length: n }, (_, i) => {
    const x = (i + 0.5) / n;
    return k * x * Math.exp(-k * x) + 0.06 * Math.pow(1 + 8 * x, -1.5);
  });
  const max = Math.max(...raw);
  const slot = (W - 2 * padX) / n;
  const barW = slot - 3;

  const bars = raw.map((v, i) => {
    const h = (v / max) * (base - top);
    const x = padX + i * slot;
    const inTail = (i + 0.5) / n >= threshold;
    return { x, y: base - h, h, inTail, i };
  });

  const tail = bars.filter((b) => b.inTail);
  const curve = tail
    .map((b, j) => `${j === 0 ? "M" : "L"} ${(b.x + barW / 2).toFixed(1)} ${(b.y - 4).toFixed(1)}`)
    .join(" ");

  const xOf = (share: number) => padX + share * (W - 2 * padX);
  const mono = "IBM Plex Mono, ui-monospace, monospace";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="Illustration: a fat-tailed distribution of trade sizes. A static limit sits inside the bulk of normal trades; the EVT limit is fitted on the tail."
    >
      {/* baseline */}
      <line x1={padX} x2={W - padX} y1={base} y2={base} stroke="rgba(255,255,255,0.2)" />

      {/* tail region wash */}
      <rect
        x={xOf(threshold)}
        y={top - 6}
        width={W - padX - xOf(threshold)}
        height={base - top + 6}
        fill="rgba(255,119,89,0.07)"
      />

      {/* bars */}
      {bars.map((b) => (
        <rect
          key={b.i}
          className="bar-grow"
          style={{ animationDelay: `${0.3 + b.i * 0.012}s` }}
          x={b.x}
          y={b.y}
          width={barW}
          height={b.h}
          rx={1}
          fill={b.inTail ? "#ff7759" : "rgba(255,255,255,0.22)"}
        />
      ))}

      {/* GPD fit over the tail */}
      <path d={curve} fill="none" stroke="#ffad9b" strokeWidth={1.5} strokeDasharray="3 3" />

      {/* static limit */}
      <line
        x1={xOf(staticLimit)}
        x2={xOf(staticLimit)}
        y1={top - 8}
        y2={base}
        stroke="rgba(255,255,255,0.45)"
        strokeDasharray="4 4"
      />
      <text x={xOf(staticLimit) - 6} y={top - 14} textAnchor="end" fontFamily={mono} fontSize={10} fill="rgba(255,255,255,0.55)">
        STATIC LIMIT · noisy
      </text>

      {/* EVT limit */}
      <line x1={xOf(evtLimit)} x2={xOf(evtLimit)} y1={top - 8} y2={base} stroke="#ff7759" strokeWidth={1.5} />
      <text x={xOf(evtLimit) - 40} y={top - 14} textAnchor="start" fontFamily={mono} fontSize={10} fill="#ff7759">
        EVT LIMIT
      </text>

      {/* threshold u */}
      <text x={xOf(threshold) + 4} y={base + 16} fontFamily={mono} fontSize={10} fill="rgba(255,255,255,0.5)">
        u — tail fitted with GPD →
      </text>
      <text x={padX} y={base + 16} fontFamily={mono} fontSize={10} fill="rgba(255,255,255,0.35)">
        trade size
      </text>
    </svg>
  );
}
