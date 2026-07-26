const { expect } = require("@playwright/test");

async function waitForApiCondition(checkFn, { timeoutMs = 20_000, intervalMs = 500, label = "condition" } = {}) {
  const start = Date.now();
  let lastError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const result = await checkFn();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`Timed out waiting for ${label}${lastError ? `: ${lastError.message}` : ""}`);
}

async function waitForUnreadCount(token, expectedMin, role = "buyer") {
  const { apiRequest } = require("./api");
  return waitForApiCondition(async () => {
    const res = await apiRequest("/marketplace/communication/conversations/unread-count", { token });
    const count = res.json?.data?.count ?? 0;
    if (count >= expectedMin) return count;
    return null;
  }, { label: `${role} unread count >= ${expectedMin}` });
}

async function waitForNotificationCount(token, expectedMin) {
  const { apiRequest } = require("./api");
  return waitForApiCondition(async () => {
    const res = await apiRequest("/marketplace/communication/notifications/unread-count", { token });
    const count = res.json?.data?.count ?? 0;
    if (count >= expectedMin) return count;
    return null;
  }, { label: `notification unread count >= ${expectedMin}` });
}

async function expectEventuallyVisible(locator, timeout = 15_000) {
  await expect(locator).toBeVisible({ timeout });
}

module.exports = {
  waitForApiCondition,
  waitForUnreadCount,
  waitForNotificationCount,
  expectEventuallyVisible,
};
