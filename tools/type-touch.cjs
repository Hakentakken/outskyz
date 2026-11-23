/**
 * tools/type-touch.cjs — Phase 6 responsive pass data.
 *
 * Prints (per route × width):
 *   - every h1/h2 size + line-height + whether it overflows horizontally
 *   - every link/button tap rect on mobile widths (flags < 44px targets)
 *
 * Usage: node tools/type-touch.cjs [baseUrl]
 */

const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3111";
const ROUTES = ["/", "/about", "/adventures", "/destinations", "/packages"];
const WIDTHS = [1440, 768, 390];

const PROBE = () => {
  const vw = document.documentElement.clientWidth;
  document.documentElement.style.scrollBehavior = "auto";
  const headings = [...document.querySelectorAll("h1, h2")].map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      size: Math.round(parseFloat(cs.fontSize)),
      lh: Math.round(parseFloat(cs.lineHeight)),
      w: Math.round(r.width),
      over: Math.round(r.right - vw),
      text: (el.textContent || "").trim().slice(0, 44),
    };
  });
  const small = [];
  const tiny = [];
  if (vw <= 768) {
    for (const el of document.querySelectorAll("a, button")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // Not rendered (desktop nav below lg, closed panels, hidden overlays).
      if (el.offsetParent === null && getComputedStyle(el).position !== "fixed")
        continue;
      if (r.width < 24 || r.height < 24) {
        tiny.push({
          tag: el.tagName.toLowerCase(),
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
        });
      } else if (r.width < 44 || r.height < 44) {
        small.push({
          tag: el.tagName.toLowerCase(),
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30),
        });
      }
    }
  }
  return { headings, small: small.slice(0, 14), smallCount: small.length, tiny, tinyCount: tiny.length };
};

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });
  // One shared page: Next cold-boots each route on first hit, so the first
  // request per route needs a longer settle; later routes can be quicker.
  const page = await browser.newPage();
  const seen = new Set();
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
      const key = route;
      const settle = seen.has(key) ? 800 : 2500;
      seen.add(key);
      await new Promise((r) => setTimeout(r, settle));
      const { headings, small, smallCount, tiny, tinyCount } = await page.evaluate(PROBE);
      console.log(`\n=== ${route} @ ${width}`);
      for (const h of headings) {
        console.log(
          `  ${h.tag} ${h.size}px/${h.lh} w${h.w}${h.over > 1 ? "  ** OVER by " + h.over : ""} '${h.text}'`,
        );
      }
      if (width <= 768) {
        console.log(`  touch < 24px (WCAG fail): ${tinyCount}`);
        for (const s of tiny) console.log(`    ${s.tag} ${s.w}x${s.h} '${s.text}'`);
        console.log(`  touch 24-44px (spacing-adjacent inline links): ${smallCount}`);
      }
    }
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
