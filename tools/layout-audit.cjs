/**
 * tools/layout-audit.cjs — geometry watchdog for visual work.
 *
 * Answers the questions a screenshot cannot:
 *   1. Is anything wider than the viewport (horizontal overflow / rogue panel)?
 *   2. Do two sections overlap (sections stacked on top of each other)?
 *   3. Is anything stuck invisible (a reveal that never un-hid)?
 *   4. How tall is each section, so spacing regressions are obvious?
 *
 * Usage: node tools/layout-audit.cjs [baseUrl]
 */

const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.argv[2] || "http://localhost:3111";
const ROUTES = ["/", "/about", "/adventures", "/destinations", "/packages"];
const WIDTHS = [1920, 1440, 1180, 1024, 768, 390];

const AUDIT = () => {
  const vw = document.documentElement.clientWidth;
  // Neutralise reveal transforms before measuring: a `.reveal` that has not
  // entered the viewport yet sits 36px below its layout box, which made a
  // sibling comparison report phantom section overlaps.
  const probe = document.createElement("style");
  probe.textContent =
    "*,*::before,*::after{transform:none!important;transition:none!important;animation:none!important}";
  document.head.appendChild(probe);
  const overflow = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.position === "fixed") continue;
    // 1×1 preload/SEO nodes never move the scrollbar — ignore them.
    if (r.width <= 2 && r.height <= 2) continue;
    if (r.width === 0 && r.height === 0) continue;
    // Elements clipped by an overflow-hidden ancestor cannot scroll the page.
    let clipped = false;
    let node = el.parentElement;
    while (node && node !== document.body) {
      const pcs = getComputedStyle(node);
      if (pcs.overflowX === "hidden" || pcs.overflowX === "clip") {
        clipped = true;
        break;
      }
      node = node.parentElement;
    }
    if (clipped) continue;
    if (r.right > vw + 1 || r.left < -1) {
      overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
      });
    }
  }

  const sections = [...document.querySelectorAll("main > *, main > * > section")]
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 70),
        top: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
        position: cs.position,
        z: cs.zIndex,
      };
    })
    .filter((s) => s.h > 0)
    .sort((a, b) => a.top - b.top);

  const overlaps = [];
  for (let i = 1; i < sections.length; i += 1) {
    const prev = sections[i - 1];
    const cur = sections[i];
    const prevBottom = prev.top + prev.h;
    if (cur.top < prevBottom - 2) {
      overlaps.push({
        a: prev.cls + " [" + prev.top + "+" + prev.h + "]",
        b: cur.cls + " [" + cur.top + "]",
        by: prevBottom - cur.top,
      });
    }
  }

  const invisible = [];
  for (const el of document.querySelectorAll(
    "h1, h2, h3, p, img, li, article, a, button, video",
  )) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.width === 0) continue;
    if (cs.visibility === "hidden") continue;
    // Phantom preload/SEO videos render at 1×1 off-canvas with opacity:0 by
    // design — they are preloading the hero, not stuck reveals.
    if (el.tagName === "VIDEO" && r.width <= 2 && r.height <= 2) continue;
    if (cs.opacity === "0" && el.closest("header, .mega-panel") === null) {
      invisible.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 70),
        text: (el.textContent || "").trim().slice(0, 40),
      });
    }
  }

  const typography = [...document.querySelectorAll("h1, h2, h3")]
    .filter((el) => el.getBoundingClientRect().height > 0)
    .map((el) => {
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        size: Math.round(parseFloat(cs.fontSize)),
        lh: Math.round(parseFloat(cs.lineHeight)),
        family: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
        text: (el.textContent || "").trim().slice(0, 46),
      };
    });

  const rhythm = [...document.querySelectorAll("main > *")].map((el) => {
    const cs = getComputedStyle(el);
    return {
      pt: Math.round(parseFloat(cs.paddingTop)),
      pb: Math.round(parseFloat(cs.paddingBottom)),
      bg: cs.backgroundColor,
      cls: String(el.className).slice(0, 34),
    };
  });

  return {
    docHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: vw,
    overflow: overflow.slice(0, 12),
    overlapCount: overlaps.length,
    overlaps: overlaps.slice(0, 8),
    invisibleCount: invisible.length,
    invisible: invisible.slice(0, 8),
    typography,
    rhythm,
    sections,
  };
};

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--no-sandbox", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log("  !! page error: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.log("  !! console: " + m.text().slice(0, 160));
  });

  for (const width of WIDTHS) {
    await page.setViewport({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
      await new Promise((r) => setTimeout(r, 1800));
      // Walk the page so every reveal has had its chance to fire.
      // scroll-behavior:smooth turns the walk into one long animated glide,
      // so the observer only ever sees the endpoints — pin it to auto first.
      await page.evaluate(async () => {
        document.documentElement.style.scrollBehavior = "auto";
        const step = Math.floor(window.innerHeight * 0.9);
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 250));
        }
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 800));
        window.scrollTo(0, 0);
      });
      await new Promise((r) => setTimeout(r, 400));
      const report = await page.evaluate(AUDIT);
      const over = report.scrollWidth > report.clientWidth + 1;
      console.log(
        "\n=== " +
          route +
          " @ " +
          width +
          "  height=" +
          report.docHeight +
          (over ? "  ** HORIZONTAL OVERFLOW " + report.scrollWidth : "") +
          "  overlaps=" +
          report.overlapCount +
          "  invisible=" +
          report.invisibleCount,
      );
      if (report.overflow.length) {
        console.log("  wide elements:");
        for (const o of report.overflow) {
          console.log(
            "    " + o.tag + " L" + o.left + " R" + o.right + " W" + o.w + " ." + o.cls,
          );
        }
      }
      for (const o of report.overlaps) {
        console.log("  OVERLAP " + o.by + "px  " + o.a + "  ->  " + o.b);
      }
      for (const i of report.invisible) {
        console.log("  HIDDEN  " + i.tag + " ." + i.cls + "  '" + i.text + "'");
      }
      if (width === 1440 && route === "/") {
        console.log("  sections:");
        for (const s of report.sections) {
          console.log(
            "    " + String(s.top).padStart(6) + "  h" + String(s.h).padStart(5) + "  " + s.cls,
          );
        }
      }
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
