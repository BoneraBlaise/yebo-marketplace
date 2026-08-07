const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "audit-screenshots", "final-production-review");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/products", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);
  const href = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/product/"]'));
    for (const l of links) {
      const h = l.getAttribute("href");
      if (h && !h.includes("isEvent")) return h;
    }
    return null;
  });
  fs.writeFileSync(path.join(OUT, "product-detail-path.json"), JSON.stringify({ href }, null, 2));
  if (!href) {
    console.log("No product link found");
    await browser.close();
    return;
  }
  for (const [w, h, name] of [
    [390, 844, "mobile-390"],
    [414, 896, "mobile-414"],
    [1920, 1080, "desktop-1920"],
  ]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`http://localhost:3000${href}`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT, `${name}-product-detail.png`), fullPage: true });
    console.log("Captured", name, href);
  }
  await browser.close();
})();
