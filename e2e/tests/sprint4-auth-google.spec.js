/**
 * Sprint 4 Phase 2 — Auth regression + Google OAuth UI checks.
 * Run: npx playwright test tests/sprint4-auth-google.spec.js
 */
const { test, expect } = require("@playwright/test");

const API = process.env.PLAYWRIGHT_API_URL || "http://localhost:3000/api/v2";

test.describe("Sprint 4 — Authentication", () => {
  test("Google sign-in button starts OAuth without token in URL", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    const googleButton = page.getByRole("button", { name: /google/i });
    await expect(googleButton).toBeVisible();

    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/auth/google")),
      googleButton.click(),
    ]);

    expect(request.url()).toContain("/auth/google");
    expect(request.url()).toContain("redirect=");
    expect(request.url()).not.toContain("token=");
  });

  test("login-success route renders processing state (cookie-based OAuth callback)", async ({
    page,
  }) => {
    await page.goto("/login-success", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Processing your login/i)).toBeVisible();
  });

  test("email/password login API still accepts credentials shape", async ({
    request,
  }) => {
    const res = await request.post(`${API}/user/login-user`, {
      data: { email: "nonexistent-e2e@yebone.test", password: "wrong-password" },
    });

    expect([400, 401, 404, 429]).toContain(res.status());
    const body = await res.json();
    expect(body.success).not.toBe(true);
  });

  test("Google OAuth start endpoint responds with redirect", async ({ request }) => {
    const res = await request.get(`${API}/auth/google?redirect=http://localhost:3000/login-success`, {
      maxRedirects: 0,
    });

    expect([302, 303]).toContain(res.status());
    const location = res.headers()["location"] || "";
    expect(location).toMatch(/accounts\.google\.com|google/i);
  });
});
