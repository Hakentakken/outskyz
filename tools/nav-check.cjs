/**
 * tools/nav-check.cjs — behavioural + geometric test for the mega-menu.
 *
 * The menu failures this guards against were all invisible to a static look:
 * a panel that opened and closed itself mid-hover, a panel that opened 162px
 * off the left edge of the viewport, a panel that let the hero photograph read
 * through its background. So this drives a real pointer across the bar and
 * asserts the invariants:
 *
 *   - a sweep across the bar never has two panels open at once;
 *   - each panel opens exactly once per sweep (no open/close chatter);
 *   - a panel stays open while the pointer travels into it;
 *   - it closes once the pointer leaves the nav, and only then;
 *   - a click pins it, an outside click releases it, Escape releases it;
 *   - at every breakpoint the surface is fully on screen, below the bar, and
 *     opaque, and no link row wraps onto a second line.
 *
 * Usage: node tools/nav-check.cjs [baseUrl]
 */

const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3111";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const WIDTHS = [1920, 1440, 1280, 1024];

let failures = 0;
const check = (ok, label, detail) => {
  if (!ok) failures += 1;
  console.log(
    (ok ? "  PASS  " : "  FAIL  ") + label + (detail ? "  -> " + detail : ""),
  );
};

/** Reads the open/closed state of every panel. */
const readPanels = () =>
  [...document.querySelectorAll(".mega-panel")].map((p) => ({
    id: p.id.replace("nav-panel-", ""),
    open: p.dataset.open === "true",
  }));

/** Geometry + paint facts for the surface that is currently open. */
const openSurface = () => {
  const strip = document.querySelector('.mega-panel[data-open="true"]');
  if (!strip) return null;
  const surface = strip.firstElementChild;
  const cs = getComputedStyle(surface);
  const r = surface.getBoundingClientRect();
  const links = [...strip.querySelectorAll(".mega-item a")].map((a) => ({
    text: a.textContent.trim().slice(0, 34),
    h: Math.round(a.getBoundingClientRect().height),
  }));
  return {
    id: strip.id.replace("nav-panel-", ""),
    rect: {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
    },
    opacity: cs.opacity,
    backgroundImage: cs.backgroundImage.slice(0, 40),
    linkRows: links.length,
    wrapped: links.filter((l) => l.h > 44),
  };
};

async function sweep(page, y) {
  const counts = {};
  const simultaneous = [];
  for (let x = 120; x <= 1320; x += 6) {
    await page.mouse.move(x, y);
    await sleep(10);
    const panels = await page.evaluate(readPanels);
    const open = panels.filter((p) => p.open);
    if (open.length > 1) simultaneous.push(x);
    if (open.length === 1) counts[open[0].id] = (counts[open[0].id] ?? 0) + 1;
  }
  return { counts, simultaneous };
}


async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on("pageerror", (e) => check(false, "page error", e.message));
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await sleep(2000);

  console.log("\n=== interaction (1440x900) ===");
  const row = await page.evaluate(() => {
    const btn = document.querySelector('nav[aria-label="Main"] button');
    const r = btn.getBoundingClientRect();
    return { y: Math.round(r.y + r.height / 2) };
  });

  const { counts, simultaneous } = await sweep(page, row.y);
  check(
    simultaneous.length === 0,
    "never two panels open at once",
    simultaneous.length ? "at x=" + simultaneous.slice(0, 4).join(",") : "",
  );
  const swept = Object.keys(counts);
  check(
    swept.length >= 3,
    "each mega item opened during the sweep",
    swept.join(", "),
  );

  // Travel from a trigger down into its own panel: it must stay open.
  await page.mouse.move(424, row.y, { steps: 6 });
  await sleep(250);
  const rect = await page.evaluate(() => {
    const s = document.querySelector(
      '.mega-panel[data-open="true"] .mega-surface',
    );
    const r = s.getBoundingClientRect();
    return {
      x: Math.round(r.x + r.width / 2),
      y: Math.round(r.y + 40),
      id: document
        .querySelector('.mega-panel[data-open="true"]')
        .id.replace("nav-panel-", ""),
    };
  });
  await page.mouse.move(rect.x, rect.y - 12, { steps: 6 });
  await page.mouse.move(rect.x, rect.y, { steps: 4 });
  await sleep(600);
  let open = await page.evaluate(readPanels);
  check(
    open.find((p) => p.id === rect.id)?.open === true,
    "panel stays open while the pointer is inside it",
    rect.id + " at y=" + rect.y,
  );

  // Leave the nav entirely: it must close.
  await page.mouse.move(60, 700, { steps: 10 });
  await sleep(600);
  open = await page.evaluate(readPanels);
  check(open.every((p) => !p.open), "closes after the pointer leaves the nav");

  // Click-to-pin, then an outside click to release. The trigger is located by
  // its own box rather than by a guessed x: the nav re-centres with the logo
  // and the action cluster, so a hard-coded coordinate can land on empty bar.
  const pinTarget = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('nav[aria-label="Main"] button')].find(
      (b) => b.textContent.trim().startsWith("Company"),
    );
    const r = btn.getBoundingClientRect();
    return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
  });
  await page.mouse.move(pinTarget.x, pinTarget.y, { steps: 8 });
  await sleep(250);
  await page.mouse.down();
  await page.mouse.up();
  await page.mouse.move(60, 700, { steps: 10 });
  await sleep(600);
  open = await page.evaluate(readPanels);
  check(
    open.filter((p) => p.open).length === 1,
    "click pins the panel",
    open.filter((p) => p.open).map((p) => p.id).join(",") || "none open",
  );
  await page.mouse.down();
  await page.mouse.up();
  await sleep(400);
  open = await page.evaluate(readPanels);
  check(open.every((p) => !p.open), "outside click dismisses the pinned panel");

  // Keyboard: focus opens, Escape closes.
  await page.focus('[aria-controls="nav-panel-company"]');
  await sleep(400);
  open = await page.evaluate(readPanels);
  check(
    open.find((p) => p.id === "company")?.open === true,
    "focus opens the panel",
  );
  await page.keyboard.press("Escape");
  await sleep(400);
  open = await page.evaluate(readPanels);
  check(open.every((p) => !p.open), "Escape closes the panel");

  console.log("\n=== geometry per breakpoint ===");
  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await sleep(1500);
    const triggers = await page.$$("nav[aria-label='Main'] button");
    for (const trigger of triggers) {
      const label = await trigger.evaluate((el) =>
        el.textContent.trim().replace(/\s+/g, "-").toLowerCase(),
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      await trigger.hover();
      await sleep(700);
      const s = await page.evaluate(openSurface);
      if (!s) {
        check(false, width + " " + label + " opened");
        continue;
      }
      const inside = s.rect.x >= 0 && s.rect.x + s.rect.w <= width;
      check(
        inside,
        width + " " + label + " surface fully on screen",
        JSON.stringify(s.rect),
      );
      check(
        s.rect.y >= 60,
        width + " " + label + " surface sits below the bar",
        "y=" + s.rect.y,
      );
      check(s.opacity === "1", width + " " + label + " surface is opaque");
      check(
        s.backgroundImage.includes("linear-gradient"),
        width + " " + label + " surface has a painted background",
      );
      check(
        s.wrapped.length === 0,
        width + " " + label + " link rows stay on one line",
        s.wrapped.map((w) => w.text + " (" + w.h + "px)").join(" | "),
      );
    }
  }

  console.log("\n=== mobile menu (390x844) ===");
  await page.setViewport({
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await sleep(1500);
  await page.click('[aria-controls="mobile-menu"]');
  await sleep(700);
  const menuState = await page.evaluate(() => {
    const overlay = document.querySelector("#mobile-menu [role='dialog']");
    if (!overlay) return null;
    const cs = getComputedStyle(overlay);
    const r = overlay.getBoundingClientRect();
    return {
      opacity: cs.opacity,
      w: Math.round(r.width),
      h: Math.round(r.height),
      bodyOverflow: document.body.style.overflow,
      links: overlay.querySelectorAll("a").length,
      docOverflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    };
  });
  check(Boolean(menuState), "mobile overlay opens");
  if (menuState) {
    check(
      menuState.opacity === "1" && menuState.w >= 380 && menuState.h >= 700,
      "overlay covers the viewport",
      JSON.stringify(menuState),
    );
    check(menuState.bodyOverflow === "hidden", "background scroll is locked");
    check(menuState.links > 4, "overlay lists the site links");
    check(
      menuState.docOverflow <= 1,
      "no horizontal overflow while open",
      "overflow=" + menuState.docOverflow,
    );
  }
  await page.click('#mobile-menu [role="dialog"] button[aria-label="Close menu"]');
  await sleep(800);
  check(
    await page.evaluate(
      () => document.querySelector("#mobile-menu [role='dialog']") === null,
    ),
    "close button removes the overlay",
  );
  check(
    await page.evaluate(() => document.body.style.overflow !== "hidden"),
    "background scroll restored on close",
  );

  await browser.close();
  console.log(
    "\n" +
      (failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"),
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
