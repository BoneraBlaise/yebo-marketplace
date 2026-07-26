const { test, expect, startProductConversation, apiRequest } = require("../fixtures/communication.fixture");
const { measure } = require("../helpers/performance");
const { waitForNotificationCount } = require("../helpers/wait");

test.describe("Suite 3 — Offer rejection", () => {
  test("reject offer updates conversation and notifies buyer", async ({
    buyerSession,
    sellerSession,
    product,
  }) => {
    const conversation = await startProductConversation(
      buyerSession.token,
      product,
      `Reject flow ${Date.now()}`
    );

    const amount = Math.max(100, Math.floor((product.discountPrice || product.originalPrice || 5000) * 0.7));
    const offerRes = await measure("offer.create", async () =>
      apiRequest("/marketplace/communication/offers", {
        method: "POST",
        token: buyerSession.token,
        body: {
          productId: product._id,
          conversationId: conversation._id,
          amount,
          message: "E2E reject offer",
        },
      })
    );
    expect(offerRes.status).toBe(201);
    const offer = offerRes.json.data;

    const rejected = await measure("offer.reject", async () => {
      const res = await apiRequest(`/marketplace/communication/offers/${offer.offerId}/rejected`, {
        method: "POST",
        token: sellerSession.token,
      });
      expect(res.status).toBe(200);
      return res.json.data;
    });
    expect(rejected.status).toBe("rejected");

    const history = await apiRequest(`/marketplace/communication/conversations/${conversation._id}/offers`, {
      token: buyerSession.token,
    });
    expect(history.ok).toBeTruthy();
    expect(history.json.data.some((o) => o.offerId === offer.offerId && o.status === "rejected")).toBeTruthy();

    const buyerNotifications = await waitForNotificationCount(buyerSession.token, 1);
    expect(buyerNotifications).toBeGreaterThanOrEqual(1);
  });
});
