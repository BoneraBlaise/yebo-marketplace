const { test, expect, startProductConversation, sendMessage, apiRequest } = require("../fixtures/communication.fixture");
const { waitForUnreadCount } = require("../helpers/wait");

test.describe("Suite 5 — Realtime messaging", () => {
  test("two sessions exchange messages with reconnect and unread counters", async ({
    browser,
    buyerSession,
    sellerSession,
    product,
  }) => {
    const conversation = await startProductConversation(
      buyerSession.token,
      product,
      `Realtime ${Date.now()}`
    );

    const buyerContext = await browser.newContext();
    const sellerContext = await browser.newContext();

    await buyerContext.addInitScript((token) => {
      document.cookie = `token=${encodeURIComponent(token)}; path=/`;
    }, buyerSession.token);

    await sellerContext.addInitScript((token) => {
      document.cookie = `seller_token=${encodeURIComponent(token)}; path=/`;
    }, sellerSession.token);

    const buyerPage = await buyerContext.newPage();
    const sellerPage = await sellerContext.newPage();

    await buyerPage.goto(`/inbox?conversation=${conversation._id}`);
    await sellerPage.goto(`/inbox?conversation=${conversation._id}`);

    await expect(buyerPage.getByRole("log")).toBeVisible();
    await expect(sellerPage.getByRole("log")).toBeVisible();

    const buyerMessage = `Buyer realtime ${Date.now()}`;
    await buyerPage.getByRole("textbox", { name: "Message" }).fill(buyerMessage);
    await buyerPage.getByRole("button", { name: "Send" }).click();
    await expect(buyerPage.getByText(buyerMessage)).toBeVisible();

    await waitForUnreadCount(sellerSession.token, 1, "seller");

    await sellerPage.reload();
    await expect(sellerPage.getByText(buyerMessage)).toBeVisible({ timeout: 20_000 });

    const sellerMessage = `Seller realtime ${Date.now()}`;
    await sendMessage(sellerSession.token, conversation._id, sellerMessage);

    await buyerPage.reload();
    await expect(buyerPage.getByText(sellerMessage)).toBeVisible({ timeout: 20_000 });

    await buyerContext.close();
    await sellerContext.close();
  });
});
