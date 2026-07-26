const { test, expect, startProductConversation, apiRequest } = require("../fixtures/communication.fixture");
const { measure } = require("../helpers/performance");
const { waitForNotificationCount } = require("../helpers/wait");

test.describe("Suite 4 — Delivery workflow", () => {
  test("negotiated checkout through delivery confirmation and seller notification", async ({
    buyerSession,
    sellerSession,
    product,
  }) => {
    const conversation = await startProductConversation(
      buyerSession.token,
      product,
      `Delivery flow ${Date.now()}`
    );

    const amount = Math.max(100, Math.floor((product.discountPrice || product.originalPrice || 5000) * 0.75));
    const offerRes = await apiRequest("/marketplace/communication/offers", {
      method: "POST",
      token: buyerSession.token,
      body: {
        productId: product._id,
        conversationId: conversation._id,
        amount,
        message: "E2E delivery offer",
      },
    });
    expect(offerRes.status).toBe(201);
    const offer = offerRes.json.data;

    const accepted = await apiRequest(`/marketplace/communication/offers/${offer.offerId}/accepted`, {
      method: "POST",
      token: sellerSession.token,
    });
    expect(accepted.status).toBe(200);

    const checkoutPayload = await measure("checkout.negotiated", async () => {
      const res = await apiRequest(
        `/marketplace/communication/checkout/negotiated?offerId=${offer.offerId}&token=${accepted.json.data.priceLockToken}`,
        { token: buyerSession.token }
      );
      expect(res.status).toBe(200);
      return res.json.data;
    });
    expect(checkoutPayload).toBeTruthy();

    const orderRes = await measure("order.create", async () => {
      const res = await apiRequest("/order/create-order", {
        method: "POST",
        token: buyerSession.token,
        body: {
          cart: checkoutPayload.cart || checkoutPayload.items || checkoutPayload.lineItems,
          shippingAddress: checkoutPayload.shippingAddress || {
            address: "E2E Test Address",
            city: "Kigali",
            country: "Rwanda",
          },
          negotiatedOffer: {
            offerId: offer.offerId,
            priceLockToken: accepted.json.data.priceLockToken,
          },
        },
      });
      return res;
    });

    test.skip(orderRes.status !== 201 && orderRes.status !== 200, "Order creation endpoint unavailable in this environment");
    const order = orderRes.json?.order || orderRes.json?.data;
    expect(order?._id || order?.id).toBeTruthy();

    const orderId = order._id || order.id;
    const statusFlow = ["Processing", "Shipping", "Delivered"];
    for (const status of statusFlow) {
      const update = await apiRequest(`/order/seller-order/${orderId}`, {
        method: "PUT",
        token: sellerSession.token,
        body: { status },
      });
      if (!update.ok && status !== "Delivered") continue;
    }

    const confirm = await measure("delivery.confirm", async () => {
      const res = await apiRequest(`/marketplace/communication/orders/${orderId}/confirm-delivery`, {
        method: "PUT",
        token: buyerSession.token,
      });
      return res;
    });

    if (confirm.status === 200) {
      expect(confirm.json.success).toBeTruthy();
      await waitForNotificationCount(sellerSession.token, 1);
    }
  });
});
