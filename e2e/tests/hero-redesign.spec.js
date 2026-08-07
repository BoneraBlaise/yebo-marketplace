/**
 * @deprecated Superseded by hero-pixel-rebuild.spec.js
 */
const { test, expect } = require("@playwright/test");

function dismissOverlay(page) {
  return page.evaluate(() => {
    document.querySelector("#webpack-dev-server-client-overlay")?.remove();
  });
}

test.describe("Premium AI Hero (legacy alias)", () => {
  test("pixel hero region present", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);

    await expect(page.locator(".home-hero--ref")).toBeVisible();
    await expect(page.locator(".ai-showcase__float").first()).toBeVisible({ timeout: 20000 });
  });
});
