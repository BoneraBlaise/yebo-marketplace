const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "audit-screenshots", "sprint-3");
const BASE = "http://localhost:3000";

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "mobile-390", width: 390, height: 844 },
];

const FLOWS = [
  { slug: "home", path: "/" },
  { slug: "products", path: "/products" },
  { slug: "search", path: "/search?q=phone" },
  { slug: "property-mobility", path: "/property-mobility" },
  { slug: "events", path: "/events" },
  { slug: "best-selling", path: "/best-selling" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const scrollReport = [];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const flow of FLOWS) {
      try {
        await page.goto(`${BASE}${flow.path}`, { waitUntil: "networkidle", timeout: 90000 });
        await page.waitForTimeout(1200);

        const scrollOk = await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1
        );
        scrollReport.push({ viewport: vp.name, flow: flow.slug, scrollOk });

        await page.screenshot({
          path: path.join(OUT, `${vp.name}-${flow.slug}-top.png`),
          fullPage: false,
        });

        if (flow.slug === "home" || flow.slug === "products") {
          await page.screenshot({
            path: path.join(OUT, `${vp.name}-${flow.slug}-full.png`),
            fullPage: true,
          });
        }

        console.log(`Captured ${vp.name} / ${flow.slug}`);
      } catch (err) {
        console.error(`Failed ${vp.name} / ${flow.slug}:`, err.message);
        scrollReport.push({ viewport: vp.name, flow: flow.slug, scrollOk: false, error: err.message });
      }
    }
  }

  fs.writeFileSync(path.join(OUT, "scroll-audit.json"), JSON.stringify(scrollReport, null, 2));
  await browser.close();
  console.log("Done — artifacts in", OUT);
})();
