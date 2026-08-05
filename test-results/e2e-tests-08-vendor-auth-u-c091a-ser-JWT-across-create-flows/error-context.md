# Test info

- Name: Unified vendor auth E2E >> vendor session uses single user JWT across create flows
- Location: D:\GURIRALINE PROJECT\GURIRALINE PROJECT\WEBSITE\guriraline_app-main\guriraline_app-main\e2e\tests\08-vendor-auth-unified.spec.js:100:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\boner\AppData\Local\Temp\cursor-sandbox-cache\827a9a36bdea7468daf0fd119d18575b\playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | /**
   2 |  * Unified vendor auth — browser E2E for Product, Property, Mobility, Event.
   3 |  * Run: npx playwright test tests/08-vendor-auth-unified.spec.js
   4 |  */
   5 | const { test, expect } = require("@playwright/test");
   6 | const path = require("path");
   7 |
   8 | const EMAIL = process.env.E2E_VENDOR_EMAIL || process.env.E2E_SELLER_EMAIL || "bonbreizy@gmail.com";
   9 | const PASSWORD = process.env.E2E_VENDOR_PASSWORD || process.env.E2E_SELLER_PASSWORD || "YeboneVendorE2E2026!";
   10 | const API = process.env.E2E_BACKEND_URL
   11 |   ? `${process.env.E2E_BACKEND_URL}/api/v2`
   12 |   : "http://127.0.0.1:5000/api/v2";
   13 |
   14 | const tinyPng = path.join(__dirname, "..", "fixtures", "tiny.png");
   15 |
   16 | async function removeWebpackOverlay(page) {
   17 |   await page.evaluate(() => {
   18 |     document.querySelector("#webpack-dev-server-client-overlay")?.remove();
   19 |     document.querySelector("#webpack-dev-server-client-overlay-div")?.remove();
   20 |   });
   21 | }
   22 |
   23 | async function openListingWizard(page) {
   24 |   await removeWebpackOverlay(page);
   25 |   await page.locator(".pm-owner-toolbar").getByRole("button", { name: "New listing" }).click();
   26 |   await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
   27 | }
   28 |
   29 | function listingWizard(page) {
   30 |   return page.getByRole("dialog");
   31 | }
   32 |
   33 | async function clearAuthState(page, context) {
   34 |   await context.clearCookies();
   35 |   await page.goto("/");
   36 |   await page.evaluate(() => {
   37 |     localStorage.clear();
   38 |     sessionStorage.clear();
   39 |   });
   40 | }
   41 |
   42 | async function loginViaUI(page) {
   43 |   await page.goto("/login");
   44 |   await removeWebpackOverlay(page);
   45 |   const sellerReady = page.waitForResponse(
   46 |     (res) => res.url().includes("/getSeller") && res.status() === 200,
   47 |     { timeout: 45000 }
   48 |   );
   49 |   await page.locator("#email").fill(EMAIL);
   50 |   await page.locator("#password").fill(PASSWORD);
   51 |   await page.locator('button[type="submit"]').click();
   52 |   await page.waitForURL(/\/(profile|dashboard|$)/, { timeout: 30000 });
   53 |   await sellerReady;
   54 |   await page.waitForFunction(() => Boolean(localStorage.getItem("yebone_auth_token_v1")));
   55 |   await page.goto("/dashboard");
   56 |   await removeWebpackOverlay(page);
   57 |   await expect(page.getByRole("link", { name: "My Shop" })).toBeVisible({ timeout: 30000 });
   58 | }
   59 |
   60 | async function waitForVendorBoot(page) {
   61 |   await page.waitForResponse(
   62 |     (res) => res.url().includes("/getuser") && res.status() === 200,
   63 |     { timeout: 45000 }
   64 |   );
   65 |   await page.waitForResponse(
   66 |     (res) => res.url().includes("/getSeller") && res.status() === 200,
   67 |     { timeout: 45000 }
   68 |   );
   69 |   await page.waitForFunction(() => Boolean(localStorage.getItem("yebone_auth_token_v1")));
   70 | }
   71 |
   72 | async function clickContinue(page) {
   73 |   const btn = page.getByRole("button", { name: "Continue" });
   74 |   await expect(btn).toBeEnabled({ timeout: 15000 });
   75 |   await btn.click();
   76 | }
   77 |
   78 | async function clickPublish(page, name = /Publish/i) {
   79 |   const btn = page.locator(".seller-xp-wizard").getByRole("button", { name });
   80 |   await expect(btn).toBeEnabled({ timeout: 15000 });
   81 |   await btn.click();
   82 | }
   83 |
   84 | async function waitForCreateResponse(page, pathFragment, click) {
   85 |   const responsePromise = page.waitForResponse(
   86 |     (res) => res.url().includes(pathFragment) && ["POST", "PUT"].includes(res.request().method()),
   87 |     { timeout: 90000 }
   88 |   );
   89 |   await click();
   90 |   const response = await responsePromise;
   91 |   if (response.status() >= 400) {
   92 |     console.log(`[E2E] ${pathFragment} failed:`, response.status(), await response.text());
   93 |   }
   94 |   expect(response.status()).toBeGreaterThanOrEqual(200);
   95 |   expect(response.status()).toBeLessThan(300);
   96 |   return response;
   97 | }
   98 |
   99 | test.describe("Unified vendor auth E2E", () => {
> 100 |   test("vendor session uses single user JWT across create flows", async ({ page, context }) => {
      |   ^ Error: browserType.launch: Executable doesn't exist at C:\Users\boner\AppData\Local\Temp\cursor-sandbox-cache\827a9a36bdea7468daf0fd119d18575b\playwright\chromium_headless_shell-1169\chrome-win\headless_shell.exe
  101 |     const authHeaders = [];
  102 |
  103 |     page.on("request", (req) => {
  104 |       const url = req.url();
  105 |       if (
  106 |         url.includes("/create-product") ||
  107 |         url.includes("/owner/listings") ||
  108 |         url.includes("/create-event")
  109 |       ) {
  110 |         authHeaders.push({
  111 |           url,
  112 |           authorization: req.headers()["authorization"] || null,
  113 |           hasSellerTokenCookie: (req.headers()["cookie"] || "").includes("seller_token="),
  114 |         });
  115 |       }
  116 |     });
  117 |
  118 |     await clearAuthState(page, context);
  119 |     await loginViaUI(page);
  120 |
  121 |     // --- Product ---
  122 |     await page.goto("/dashboard-create-product");
  123 |     await waitForVendorBoot(page);
  124 |     await removeWebpackOverlay(page);
  125 |     await expect(page.getByRole("heading", { name: /Create Product/i }).first()).toBeVisible();
  126 |
  127 |     await page.getByPlaceholder(/Wireless earbuds/i).fill("E2E Unified Auth Product");
  128 |     await page.locator(".premium-select__trigger").first().click();
  129 |     await page.getByRole("option").first().click();
  130 |     const productEditor = page.locator(".ql-editor").first();
  131 |     await productEditor.click();
  132 |     await productEditor.fill("E2E product description for unified vendor auth test.");
  133 |     await clickContinue(page);
  134 |
  135 |     await page.locator("#original-price").fill("30000");
  136 |     await page.locator("#discount-price").fill("25000");
  137 |     await page.locator("#product-stock").fill("5");
  138 |     await clickContinue(page);
  139 |
  140 |     await page.locator("#product-images-input").setInputFiles(tinyPng);
  141 |     await expect(page.locator(".seller-xp-image-thumb img").first()).toBeVisible({ timeout: 10000 });
  142 |     await clickContinue(page);
  143 |     await waitForCreateResponse(page, "/create-product", () => clickPublish(page, /Publish product/i));
  144 |     await page.waitForURL(/\/product\//, { timeout: 30000 });
  145 |
  146 |     // --- Property ---
  147 |     await page.goto("/dashboard-property-mobility");
  148 |     await waitForVendorBoot(page);
  149 |     await removeWebpackOverlay(page);
  150 |     await openListingWizard(page);
  151 |     await listingWizard(page).getByRole("button", { name: "Houses" }).click();
  152 |     await listingWizard(page).getByRole("button", { name: "For Sale" }).click();
  153 |     await clickContinue(page);
  154 |
  155 |     await page.locator("#listing-title").fill("E2E Unified Auth House");
  156 |     await page.locator("#listing-desc").fill(
  157 |       "E2E property listing for unified vendor authentication pipeline verification."
  158 |     );
  159 |     await clickContinue(page);
  160 |
  161 |     await page.locator("#listing-price").fill("150000");
  162 |     await clickContinue(page);
  163 |
  164 |     await page.locator("#listing-city").fill("Kigali");
  165 |     await clickContinue(page);
  166 |
  167 |     await page.locator('.seller-xp-wizard input[type="file"][accept="image/*"]').setInputFiles(tinyPng);
  168 |     await expect(page.locator(".listing-media__thumb img").first()).toBeVisible({ timeout: 10000 });
  169 |     await clickContinue(page);
  170 |     await waitForCreateResponse(page, "/owner/listings", () => clickPublish(page, /Publish listing/i));
  171 |     await expect(page.getByText(/Listing Published/i).first()).toBeVisible({ timeout: 30000 });
  172 |
  173 |     // --- Mobility ---
  174 |     await page.goto("/dashboard-property-mobility");
  175 |     await waitForVendorBoot(page);
  176 |     await removeWebpackOverlay(page);
  177 |     await openListingWizard(page);
  178 |     await listingWizard(page).getByRole("button", { name: "Cars" }).click();
  179 |     await listingWizard(page).getByRole("button", { name: "For Sale" }).click();
  180 |     await clickContinue(page);
  181 |
  182 |     await page.locator("#brand").fill("Toyota");
  183 |     await page.locator("#model").fill("Corolla");
  184 |     await page.locator("#listing-title").fill("E2E Unified Auth Car");
  185 |     await page.locator("#listing-desc").fill(
  186 |       "E2E mobility listing for unified vendor authentication pipeline verification."
  187 |     );
  188 |     await clickContinue(page);
  189 |
  190 |     await page.locator("#listing-price").fill("80000");
  191 |     await clickContinue(page);
  192 |     await page.locator("#listing-city").fill("Kigali");
  193 |     await clickContinue(page);
  194 |     await page.locator('.seller-xp-wizard input[type="file"][accept="image/*"]').setInputFiles(tinyPng);
  195 |     await expect(page.locator(".listing-media__thumb img").first()).toBeVisible({ timeout: 10000 });
  196 |     await clickContinue(page);
  197 |     await waitForCreateResponse(page, "/owner/listings", () => clickPublish(page, /Publish listing/i));
  198 |     await expect(page.getByText(/Listing Published/i).first()).toBeVisible({ timeout: 30000 });
  199 |
  200 |     // --- Event ---
```