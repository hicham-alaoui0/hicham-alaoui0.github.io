/** The parts of the AgentDeck case study that the generic template has no slot for. */

const RULES = [
  {
    title: "It may never block an agent",
    text: "If AgentDeck is closed, crashed or slow, Claude Code and Codex behave as if it was never installed. A request nobody answers goes back to the terminal after 9 minutes.",
  },
  {
    title: "Agents cannot approve themselves",
    text: "Two keys. The one on disk, which an agent's hooks use, can only ask. The one that answers lives in the app's memory, so nothing an agent can read is able to say yes.",
  },
  {
    title: "Nothing leaves the PC unless you switch it on",
    text: "No telemetry and no account. The phone's relay is off by default, and when it is on it carries frames sealed between the phone and the PC that it cannot read.",
  },
];

/** One real bug, in the order it was worked. Nothing here is tidied up after the fact. */
const BUG = [
  {
    step: "The symptom",
    text: "A request showed up in the phone app the moment I opened it. On a locked phone, no notification ever came.",
  },
  {
    step: "Stop guessing",
    text: "The path has four parts: PC, relay, Google's push service, phone. I made the relay log one plain line per outcome. The first one read: this phone hasn't registered for notifications. So the PC and the relay were fine.",
  },
  {
    step: "Reproduce it somewhere I can see",
    text: "On an Android emulator the same build registered and showed the notification. The code worked. Something about my phone did not.",
  },
  {
    step: "Put the reason on the screen",
    text: "The app swallowed the error, so I added a Notifications line to its settings that says On, or the exact reason it is not. On my phone it said MISSING_INSTANCEID_SERVICE. It is a Huawei: no Google Play services, so Google's push can never reach it.",
  },
  {
    step: "The fix is a second way in",
    text: "On phones without Google, the app now keeps one quiet connection to the relay and shows the notification itself. Phones with Google keep using Google's push. I tested it on the emulator with Google services switched off, then on the Huawei.",
  },
  {
    step: "And the bug behind the bug",
    text: "The new settings line said Connecting forever while notifications arrived. Commands sent from the page to the Android side are looked up in camelCase, and mine were snake_case, so four of them had never run. That included the one that asks Android for permission to notify.",
  },
];

const OPEN = [
  "It is a public beta. I use it myself, but I have no usage numbers, because it collects none.",
  "The installer is not code-signed yet, so Windows shows a warning before it runs.",
  "Windows only on the PC side, Android only on the phone. The iPhone app is not built.",
  "The relay is one Cloudflare Worker on my own account. It has had one user's traffic, not load.",
];

/** For engineers, low on the page: how the parts fit. */
export function AgentDeckUnderTheHood() {
  return (
    <section className="mt-16">
      <h2 className="t-mono text-slate">Under the hood</h2>
      <figure className="mt-5">
        <div className="overflow-x-auto rounded-lg bg-stone p-4 md:p-6 xl:-mx-[100px] xl:p-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/diagrams/agentdeck-architecture.svg"
            alt="AgentDeck architecture: Claude Code and Codex send permission requests through their hooks to a local Rust core, which also reads their session files. The core serves the island and window on the PC, a listener for the phone on Wi-Fi, and an opt-in relay client. Outside the PC, a Cloudflare Worker passes sealed frames to the Android app and cannot read them."
            className="w-full min-w-[700px] rounded-sm"
          />
        </div>
        <figcaption className="mt-4 text-sm leading-relaxed text-slate">
          One Rust core holds every session and every pending request. The island, the phone on Wi-Fi and the relay
          are three doors to the same core, and the phone speaks one sealed protocol through both of its doors. The
          Android app reuses the React screens of the PC app.
        </figcaption>
      </figure>
    </section>
  );
}

export default function AgentDeckNotes() {
  return (
    <>
      <section className="mt-16">
        <h2 className="t-mono text-slate">Three rules I did not let myself break</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {RULES.map((r) => (
            <div key={r.title} className="card-stone p-6">
              <p className="t-feature text-ink">{r.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="t-mono text-slate">One bug, start to finish</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-slate">
          Notifications worked on the test phone and not on mine. This is how that went, working with Claude Code,
          including the part where the first guess was wrong.
        </p>
        <ol className="mt-6 border-t border-line">
          {BUG.map((b, i) => (
            <li key={b.step} className="flex gap-5 border-b border-line py-4 text-[15px] leading-relaxed text-slate">
              <span className="font-mono text-xs text-coral">0{i + 1}</span>
              <span>
                <span className="font-medium text-ink">{b.step}.</span> {b.text}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted">
          The first guess was timing: that the notification had been sent while the app was still open. The relay's
          log line ruled that out in one test.
        </p>
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
          Next on the list: Allow and Deny inside the notification itself, and telling an already-paired phone about
          the relay so that turning it on later needs no second scan.
        </p>
      </section>
    </>
  );
}
