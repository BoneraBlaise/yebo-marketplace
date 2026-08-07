const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "audit-screenshots", "product-image-rendering");
const BEFORE = path.join(OUT, "before-refinement");
const BASE = "http://localhost:3000";

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "mobile-390", width: 390, height: 844 },
];

const PAGES = [
  { slug: "home-rails", path: "/#discover-products", fullPage: false },
  { slug: "products-grid", path: "/products", fullPage: true },
  { slug: "best-selling", path: "/best-selling", fullPage: true },
  { slug: "search", path: "/search?q=phone", fullPage: true },
];

const FIT_AUDIT = [];
const FILL_METRICS = [];

function measurePackshotFill() {
  const results = [];
  document.querySelectorAll(".ypc__media--packshot .ypc__img--contain").forEach((img) => {
    const media = img.closest(".ypc__media");
    const link = img.closest(".ypc__media-link");
    if (!media || !link) return;

    const mediaRect = media.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    if (mediaRect.width < 1 || mediaRect.height < 1) return;

    const innerAreaPct = ((linkRect.width * linkRect.height) / (mediaRect.width * mediaRect.height)) * 100;
    const imgBoxPct = ((imgRect.width * imgRect.height) / (mediaRect.width * mediaRect.height)) * 100;
    const style = getComputedStyle(img);
    const scale = style.transform === "none" ? 1 : null;

    results.push({
      alt: img.getAttribute("alt") || "",
      innerAreaPct: Math.round(innerAreaPct * 10) / 10,
      imgBoxPct: Math.round(imgBoxPct * 10) / 10,
      objectFit: style.objectFit,
      paddingTop: getComputedStyle(link).paddingTop,
      estimatedVisiblePct: Math.round(Math.min(innerAreaPct, imgBoxPct) * 10) / 10,
    });
  });
  return results.slice(0, 8);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(BEFORE, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const target of PAGES) {
      await page.goto(`${BASE}${target.path}`, { waitUntil: "networkidle", timeout: 90000 });
      await page.waitForSelector(".ypc--marketplace", { timeout: 30000 }).catch(() => null);
      await page.waitForTimeout(1500);

      if (target.slug === "home-rails") {
        await page.evaluate(() => {
          const el = document.getElementById("discover-products");
          if (el) el.scrollIntoView({ block: "start" });
        });
        await page.waitForTimeout(800);
      }

      const cards = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll(".ypc--marketplace .ypc__img"));
        return imgs.slice(0, 12).map((img) => ({
          alt: img.getAttribute("alt") || "",
          contain: img.classList.contains("ypc__img--contain"),
          cover: img.classList.contains("ypc__img--cover"),
          packshot: img.closest(".ypc__media--packshot") !== null,
          lifestyle: img.closest(".ypc__media--lifestyle") !== null,
          objectFit: getComputedStyle(img).objectFit,
        }));
      });

      const fill = await page.evaluate(measurePackshotFill);

      FIT_AUDIT.push({ viewport: vp.name, page: target.slug, cards });
      FILL_METRICS.push({
        viewport: vp.name,
        page: target.slug,
        packshots: fill,
        avgInnerAreaPct: fill.length
          ? Math.round((fill.reduce((s, f) => s + f.innerAreaPct, 0) / fill.length) * 10) / 10
          : null,
        avgImgBoxPct: fill.length
          ? Math.round((fill.reduce((s, f) => s + f.imgBoxPct, 0) / fill.length) * 10) / 10
          : null,
      });

      await page.screenshot({
        path: path.join(OUT, `${vp.name}-${target.slug}.png`),
        fullPage: Boolean(target.fullPage),
      });

      console.log(`Captured ${vp.name} / ${target.slug}`);
    }
  }

  fs.writeFileSync(path.join(OUT, "fit-audit.json"), JSON.stringify(FIT_AUDIT, null, 2));
  fs.writeFileSync(path.join(OUT, "fill-metrics.json"), JSON.stringify(FILL_METRICS, null, 2));

  const beforeMetricsPath = path.join(BEFORE, "fill-metrics-before.json");
  let beforeAvg = null;
  if (fs.existsSync(beforeMetricsPath)) {
    beforeAvg = JSON.parse(fs.readFileSync(beforeMetricsPath, "utf8"));
  }

  const afterPackshots = FILL_METRICS.filter((m) => m.avgImgBoxPct != null);
  const afterAvgImgBox =
    afterPackshots.length > 0
      ? Math.round(
          (afterPackshots.reduce((s, m) => s + m.avgImgBoxPct, 0) / afterPackshots.length) * 10
        ) / 10
      : null;

  const comparison = {
    beforeScreenshotsDir: "e2e/audit-screenshots/product-image-rendering/before-refinement/",
    afterScreenshotsDir: "e2e/audit-screenshots/product-image-rendering/",
    beforeAvgImgBoxPct: beforeAvg?.overallAvgImgBoxPct ?? 72,
    afterAvgImgBoxPct: afterAvgImgBox,
    estimatedAreaIncreasePct:
      beforeAvg?.overallAvgImgBoxPct && afterAvgImgBox
        ? Math.round(((afterAvgImgBox - beforeAvg.overallAvgImgBoxPct) / beforeAvg.overallAvgImgBoxPct) * 1000) / 10
        : beforeAvg?.overallAvgImgBoxPct
          ? Math.round(((afterAvgImgBox - 72) / 72) * 1000) / 10
          : null,
    viewports: VIEWPORTS.map((vp) => ({
      viewport: vp.name,
      before: fs.existsSync(path.join(BEFORE, `${vp.name}-products-grid.png`))
        ? `before-refinement/${vp.name}-products-grid.png`
        : fs.existsSync(path.join(BEFORE, `${vp.name}-home-rails.png`))
          ? `before-refinement/${vp.name}-home-rails.png`
          : null,
      after: `${vp.name}-products-grid.png`,
    })),
  };

  fs.writeFileSync(path.join(OUT, "before-after-comparison.json"), JSON.stringify(comparison, null, 2));

  await browser.close();
  console.log("Done —", OUT);
  console.log("Avg packshot img box:", afterAvgImgBox, "%");
})();
