/**
 * Mobile UX & image stability verification
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { optimizeProductImage } = require("../../src/utils/productImageUtils");

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "393", width: 393, height: 852 },
  { name: "414", width: 414, height: 896 },
  { name: "430", width: 430, height: 932 },
];

const PAGES = [
  { key: "homepage", path: "/" },
  { key: "products", path: "/products" },
  { key: "search", path: "/search?search=phone" },
  { key: "login", path: "/login" },
  { key: "sign-up", path: "/sign-up" },
  { key: "property", path: "/property-mobility" },
  { key: "vendor", path: "/shop/preview/6a64e98ddcdc9f592fe0d774" },
];

const OUT_DIR = path.join(__dirname, "..", "audit-screenshots", "mobile-stability");

function dismissOverlay(page) {
  return page.evaluate(() => {
    document.querySelector("#webpack-dev-server-client-overlay")?.remove();
  });
}

test.describe("Mobile Stability — Product Images", () => {
  test("all production product optimized URLs return 200", async ({ request }) => {
    const res = await request.get("http://127.0.0.1:5000/api/v2/product/get-all-products");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    const products = json.products || [];
    expect(products.length).toBeGreaterThan(0);

    const failures = [];
    for (const p of products) {
      const raw = p.images?.[0]?.url;
      if (!raw) {
        failures.push({ name: p.name, reason: "no url in database" });
        continue;
      }
      const optimized = optimizeProductImage(raw, "card");
      const imgRes = await request.get(optimized);
      if (!imgRes.ok()) {
        failures.push({ name: p.name, optimized, status: imgRes.status() });
      }
    }

    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });

  test("product cards render loaded images on homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    const imgs = page.locator(".ypc__img");
    await expect(imgs.first()).toBeVisible({ timeout: 15000 });

    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 8); i++) {
      const img = imgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((el) =>
        el.complete
          ? Promise.resolve()
          : new Promise((resolve, reject) => {
              el.addEventListener("load", resolve, { once: true });
              el.addEventListener("error", reject, { once: true });
            })
      );
      const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0);
      expect(ok, `Image ${i} failed to load: ${await img.getAttribute("src")}`).toBeTruthy();
    }
  });
});

test.describe("Mobile Stability — Safari Zoom Prevention", () => {
  test("form inputs are at least 16px on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    const fontSize = await page.locator(".auth-floating-input").first().evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(fontSize).toBeGreaterThanOrEqual(16);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    const searchInput = page.locator(".home-header__search-input");
    if (await searchInput.count()) {
      const searchFont = await searchInput.first().evaluate((el) =>
        parseFloat(window.getComputedStyle(el).fontSize)
      );
      expect(searchFont).toBeGreaterThanOrEqual(16);
    }
  });
});

test.describe("Mobile Stability — No Horizontal Scroll", () => {
  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      test(`no horizontal overflow @ ${vp.name}px on ${p.key}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(p.path, { waitUntil: "domcontentloaded", timeout: 45000 });
        await dismissOverlay(page);
        await page.waitForTimeout(1200);

        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
        }));

        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
        expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
      });
    }
  }
});

test.describe("Mobile Stability — Screenshots", () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const vp of VIEWPORTS) {
    test(`capture @ ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const p of PAGES) {
        await page.goto(p.path, { waitUntil: "domcontentloaded", timeout: 45000 });
        await dismissOverlay(page);
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(OUT_DIR, `${p.key}-${vp.name}.png`),
          fullPage: false,
        });
      }
    });
  }
});
