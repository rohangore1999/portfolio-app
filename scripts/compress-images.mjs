import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");

// Max dimension (longest side) per top-level image folder.
const MAX_DIM = {
  home: 1920, // hero / LCP
  gallery: 1600,
  blog: 1600,
  work: 1600,
  about: 1600,
  _default: 1600,
};

const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const SKIP_BELOW_BYTES = 150 * 1024; // don't bother with already-small files

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

function maxDimFor(file) {
  const rel = path.relative(IMAGES_DIR, file);
  const top = rel.split(path.sep)[0];
  return MAX_DIM[top] ?? MAX_DIM._default;
}

const fmt = (b) => (b / 1024 / 1024).toFixed(2) + "MB";

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return null;

  const origBytes = fs.statSync(file).size;
  if (origBytes < SKIP_BELOW_BYTES) return null;

  const maxDim = maxDimFor(file);
  const input = fs.readFileSync(file);
  let pipeline = sharp(input, { failOn: "none" }).rotate(); // respect EXIF orientation

  const meta = await sharp(input).metadata();
  const longest = Math.max(meta.width || 0, meta.height || 0);
  if (longest > maxDim) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? maxDim : null,
      height: meta.height > meta.width ? maxDim : null,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({
      quality: PNG_QUALITY,
      compressionLevel: 9,
      palette: true,
      effort: 8,
    });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const output = await pipeline.toBuffer();

  // Only overwrite if we actually saved meaningful space.
  if (output.length < origBytes * 0.95) {
    fs.writeFileSync(file, output);
    return { file, origBytes, newBytes: output.length };
  }
  return { file, origBytes, newBytes: origBytes, skipped: true };
}

async function main() {
  const files = walk(IMAGES_DIR);
  let totalOrig = 0;
  let totalNew = 0;
  const changed = [];

  for (const file of files) {
    try {
      const res = await processFile(file);
      if (!res) continue;
      totalOrig += res.origBytes;
      totalNew += res.newBytes;
      if (!res.skipped) {
        changed.push(res);
        console.log(
          `${path.relative(IMAGES_DIR, res.file)}  ${fmt(res.origBytes)} -> ${fmt(res.newBytes)}`
        );
      }
    } catch (err) {
      console.error(`FAILED ${file}: ${err.message}`);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Files optimized: ${changed.length}`);
  console.log(`Total (candidates): ${fmt(totalOrig)} -> ${fmt(totalNew)}`);
}

main();
