"use client";

/**
 * A sketch of AgentDeck you can click: three requests arrive from two agents, and the visitor
 * answers them on the island or on the phone. It is not the real app (that one is a Windows
 * program), but every rule shown here is the real one: the hold for risky requests, the
 * built-in rule that stops a force-push, the flag on a risky request allowed in under two
 * seconds, and what happens when AgentDeck is not running.
 */
import { useEffect, useRef, useState } from "react";

type Risk = "medium" | "high" | "critical";
type Ask = { agent: string; tool: string; buddy: string; cmd: string; why: string; risk: Risk; rule?: boolean };

const ASKS: Ask[] = [
  { agent: "webshop", tool: "Claude Code", buddy: "#ff9f80", cmd: "npm test", why: "Runs npm test", risk: "medium" },
  { agent: "api", tool: "Codex", buddy: "#7dd3fc", cmd: "npm publish", why: "Publishes a package publicly", risk: "high" },
  {
    agent: "webshop",
    tool: "Claude Code",
    buddy: "#ff9f80",
    cmd: "git push --force origin main",
    why: "Rewrites history on main",
    risk: "critical",
    rule: true,
  },
];
const DONE = ASKS.length;
/** How long Allow must be held for a high-risk request, as in the app. */
const HOLD_MS = 800;
/** A risky request allowed faster than this is flagged in History, as in the app. */
const HASTY_MS = 2000;

type From = "island" | "phone" | "terminal" | "rule";
type Line = { text: string; tone?: "dim" | "ask" | "ok" | "no" };
type Row = { outcome: "Allowed" | "Denied"; cmd: string; risk: Risk; who: string; waited: string; hasty: boolean };

const CAPTIONS = [
  {
    who: "You decide",
    title: "An agent needs a yes",
    text: "Claude Code wants to run a command. Without AgentDeck, that question waits in whichever terminal tab asked it. Here it drops from the island at the top of the screen. Answer it there, or on the phone.",
  },
  {
    who: "You decide, deliberately",
    title: "Risky requests take a hold",
    text: "Publishing a package is rated high risk, and the card says why. Allow has to be held for 0.8 seconds, so a reflex click cannot approve it. Allow it in under two seconds anyway and History flags it.",
  },
  {
    who: "A rule decides",
    title: "Some requests never reach you",
    text: "A force-push to main is stopped by a built-in rule. The agent is told no, nothing interrupts you, and History records that a rule made the call.",
  },
  {
    who: "On the record",
    title: "Every decision is kept",
    text: "What was asked, how risky it was, who answered, from where, and how long it waited. The history stays on the PC for 90 days and is never sent anywhere.",
  },
];
const OFF = {
  who: "The agent, as before",
  title: "If it is not running, nothing changes",
  text: "Quit AgentDeck and the agent asks in its own terminal, exactly as if AgentDeck had never been installed. Nothing it adds is allowed to block an agent. That one rule shaped the whole design.",
};

function Buddy({ color, size = 22, waiting = false }: { color: string; size?: number; waiting?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden className="shrink-0">
      <rect x="2" y="3" width="18" height="17" rx="7" fill={color} />
      <circle cx="8" cy="11" r={waiting ? 2 : 1.6} fill="#17171c" />
      <circle cx="14" cy="11" r={waiting ? 2 : 1.6} fill="#17171c" />
    </svg>
  );
}

const RISK: Record<Risk, { label: string; className: string }> = {
  medium: { label: "Medium risk", className: "bg-white/10 text-white/75" },
  high: { label: "High risk", className: "bg-coral/20 text-coral-soft" },
  critical: { label: "Critical", className: "bg-coral text-near" },
};

/** Allow, or for a risky request a button that only acts after being held. */
function AllowButton({ hold, onDone, small = false }: { hold: boolean; onDone: () => void; small?: boolean }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number>(0);
  const cancel = () => {
    window.clearTimeout(timer.current);
    setHolding(false);
  };
  const start = () => {
    window.clearTimeout(timer.current);
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      onDone();
    }, HOLD_MS);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const size = small ? "h-8 text-[12px]" : "h-9 text-[13px]";

  if (!hold) {
    return (
      <button onClick={onDone} className={`${size} flex-1 rounded-sm bg-white font-medium text-near transition-colors hover:bg-white/85`}>
        Allow
      </button>
    );
  }
  const key = (k: string) => k === "Enter" || k === " ";
  return (
    <button
      onPointerDown={(e) => e.button === 0 && start()}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => {
        if (!key(e.key)) return;
        e.preventDefault();
        if (!e.repeat) start();
      }}
      onKeyUp={(e) => key(e.key) && cancel()}
      onContextMenu={(e) => e.preventDefault()}
      title="Risky request: hold to allow"
      className={`${size} relative flex-1 touch-none select-none overflow-hidden rounded-sm border border-white/70 font-medium transition-colors ${
        holding ? "text-near" : "text-white"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left bg-white"
        style={{ transform: `scaleX(${holding ? 1 : 0})`, transition: holding ? `transform ${HOLD_MS}ms linear` : "none" }}
      />
      <span className="relative">{holding ? "Keep holding…" : small ? "Hold" : "Hold to allow"}</span>
    </button>
  );
}

export default function AgentDeckDemo() {
  const [phase, setPhase] = useState(0); // which request is up; DONE when all three are answered
  const [answered, setAnswered] = useState(false); // the current request has its answer; the next is on its way
  const [running, setRunning] = useState(true); // AgentDeck itself: quit it to see the fail-safe
  const [log, setLog] = useState<Line[]>([]);
  const [history, setHistory] = useState<Row[]>([]);
  const [now, setNow] = useState(0);
  const since = useRef(0);
  const announced = useRef<number | null>(null); // the request already written to the terminal
  const next = useRef(0); // the timer that brings the next request

  const ask = phase < DONE ? ASKS[phase] : null;
  const pending = !!ask && !answered;

  // A request arrives: the agent says what it wants, and the clock starts.
  useEffect(() => {
    if (!ask || announced.current === phase) return;
    announced.current = phase;
    since.current = Date.now();
    setNow(Date.now());
    setAnswered(false);
    setLog((l) => [
      ...l.slice(-5),
      { text: `${ask.agent} › ${ask.tool.toLowerCase()}`, tone: "dim" },
      { text: `● wants to run  ${ask.cmd}`, tone: "ask" },
    ]);
  }, [phase]);

  useEffect(() => {
    if (!pending) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [pending]);

  const answer = (allow: boolean, from: From) => {
    if (!ask || answered) return;
    const ms = Date.now() - since.current;
    const waited = `${(ms / 1000).toFixed(1)}s`;
    setAnswered(true);
    const where =
      from === "rule" ? "by a built-in rule, no question asked" : from === "terminal" ? "in the terminal" : `from the ${from} after ${waited}`;
    setLog((l) => [
      ...l,
      { text: `  ${allow ? "✓ allowed" : "✗ denied"} ${where}`, tone: allow ? "ok" : "no" },
      { text: allow ? `● running ${ask.cmd}…` : "● the agent looks for another way", tone: "dim" },
    ]);
    // AgentDeck records what it saw. When it is not running, it saw nothing.
    if (from !== "terminal") {
      setHistory((h) => [
        ...h,
        {
          outcome: allow ? "Allowed" : "Denied",
          cmd: ask.cmd,
          risk: ask.risk,
          who: from === "rule" ? "rule · built-in" : `you · ${from}`,
          waited: from === "rule" ? "0.0s" : waited,
          hasty: allow && ask.risk !== "medium" && ms < HASTY_MS,
        },
      ]);
    }
    next.current = window.setTimeout(() => setPhase((p) => p + 1), 1700);
  };
  useEffect(() => () => window.clearTimeout(next.current), []);

  // The built-in rule answers by itself, as long as AgentDeck is there to apply it.
  useEffect(() => {
    if (!pending || !ask?.rule || !running) return;
    const id = window.setTimeout(() => answer(false, "rule"), 1400);
    return () => window.clearTimeout(id);
  }, [pending, running, phase]);

  const restart = () => {
    window.clearTimeout(next.current);
    announced.current = null;
    setLog([]);
    setHistory([]);
    setAnswered(false);
    setPhase((p) => (p === 0 ? -1 : 0));
  };
  // Restarting while already on the first request still has to announce it again.
  useEffect(() => {
    if (phase === -1) setPhase(0);
  }, [phase]);

  const caption = !running && pending ? OFF : CAPTIONS[Math.min(Math.max(phase, 0), DONE)];
  const waiting = pending ? Math.max(0, Math.round((now - since.current) / 1000)) : 0;
  const onDeck = running && pending && !ask?.rule; // a question for you, on the island and the phone

  return (
    <div className="rounded-lg bg-near p-6 text-white md:p-10">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-pill bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          a sketch you can click
        </span>
        <span className="rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          the real one is a Windows app
        </span>
        <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
          shipped · public beta
        </span>
      </div>

      <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.5fr)] lg:gap-12">
        {/* caption and controls */}
        <div className="flex flex-col">
          <div className="min-h-[13.5rem] lg:min-h-[19rem]" aria-live="polite">
            <p className="t-mono text-white/50">
              {phase >= DONE ? "3 requests answered" : `Request ${Math.max(phase, 0) + 1} of ${DONE}`}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/80 lg:mt-4">
              <span className={`inline-block h-2 w-2 rounded-full ${!running && pending ? "bg-amber" : "bg-coral"}`} />
              {caption.who}
            </p>
            <h2 className="mt-2 font-display text-xl leading-tight tracking-tight text-white md:text-2xl lg:mt-3 lg:text-3xl">
              {caption.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70 lg:mt-3 lg:text-[15px]">{caption.text}</p>
          </div>

          <div className="mb-6 mt-4 flex flex-wrap items-center gap-2 lg:mb-0">
            <button
              role="switch"
              aria-checked={running}
              onClick={() => setRunning((r) => !r)}
              className="inline-flex items-center gap-2.5 rounded-pill border border-white/25 py-1.5 pl-2 pr-4 text-sm text-white transition-colors hover:border-white/60"
            >
              <span className={`relative h-5 w-9 rounded-full transition-colors ${running ? "bg-mint" : "bg-white/25"}`}>
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-near transition-[left] duration-200 ${running ? "left-[18px]" : "left-0.5"}`}
                />
              </span>
              {running ? "AgentDeck is running" : "AgentDeck is quit"}
            </button>
            <button
              onClick={restart}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
                phase >= DONE ? "bg-coral text-near hover:bg-coral-soft" : "border border-white/25 text-white hover:border-white/60"
              }`}
            >
              {phase >= DONE ? "Run it again" : "Restart"}
            </button>
          </div>
        </div>

        {/* the desk: a PC screen with the island and a terminal, and the phone beside it */}
        <div className="min-w-0 rounded-md border border-white/10 bg-black/35 p-4 md:p-6">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_168px]">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Your PC</p>
              <div className="mt-2 flex min-h-[21rem] flex-col rounded-md border border-white/10 bg-[#0c0c0f] p-3">
                {/* the island */}
                <div className="mx-auto w-full max-w-[19rem]">
                  {running ? (
                    <div
                      className={`overflow-hidden border border-white/15 bg-black transition-[border-radius] duration-300 ${
                        onDeck ? "rounded-[18px]" : "rounded-[22px]"
                      }`}
                    >
                      <div className="flex h-9 items-center gap-2 px-3">
                        <Buddy color="#ff9f80" size={18} waiting={onDeck && ask?.buddy === "#ff9f80"} />
                        <Buddy color="#7dd3fc" size={18} waiting={onDeck && ask?.buddy === "#7dd3fc"} />
                        <span className={`ml-1 text-[12.5px] font-medium ${onDeck ? "text-amber" : "text-white/80"}`}>
                          {onDeck ? "1 needs you" : phase >= DONE ? "All quiet" : "2 working"}
                        </span>
                        <span className={`ml-auto h-1.5 w-1.5 rounded-full ${onDeck ? "bg-amber" : "bg-mint"}`} />
                      </div>
                      {onDeck && ask && (
                        <div className="border-t border-white/10 p-3">
                          <p className="text-[12.5px] text-white/60">
                            <span className="font-medium text-white">{ask.agent}</span> wants to run a command
                          </p>
                          <p className="mt-2 flex flex-wrap items-center gap-2 text-[11.5px] text-white/60">
                            <span className={`rounded-xs px-1.5 py-0.5 font-medium ${RISK[ask.risk].className}`}>{RISK[ask.risk].label}</span>
                            {ask.why}
                          </p>
                          <code className="mt-2 block rounded-xs bg-white/[0.07] px-2.5 py-1.5 font-mono text-[12px] text-white/90">
                            {ask.cmd}
                          </code>
                          <p className="mt-2 font-mono text-[10.5px] text-white/40">
                            {ask.tool} · waiting {waiting}s
                          </p>
                          <div className="mt-2.5 flex gap-2">
                            <button
                              onClick={() => answer(false, "island")}
                              className="h-9 flex-1 rounded-sm bg-white/10 text-[13px] font-medium text-coral-soft transition-colors hover:bg-white/15"
                            >
                              Deny
                            </button>
                            <AllowButton key={phase} hold={ask.risk === "high"} onDone={() => answer(true, "island")} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="rounded-[22px] border border-dashed border-white/15 px-3 py-2 text-center text-[12px] text-white/40">
                      no island: AgentDeck is not running
                    </p>
                  )}
                </div>

                {/* the agents' terminal */}
                <div className="mt-auto pt-4 font-mono text-[11.5px] leading-[1.7] md:text-[12px]">
                  {log.map((l, i) => (
                    <p
                      key={`${i}-${l.text}`}
                      className={`whitespace-pre-wrap break-words ${
                        l.tone === "dim" ? "text-white/40" : l.tone === "ok" ? "text-mint" : l.tone === "no" ? "text-amber" : "text-white/85"
                      }`}
                    >
                      {l.text}
                    </p>
                  ))}
                  {/* with AgentDeck quit, the agent's own prompt is all there is */}
                  {!running && pending && ask && (
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-white">
                      <span>  allow? </span>
                      <button
                        onClick={() => answer(true, "terminal")}
                        className="rounded-xs border border-white/40 px-2 leading-5 transition-colors hover:border-white"
                      >
                        y
                      </button>
                      <button
                        onClick={() => answer(false, "terminal")}
                        className="rounded-xs border border-white/40 px-2 leading-5 transition-colors hover:border-white"
                      >
                        n
                      </button>
                    </p>
                  )}
                  {phase >= DONE && <p className="text-white/40">● both agents are back at work</p>}
                </div>
              </div>
            </div>

            {/* the phone */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Your phone</p>
              <div className="mx-auto mt-2 flex min-h-[21rem] max-w-[168px] flex-col rounded-[26px] border border-white/20 bg-black p-2.5">
                <p className="flex items-center gap-1.5 px-1 pt-1 text-[10.5px] text-white/60">
                  <span className={`h-1.5 w-1.5 rounded-full ${running ? "bg-mint" : "bg-coral"}`} />
                  {running ? "My PC" : "Can't reach your PC"}
                </p>
                {onDeck && ask ? (
                  <>
                    <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                      <Buddy color={ask.buddy} size={46} waiting />
                      <p className="mt-1 text-[12.5px] font-medium">{ask.agent}</p>
                      <p className="text-[10px] text-white/50">{ask.tool}</p>
                    </div>
                    <div className="rounded-md border border-white/10 bg-white/[0.06] p-2.5">
                      <p className="text-[12px] font-medium leading-snug">Can I run a command?</p>
                      <code className="mt-1.5 block break-all rounded-xs bg-black px-2 py-1 font-mono text-[10.5px] text-white/85">
                        {ask.cmd}
                      </code>
                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => answer(false, "phone")}
                          className="h-8 flex-1 rounded-sm bg-white/10 text-[12px] font-medium text-coral-soft transition-colors hover:bg-white/15"
                        >
                          Deny
                        </button>
                        <AllowButton key={phase} small hold={ask.risk === "high"} onDone={() => answer(true, "phone")} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                    <Buddy color={running ? "#6ee7b7" : "#5f5f70"} size={46} />
                    <p className="text-[12px] text-white/60">
                      {!running ? "Is AgentDeck running?" : phase >= DONE ? "All clear" : "Nothing needs you"}
                    </p>
                  </div>
                )}
                <div className="mt-2 flex justify-around px-3 pb-1" aria-hidden>
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`h-1 w-4 rounded-full ${i === 0 ? "bg-white" : "bg-white/20"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* History, as the app keeps it */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">History</p>
            {history.length === 0 ? (
              <p className="mt-2 text-[12.5px] text-white/40">
                {running ? "Nothing yet. Answer the request above." : "AgentDeck records what it sees. Quit, it sees nothing."}
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {history.map((r, i) => (
                  <li key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                    <span className={`w-14 font-medium ${r.outcome === "Allowed" ? "text-mint" : "text-coral-soft"}`}>{r.outcome}</span>
                    <code className="font-mono text-[11.5px] text-white/85">{r.cmd}</code>
                    <span className={`rounded-xs px-1.5 py-0.5 text-[10.5px] font-medium ${RISK[r.risk].className}`}>{RISK[r.risk].label}</span>
                    <span className="ml-auto font-mono text-[11px] text-white/50">
                      {r.who} · {r.waited}
                      {r.hasty && (
                        <span className="ml-1.5 text-amber" title="A risky request allowed in under 2 seconds">
                          ⚑ fast
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
