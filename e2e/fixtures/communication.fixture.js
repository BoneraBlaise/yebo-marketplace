const { test: base, expect } = require("@playwright/test");
const {
  hasCommunicationCredentials,
  loginUser,
  loginSeller,
  getFirstProduct,
  apiRequest,
} = require("../helpers/api");
const { measure } = require("../helpers/performance");

const test = base.extend({
  buyerSession: async ({}, use, testInfo) => {
    if (!hasCommunicationCredentials()) {
      testInfo.skip(true, "Set E2E_BUYER_* and E2E_SELLER_* env vars");
    }
    const session = await loginUser(process.env.E2E_BUYER_EMAIL, process.env.E2E_BUYER_PASSWORD);
    await use(session);
  },
  sellerSession: async ({}, use, testInfo) => {
    if (!hasCommunicationCredentials()) {
      testInfo.skip(true, "Set E2E_BUYER_* and E2E_SELLER_* env vars");
    }
    const session = await loginSeller(process.env.E2E_SELLER_EMAIL, process.env.E2E_SELLER_PASSWORD);
    await use(session);
  },
  product: async ({ buyerSession }, use) => {
    const product = await getFirstProduct(buyerSession.token);
    await use(product);
  },
});

async function startProductConversation(buyerToken, product, message) {
  return measure("messaging.startConversation", async () => {
    const res = await apiRequest("/marketplace/communication/conversations/product", {
      method: "POST",
      token: buyerToken,
      body: {
        productId: product._id,
        sellerId: product.shopId || product.shop?._id,
        productSnapshot: {
          name: product.name,
          price: product.discountPrice || product.originalPrice || product.price,
          image: product.images?.[0]?.url || product.images?.[0],
        },
        initialMessage: message,
      },
    });
    expect(res.status).toBe(201);
    return res.json.data;
  });
}

async function sendMessage(token, conversationId, text) {
  return measure("messaging.sendMessage", async () => {
    const res = await apiRequest(`/marketplace/communication/conversations/${conversationId}/messages`, {
      method: "POST",
      token,
      body: { text },
    });
    expect(res.status).toBe(201);
    return res.json.data;
  });
}

module.exports = {
  test,
  expect,
  startProductConversation,
  sendMessage,
  apiRequest,
};
