const fs = require("fs");

const file = process.argv[2];
const label = process.argv[3] || "run";
const r = JSON.parse(fs.readFileSync(file, "utf8"));

const a = r.audits;
const num = (id) => {
  const v = a[id] && a[id].numericValue;
  return typeof v === "number" ? v : null;
};
const ms = (v) => (v === null ? "n/a" : Math.round(v) + " ms");
const kb = (bytes) => (bytes / 1024).toFixed(0) + " KB";

const cats = r.categories;
const score = (c) => (cats[c] ? Math.round(cats[c].score * 100) : "n/a");

console.log("=== " + label + " ===");
console.log("URL: " + r.finalDisplayedUrl);
console.log(
  "Scores  perf=" + score("performance") +
    "  a11y=" + score("accessibility") +
    "  bp=" + score("best-practices") +
    "  seo=" + score("seo"),
);
console.log("Metrics");
console.log("  LCP          " + ms(num("largest-contentful-paint")));
console.log("  FCP          " + ms(num("first-contentful-paint")));
console.log("  CLS          " + (num("cumulative-layout-shift") ?? 0).toFixed(3));
console.log("  TBT          " + ms(num("total-blocking-time")));
console.log("  INP          " + ms(num("interaction-to-next-paint")));
console.log("  SI           " + ms(num("speed-index")));
console.log("  TTFB         " + ms(num("server-response-time")));

// Payload
const items = a["network-requests"] && a["network-requests"].details
  ? a["network-requests"].details.items
  : [];
const total = items.reduce((s, i) => s + (i.transferSize || 0), 0);
const js = items.filter((i) => (i.resourceType || "") === "Script");
const css = items.filter((i) => (i.resourceType || "") === "Stylesheet");
const img = items.filter((i) => (i.resourceType || "") === "Image");
const vid = items.filter((i) => (i.resourceType || "") === "Media");
const sum = (arr) => arr.reduce((s, i) => s + (i.transferSize || 0), 0);
console.log("Payload (transfer)");
console.log("  total        " + kb(total));
console.log("  js           " + kb(sum(js)) + "  (" + js.length + " files)");
console.log("  css          " + kb(sum(css)) + "  (" + css.length + " files)");
console.log("  images       " + kb(sum(img)) + "  (" + img.length + " files)");
console.log("  video        " + kb(sum(vid)) + "  (" + vid.length + " files)");

// Opportunities
console.log("Top opportunities");
const opp = Object.values(a)
  .filter(
    (x) =>
      x.details &&
      x.details.overallSavingsMs &&
      x.details.overallSavingsMs > 50,
  )
  .sort((x, y) => y.details.overallSavingsMs - x.details.overallSavingsMs)
  .slice(0, 6);
for (const o of opp) {
  console.log(
    "  " + Math.round(o.details.overallSavingsMs) + " ms  " + o.title,
  );
}
