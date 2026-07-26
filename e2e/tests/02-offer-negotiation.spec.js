const { test, expect, startProductConversation, apiRequest } = require("../fixtures/communication.fixture");
const { measure } = require("../helpers/performance");
const { waitForNotificationCount } = require("../helpers/wait");

test.describe("Suite 2 — Offer negotiation", () => {
  test("buyer offer, seller counter, buyer accepts, checkout preserves negotiated price", async ({
    buyerSession,
    sellerSession,
    product,
  }) => {
    const conversation = await startProductConversation(
      buyerSession.token,
      product,
      `Offer flow ${Date.now()}`
    );

    const buyerOfferAmount = Math.max(100, Math.floor((product.discountPrice || product.originalPrice || 5000) * 0.8));
    const offer = await measure("offer.create", async () => {
      const res = await apiRequest("/marketplace/communication/offers", {
        method: "POST",
        token: buyerSession.token,
        body: {
          productId: product._id,
          conversationId: conversation._id,
          amount: buyerOfferAmount,
          message: "E2E initial offer",
          productSnapshot: {
            name: product.name,
            price: product.discountPrice || product.originalPrice,
          },
        },
      });
      expect(res.status).toBe(201);
      return res.json.data;
    });

    expect(offer.offerId).toBeTruthy();
    await waitForNotificationCount(sellerSession.token, 1);

    const counterAmount = buyerOfferAmount + 200;
    const counter = await measure("offer.counter", async () => {
      const res = await apiRequest(`/marketplace/communication/offers/${offer.offerId}/counter`, {
        method: "POST",
        token: sellerSession.token,
        body: { amount: counterAmount, message: "E2E counter" },
      });
      expect(res.status).toBe(200);
      return res.json.data;
    });
    expect(counter.amount).toBe(counterAmount);

    const accepted = await measure("offer.accept", async () => {
      const res = await apiRequest(`/marketplace/communication/offers/${offer.offerId}/accepted`, {
        method: "POST",
        token: sellerSession.token,
      });
      expect(res.status).toBe(200);
      return res.json.data;
    });
    expect(accepted.status).toBe("accepted");
    expect(accepted.priceLockToken).toBeTruthy();

    const checkout = await measure("checkout.negotiated", async () => {
      const res = await apiRequest(
        `/marketplace/communication/checkout/negotiated?offerId=${offer.offerId}&token=${accepted.priceLockToken}`,
        { token: buyerSession.token }
      );
      expect(res.status).toBe(200);
      return res.json.data;
    });

    expect(checkout.negotiatedOffer?.amount || checkout.amount || checkout.total).toBeTruthy();
    const preservedAmount = checkout.negotiatedOffer?.amount ?? checkout.subtotal ?? checkout.amount;
    expect(Number(preservedAmount)).toBe(counterAmount);
  });
});
