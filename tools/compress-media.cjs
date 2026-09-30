/**
 * Compress oversized committed media in place.
 *
 * Lighthouse measured ~6 MB of images on the home page. The biggest offenders
 * were adventure photos committed at 16-20 MB each, which are far larger than
 * any viewport needs. These are resized to a sane max width and re-encoded.
 *
 * Run: node tools/compress-media.cjs
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC = path.join(process.cwd(), "public");

/** Max width per folder. Hero-ish backgrounds stay wide; cards do not. */
const MAX_WIDTH = {
  "adventures": 1600,
  "bg": 1600,
  "gallery": 1600,
  "team": 1200,
  "leadership": 1200,
};

// Anything larger than this is worth re-encoding.
const THRESHOLD_BYTES = 400 * 1024;

const kb = (n) => (n / 1024).toFixed(0) + " KB";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

(async () => {
  const files = walk(PUBLIC);
  let before = 0;
  let after = 0;
  let touched = 0;
  const broken = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const size = fs.statSync(file).size;
    before += size;
    if (size < THRESHOLD_BYTES) {
      after += size;
      continue;
    }

    const folder = path.basename(path.dirname(file));
    const maxWidth = MAX_WIDTH[folder] ?? 1600;

    try {
      const buf = await sharp(file, { failOn: "none", limitInputPixels: false })
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true, progressive: true })
        .toBuffer();

      // Only replace if it actually saves meaningful space.
      if (buf.length < size * 0.9) {
        fs.writeFileSync(file, buf);
        touched++;
        after += buf.length;
        console.log(
          `  ${path.relative(process.cwd(), file)}: ${kb(size)} -> ${kb(buf.length)}`,
        );
      } else {
        after += size;
        console.log(
          `  ${path.relative(process.cwd(), file)}: ${kb(size)} (already efficient)`,
        );
      }
    } catch (err) {
      after += size;
      const label = path.relative(process.cwd(), file);
      console.log(`  ${label}: UNPROCESSABLE (${err.message})`);
      broken.push(label);
    }
  }

  console.log("");
  console.log(`images: ${kb(before)} -> ${kb(after)} (${touched} files rewritten)`);

  if (broken.length) {
    console.log("");
    console.log("CORRUPT / UNPROCESSABLE FILES (need replacing):");
    for (const b of broken) console.log("  - " + b);
  }
})();
