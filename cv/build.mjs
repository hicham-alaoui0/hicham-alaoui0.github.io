// Prints the CV with headless Edge or Chrome, in English and French:
//   cv/cv.html    -> public/CV_Hicham_Alaoui.pdf     (preview: cv/cv-preview.png)
//   cv/cv.fr.html -> public/CV_Hicham_Alaoui_FR.pdf  (preview: cv/cv-preview.fr.png)
// Each PDF is written only when it passes every check; otherwise the published file is left untouched. The checks:
//   - the PDF is exactly one A4 page (nothing overflows),
//   - every font loads from cv/fonts and the PDF embeds Inter, Space Grotesk and IBM Plex Mono and nothing else
//     (no fallback fonts, no Type 3 glyph fonts that text extractors and ATS parsers read badly),
//   - no text is set below 9pt and there is no em dash,
//   - every <a href> in the page is a clickable link annotation in the PDF,
//   - the PDF is tagged, so its reading order is explicit.
//
//   node cv/build.mjs                                   (set BROWSER to a Chrome/Edge binary if neither default path exists)
//   node cv/build.mjs --in draft.html --out draft.pdf --png draft.png        (one page of your own)
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { inflateSync } from "node:zlib";

const here = dirname(fileURLToPath(import.meta.url));
const { values: args } = parseArgs({ options: { in: { type: "string" }, out: { type: "string" }, png: { type: "string" } } });
if (args.in && !(args.out && args.png)) throw new Error("--in needs --out and --png");
const documents = args.in
  ? [{ in: resolve(args.in), out: resolve(args.out), png: resolve(args.png) }]
  : [
      { in: "cv.html", out: "../public/CV_Hicham_Alaoui.pdf", png: "cv-preview.png" },
      { in: "cv.fr.html", out: "../public/CV_Hicham_Alaoui_FR.pdf", png: "cv-preview.fr.png" },
    ].map((cv) => ({ in: resolve(here, cv.in), out: resolve(here, cv.out), png: resolve(here, cv.png) }));
const browserPath = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((path) => path && existsSync(path));
if (!browserPath) throw new Error("No Chrome or Edge found: set BROWSER");

const MIN_PT = 9;
const FAMILIES = { Inter: "Inter", SpaceGrotesk: "Space Grotesk", IBMPlexMono: "IBM Plex Mono" };
const A4_HEIGHT_PX = (297 / 25.4) * 96;

// ---- a minimal DevTools Protocol client over Node's built-in WebSocket, so the build needs no npm packages

const profile = mkdtempSync(join(tmpdir(), "cv-build-"));
// Edge's launcher can hand the browser to another process and exit, so read the debugging port from the profile
// (DevToolsActivePort) instead of from the launcher's output, and close the browser over the protocol at the end.
spawn(browserPath, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });
const portFile = join(profile, "DevToolsActivePort");
let endpoint;
for (let tries = 0; !endpoint; tries++) {
  if (tries > 120) throw new Error("the browser did not start");
  const [port, path] = existsSync(portFile) ? readFileSync(portFile, "utf8").split(/\r?\n/) : [];
  if (port && path) endpoint = `ws://127.0.0.1:${port}${path}`;
  else await new Promise((done) => setTimeout(done, 250));
}

const socket = new WebSocket(endpoint);
await new Promise((done) => socket.addEventListener("open", done, { once: true }));
let lastId = 0;
const pending = new Map();
const waiters = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { done, fail } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) fail(new Error(message.error.message));
    else done(message.result);
  } else {
    for (const waiter of waiters.splice(0)) {
      if (waiter.method === message.method) waiter.done(message.params);
      else waiters.push(waiter);
    }
  }
});
const send = (method, params = {}, sessionId) =>
  new Promise((done, fail) => {
    const id = ++lastId;
    pending.set(id, { done, fail });
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
const next = (method) => new Promise((done) => waiters.push({ method, done }));

async function finish(code) {
  await send("Browser.close").catch(() => {});
  socket.close();
  // the browser holds the profile for a moment after it closes
  setTimeout(() => {
    rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    process.exit(code);
  }, 500);
}

/** Prints one CV page and checks it; writes its PDF only when nothing failed. Returns whether it passed. */
async function build(cv, page) {
  const failures = [];
  const fail = (message) => failures.push(message);
  console.log(`\n${cv.in}`);

  const loaded = next("Page.loadEventFired");
  await page("Page.navigate", { url: pathToFileURL(cv.in).href });
  await loaded;

  // ---- checks on the rendered page
  const { result } = await page("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      await document.fonts.ready;
      const faces = [...document.fonts].map((f) => ({ family: f.family.replace(/"/g, ""), weight: f.weight, status: f.status }));
      const small = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.trim();
        if (!text) continue;
        const el = walker.currentNode.parentElement;
        const px = parseFloat(getComputedStyle(el).fontSize);
        if (px * 0.75 < ${MIN_PT} - 0.01) small.push({ text: text.slice(0, 40), pt: +(px * 0.75).toFixed(2) });
      }
      // the lowest line of text plus the bottom margin (full-height backgrounds don't count)
      let bottom = 0;
      const range = document.createRange();
      const lines = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (lines.nextNode()) {
        if (!lines.currentNode.textContent.trim()) continue;
        range.selectNodeContents(lines.currentNode);
        bottom = Math.max(bottom, range.getBoundingClientRect().bottom);
      }
      return {
        faces,
        small,
        emDash: document.body.innerText.includes("\\u2014"),
        hrefs: [...new Set([...document.querySelectorAll("a[href]")].map((a) => a.href))],
        bottom: bottom + parseFloat(getComputedStyle(document.body).paddingBottom),
      };
    })()`,
  });
  const checks = result.value;
  // faces the page never uses stay "unloaded"; "error" means a file is missing or unreadable
  const broken = checks.faces.filter((face) => face.status === "error");
  if (broken.length) fail(`fonts did not load: ${broken.map((f) => `${f.family} ${f.weight} (${f.status})`).join(", ")}`);
  for (const { text, pt } of checks.small) fail(`text below ${MIN_PT}pt (${pt}pt): "${text}"`);
  if (checks.emDash) fail("the text contains an em dash");
  const slack = (A4_HEIGHT_PX - checks.bottom) / (96 / 25.4);

  // ---- the PDF itself
  const { data } = await page("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    generateTaggedPDF: true,
    displayHeaderFooter: false,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });
  const pdf = Buffer.from(data, "base64");

  // read the PDF's dictionaries, including any packed into compressed object streams
  const raw = pdf.toString("latin1");
  let text = raw;
  for (const match of raw.matchAll(/stream\r?\n/g)) {
    const start = match.index + match[0].length;
    const end = raw.indexOf("endstream", start);
    try {
      text += "\n" + inflateSync(pdf.subarray(start, end)).toString("latin1");
    } catch {
      // not a Flate stream (or a font program); dictionaries never live there
    }
  }
  const pages = [...text.matchAll(/\/Type\s*\/Page(?![A-Za-z])/g)].length;
  if (pages !== 1) fail(`the PDF has ${pages} pages, not 1 (the content overflows A4)`);

  const fonts = [...new Set([...text.matchAll(/\/BaseFont\s*\/([^\s/<>\[\]()]+)/g)].map((m) => m[1].replace(/^[A-Z]{6}\+/, "")))];
  if (/\/Subtype\s*\/Type3/.test(text)) fail("the PDF has Type 3 fonts (glyphs drawn as shapes, poor for text extraction)");
  const foreign = fonts.filter((name) => !Object.keys(FAMILIES).some((family) => name.startsWith(family)));
  if (foreign.length) fail(`fallback fonts in the PDF: ${foreign.join(", ")}`);
  for (const [family, label] of Object.entries(FAMILIES))
    if (!fonts.some((name) => name.startsWith(family))) fail(`${label} is not embedded in the PDF`);

  const unescape = (s) => s.replace(/\\([()\\])/g, "$1");
  const uris = new Set([...text.matchAll(/\/URI\s*\((.*?)(?<!\\)\)/g)].map((m) => unescape(m[1])));
  for (const href of checks.hrefs) if (!uris.has(href)) fail(`no clickable link in the PDF for ${href}`);
  if (!/\/StructTreeRoot/.test(text)) fail("the PDF is not tagged (no structure tree for reading order)");

  console.log(`fonts: ${fonts.join(", ")}`);
  console.log(`links: ${[...uris].join(" ")}`);
  console.log(`room left above the bottom margin: ${slack.toFixed(1)} mm`);

  // ---- the preview, at 2x
  const shot = await page("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 794, height: 1123, scale: 1 } });
  writeFileSync(cv.png, Buffer.from(shot.data, "base64"));
  console.log(`preview: ${cv.png}`);

  if (failures.length) {
    for (const message of failures) console.error(`FAIL ${message}`);
    console.error(`${cv.out} was not written`);
    return false;
  }
  writeFileSync(cv.out, pdf);
  console.log(`${cv.out}: 1 page, ${(pdf.length / 1024).toFixed(0)} KB`);
  return true;
}

try {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const page = (method, params) => send(method, params, sessionId);

  await page("Page.enable");
  await page("Emulation.setEmulatedMedia", { media: "print" });
  await page("Emulation.setDeviceMetricsOverride", { width: 794, height: 1123, deviceScaleFactor: 2, mobile: false });
  await page("Emulation.setScrollbarsHidden", { hidden: true });
  let passed = true;
  for (const cv of documents) passed = (await build(cv, page)) && passed;
  finish(passed ? 0 : 1);
} catch (error) {
  console.error(error);
  finish(1);
}
