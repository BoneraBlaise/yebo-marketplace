/**
 * Global marketplace search — unified typeahead + /search results
 */
const { test, expect } = require("@playwright/test");

test.describe("Global Marketplace Search", () => {
  test("header search shows discovery panel and navigates to unified results", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.querySelector("#webpack-dev-server-client-overlay")?.remove();
    });

    const searchInput = page.locator(".home-header__search-input");
    await searchInput.waitFor({ state: "visible", timeout: 30000 });
    await searchInput.click();

    await expect(page.getByText("Trending")).toBeVisible({ timeout: 10000 });

    await searchInput.fill("kigali apartment");
    await page.waitForTimeout(400);

    const suggestPanel = page.locator(".home-search-suggest");
    await expect(suggestPanel).toBeVisible({ timeout: 15000 });

    await searchInput.press("Enter");
    await page.waitForURL(/\/search\?search=/, { timeout: 15000 });

    await expect(page.getByText("Show:")).toBeVisible();
    await expect(page.getByRole("button", { name: "Products" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Events" })).toBeVisible();
  });
});
