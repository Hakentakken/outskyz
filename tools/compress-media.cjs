/**
 * Image integrity check + compression for committed media.
 *
 * WHY THIS EXISTS
 * ---------------
 * A number of photos in `public/resources` were committed as TRUNCATED
 * progressive JPEGs (interrupted transfers). Browsers are lenient and paint
 * the available scans, so the pages looked plausible — but `sharp`/libvips
 * refuses to decode them by default ("premature end of JPEG image"), and
 * `next/image` reacts to an optimisation failure by serving the ORIGINAL file
 * untouched. That is how a `w=750` request ended up transferring ~1.9 MB and
 * wrecking Largest Contentful Paint.
 *
 * Because the files are progressive, every scan is present except the final
 * refinement, so `failOn: "none"` decodes complete, visually correct pixels.
 * Re-encoding therefore REPAIRS the file and shrinks it at the same time.
 *
 * Files are read into a Buffer before being handed to sharp: on Windows,
 * passing a path intermittently fails with `UNKNOWN: unknown error, open ...`
 * when another process holds a read handle.
 *
 * USAGE
 *   node tools/compress-media.cjs          # repair + compress in place
 *   node tools/compress-media.cjs --check  # report only, write nothing
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const PUBLIC = path.join(process.cwd(), "public");
const CHECK_ONLY = process.argv.includes("--check");

/** Max width per folder. Wide backgrounds stay wider than cards. */
const MAX_WIDTH = {
  adventures: 1600,
  bg: 1920,
  gallery: 1600,
  documentry: 1600,
  team: 1200,
  leadership: 1200,
};

/** Anything larger than this is worth re-encoding. */
const THRESHOLD_BYTES = 300 * 1024;

const kb = (n) => (n / 1024).toFixed(0) + " KB";

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/**
 * True when libvips reports the file as damaged. A strict decode is the only
 * reliable test: `metadata()` happily reads the header of a truncated JPEG.
 */
async function isDamaged(buf) {
  try {
    await sharp(buf, { limitInputPixels: false }).resize({ width: 8 }).toBuffer();
    return false;
  } catch {
    return true;
  }
}

(async () => {
  const files = walk(PUBLIC).filter((f) =>
    [".jpg", ".jpeg", ".png"].includes(path.extname(f).toLowerCase()),
  );

  let before = 0;
  let after = 0;
  let rewritten = 0;
  let repaired = 0;
  const damaged = [];
  const stillBroken = [];

  for (const file of files) {
    const label = path.relative(process.cwd(), file);
    const stat = fs.statSync(file);
    before += stat.size;

    let buf;
    try {
      buf = fs.readFileSync(file);
    } catch (err) {
      console.log(`  ${label}: UNREADABLE (${err.message})`);
      after += stat.size;
      stillBroken.push(label);
      continue;
    }

    const broken = await isDamaged(buf);
    if (broken) damaged.push(label);

    const needsResize = stat.size >= THRESHOLD_BYTES;
    if (!broken && !needsResize) {
      after += stat.size;
      continue;
    }
    if (CHECK_ONLY) {
      after += stat.size;
      if (broken) console.log(`  DAMAGED   ${label}  (${kb(stat.size)})`);
      continue;
    }

    const folder = path.basename(path.dirname(file));
    const maxWidth = MAX_WIDTH[folder] ?? 1600;
    const isPng = path.extname(file).toLowerCase() === ".png";

    try {
      let pipeline = sharp(buf, { failOn: "none", limitInputPixels: false })
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true });

      pipeline = isPng
        ? pipeline.png({ compressionLevel: 9, palette: true })
        : pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true });

      const out = await pipeline.toBuffer();

      // Only replace when it genuinely helps, or when the original is damaged.
      if (broken || out.length < stat.size * 0.9) {
        fs.writeFileSync(file, out);
        rewritten++;
        if (broken) repaired++;
        after += out.length;
        console.log(
          `  ${broken ? "REPAIRED" : "SHRUNK  "} ${label}: ${kb(stat.size)} -> ${kb(out.length)}`,
        );
      } else {
        after += stat.size;
      }
    } catch (err) {
      after += stat.size;
      console.log(`  ${label}: UNPROCESSABLE (${err.message})`);
      stillBroken.push(label);
    }
  }

  console.log("");
  if (CHECK_ONLY) {
    console.log(`checked ${files.length} images, ${damaged.length} damaged`);
  } else {
    console.log(
      `images: ${kb(before)} -> ${kb(after)} (${rewritten} rewritten, ${repaired} repaired)`,
    );
  }

  if (damaged.length) {
    console.log("");
    console.log("DAMAGED (truncated) FILES:");
    for (const d of damaged) console.log("  - " + d);
  }
  if (stillBroken.length) {
    console.log("");
    console.log("NOT REPAIRABLE — replace the source file:");
    for (const b of stillBroken) console.log("  - " + b);
  }
})();
