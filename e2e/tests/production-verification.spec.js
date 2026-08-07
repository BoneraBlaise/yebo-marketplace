/**
 * Production verification — route smoke + responsive screenshots (read-only).
 * Run: npx playwright test --config e2e/playwright.config.js e2e/tests/production-verification.spec.js
 */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "414", width: 414, height: 896 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const SCREENSHOT_PAGES = [
  { key: "homepage", path: "/" },
  { key: "products", path: "/products" },
  { key: "product-detail", path: null },
  { key: "vendor", path: null },
  { key: "search", path: "/search?search=phone" },
  { key: "property", path: "/property-mobility" },
  { key: "dashboard", path: "/dashboard" },
  { key: "messages", path: "/inbox" },
  { key: "notifications", path: "/inbox" },
];

const ROUTE_SMOKE = [
  { route: "/", label: "Home", expectAuth: false },
  { route: "/products", label: "Products", expectAuth: false },
  { route: "/product/:id", label: "Product detail", dynamic: "product" },
  { route: "/search", label: "Search", expectAuth: false },
  { route: "/events", label: "Events", expectAuth: false },
  { route: "/property-mobility", label: "Property/Mobility", expectAuth: false },
  { route: "/login", label: "Login (auth/login alias)", expectAuth: false },
  { route: "/sign-up", label: "Register (auth/register alias)", expectAuth: false },
  { route: "/checkout", label: "Checkout", expectAuth: true },
  { route: "/profile", label: "Profile", expectAuth: true },
  { route: "/dashboard", label: "Dashboard", expectAuth: true },
  { route: "/settings", label: "Settings", expectAuth: true },
  { route: "/inbox", label: "Messages", expectAuth: true },
  { route: "/customer-ui/wishlist", label: "Wishlist (customer-ui)", expectAuth: false },
  { route: "/customer-ui/category", label: "Categories (customer-ui)", expectAuth: false },
  { route: "/shop/preview/:id", label: "Vendor preview", dynamic: "shop" },
  { route: "/ai-experience", label: "AI Experience", expectAuth: false },
  { route: "/cart", label: "Cart redirect", expectAuth: false, expectRedirect: "/checkout" },
];

const OUT_DIR = path.join(__dirname, "..", "audit-screenshots", "production-verification");

function dismissOverlay(page) {
  return page.evaluate(() => {
    document.querySelector("#webpack-dev-server-client-overlay")?.remove();
  });
}

const KNOWN_SHOP_ID = "6a64e98ddcdc9f592fe0d774";
const KNOWN_RADISSON_ID = "6a71af9e585c5be8290f6c2d";

async function fetchFirstProductId(request) {
  const res = await request.get("http://127.0.0.1:5000/api/v2/product/get-all-products");
  if (!res.ok()) return null;
  const json = await res.json();
  const products = json.products || json.data || [];
  return products[0]?._id;
}

async function fetchShopPreviewId() {
  return KNOWN_SHOP_ID;
}

async function fetchRadissonListingId(request) {
  const res = await request.get(`http://127.0.0.1:5000/api/v2/marketplace/property-mobility/listings/${KNOWN_RADISSON_ID}`);
  if (res.ok()) return KNOWN_RADISSON_ID;
  return KNOWN_RADISSON_ID;
}

test.describe("Production Verification — Route Smoke", () => {
  let productId;
  let shopId;
  let listingId;

  test.beforeAll(async ({ request }) => {
    productId = await fetchFirstProductId(request);
    shopId = await fetchShopPreviewId();
    listingId = await fetchRadissonListingId(request);
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const item of ROUTE_SMOKE) {
    test(`route loads: ${item.label} (${item.route})`, async ({ page }) => {
      let route = item.route;
      if (item.dynamic === "product" && productId) route = `/product/${productId}`;
      if (item.dynamic === "shop" && shopId) route = `/shop/preview/${shopId}`;
      if (route.includes(":id") && !productId && !shopId) {
        test.skip(true, "No dynamic ID available");
      }

      const consoleErrors = [];
      const failedRequests = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => consoleErrors.push(err.message));
      page.on("requestfailed", (req) => failedRequests.push(`${req.url()} — ${req.failure()?.errorText}`));

      await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await dismissOverlay(page);
      await page.waitForTimeout(1500);

      if (item.expectRedirect) {
        await expect(page).toHaveURL(new RegExp(item.expectRedirect.replace("/", "\\/")));
      } else {
        expect(page.url()).not.toMatch(/\/404|not-found/i);
      }

      const fatalReact = consoleErrors.filter(
        (e) =>
          /cannot read|undefined is not|Minified React error|ChunkLoadError/i.test(e) &&
          !/webpack-dev-server|ResizeObserver|favicon/i.test(e)
      );
      expect(fatalReact, `Fatal console on ${route}: ${fatalReact.join("; ")}`).toHaveLength(0);
    });
  }

  test("property listing detail opens", async ({ page }) => {
    if (!listingId) test.skip(true, "No listing ID");
    await page.goto(`/property-mobility/listing/${listingId}`, { waitUntil: "domcontentloaded" });
    await dismissOverlay(page);
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toContain(String(listingId));
  });
});

test.describe("Production Verification — Responsive Screenshots", () => {
  let productId;
  let shopId;

  test.beforeAll(async ({ request }) => {
    productId = await fetchFirstProductId(request);
    shopId = await fetchShopPreviewId();
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const vp of VIEWPORTS) {
    test(`screenshots @ ${vp.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const pages = [
        { key: "homepage", path: "/" },
        { key: "products", path: "/products" },
        { key: "product-detail", path: productId ? `/product/${productId}` : null },
        { key: "vendor", path: shopId ? `/shop/preview/${shopId}` : null },
        { key: "search", path: "/search?search=phone" },
        { key: "property", path: "/property-mobility" },
        { key: "dashboard", path: "/dashboard" },
        { key: "messages", path: "/inbox" },
      ];

      for (const p of pages) {
        if (!p.path) continue;
        await page.goto(p.path, { waitUntil: "domcontentloaded", timeout: 45000 });
        await dismissOverlay(page);
        await page.waitForTimeout(1200);
        const file = path.join(OUT_DIR, `${p.key}-${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: false });
      }
    });
  }
});

test.describe("Production Verification — Console & Network Audit", () => {
  test("homepage network and console audit", async ({ page }) => {
    const consoleMsgs = { error: [], warn: [] };
    const httpFailures = [];

    page.on("console", (msg) => {
      const t = msg.type();
      if (t === "error" || t === "warning") consoleMsgs[t === "warning" ? "warn" : "error"].push(msg.text());
    });
    page.on("response", (res) => {
      const status = res.status();
      const url = res.url();
      if (status >= 400 && !url.includes("favicon")) {
        httpFailures.push({ status, url });
      }
    });

    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
    await dismissOverlay(page);

    const report = {
      consoleErrors: consoleMsgs.error.slice(0, 30),
      consoleWarnings: consoleMsgs.warn.slice(0, 30),
      httpFailures: httpFailures.slice(0, 50),
    };
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, "console-network-audit.json"), JSON.stringify(report, null, 2));

    const serverErrors = httpFailures.filter((f) => f.status >= 500);
    expect(serverErrors.length, `500 errors: ${JSON.stringify(serverErrors)}`).toBeLessThanOrEqual(3);
  });
});
