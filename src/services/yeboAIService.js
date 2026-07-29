import { YIPGatewayClient } from "../ai/gateway/YIPGatewayClient";

/** Production YEBO AI service — all features route through backend gateway */
export const yeboAIService = {
  chat: (message, options) => YIPGatewayClient.chat(message, options),
  search: (query, options) => YIPGatewayClient.search(query, options),
  compareProducts: (products) =>
    YIPGatewayClient.intelligence("compare", { products }).then((r) => r?.data?.result || r?.data),
  budgetAdvice: (selection) =>
    YIPGatewayClient.intelligence("budget", { selection }).then((r) => r?.data?.result || r?.data),
  giftFinder: (categoryId) =>
    YIPGatewayClient.intelligence("gift", { categoryId }).then((r) => r?.data?.result || r?.data),
  getShoppingTips: () =>
    YIPGatewayClient.intelligence("tips", {}).then((r) => r?.data?.result?.tips || []),
  getProactiveSuggestions: () =>
    YIPGatewayClient.intelligence("suggestions", {}).then((r) => r?.data?.result?.suggestions || []),
  createPreview: (payload) => YIPGatewayClient.preview(payload),
  getPreviewSession: (sessionId) => YIPGatewayClient.getPreviewSession(sessionId),
  getPreviewResult: (sessionId) => YIPGatewayClient.getPreviewResult(sessionId),
  cancelPreview: (sessionId) => YIPGatewayClient.cancelPreview(sessionId),
  listCustomerPreviews: () => YIPGatewayClient.listCustomerPreviews(),
  searchByImage: (payload) => YIPGatewayClient.searchByImage(payload),
  runService: (payload) => YIPGatewayClient.service(payload),
  getVendorDashboard: () => YIPGatewayClient.getVendorDashboard(),
  getVendorCredits: () => YIPGatewayClient.getVendorCredits(),
  getVendorSubscription: () => YIPGatewayClient.getVendorSubscription(),
  getAdminAnalytics: (period = "daily") => YIPGatewayClient.getAdminAnalytics(period),
  adjustAdminCredits: (payload) => YIPGatewayClient.adjustAdminCredits(payload),
  health: () => YIPGatewayClient.health(),
};

export default yeboAIService;
