const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "audit-screenshots", "product-rail-layout");
const BASE = "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
];

function measureRail() {
  const wrap = document.querySelector(".mpc-rail-wrap");
  const rail = document.querySelector(".mpc-rail.mpc-rail--carousel");
  const items = Array.from(document.querySelectorAll(".mpc-rail__item"));
  if (!rail || items.length < 2) return null;

  const viewportW = window.innerWidth;
  const wrapRect = wrap?.getBoundingClientRect();
  const railRect = rail.getBoundingClientRect();
  const railStyle = getComputedStyle(rail);
  const wrapStyle = wrap ? getComputedStyle(wrap) : null;
  const card1 = items[0].getBoundingClientRect();
  const card2 = items[1].getBoundingClientRect();
  const card3 = items[2]?.getBoundingClientRect();

  const gap = parseFloat(railStyle.gap) || 0;
  const paddingLeft = wrapStyle ? parseFloat(wrapStyle.paddingLeft) || 0 : 0;
  const paddingRight = wrapStyle ? parseFloat(wrapStyle.paddingRight) || 0 : 0;

  const twoCardsPlusGap = card2.right - card1.left;
  const peekThird = card3 ? Math.max(0, Math.min(card3.width, card3.right - card2.right)) : 0;
  const utilization = (twoCardsPlusGap / viewportW) * 100;

  return {
    viewportW,
    wrapWidth: wrapRect ? Math.round(wrapRect.width * 10) / 10 : null,
    railWidth: Math.round(railRect.width * 10) / 10,
    outerPaddingLeft: paddingLeft,
    outerPaddingRight: paddingRight,
    cardWidth: Math.round(card1.width * 10) / 10,
    card2Width: Math.round(card2.width * 10) / 10,
    gap,
    twoCardsPlusGap: Math.round(twoCardsPlusGap * 10) / 10,
    peekThird: Math.round(peekThird * 10) / 10,
    viewportUtilizationPct: Math.round(utilization * 10) / 10,
    visibleCardsApprox: Math.round(((twoCardsPlusGap + peekThird) / card1.width) * 100) / 100,
  };
}

(async () => {
  const phase = process.argv[2] || "after";
  const outDir = path.join(OUT, phase);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const metrics = [];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(`${BASE}/#discover-products`, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForSelector(".mpc-rail-wrap", { timeout: 30000 }).catch(() => null);
    await page.waitForTimeout(1200);

    const m = await page.evaluate(measureRail);
    metrics.push({ viewport: vp.name, phase, ...m });

    await page.screenshot({
      path: path.join(outDir, `${vp.name}-home-rails.png`),
      fullPage: false,
    });
    console.log(`${phase} ${vp.name}:`, m?.viewportUtilizationPct, "% util");
  }

  fs.writeFileSync(path.join(outDir, "metrics.json"), JSON.stringify(metrics, null, 2));
  await browser.close();
  console.log("Done", outDir);
})();
