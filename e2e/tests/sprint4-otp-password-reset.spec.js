/**
 * Sprint 4 Phase 3 — OTP password reset E2E checks.
 */
const { test, expect } = require("@playwright/test");

const API = process.env.PLAYWRIGHT_API_URL || "http://localhost:3000/api/v2";

test.describe("Sprint 4 Phase 3 — OTP Password Reset", () => {
  test("forgot-password returns generic success (no enumeration)", async ({ request }) => {
    const res = await request.post(`${API}/user/forgot-password`, {
      data: { email: "nonexistent-otp-test@yebone.test" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toMatch(/If an account exists/i);
  });

  test("verify-reset-otp rejects missing fields", async ({ request }) => {
    const res = await request.post(`${API}/user/verify-reset-otp`, {
      data: { email: "test@example.com" },
    });
    expect(res.status()).toBe(400);
  });

  test("reset-password rejects weak password", async ({ request }) => {
    const res = await request.post(`${API}/user/reset-password`, {
      data: {
        resetSessionToken: "invalid-token",
        newPassword: "weak",
      },
    });
    expect([400, 401]).toContain(res.status());
  });

  test("forgot-password page shows Send Code button", async ({ page }) => {
    await page.goto("/forgot-password", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /Send Code/i })).toBeVisible();
    await expect(page.getByText(/verification code/i)).toBeVisible();
  });

  test("legacy reset-password route redirects user to OTP flow", async ({ page }) => {
    await page.goto("/reset-password/legacy-token", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/verification code/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Forgot Password/i })).toBeVisible();
  });

  test("login page still loads after OTP changes", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });
});
