/**
 * Copies the official Y Monogram (logomobile.png) into public browser/PWA icon files.
 * Run: node scripts/sync-brand-icons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "src", "Assests", "Logo", "logomobile.png");
const publicDir = path.join(root, "public");

if (!fs.existsSync(src)) {
  console.error("Source logo not found:", src);
  process.exit(1);
}

const png = fs.readFileSync(src);
const b64 = png.toString("base64");

const pngTargets = [
  "apple-touch-icon.png",
  "favicon-96x96.png",
  "logo192.png",
  "logo512.png",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
];

for (const name of pngTargets) {
  fs.copyFileSync(src, path.join(publicDir, name));
  console.log("Wrote", name);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image href="data:image/png;base64,${b64}" width="512" height="512"/></svg>\n`;
fs.writeFileSync(path.join(publicDir, "favicon.svg"), svg);
console.log("Wrote favicon.svg");

// Minimal single-size ICO (PNG payload) — browsers accept PNG-in-ICO for modern tabs
fs.copyFileSync(src, path.join(publicDir, "favicon.ico"));
console.log("Wrote favicon.ico (PNG copy)");

console.log("Brand icon sync complete.");
