/**
 * Homepage category refinement verification
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const EXPECTED_CATEGORIES = [
  "Phones",
  "Electronics",
  "Computers",
  "Fashion",
  "Beauty",
  "Home & Furniture",
  "Property",
  "Mobility",
  "Baby",
  "Gaming",
  "Cameras",
  "Sports Wear",
  "Sports Accessories",
  "School Materials",
  "Groceries",
];

const REMOVED_CATEGORIES = ["Health", "Pets", "Books", "Office & School", "Automotive"];

const MOBILE_VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "393", width: 393, height: 852 },
  { name: "414", width: 414, height: 896 },
  { name: "430", width: 430, height: 932 },
];

const DESKTOP_VIEWPORTS = [
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
];

const OUT_DIR = path.join(__dirname, "..", "audit-screenshots", "homepage-categories");

function dismissOverlay(page) {
  return page.evaluate(() => {
    document.querySelector("#webpack-dev-server-client-overlay")?.remove();
  });
}

test.describe("Homepage Category Refinement", () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  test("displays exactly 15 target categories", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.locator(".home-cat-grid").scrollIntoViewIfNeeded();
    await expect(page.locator(".home-cat-card__title")).toHaveCount(15, { timeout: 20000 });

    const titles = await page.locator(".home-cat-card__title").allTextContents();
    const normalized = titles.map((t) => t.trim());

    expect(normalized.length).toBe(15);
    for (const name of EXPECTED_CATEGORIES) {
      expect(normalized, `Missing category: ${name}`).toContain(name);
    }
  });

  test("removed categories are not on homepage grid", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.locator(".home-cat-grid").scrollIntoViewIfNeeded();
    await expect(page.locator(".home-cat-card__title")).toHaveCount(15, { timeout: 20000 });

    const titles = await page.locator(".home-cat-card__title").allTextContents();
    const normalized = titles.map((t) => t.trim());

    for (const name of REMOVED_CATEGORIES) {
      expect(normalized, `Should not show: ${name}`).not.toContain(name);
    }
  });

  test("all category images load without broken icons", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.locator(".home-cat-grid").scrollIntoViewIfNeeded();
    await expect(page.locator(".home-cat-card__img")).toHaveCount(15, { timeout: 20000 });

    const imgs = page.locator(".home-cat-card__img");
    const count = await imgs.count();

    for (let i = 0; i < count; i++) {
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
      expect(ok, `Broken category image at index ${i}`).toBeTruthy();
    }
  });

  for (const vp of MOBILE_VIEWPORTS) {
    test(`mobile layout @ ${vp.name}px — no overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await dismissOverlay(page);
      await page.locator(".home-cat-grid").scrollIntoViewIfNeeded();

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);

      await page.screenshot({
        path: path.join(OUT_DIR, `categories-mobile-${vp.name}.png`),
        fullPage: false,
      });
    });
  }

  for (const vp of DESKTOP_VIEWPORTS) {
    test(`desktop layout @ ${vp.name}px — no overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await dismissOverlay(page);
      await page.locator(".home-cat-grid").scrollIntoViewIfNeeded();

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);

      await page.screenshot({
        path: path.join(OUT_DIR, `categories-desktop-${vp.name}.png`),
        fullPage: false,
      });
    });
  }

  test("Property navigates to property-mobility hub", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.getByRole("button", { name: /Property — shop on Yebone/i }).click();
    await expect(page).toHaveURL(/\/property-mobility\?listingType=property/);
  });

  test("Mobility navigates to vehicle hub", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.getByRole("button", { name: /Mobility — shop on Yebone/i }).click();
    await expect(page).toHaveURL(/\/property-mobility\?listingType=vehicle/);
  });
});
