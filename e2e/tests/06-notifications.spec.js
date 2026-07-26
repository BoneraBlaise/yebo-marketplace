const { test, expect, startProductConversation, apiRequest } = require("../fixtures/communication.fixture");
const { measure } = require("../helpers/performance");
const { waitForNotificationCount } = require("../helpers/wait");

test.describe("Suite 6 — Notifications", () => {
  test("offer lifecycle and order notifications update unread counts", async ({
    buyerSession,
    sellerSession,
    product,
  }) => {
    const conversation = await startProductConversation(
      buyerSession.token,
      product,
      `Notifications ${Date.now()}`
    );

    const amount = Math.max(100, Math.floor((product.discountPrice || product.originalPrice || 5000) * 0.72));
    const offerRes = await measure("notification.offer.create", async () =>
      apiRequest("/marketplace/communication/offers", {
        method: "POST",
        token: buyerSession.token,
        body: {
          productId: product._id,
          conversationId: conversation._id,
          amount,
          message: "Notification offer",
        },
      })
    );
    expect(offerRes.status).toBe(201);
    const offer = offerRes.json.data;
    await waitForNotificationCount(sellerSession.token, 1);

    await measure("notification.offer.counter", async () => {
      const res = await apiRequest(`/marketplace/communication/offers/${offer.offerId}/counter`, {
        method: "POST",
        token: sellerSession.token,
        body: { amount: amount + 150, message: "Counter notification" },
      });
      expect(res.status).toBe(200);
    });
    await waitForNotificationCount(buyerSession.token, 1);

    await measure("notification.offer.reject", async () => {
      const res = await apiRequest(`/marketplace/communication/offers/${offer.offerId}/rejected`, {
        method: "POST",
        token: sellerSession.token,
      });
      expect(res.status).toBe(200);
    });

    const buyerList = await apiRequest("/marketplace/communication/notifications?unreadOnly=true", {
      token: buyerSession.token,
    });
    expect(buyerList.ok).toBeTruthy();
    expect(Array.isArray(buyerList.json.data?.items || buyerList.json.data)).toBeTruthy();

    const sellerList = await apiRequest("/marketplace/communication/notifications?unreadOnly=true", {
      token: sellerSession.token,
    });
    expect(sellerList.ok).toBeTruthy();
  });
});
