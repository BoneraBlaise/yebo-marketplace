/**
 * Unified vendor auth — browser E2E for Product, Property, Mobility, Event.
 * Run: npx playwright test tests/08-vendor-auth-unified.spec.js
 */
const { test, expect } = require("@playwright/test");
const path = require("path");
const { vendorCredentials, skipIfMissing } = require("../helpers/credentials");

const vendorCreds = vendorCredentials();
const API = process.env.E2E_BACKEND_URL
  ? `${process.env.E2E_BACKEND_URL}/api/v2`
  : "http://127.0.0.1:5000/api/v2";

const tinyPng = path.join(__dirname, "..", "fixtures", "tiny.png");

async function removeWebpackOverlay(page) {
  await page.evaluate(() => {
    document.querySelector("#webpack-dev-server-client-overlay")?.remove();
    document.querySelector("#webpack-dev-server-client-overlay-div")?.remove();
  });
}

async function openListingWizard(page) {
  await removeWebpackOverlay(page);
  await page.locator(".pm-owner-toolbar").getByRole("button", { name: "New listing" }).click();
  await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
}

function listingWizard(page) {
  return page.getByRole("dialog");
}

async function clearAuthState(page, context) {
  await context.clearCookies();
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

async function loginViaUI(page) {
  await page.goto("/login");
  await removeWebpackOverlay(page);
  const sellerReady = page.waitForResponse(
    (res) => res.url().includes("/getSeller") && res.status() === 200,
    { timeout: 45000 }
  );
  await page.locator("#email").fill(vendorCreds.email);
  await page.locator("#password").fill(vendorCreds.password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/(profile|dashboard|$)/, { timeout: 30000 });
  await sellerReady;
  await page.waitForFunction(() => Boolean(localStorage.getItem("yebone_auth_token_v1")));
  await page.goto("/dashboard");
  await removeWebpackOverlay(page);
  await expect(page.getByRole("link", { name: "My Shop" })).toBeVisible({ timeout: 30000 });
}

async function waitForVendorBoot(page) {
  await page.waitForResponse(
    (res) => res.url().includes("/getuser") && res.status() === 200,
    { timeout: 45000 }
  );
  await page.waitForResponse(
    (res) => res.url().includes("/getSeller") && res.status() === 200,
    { timeout: 45000 }
  );
  await page.waitForFunction(() => Boolean(localStorage.getItem("yebone_auth_token_v1")));
}

async function clickContinue(page) {
  const btn = page.getByRole("button", { name: "Continue" });
  await expect(btn).toBeEnabled({ timeout: 15000 });
  await btn.click();
}

async function clickPublish(page, name = /Publish/i) {
  const btn = page.locator(".seller-xp-wizard").getByRole("button", { name });
  await expect(btn).toBeEnabled({ timeout: 15000 });
  await btn.click();
}

async function waitForCreateResponse(page, pathFragment, click) {
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes(pathFragment) && ["POST", "PUT"].includes(res.request().method()),
    { timeout: 90000 }
  );
  await click();
  const response = await responsePromise;
  if (response.status() >= 400) {
    console.log(`[E2E] ${pathFragment} failed:`, response.status(), await response.text());
  }
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(300);
  return response;
}

test.describe("Unified vendor auth E2E", () => {
  test.beforeEach(({}, testInfo) => {
    skipIfMissing(testInfo, vendorCreds, "E2E_VENDOR_EMAIL / E2E_VENDOR_PASSWORD");
  });

  test("vendor session uses single user JWT across create flows", async ({ page, context }) => {
    const authHeaders = [];

    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("/create-product") ||
        url.includes("/owner/listings") ||
        url.includes("/create-event")
      ) {
        authHeaders.push({
          url,
          authorization: req.headers()["authorization"] || null,
          hasSellerTokenCookie: (req.headers()["cookie"] || "").includes("seller_token="),
        });
      }
    });

    await clearAuthState(page, context);
    await loginViaUI(page);

    // --- Product ---
    await page.goto("/dashboard-create-product");
    await waitForVendorBoot(page);
    await removeWebpackOverlay(page);
    await expect(page.getByRole("heading", { name: /Create Product/i }).first()).toBeVisible();

    await page.getByPlaceholder(/Wireless earbuds/i).fill("E2E Unified Auth Product");
    await page.locator(".premium-select__trigger").first().click();
    await page.getByRole("option").first().click();
    const productEditor = page.locator(".ql-editor").first();
    await productEditor.click();
    await productEditor.fill("E2E product description for unified vendor auth test.");
    await clickContinue(page);

    await page.locator("#original-price").fill("30000");
    await page.locator("#discount-price").fill("25000");
    await page.locator("#product-stock").fill("5");
    await clickContinue(page);

    await page.locator("#product-images-input").setInputFiles(tinyPng);
    await expect(page.locator(".seller-xp-image-thumb img").first()).toBeVisible({ timeout: 10000 });
    await clickContinue(page);
    await waitForCreateResponse(page, "/create-product", () => clickPublish(page, /Publish product/i));
    await page.waitForURL(/\/product\//, { timeout: 30000 });

    // --- Property ---
    await page.goto("/dashboard-property-mobility");
    await waitForVendorBoot(page);
    await removeWebpackOverlay(page);
    await openListingWizard(page);
    await listingWizard(page).getByRole("button", { name: "Houses" }).click();
    await listingWizard(page).getByRole("button", { name: "For Sale" }).click();
    await clickContinue(page);

    await page.locator("#listing-title").fill("E2E Unified Auth House");
    await page.locator("#listing-desc").fill(
      "E2E property listing for unified vendor authentication pipeline verification."
    );
    await clickContinue(page);

    await page.locator("#listing-price").fill("150000");
    await clickContinue(page);

    await page.locator("#listing-city").fill("Kigali");
    await clickContinue(page);

    await page.locator('.seller-xp-wizard input[type="file"][accept="image/*"]').setInputFiles(tinyPng);
    await expect(page.locator(".listing-media__thumb img").first()).toBeVisible({ timeout: 10000 });
    await clickContinue(page);
    await waitForCreateResponse(page, "/owner/listings", () => clickPublish(page, /Publish listing/i));
    await expect(page.getByText(/Listing Published/i).first()).toBeVisible({ timeout: 30000 });

    // --- Mobility ---
    await page.goto("/dashboard-property-mobility");
    await waitForVendorBoot(page);
    await removeWebpackOverlay(page);
    await openListingWizard(page);
    await listingWizard(page).getByRole("button", { name: "Cars" }).click();
    await listingWizard(page).getByRole("button", { name: "For Sale" }).click();
    await clickContinue(page);

    await page.locator("#brand").fill("Toyota");
    await page.locator("#model").fill("Corolla");
    await page.locator("#listing-title").fill("E2E Unified Auth Car");
    await page.locator("#listing-desc").fill(
      "E2E mobility listing for unified vendor authentication pipeline verification."
    );
    await clickContinue(page);

    await page.locator("#listing-price").fill("80000");
    await clickContinue(page);
    await page.locator("#listing-city").fill("Kigali");
    await clickContinue(page);
    await page.locator('.seller-xp-wizard input[type="file"][accept="image/*"]').setInputFiles(tinyPng);
    await expect(page.locator(".listing-media__thumb img").first()).toBeVisible({ timeout: 10000 });
    await clickContinue(page);
    await waitForCreateResponse(page, "/owner/listings", () => clickPublish(page, /Publish listing/i));
    await expect(page.getByText(/Listing Published/i).first()).toBeVisible({ timeout: 30000 });

    // --- Event ---
    await page.goto("/dashboard-create-event");
    await waitForVendorBoot(page);
    await removeWebpackOverlay(page);
    await page.getByPlaceholder(/Enter your event name/i).fill("E2E Unified Auth Event");
    await page.locator(".ql-editor").first().fill("E2E event for unified vendor auth.");
    await page.locator('select:has(option:text("Choose a category"))').selectOption({ index: 1 });
    await page.getByPlaceholder(/price with discount/i).fill("5000");
    await page.getByPlaceholder(/event stock/i).fill("10");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 4);
    await page.locator("#start-date").fill(startDate.toISOString().slice(0, 10));
    await page.locator("#end-date").fill(endDate.toISOString().slice(0, 10));

    await page.locator("#upload").setInputFiles(tinyPng);
    await expect(page.locator('img[alt=""]').first()).toBeVisible({ timeout: 10000 });
    await waitForCreateResponse(page, "/create-event", () =>
      page.getByRole("button", { name: "Create Event" }).click()
    );
    await page.waitForURL(/\/dashboard-events/, { timeout: 60000 });

    expect(authHeaders.length).toBeGreaterThan(0);
    for (const h of authHeaders) {
      expect(h.authorization).toMatch(/^Bearer eyJ/);
      expect(h.hasSellerTokenCookie).toBe(false);
    }
  });
});
