import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(here, "..", "public", "logo.svg");
const outPath = resolve(here, "..", "icon-source.png");
mkdirSync(dirname(outPath), { recursive: true });

const svg = readFileSync(svgPath);
await sharp(svg, { density: 2048 })
  .resize(1024, 1024)
  .png()
  .toFile(outPath);

console.log("wrote", outPath);
