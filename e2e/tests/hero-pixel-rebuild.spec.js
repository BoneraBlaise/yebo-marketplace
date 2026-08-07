/**
 * Hero reference rebuild verification
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "414", width: 414, height: 896 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const OUT_AFTER = path.join(__dirname, "..", "audit-screenshots", "hero-reference");

function dismissOverlay(page) {
  return page.evaluate(() => {
    document.querySelector("#webpack-dev-server-client-overlay")?.remove();
  });
}

test.describe("Hero Reference Rebuild", () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_AFTER, { recursive: true });
  });

  test("exact copy hierarchy and CTAs", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    const hero = page.locator(".home-hero--ref");

    await expect(hero.locator("#home-hero-heading")).toContainText("Shop Smarter.");
    await expect(hero.locator("#home-hero-heading")).toContainText("Try");
    await expect(hero.locator("#home-hero-heading")).toContainText("Before You Buy.");
    await expect(hero.getByText(/AI Powered Experience/i)).toBeVisible();
    await expect(hero.getByText(/Discover millions of products/i)).toBeVisible();
    await expect(hero.getByRole("link", { name: /Shop Now/i })).toBeVisible();
    await expect(hero.getByRole("link", { name: /Try AI Now/i })).toBeVisible();
    await expect(hero.getByText("4.9/5")).toBeVisible();
    await expect(hero.getByText(/Trusted by 50,000\+ customers across Africa/i)).toBeVisible();
  });

  test("no dashboard chrome or metric widgets", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    await expect(page.locator(".ai-showcase__shell")).toHaveCount(0);
    await expect(page.locator(".ai-showcase__metrics")).toHaveCount(0);
    await expect(page.getByText(/AI Match/i)).toHaveCount(0);
  });

  test("five placeholder cards with specified prices", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    const hero = page.locator(".home-hero--ref");
    await hero.scrollIntoViewIfNeeded();

    const cards = hero.locator(".ai-showcase__float");
    await expect(cards.first()).toBeVisible({ timeout: 20000 });
    expect(await cards.count()).toBe(5);

    await expect(hero.getByText("Sunglasses")).toBeVisible();
    await expect(hero.getByText("RWF 6,000")).toBeVisible();
    await expect(hero.getByText("Handbag")).toBeVisible();
    await expect(hero.getByText("RWF 20,000")).toBeVisible();
    await expect(hero.getByText("Jacket")).toBeVisible();
    await expect(hero.getByText("Sneakers")).toBeVisible();
    await expect(hero.getByText("RWF 30,000")).toBeVisible();
  });

  test("featured shirt product in center", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.locator(".home-hero--ref").scrollIntoViewIfNeeded();

    await expect(
      page.locator(".ai-showcase__featured, .ai-showcase__featured-placeholder").first()
    ).toBeVisible({ timeout: 20000 });
  });

  test("hero feature bar and carousel chrome", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    const hero = page.locator(".home-hero--ref");
    await expect(hero.getByText("Secure Payments")).toBeVisible();
    await expect(hero.getByText("Fast Delivery")).toBeVisible();
    await expect(hero.getByText("AI Try-On")).toBeVisible();
    await expect(hero.getByText("Easy Returns")).toBeVisible();
    await expect(hero.getByText("Verified Vendors")).toBeVisible();
    await expect(page.locator(".home-hero--ref__dot--active")).toBeVisible();
  });

  test("see-it-on-you gold curves", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    await expect(page.getByText("See it on you")).toBeVisible();
    await expect(page.locator(".ai-showcase__curve")).toHaveCount(3);
  });

  test("featured shirt links to product detail when loaded", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.locator(".home-hero--ref").scrollIntoViewIfNeeded();

    const featured = page.locator(".ai-showcase__featured-link");
    if (await featured.count()) {
      const href = await featured.getAttribute("href");
      expect(href).toMatch(/^\/product\/[a-f0-9]+$/);
    }
  });

  test("no horizontal overflow and images load", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await page.waitForTimeout(1200);

    const metrics = await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll(".home-hero--ref .ai-showcase__float-img, .home-hero--ref .ai-showcase__featured"));
      await Promise.all(
        imgs.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                })
        )
      );
      const imagesOk = imgs.every((el) => el.complete && el.naturalWidth > 0);
      return {
        imagesOk,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    expect(metrics.imagesOk).toBeTruthy();
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  });

  for (const vp of VIEWPORTS) {
    test(`responsive hero @ ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await dismissOverlay(page);
      await page.evaluate(() => {
        document.querySelectorAll(".ai-showcase__float, .ai-showcase__curve").forEach((el) => {
          el.style.animation = "none";
        });
        window.scrollTo(0, 0);
      });
      await page.waitForSelector(".home-hero--ref", { state: "visible" });
      await page.waitForTimeout(400);

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);

      await page.locator(".home-hero--ref__shell").screenshot({
        path: path.join(OUT_AFTER, `hero-ref-${vp.name}.png`),
        animations: "disabled",
      });
    });
  }
});
