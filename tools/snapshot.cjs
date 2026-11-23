/**
 * tools/snapshot.cjs — visual QA helper.
 *
 * Drives a real Chrome through CDP (puppeteer-core is already a transitive
 * dependency of lighthouse) so visual work can be verified from the terminal
 * instead of by eye only: it writes PNGs to `.snapshots/` AND dumps
 * computed-style diagnostics for the mega-menu, which is the only way to catch
 * things like a Tailwind arbitrary value silently compiling to nothing.
 *
 * Usage:
 *   npm run start -- -p 3111          (or: npx next dev -p 3111)
 *   node tools/snapshot.cjs [baseUrl] [outDir]
 *
 * Override the browser with CHROME_PATH if Chrome is not in the default spot.
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3111";
const OUT = process.argv[3] || path.join(process.cwd(), ".snapshots");

/** Desktop pass: top of page, each menu open, and a few scroll stops. */
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844, isMobile: true, hasTouch: true };

const SCROLL_STOPS = [
  0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
];

/**
 * JPEG, not PNG: a 1440x900 PNG of these gradient-heavy pages is several MB,
 * which is too big to review comfortably. Quality 72 keeps the artefacts out of
 * the way of layout judgement.
 */
/**
 * JPEG, not PNG: a 1440x900 PNG of these gradient-heavy pages is several MB,
 * which is too big to review comfortably. Quality 60 keeps the artefacts out of
 * the way of layout judgement, and `clip` lets a shot cover just the region
 * under review (a cropped frame is far easier to read and to ship around).
 */
async function shade(page, name, clip) {
  const file = path.join(OUT, name + ".jpg");
  await page.screenshot({
    path: file,
    type: "jpeg",
    quality: 60,
    ...(clip ? { clip } : {}),
  });
  console.log("shot  " + name);
}

/** Everything a broken panel hides behind: geometry, stacking and paint. */
async function navDiagnostics(page) {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const out = {
      vars: {
        void: root.getPropertyValue("--color-void").trim(),
        gold: root.getPropertyValue("--color-gold").trim(),
      },
      header: null,
      panels: [],
      triggers: [],
    };
    const header = document.querySelector("header");
    if (header) {
      const cs = getComputedStyle(header);
      out.header = {
        zIndex: cs.zIndex,
        position: cs.position,
        background: cs.backgroundColor,
        rect: header.getBoundingClientRect().toJSON(),
      };
    }
    out.triggers = [...document.querySelectorAll("nav[aria-label='Main'] button")].map(
      (b) => {
        const r = b.getBoundingClientRect();
        return {
          label: b.textContent.trim(),
          open: b.getAttribute("aria-expanded"),
          x: Math.round(r.x),
          w: Math.round(r.width),
        };
      },
    );
    out.panels = [...document.querySelectorAll(".mega-panel")].map((p) => {
      const cs = getComputedStyle(p);
      const box = p.firstElementChild;
      const boxCs = box ? getComputedStyle(box) : null;
      const r = p.getBoundingClientRect();
      return {
        id: p.id.replace("nav-panel-", ""),
        open: p.dataset.open,
        rect: {
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        },
        position: cs.position,
        width: cs.width,
        zIndex: cs.zIndex,
        opacity: cs.opacity,
        visibility: cs.visibility,
        transform: cs.transform,
        boxWidth: box ? Math.round(box.getBoundingClientRect().width) : null,
        boxBackground: boxCs ? boxCs.backgroundColor : null,
      };
    });
    return out;
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: DESKTOP.width, height: DESKTOP.height });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  // Videos stream from a proxy; never wait for the network to go idle.
  await new Promise((r) => setTimeout(r, 2500));

  for (const y of SCROLL_STOPS) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await new Promise((r) => setTimeout(r, 1400));
    await shade(page, "home-" + y);
  }

  // Mega-menu: open every panel that has one, and measure it while open.
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 600));
  const triggers = await page.$$("nav[aria-label='Main'] button");
  for (const trigger of triggers) {
    const label = await trigger.evaluate((el) =>
      el.textContent.trim().replace(/\s+/g, "-").toLowerCase(),
    );
    await trigger.hover();
    await new Promise((r) => setTimeout(r, 900));
    // Cropped to the bar plus its panel: the whole point of these frames is to
    // judge the menu, and a 520px-tall crop stays small enough to review.
    await shade(page, "nav-" + label, {
      x: 0,
      y: 0,
      width: DESKTOP.width,
      height: 520,
    });
    const diag = await navDiagnostics(page);
    console.log("nav   " + label + " " + JSON.stringify(diag.panels.find((p) => p.open === "true")));
  }
  const full = await navDiagnostics(page);
  console.log("--- diagnostics ---");
  console.log(JSON.stringify(full, null, 2));

  // Other routes worth eyeballing.
  for (const route of ["/about", "/adventures", "/destinations", "/packages"]) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2200));
    await shade(page, "route" + route.replace(/\//g, "-"));
  }

  // Mobile: does the header/hero hold up at 390px?
  await page.setViewport(MOBILE);
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2200));
  await shade(page, "mobile-home-top");

  await browser.close();
  console.log("done -> " + OUT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
