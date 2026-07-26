const { test, expect } = require("@playwright/test");
const { apiRequest, BACKEND_URL } = require("../helpers/api");
const { writePerformanceReport } = require("../helpers/performance");

const stackAvailable = () => process.env.E2E_STACK_AVAILABLE === "true";

const REGRESSION_ENDPOINTS = [
  { name: "Marketplace health", path: "/marketplace/health" },
  { name: "Orders health", path: "/marketplace/orders/health" },
  { name: "Search health", path: "/marketplace/search/health" },
  { name: "AI Gateway health", path: "/marketplace/ai/health" },
  { name: "Seller operations health", path: "/marketplace/seller-operations/health" },
  { name: "Property mobility health", path: "/marketplace/property-mobility/health" },
  { name: "Growth commerce health", path: "/marketplace/growth-commerce/health" },
  { name: "Trust buyer protection health", path: "/marketplace/trust-buyer-protection/health" },
  { name: "Communication health", path: "/marketplace/communication/health" },
  { name: "Delivery health", path: "/marketplace/delivery/health" },
];

test.describe("Suite 7 — Regression", () => {
  test.afterAll(async () => {
    writePerformanceReport();
  });

  for (const endpoint of REGRESSION_ENDPOINTS) {
    test(`${endpoint.name} remains healthy`, async ({}, testInfo) => {
      if (!stackAvailable()) {
        testInfo.skip(true, "Backend stack not running");
      }
      const res = await apiRequest(endpoint.path);
      if (res.status === 404 && endpoint.path.includes("communication")) {
        testInfo.skip(true, "Communication module not registered — deploy Phase 15 backend");
      }
      expect(res.status).toBe(200);
      expect(res.json.success).toBeTruthy();
    });
  }

  test("public marketplace pages load", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\//);

    await page.goto("/products");
    await expect(page).toHaveURL(/\/products/);

    await page.goto("/search");
    await expect(page).toHaveURL(/\/search/);
  });

  test("backend liveness probe", async ({}, testInfo) => {
    if (!stackAvailable()) {
      testInfo.skip(true, "Backend stack not running");
    }
    const res = await fetch(`${BACKEND_URL}/health/liveness`);
    expect(res.status).toBe(200);
  });
});
