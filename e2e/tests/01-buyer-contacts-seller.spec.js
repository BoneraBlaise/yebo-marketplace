const { test, expect, startProductConversation, sendMessage, apiRequest } = require("../fixtures/communication.fixture");
const { waitForUnreadCount, waitForNotificationCount } = require("../helpers/wait");

test.describe("Suite 1 — Buyer contacts seller", () => {
  test("creates conversation, delivers message, updates unread and notifications", async ({
    buyerSession,
    sellerSession,
    product,
  }) => {
    const uniqueMessage = `E2E contact ${Date.now()}`;
    const conversation = await startProductConversation(buyerSession.token, product, uniqueMessage);

    expect(conversation._id).toBeTruthy();
    expect(conversation.members).toContain(String(buyerSession.user._id));

    const messagesRes = await apiRequest(
      `/marketplace/communication/conversations/${conversation._id}/messages`,
      { token: buyerSession.token }
    );
    expect(messagesRes.ok).toBeTruthy();
    expect(messagesRes.json.data.some((m) => m.text === uniqueMessage)).toBeTruthy();

    const followUp = await sendMessage(buyerSession.token, conversation._id, `Follow-up ${Date.now()}`);
    expect(followUp._id).toBeTruthy();

    const sellerUnread = await waitForUnreadCount(sellerSession.token, 1, "seller");
    expect(sellerUnread).toBeGreaterThanOrEqual(1);

    const sellerNotifications = await waitForNotificationCount(sellerSession.token, 1);
    expect(sellerNotifications).toBeGreaterThanOrEqual(1);

    const sellerConversations = await apiRequest("/marketplace/communication/conversations", {
      token: sellerSession.token,
    });
    expect(sellerConversations.ok).toBeTruthy();
    expect(sellerConversations.json.data.some((c) => String(c._id) === String(conversation._id))).toBeTruthy();
  });
});
