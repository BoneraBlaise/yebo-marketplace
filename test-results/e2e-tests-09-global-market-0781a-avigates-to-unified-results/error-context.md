# Test info

- Name: Global Marketplace Search >> header search shows discovery panel and navigates to unified results
- Location: D:\GURIRALINE PROJECT\GURIRALINE PROJECT\WEBSITE\guriraline_app-main\guriraline_app-main\e2e\tests\09-global-marketplace-search.spec.js:7:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

    at D:\GURIRALINE PROJECT\GURIRALINE PROJECT\WEBSITE\guriraline_app-main\guriraline_app-main\e2e\tests\09-global-marketplace-search.spec.js:8:16
```

# Test source

```ts
   1 | /**
   2 |  * Global marketplace search — unified typeahead + /search results
   3 |  */
   4 | const { test, expect } = require("@playwright/test");
   5 |
   6 | test.describe("Global Marketplace Search", () => {
   7 |   test("header search shows discovery panel and navigates to unified results", async ({ page }) => {
>  8 |     await page.goto("/");
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
   9 |     await page.evaluate(() => {
  10 |       document.querySelector("#webpack-dev-server-client-overlay")?.remove();
  11 |     });
  12 |
  13 |     const searchInput = page.locator(".home-header__search-input");
  14 |     await searchInput.waitFor({ state: "visible", timeout: 30000 });
  15 |     await searchInput.click();
  16 |
  17 |     await expect(page.getByText("Trending")).toBeVisible({ timeout: 10000 });
  18 |
  19 |     await searchInput.fill("kigali apartment");
  20 |     await page.waitForTimeout(400);
  21 |
  22 |     const suggestPanel = page.locator(".home-search-suggest");
  23 |     await expect(suggestPanel).toBeVisible({ timeout: 15000 });
  24 |
  25 |     await searchInput.press("Enter");
  26 |     await page.waitForURL(/\/search\?search=/, { timeout: 15000 });
  27 |
  28 |     await expect(page.getByText("Show:")).toBeVisible();
  29 |     await expect(page.getByRole("button", { name: "Products" })).toBeVisible();
  30 |     await expect(page.getByRole("button", { name: "Events" })).toBeVisible();
  31 |   });
  32 | });
  33 |
```