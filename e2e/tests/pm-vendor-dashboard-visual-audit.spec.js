/**
 * Visual audit — Property & Mobility Vendor Dashboard (evidence capture only)
 */
const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");
const { vendorCredentials, skipIfMissing } = require("../helpers/credentials");

const vendorCreds = vendorCredentials();
const API = "http://127.0.0.1:5000/api/v2";
const OUT = path.join(__dirname, "..", "audit-screenshots", "pm-vendor-dashboard");

test.describe("PM Vendor Dashboard Visual Audit", () => {
  test("capture rendered UI evidence", async ({ page, context, request }, testInfo) => {
    skipIfMissing(testInfo, vendorCreds, "E2E_VENDOR_EMAIL / E2E_VENDOR_PASSWORD");
    fs.mkdirSync(OUT, { recursive: true });

    const loginRes = await request.post(`${API}/user/login-user`, {
      data: { email: vendorCreds.email, password: vendorCreds.password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = await loginRes.json();

    await context.addCookies([
      { name: "token", value: token, domain: "localhost", path: "/", sameSite: "Lax" },
    ]);
    await page.addInitScript((t) => localStorage.setItem("yebone_auth_token_v1", t), token);

    await page.goto("/dashboard-property-mobility");
    await page.evaluate(() => {
      document.querySelector("#webpack-dev-server-client-overlay")?.remove();
    });
    await page.waitForSelector(".pm-owner-toolbar, .pm-empty-state, .pm-vendor-dashboard", { timeout: 45000 });
    await page.waitForResponse(
      (res) => res.url().includes("/owner/listings") && res.status() === 200,
      { timeout: 45000 }
    ).catch(() => null);
    await page.waitForTimeout(2000);

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, "01-desktop-full.png"), fullPage: true });

    const audit = {
      hasTable: await page.locator("table, .responsive-data-table, [class*='data-table']").count(),
      hasOwnerCards: await page.locator(".pm-owner-card").count(),
      hasRawPendingReview: await page.getByText("pending_review").count(),
      hasHumanPendingReview: await page.getByText(/Pending Review/i).count(),
      cardFields: {},
      tabs: {},
      problems: [],
    };

    const firstCard = page.locator(".pm-owner-card").first();
    if (await firstCard.count()) {
      audit.cardFields = {
        thumbnail: await firstCard.locator(".pm-owner-card__media img, .pm-owner-card__placeholder").count(),
        title: await firstCard.locator(".pm-owner-card__title").count(),
        price: await firstCard.locator(".pm-owner-card__price").count(),
        location: await firstCard.locator(".pm-owner-card__location").count(),
        categoryBadge: await firstCard.locator(".pm-owner-card__category").count(),
        statusBadge: await firstCard.locator(".pm-status-badge").count(),
        iconActions: await firstCard.locator(".pm-owner-card__action").count(),
        statusText: (await firstCard.locator(".pm-status-badge").textContent())?.trim(),
      };
      await firstCard.screenshot({ path: path.join(OUT, "02-desktop-card-closeup.png") });
    }

    await page.locator(".pm-owner-toolbar").screenshot({
      path: path.join(OUT, "03-desktop-filter-bar.png"),
    });

    // Mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT, "04-mobile-full.png"), fullPage: true });

    if (await firstCard.count()) {
      await page.locator(".pm-owner-card").first().screenshot({
        path: path.join(OUT, "05-mobile-card-closeup.png"),
      });
    }

    // List view toggle
    await page.setViewportSize({ width: 1440, height: 900 });
    const listBtn = page.getByRole("button", { name: "List view" });
    if (await listBtn.count()) {
      await listBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, "06-desktop-list-view.png"), fullPage: true });
    }

    // Other tabs (agencies still table?)
    for (const tab of ["agencies", "offers", "verification"]) {
      await page.getByRole("tab", { name: tab }).click();
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(OUT, `07-tab-${tab}.png`),
        fullPage: true,
      });
      audit.tabs[tab] = {
        hasTable: await page.locator("table").count(),
        hasOwnerCards: await page.locator(".pm-owner-card").count(),
      };
    }

    // Success screen via quick listing create
    await page.getByRole("tab", { name: "listings" }).click();
    await page.locator(".pm-owner-toolbar__create, .pm-owner-toolbar button").first().click();
    await page.getByRole("dialog").waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: "Houses" }).click();
    await page.getByRole("button", { name: "For Sale" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("#listing-title").fill("Visual Audit Test House");
    await page.locator("#listing-desc").fill(
      "Visual audit listing for moderation success screen verification with enough description text."
    );
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("#listing-price").fill("175000");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.locator("#listing-city").fill("Kigali");
    await page.getByRole("button", { name: "Continue" }).click();
    const tinyPng = path.join(__dirname, "..", "fixtures", "tiny.png");
    await page.locator('.seller-xp-wizard input[type="file"][accept="image/*"]').setInputFiles(tinyPng);
    await expect(page.locator(".listing-media__thumb img").first()).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: /Publish listing/i }).click();
    await expect(page.getByText(/Listing Submitted/i)).toBeVisible({ timeout: 60000 });

    audit.successScreen = {
      hasListingSubmitted: await page.getByText("Listing Submitted").count(),
      hasOldPublishedTitle: await page.getByText("Listing Published").count(),
      hasTechnicalId: await page.getByText(/^ID:/).count(),
      hasModerationCopy: await page.getByText(/moderation team/i).count(),
      has24h: await page.getByText(/Within 24 hours/i).count(),
      hasPreviewCard: await page.locator(".listing-publish-success__preview").count(),
    };

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: path.join(OUT, "08-success-desktop.png"), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(OUT, "09-success-mobile.png"), fullPage: true });

    fs.writeFileSync(path.join(OUT, "audit-results.json"), JSON.stringify(audit, null, 2));
    console.log(JSON.stringify(audit, null, 2));
  });
});
