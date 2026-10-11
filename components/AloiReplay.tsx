"use client";

/**
 * Replays one real Aloi turn, step by step, with a caption saying who is acting.
 * Everything shown comes from lib/aloi-recording.ts. At rest (and without JavaScript) the whole
 * run is visible. On a wide screen the replay starts by itself when the card comes into view;
 * on a phone the visitor starts it, and the page then follows each step as it appears.
 */
import { useEffect, useRef, useState } from "react";
import { recording as rec } from "@/lib/aloi-recording";

type Actor = "you" | "model" | "code" | "check" | "limit";

const ACTORS: Record<Actor, { label: string; dot: string }> = {
  you: { label: "You", dot: "bg-white" },
  model: { label: "The model", dot: "bg-white/40" },
  code: { label: "Code", dot: "bg-coral" },
  check: { label: "The check", dot: "bg-mint" },
  limit: { label: "The limit", dot: "bg-amber" },
};

/** One caption per step; `ms` is how long the step holds during a replay. */
const STEPS: { actor: Actor; title: string; text: string; ms: number }[] = [
  {
    actor: "you",
    title: "A plain question",
    text: `No ticker syntax and no menus. The question goes to the model together with the list of ${rec.toolsOnOffer} tools it may call.`,
    ms: 2600,
  },
  {
    actor: "model",
    title: "The model picks a tool",
    text: "It does not answer yet. It cannot reach any data by itself, so it asks for the yield-curve tool.",
    ms: 2200,
  },
  {
    actor: "code",
    title: "Python does the work",
    text: "The tool fetches 11 Treasury yields from FRED, lines up today, a month ago and a year ago, and computes the spreads. No arithmetic goes through the model.",
    ms: 3800,
  },
  {
    actor: "code",
    title: "The chart is drawn by code",
    text: "It is built from the same numbers out of Braille characters, so it works in any terminal. The model never sees it. Here the terminal renderer's output is redrawn dot for dot.",
    ms: 3800,
  },
  {
    actor: "model",
    title: "Now the model writes",
    text: "Only with the tool result in front of it. Its job is to choose and to explain.",
    ms: 3800,
  },
  {
    actor: "check",
    title: "Every percentage is traced",
    text: "Each amount and percentage in the answer is looked up in what the tools returned. Both are there. One that is missing gets a yellow warning under the answer.",
    ms: 3800,
  },
  {
    actor: "code",
    title: "The bill",
    text: "One line closes each turn: time, tool calls, tokens and cost. This answer cost a fifth of a cent.",
    ms: 2800,
  },
  {
    actor: "limit",
    title: "What the check missed",
    text: "The check proves a number was fetched. It cannot judge a sentence, and one here is too strong: the 30-year yield sits below the 20-year. I left the run as recorded.",
    ms: 0,
  },
];
const LAST = STEPS.length;
/** Shown before anything has been played. */
const INTRO = {
  title: "Watch one question travel",
  text: "A real run, recorded and annotated: what the model does, what plain code does, what the check catches, and what it misses.",
};
const ALL = Number.POSITIVE_INFINITY;

const ANSWER_LENGTH = rec.answer.reduce((sum, part) => sum + part.text.length, 0);
const RECORDED = new Date(`${rec.recorded}T00:00:00Z`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Chart colours: the terminal's cyan, magenta and grey become the site's coral and two whites. */
const INK: Record<string, string> = {
  cyan: "#ff7759",
  magenta: "rgba(255,255,255,0.8)",
  bright_black: "rgba(255,255,255,0.34)",
  default: "rgba(255,255,255,0.85)",
};
const LABEL: Record<string, string> = { ...INK, bright_black: "rgba(255,255,255,0.5)" };
const MONO = "IBM Plex Mono, ui-monospace, monospace";

/** Text that appears as if typed; the part still to come keeps its space, so nothing moves. */
function Typing({ text, shown }: { text: string; shown: number }) {
  if (shown >= text.length) return <>{text}</>;
  const at = Math.max(0, shown);
  return (
    <>
      {text.slice(0, at)}
      <span className="opacity-0">{text.slice(at)}</span>
    </>
  );
}

function Chart() {
  const c = rec.chart;
  return (
    <svg
      viewBox={`0 0 ${c.width} ${c.height}`}
      className="h-auto w-full min-w-[520px] max-w-[680px]"
      role="img"
      aria-label="The US Treasury yield curve from 1 month to 30 years on 8 October 2026, against a month and a year earlier. Yields rise with maturity up to 20 years."
    >
      <path d={c.axis} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      {Object.entries(c.dots).map(([colour, d]) => (
        <path key={colour} d={d} fill={INK[colour]} />
      ))}
      {c.swatches.map((s) => (
        <line key={s.x} x1={s.x} x2={s.x + s.w} y1={s.y} y2={s.y} stroke={INK[s.colour]} strokeWidth={2.5} />
      ))}
      {c.texts.map((t) => (
        <text
          key={`${t.x}-${t.y}`}
          x={t.x}
          y={t.y}
          textLength={t.w}
          lengthAdjust="spacingAndGlyphs"
          fontFamily={MONO}
          fontSize={12.5}
          fill={LABEL[t.colour]}
        >
          {t.text}
        </text>
      ))}
    </svg>
  );
}

export default function AloiReplay() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(LAST);
  const [playing, setPlaying] = useState(false);
  const [typed, setTyped] = useState(ALL); // characters shown of the text being typed or streamed
  const [run, setRun] = useState(0); // restarts the chart's wipe on every replay
  const [idle, setIdle] = useState(true); // nothing played yet: the caption introduces the run
  const blocks = useRef<(HTMLElement | null)[]>([]);
  const follow = useRef(false); // the visitor pressed Play, so the page may scroll with the steps
  const calm = useRef(false); // the visitor prefers reduced motion

  const replay = (byVisitor: boolean) => {
    follow.current = byVisitor;
    setIdle(false);
    setRun((n) => n + 1);
    setTyped(calm.current ? ALL : 0);
    setStep(1);
    setPlaying(true);
  };
  const jump = (to: number) => {
    setIdle(false);
    setPlaying(false);
    setTyped(ALL);
    setStep(Math.min(LAST, Math.max(1, to)));
  };

  // Start once when the card is first seen, where the caption sits beside the terminal and
  // both fit on screen. Never for a visitor who prefers no motion.
  useEffect(() => {
    const el = ref.current;
    calm.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || calm.current || !window.matchMedia("(min-width: 1024px) and (min-height: 700px)").matches) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          replay(false);
          obs.disconnect();
        }
      },
      // once the top of the card has cleared the lower third of the screen
      { rootMargin: "0px 0px -35% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // While playing: bring the new block into view, type the question or stream the answer, then move on.
  useEffect(() => {
    if (!playing) return;
    if (follow.current) {
      // From the answer on, every step marks up the answer itself, so that is what stays in view.
      blocks.current[Math.min(step, 5)]?.scrollIntoView({ block: "start", behavior: calm.current ? "auto" : "smooth" });
    }
    const total = calm.current ? 0 : step === 1 ? rec.question.length : step === 5 ? ANSWER_LENGTH : 0;
    const perTick = step === 1 ? 2 : 6;
    let shown = 0;
    setTyped(total ? 0 : ALL);
    const ticker = total
      ? window.setInterval(() => {
          shown += perTick;
          setTyped(shown >= total ? ALL : shown);
          if (shown >= total) window.clearInterval(ticker);
        }, 30)
      : 0;
    const next = window.setTimeout(() => {
      if (step < LAST) setStep(step + 1);
      else setPlaying(false);
    }, STEPS[step - 1].ms);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(next);
    };
  }, [step, playing]);

  const current = STEPS[step - 1];
  const actor = ACTORS[current.actor];
  /**
   * A block of the transcript appears at its step and stays; hidden blocks keep their space.
   * The scroll margin leaves room for the site header and, on a phone, the pinned caption.
   */
  const block = (from: number) =>
    `scroll-mt-[17.5rem] transition-opacity duration-500 lg:scroll-mt-28 ${step >= from ? "opacity-100" : "opacity-0"}`;
  const at = (from: number) => (el: HTMLElement | null) => {
    blocks.current[from] = el;
  };
  const checked = step >= 6;
  let offset = 0; // position of each answer segment, for the streaming effect

  return (
    <div ref={ref} className="relative rounded-lg bg-near p-6 text-white md:p-10">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          one recorded run
        </span>
        <span className="rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          {rec.model} · FRED data · {RECORDED}
        </span>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          <span className="dot-live" />
          building now
        </span>
      </div>

      <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.5fr)] lg:gap-12">
        {/* Caption and controls. Beside the terminal on a wide screen, where the whole column
            stays in view. On a phone the wrapper dissolves and the caption alone is pinned
            under the site header, so it stays readable while the terminal scrolls beneath it. */}
        <div className="contents lg:sticky lg:top-24 lg:flex lg:flex-col lg:self-start">
          <div
            className="sticky top-14 z-10 -mx-6 min-h-[12.5rem] bg-near px-6 pb-3 pt-4 md:-mx-10 md:px-10 lg:static lg:mx-0 lg:min-h-[19rem] lg:p-0"
            aria-live={playing ? "off" : "polite"}
          >
            <p className="t-mono text-white/50">
              {idle ? `${LAST} steps · about 25 seconds` : `Step ${step} of ${LAST}`}
            </p>
            {!idle && (
              <p className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/80 lg:mt-4">
                <span className={`inline-block h-2 w-2 rounded-full ${actor.dot}`} />
                {actor.label}
              </p>
            )}
            <h2 className="mt-2 font-display text-xl leading-tight tracking-tight text-white md:text-2xl lg:mt-3 lg:text-3xl">
              {idle ? INTRO.title : current.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70 lg:mt-3 lg:text-[15px]">
              {idle ? INTRO.text : current.text}
            </p>
          </div>

          <div className="mt-3 flex gap-1.5 lg:mt-6" role="group" aria-label="Steps of the run">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                onClick={() => jump(i + 1)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={!idle && step === i + 1 ? "step" : undefined}
                className="group flex-1 py-2"
              >
                <span
                  className={`block h-1.5 rounded-full transition-colors duration-300 group-hover:bg-white/80 ${
                    idle ? "bg-white/25" : step === i + 1 ? "bg-coral" : step > i + 1 ? "bg-white/55" : "bg-white/15"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6 mt-3 flex flex-wrap items-center gap-2 lg:mb-0 lg:mt-4">
            <button
              onClick={() => (playing ? jump(step) : replay(true))}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
                idle
                  ? "bg-coral text-near hover:bg-coral-soft"
                  : "border border-white/25 text-white hover:border-white/60"
              }`}
            >
              {playing ? "Pause" : idle ? "▶ Play the run" : "Replay"}
            </button>
            <button
              onClick={() => jump(idle ? 1 : step - 1)}
              disabled={!idle && step === 1}
              aria-label="Previous step"
              className="rounded-pill border border-white/25 px-3.5 py-1.5 text-sm text-white transition-colors hover:border-white/60 disabled:opacity-35"
            >
              ←
            </button>
            <button
              onClick={() => jump(idle ? 1 : step + 1)}
              disabled={!idle && step === LAST}
              aria-label="Next step"
              className="rounded-pill border border-white/25 px-3.5 py-1.5 text-sm text-white transition-colors hover:border-white/60 disabled:opacity-35"
            >
              →
            </button>
          </div>
        </div>

        {/* the terminal */}
        <div className="min-w-0 rounded-md border border-white/10 bg-black/35 p-4 font-mono text-[12.5px] leading-6 text-white/85 md:p-6 md:text-[13px]">
          <p ref={at(1)} className={block(1)}>
            <span className="text-coral">›</span> <Typing text={rec.question} shown={step === 1 ? typed : ALL} />
          </p>

          <p ref={at(2)} className={`mt-3 ${block(2)}`}>
            <span className="text-coral">●</span> <span className="font-medium text-white">{rec.tool.label}</span>
          </p>

          <div ref={at(3)} className={block(3)}>
            <p>
              {"  "}
              <span className="text-mint">✓</span> {rec.tool.summary}{" "}
              <span className="text-white/45">· {rec.tool.seconds.toFixed(1)}s</span>
            </p>
            <div className="mt-2 border-l border-white/15 pl-3">
              <p className="font-sans text-[11px] uppercase tracking-wider text-white/40">
                what the model receives (excerpt)
              </p>
              <pre className="mt-1 overflow-x-auto text-[11.5px] leading-5 text-white/50">{`{"as_of":"2026-10-08","curve":[ …
  {"tenor":"2Y","yield_pct":4.75, …}, … {"tenor":"10Y","yield_pct":5.22, …},
  {"tenor":"20Y","yield_pct":5.64, …}, {"tenor":"30Y","yield_pct":5.6, …}],
 "spreads":{"10Y_minus_2Y_bp":{"latest":47,"1 month ago":41,"1 year ago":55},
            "10Y_minus_3M_bp":{"latest":99, …}}}`}</pre>
            </div>
          </div>

          {/* on a phone the chart keeps a readable size and scrolls sideways, as it would in a terminal */}
          <div ref={at(4)} className={`mt-4 overflow-x-auto ${block(4)}`}>
            <div key={run} className={playing && step === 4 ? "wipe" : undefined}>
              <Chart />
            </div>
          </div>

          <p ref={at(5)} className={`mt-4 ${block(5)}`}>
            {rec.answer.map((part) => {
              const shown = step === 5 ? typed - offset : ALL;
              offset += part.text.length;
              const look =
                part.kind === "checked" && checked
                  ? "rounded-xs bg-mint/15 text-mint shadow-[0_0_0_3px_rgba(125,219,163,0.15)]"
                  : part.kind === "bare" && checked
                    ? "underline decoration-white/45 decoration-dotted underline-offset-4"
                    : part.kind === "claim" && step >= 8
                      ? "text-amber underline decoration-amber decoration-wavy underline-offset-4"
                      : "";
              return (
                <span key={offset} className={`transition-colors duration-500 ${look}`}>
                  <Typing text={part.text} shown={shown} />
                </span>
              );
            })}
          </p>

          <p ref={at(6)} className={`mt-3 font-sans text-[13px] leading-snug ${block(6)}`}>
            <span className="text-mint">
              ✓ {rec.checked} of {rec.checked} percentages found in the tool result.
            </span>{" "}
            <span className="text-white/50">
              The {rec.bare} basis-point figures are bare numbers, which the check does not cover. Note added for
              this page: the program prints nothing when every figure passes.
            </span>
          </p>

          <p ref={at(7)} className={`mt-4 text-white/45 ${block(7)}`}>
            {rec.usageLine}
          </p>

          <p ref={at(8)} className={`mt-3 font-sans text-[13px] leading-snug text-amber ${block(8)}`}>
            Not caught: the tool result has the 30Y at 5.60%, below the 20Y at 5.64%, so the curve is not
            positively sloped across all tenors.
          </p>
        </div>
      </div>
    </div>
  );
}
