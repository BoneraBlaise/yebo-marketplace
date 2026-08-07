/**
 * Sprint 4 Phase 5 — Auth security hardening checks.
 */
const { test, expect } = require("@playwright/test");

const API = process.env.PLAYWRIGHT_API_URL || "http://localhost:3000/api/v2";

test.describe("Sprint 4 Phase 5 — Security Hardening", () => {
  test("login returns generic error for unknown email", async ({ request }) => {
    const res = await request.post(`${API}/user/login-user`, {
      data: { email: "nonexistent-security@yebone.test", password: "Wrong1!pass" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/Invalid email or password/i);
  });

  test("registration rejects weak password", async ({ request }) => {
    const res = await request.post(`${API}/user/create-user`, {
      data: {
        name: "Test User",
        email: `weak-${Date.now()}@yebone.test`,
        password: "weak",
        avatar: "data:image/png;base64,iVBORw0KGgo=",
      },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch(/Password must/i);
  });

  test("login rate limit returns 429 after excessive attempts", async ({ request }) => {
    const email = `ratelimit-${Date.now()}@yebone.test`;
    let lastStatus = 0;

    for (let i = 0; i < 12; i += 1) {
      const res = await request.post(`${API}/user/login-user`, {
        data: { email, password: "Wrong1!pass" },
      });
      lastStatus = res.status();
      if (lastStatus === 429) break;
    }

    expect(lastStatus).toBe(429);
  });

  test("forgot-password still returns generic success", async ({ request }) => {
    const res = await request.post(`${API}/user/forgot-password`, {
      data: { email: "security-audit@yebone.test" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/If an account exists/i);
  });
});
