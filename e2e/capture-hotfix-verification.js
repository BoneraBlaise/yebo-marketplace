const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "audit-screenshots", "hotfix-mobile-header");
const VIEWPORTS = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForSelector(".home-header", { timeout: 15000 });
    await page.waitForTimeout(800);

    const metrics = await page.evaluate(() => {
      const searchRow = document.querySelector(".home-header__search-row");
      const hero = document.querySelector(".home-hero");
      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
        searchRowFlex: searchRow ? getComputedStyle(searchRow).flex : null,
        searchRowWidth: searchRow ? Math.round(searchRow.getBoundingClientRect().width) : null,
        heroCentered: hero
          ? Math.abs(hero.getBoundingClientRect().left) < 2
          : null,
      };
    });

    await page.screenshot({
      path: path.join(OUT, `${vp.name}-header-after.png`),
      fullPage: false,
    });

    results.push({ viewport: vp.name, ...metrics });
    console.log(JSON.stringify({ viewport: vp.name, ...metrics }));
  }

  fs.writeFileSync(path.join(OUT, "verification.json"), JSON.stringify(results, null, 2));
  await browser.close();
})();
